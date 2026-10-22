export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  prompt: string;
  number: string;
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  { slug: "weddings-traditional-events", title: "Weddings & traditional events", short: "A thoughtful food plan for the moments people gather around.", description: "Share the date, venue, guest estimate, and the kind of gathering you are planning. The catering team can review the details and prepare a custom quotation.", prompt: "Tell us about the event, the venue, and the guest estimate.", number: "01", image: "/images/traditional-events.jpg", imageAlt: "Kerala event table set with banana leaves and brass serving vessels" },
  { slug: "corporate-catering", title: "Corporate catering", short: "For meetings, team occasions, and business gatherings.", description: "Describe the occasion, timing, location, and service needs. The team will review the request and follow up with a tailored quotation.", prompt: "Include the organization, event date, location, and service format if known.", number: "02", image: "/images/corporate-catering.jpg", imageAlt: "A catered buffet arranged in a bright meeting venue" },
  { slug: "parties", title: "Parties", short: "A custom enquiry for the people and plans that matter to you.", description: "Tell us what you are celebrating, where it will take place, and roughly how many guests to expect. Menu and service details can be discussed after the enquiry.", prompt: "An approximate guest count and event date are a useful starting point.", number: "03", image: "/images/raman-caterings-hero.jpg", imageAlt: "A Kerala meal presented for a gathering" },
  { slug: "institutional-catering", title: "Institutional catering", short: "Discuss one-off or recurring requirements with the team.", description: "Share the organization, expected quantities, schedule, location, and any requirements the team should consider before preparing a quotation.", prompt: "Include frequency and approximate volume if you already know them.", number: "04", image: "/images/corporate-catering.jpg", imageAlt: "A generous buffet prepared for group dining" },
  { slug: "bulk-food-orders", title: "Bulk food orders", short: "Start with quantity, date, and delivery or collection details.", description: "Use the enquiry form to describe the requested quantity, date, destination, and any preferences. The team will confirm what can be quoted.", prompt: "Share quantity, date, locality, and delivery or collection preference.", number: "05", image: "/images/raman-caterings-hero.jpg", imageAlt: "A Kerala meal served on a fresh banana leaf" }
];

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ramancatering.vercel.app";
