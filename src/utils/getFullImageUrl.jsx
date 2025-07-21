export function getFullImageUrl(path) {
  if (!path) return "";
  // ถ้า path ไม่มี http = เติม domain API
  if (path.startsWith("/uploads")) {
    return `https://member.luggaw.com${path}`;
  }
  return path;
}
