create extension if not exists pgcrypto;

create table if not exists public.service_types (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  display_name text not null,
  active boolean not null default true,
  sort_order integer not null default 0
);

insert into public.service_types(key, display_name, sort_order) values
  ('weddings-traditional-events', 'Weddings and traditional events', 1),
  ('corporate-catering', 'Corporate catering', 2),
  ('parties', 'Parties', 3),
  ('institutional-catering', 'Institutional catering', 4),
  ('bulk-food-orders', 'Bulk food orders', 5),
  ('other', 'Other', 6)
on conflict (key) do nothing;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('owner', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique,
  idempotency_key uuid not null unique,
  status text not null default 'new' check (status in ('new','contacted','needs_information','qualified','quote_in_progress','quote_sent','won','lost','not_proceeding')),
  service_type_id uuid not null references public.service_types(id),
  event_date date,
  guest_count_min integer check (guest_count_min is null or guest_count_min > 0),
  venue_locality text,
  event_notes text,
  customer_name text not null,
  organization_name text,
  email text,
  phone text,
  preferred_contact text check (preferred_contact is null or preferred_contact in ('email','phone')),
  privacy_notice_version text not null default 'enquiry-consent-v1',
  privacy_acknowledged_at timestamptz not null,
  assigned_to uuid references public.admin_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint enquiry_has_contact check (email is not null or phone is not null)
);

create table if not exists public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  author_user_id uuid not null references public.admin_profiles(user_id),
  note_text text not null check (length(note_text) between 1 and 5000),
  visibility text not null default 'internal' check (visibility = 'internal'),
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  quote_number text not null unique,
  revision_number integer not null check (revision_number > 0),
  status text not null default 'draft' check (status in ('draft','sent','accepted','revision_requested','declined','expired','superseded')),
  currency char(3) not null,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  discount_total numeric(12,2) not null default 0 check (discount_total >= 0),
  tax_total numeric(12,2) not null default 0 check (tax_total >= 0),
  grand_total numeric(12,2) not null default 0 check (grand_total >= 0),
  customer_note text,
  issued_at timestamptz,
  expires_at timestamptz,
  sent_at timestamptz,
  sent_by uuid references public.admin_profiles(user_id),
  public_token_hash text unique,
  token_expires_at timestamptz,
  customer_response text,
  customer_response_note text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  supersedes_quote_id uuid references public.quotes(id)
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  sort_order integer not null default 0,
  category text not null default 'other',
  customer_description text not null,
  quantity numeric(10,2) not null check (quantity > 0),
  unit_label text not null default 'item',
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  customer_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null unique references public.enquiries(id) on delete cascade,
  accepted_quote_id uuid references public.quotes(id),
  status text not null default 'pending_confirmation' check (status in ('pending_confirmation','confirmed','cancelled','completed')),
  confirmed_at timestamptz,
  confirmed_by uuid references public.admin_profiles(user_id),
  event_date date,
  operational_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  actor_user_id uuid references public.admin_profiles(user_id),
  event_type text not null,
  safe_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.public_submission_limits (
  ip_hash text not null,
  window_start timestamptz not null,
  hit_count integer not null default 0,
  primary key (ip_hash, window_start)
);

create index if not exists enquiries_status_created_idx on public.enquiries(status, created_at desc);
create index if not exists enquiries_event_date_idx on public.enquiries(event_date);
create index if not exists enquiries_assigned_status_idx on public.enquiries(assigned_to, status);
create index if not exists quotes_enquiry_revision_idx on public.quotes(enquiry_id, revision_number desc);
create index if not exists quote_items_quote_order_idx on public.quote_items(quote_id, sort_order);
create index if not exists bookings_event_status_idx on public.bookings(event_date, status);
create index if not exists activity_enquiry_created_idx on public.activity_events(enquiry_id, created_at desc);

create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles p
    where p.user_id = auth.uid() and p.active = true
  );
$$;

create or replace function public.consume_public_submission(p_ip_hash text, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := date_trunc('minute', now()) - make_interval(mins => (extract(minute from now())::integer % 15));
  v_count integer;
begin
  if length(p_ip_hash) <> 64 or p_limit < 1 then return false; end if;
  delete from public.public_submission_limits where window_start < now() - interval '2 days';
  insert into public.public_submission_limits(ip_hash, window_start, hit_count)
    values (p_ip_hash, v_window, 1)
    on conflict (ip_hash, window_start)
    do update set hit_count = public.public_submission_limits.hit_count + 1
      where public.public_submission_limits.hit_count < p_limit
    returning hit_count into v_count;
  return v_count is not null;
end;
$$;

alter table public.service_types enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.bookings enable row level security;
alter table public.activity_events enable row level security;
alter table public.public_submission_limits enable row level security;

grant select on public.service_types to anon, authenticated;
grant select on public.admin_profiles to authenticated;
grant select, insert, update on public.enquiries to authenticated;
grant select, insert, update on public.enquiry_notes to authenticated;
grant select, insert, update, delete on public.quotes to authenticated;
grant select, insert, update, delete on public.quote_items to authenticated;
grant select, insert, update on public.bookings to authenticated;
grant select, insert on public.activity_events to authenticated;
grant all on public.public_submission_limits to service_role;

create policy "active services are readable" on public.service_types
  for select to anon, authenticated using (active = true);
create policy "staff can read own profile" on public.admin_profiles
  for select to authenticated using (user_id = auth.uid());
create policy "staff can read enquiries" on public.enquiries
  for select to authenticated using (public.is_active_staff());
create policy "staff can create enquiries" on public.enquiries
  for insert to authenticated with check (public.is_active_staff());
create policy "staff can update enquiries" on public.enquiries
  for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "staff can manage enquiry notes" on public.enquiry_notes
  for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "staff can read quotes" on public.quotes
  for select to authenticated using (public.is_active_staff());
create policy "staff can create quotes" on public.quotes
  for insert to authenticated with check (public.is_active_staff() and status = 'draft');
create policy "staff can update draft quotes" on public.quotes
  for update to authenticated using (public.is_active_staff() and status = 'draft')
  with check (public.is_active_staff() and status = 'draft');
create policy "staff can delete draft quotes" on public.quotes
  for delete to authenticated using (public.is_active_staff() and status = 'draft');
create policy "staff can read quote items" on public.quote_items
  for select to authenticated using (public.is_active_staff());
create policy "staff can add items to draft quotes" on public.quote_items
  for insert to authenticated with check (
    public.is_active_staff() and exists (
      select 1 from public.quotes q where q.id = quote_id and q.status = 'draft'
    )
  );
create policy "staff can update items on draft quotes" on public.quote_items
  for update to authenticated using (
    public.is_active_staff() and exists (
      select 1 from public.quotes q where q.id = quote_id and q.status = 'draft'
    )
  ) with check (
    public.is_active_staff() and exists (
      select 1 from public.quotes q where q.id = quote_id and q.status = 'draft'
    )
  );
create policy "staff can delete items on draft quotes" on public.quote_items
  for delete to authenticated using (
    public.is_active_staff() and exists (
      select 1 from public.quotes q where q.id = quote_id and q.status = 'draft'
    )
  );
create policy "staff can manage bookings" on public.bookings
  for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "staff can read and add activity" on public.activity_events
  for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());

revoke all on public.public_submission_limits from anon, authenticated;
revoke all on function public.consume_public_submission(text, integer) from public, anon, authenticated;
grant execute on function public.consume_public_submission(text, integer) to service_role;
grant execute on function public.is_active_staff() to authenticated;
