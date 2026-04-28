export function extractProps(obj: any, depth = 4, seen = new WeakSet()) {
  if (!obj || typeof obj !== "object") return "data";

  // prevent circular references
  if (seen.has(obj)) return "circular";
  seen.add(obj);

  if (depth === 0) return "data";

  const result: any = {};

  for (let key in obj) {
    try {
      const value = obj[key];

      // Skip useless stuff
      if (
        typeof value === "function" ||
        key.startsWith("_") ||
        key === "parent"
      ) continue;

      // Arrays
      if (Array.isArray(value)) {
        result[key] = value.length
          ? [extractProps(value[0], depth - 1, seen)]
          : [];
      }
      // Objects
      else if (typeof value === "object") {
        result[key] = extractProps(value, depth - 1, seen);
      }
      // Primitive
      else {
        result[key] = "data";
      }
    } catch (e) {
      result[key] = "unreadable";
    }
  }

  return result;
}