export function getErrorMessage(err: any, fallback = "An error occurred") {
  if (!err) return fallback;
  // If it's already a string
  if (typeof err === "string") return err;

  // If it's an Error object with message set by API layer, prefer that
  if (err.message && typeof err.message === "string") {
    const m: string = err.message;
    // If message contains a JSON body (e.g. "401 ...: {..}"), try parse it
    const jsonStart = m.indexOf("{");
    if (jsonStart !== -1) {
      try {
        const parsed = JSON.parse(m.slice(jsonStart));
        if (parsed && typeof parsed === "object") {
          if (parsed.message) return String(parsed.message);
          if (parsed.error) return String(parsed.error);
          return JSON.stringify(parsed);
        }
      } catch {
        // fall through to other strategies
      }
    }
    // If message has a status prefix like "401 Unauthorized: some message", take suffix
    const colonIndex = m.indexOf(": ");
    if (colonIndex !== -1) {
      const suffix = m.slice(colonIndex + 2).trim();
      if (suffix) return suffix;
    }
    return m;
  }

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
