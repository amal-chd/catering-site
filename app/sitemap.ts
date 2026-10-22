import type { MetadataRoute } from "next";
import { services, siteUrl } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/services", "/how-it-works", "/contact", "/request-quote"];
  return [
    ...routes.map((route) => ({ url: siteUrl + route, lastModified: new Date() })),
    ...services.map((service) => ({ url: siteUrl + "/services/" + service.slug, lastModified: new Date() }))
  ];
}
