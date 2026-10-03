export const tools = [
  { slug: "png-in-jpg", name: "PNG in JPG", category: "bilder", status: "live" },
  { slug: "jpg-in-png", name: "JPG in PNG", category: "bilder", status: "live" },
  { slug: "heic-in-jpg", name: "HEIC in JPG", category: "bilder", status: "live" },
  { slug: "webp-in-jpg", name: "WebP in JPG", category: "bilder", status: "live" },
  { slug: "jpg-in-pdf", name: "JPG in PDF", category: "pdf", status: "live" },
];

export const liveTools = tools.filter(t => t.status === "live");
