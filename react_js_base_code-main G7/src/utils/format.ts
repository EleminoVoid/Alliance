export function prettifyLabel(input?: string): string {
  if (!input) return "";
  // If already contains spaces, just title-case
  const replaced = input
    // replace underscores and hyphens
    .replace(/[-_]+/g, " ")
    // insert space before capital letters (camelCase/PascalCase)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // collapse multiple spaces
    .replace(/\s+/g, " ")
    .trim();

  // Title case each word
  return replaced
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function amenityLabel(amenity: any): string {
  if (!amenity && amenity !== 0) return "";
  if (typeof amenity === "string") return prettifyLabel(amenity);
  if (typeof amenity === "number") return String(amenity);
  // amenity might be an object like { amenity: 'Projector' } or { name: 'Projector' }
  if (typeof amenity === "object") {
    const candidate = amenity.amenity ?? amenity.name ?? amenity.label ?? amenity.Amenity ?? amenity.Name;
    if (candidate) return prettifyLabel(String(candidate));
    // fallback: try to stringify a value field
    const vals = Object.values(amenity).filter((v) => typeof v === "string" || typeof v === "number");
    if (vals.length > 0) return prettifyLabel(String(vals[0]));
    return JSON.stringify(amenity);
  }
  return String(amenity);
}

export function joinAmenityList(list: any[] | undefined): string {
  if (!list || !Array.isArray(list) || list.length === 0) return "";
  return list.map(amenityLabel).filter(Boolean).join(", ");
}
