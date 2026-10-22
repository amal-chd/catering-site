type BrandMarkProps = { className?: string };

export default function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="#173e35" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="#dfb45d" strokeWidth="1.25" />
      <circle cx="32" cy="38" r="13.5" fill="none" stroke="#fff5e3" strokeOpacity=".78" strokeWidth="1.2" />
      <path d="M15.5 37.5C20.4 23.7 31.1 16.8 49.3 14.4c-1.3 17.2-11.7 29.2-29.5 31.1-2.5-2-3.9-4.6-4.3-8Z" fill="#c8da82" />
      <path d="M19.2 43.7c8.1-7.1 17.7-16 28.8-27.5" fill="none" stroke="#496d4d" strokeLinecap="round" strokeWidth="1.65" />
      <path d="M27.2 33.1c-3.1-1.4-5.7-3.5-7.7-6.2M34.2 26.2c-1.1-3-1.2-5.9-.2-8.8M27.1 36.1c-3.4.2-6.5-.2-9.2-1.4" fill="none" stroke="#789b63" strokeLinecap="round" strokeWidth="1.1" />
      <circle cx="32" cy="38" r="8.2" fill="none" stroke="#dfb45d" strokeOpacity=".85" strokeWidth=".9" />
    </svg>
  );
}
