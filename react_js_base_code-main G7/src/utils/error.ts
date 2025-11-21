export function getErrorMessage(err: any, fallback = "An error occurred") {
  if (!err) return fallback;
  // If it's already a string
  if (typeof err === "string") return err;

  // If it's an Error object with message set by API layer, prefer that
  if (err.message && typeof err.message === "string") return err.message;

  // If API attached a status, map to friendly messages as fallback
  if (typeof err.status === "number") {
    if (err.status === 401) return "Authentication failed. Please sign in.";
    if (err.status === 403) return "You do not have permission to perform this action.";
    if (err.status === 404) return "Resource not found.";
    if (err.status >= 500) return "Server error. Please try again later.";
  }

  // If raw body present, try to extract known properties
  const raw = err.raw ?? err;
  if (raw) {
    try {
      if (typeof raw === "string") {
        // try parse JSON
        try {
          const p = JSON.parse(raw);
          return (p.message || p.error || p.detail || JSON.stringify(p)).toString();
        } catch {
          return raw;
        }
      }
      if (typeof raw === "object") {
        return (raw.message || raw.error || raw.detail || JSON.stringify(raw)).toString();
      }
    } catch {
      // fallthrough
    }
  }

  return fallback;
}
