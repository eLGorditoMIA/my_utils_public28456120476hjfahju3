export function isObjectLike(v) {
  return v !== null && typeof v === "object";
}

export function formatPath(path) {
  if (!path || !path.length) return "root";
  return "root" + path.map((p) => (typeof p === "number" ? `[${p}]` : `.${p}`)).join("");
}

export function getAtPath(root, path) {
  let cur = root;
  for (const p of path) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

export function setAtPath(root, path, value) {
  if (!path.length) return value;
  let cur = root;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i]];
  }
  cur[path[path.length - 1]] = value;
  return root;
}

export function deleteAtPath(root, path) {
  if (!path.length) return root;
  const parent = getAtPath(root, path.slice(0, -1));
  const last = path[path.length - 1];
  if (Array.isArray(parent) && typeof last === "number") {
    parent.splice(last, 1);
  } else if (parent && typeof parent === "object") {
    delete parent[last];
  }
  return root;
}

export function renameKeyAtPath(root, path, oldKey, newKey) {
  const obj = getAtPath(root, path);
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return root;
  if (!Object.prototype.hasOwnProperty.call(obj, oldKey)) return root;
  if (oldKey !== newKey && Object.prototype.hasOwnProperty.call(obj, newKey)) return root;
  const val = obj[oldKey];
  delete obj[oldKey];
  obj[newKey] = val;
  return root;
}
