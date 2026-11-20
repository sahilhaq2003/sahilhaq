const MONGODB_IMAGE_PATH = /^\/api\/images\/[a-f\d]{24}$/i;

/** Convert MongoDB image paths to URLs that work from a separate frontend. */
export function resolveImageUrl(req, value) {
  if (typeof value !== "string" || !MONGODB_IMAGE_PATH.test(value)) return value || "";
  return `${req.protocol}://${req.get("host")}${value}`;
}

export function resolveImageUrls(req, values = []) {
  return Array.isArray(values) ? values.map((value) => resolveImageUrl(req, value)) : [];
}
