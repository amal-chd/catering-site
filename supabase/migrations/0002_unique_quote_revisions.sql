create unique index if not exists quotes_enquiry_revision_unique_idx
  on public.quotes(enquiry_id, revision_number);
