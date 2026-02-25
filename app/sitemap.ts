import type { MetadataRoute } from "next"
import { products } from "@/lib/products-data"

const SITE_URL = "https://cersanit-spb.ru"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/delivery`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contacts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  // SEO landing pages
  const seoPages: MetadataRoute.Sitemap = [
    "spb",
    "keramicheskaya-plitka-spb",
    "keramogranit-spb",
    "plitka-dlya-vannoj-spb",
    "mozaika-spb",
    "dostavka-plitki-spb",
    "magazin-plitki-spb",
  ].map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Product pages
  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.slug)
    .map((product) => ({
      url: `${SITE_URL}/catalog/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

  return [...staticPages, ...seoPages, ...productPages]
}
