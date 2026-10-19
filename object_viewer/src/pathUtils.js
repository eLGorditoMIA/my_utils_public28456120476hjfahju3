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

/**
 * Move `key` one position earlier ("up") or later ("down") among its
 * object's own keys. Objects can't reorder keys in place, so this returns a
 * NEW object with the same values in the new key order (same object
 * reference back if already at that boundary, so callers can skip
 * re-rendering on a no-op).
 * @param {Record<string, any>} obj
 * @param {string} key
 * @param {"up"|"down"} direction
 */
export function reorderObjectKey(obj, key, direction) {
  const keys = Object.keys(obj || {});
  const idx = keys.indexOf(key);
  const newIdx = idx + (direction === "up" ? -1 : 1);
  if (idx === -1 || newIdx < 0 || newIdx >= keys.length) return obj;

  const reordered = keys.slice();
  [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];

  const next = {};
  for (const k of reordered) next[k] = obj[k];
  return next;
}

/**
 * Move the array element at `index` one position earlier ("up") or later
 * ("down"). Mutates `arr` in place since arrays can reorder without
 * replacing the reference.
 * @param {any[]} arr
 * @param {number} index
 * @param {"up"|"down"} direction
 */
export function moveArrayItem(arr, index, direction) {
  if (!Array.isArray(arr)) return arr;
  const newIndex = index + (direction === "up" ? -1 : 1);
  if (newIndex < 0 || newIndex >= arr.length) return arr;
  [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
  return arr;
}

/**
 * Recursively filters an object by key/value substring match, drilling into
 * nested objects AND arrays (of objects, arrays, or primitives) so only the
 * matching leaves (and their parent keys/indices, needed to show where the
 * match lives) are kept, pruning non-matching siblings/items at every level.
 */
export function deepFilterObject(obj, filter, stringifyFn) {
  const isArr = Array.isArray(obj);
  const results = isArr ? [] : {};
  const set = (k, v) => (isArr ? results.push(v) : (results[k] = v));
  Object.entries(obj || {}).forEach(([k, v]) => {
    const isNestedContainer = v !== null && typeof v === "object";
    if (isNestedContainer) {
      if (k.toLowerCase().includes(filter)) {
        set(k, v);
      } else {
        const nested = deepFilterObject(v, filter, stringifyFn);
        if (Object.keys(nested).length) set(k, nested);
      }
    } else {
      const t = stringifyFn(v);
      if (k.toLowerCase().includes(filter) || String(t).toLowerCase().includes(filter)) {
        set(k, v);
      }
    }
  });
  return results;
}
