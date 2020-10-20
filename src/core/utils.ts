export function isNullOrUndefined(value: any): boolean {
  return typeof value === "undefined" || value === null;
}
export function isBlank(str: string | null | undefined): boolean {
  return !str || /^\s*$/.test(str);
}

export function isFalse(value: boolean | null | undefined): boolean {
  return value === false;
}

function isArrayIndex(value: string): boolean {
  return /\[\d+\]/.test(value);
}

function getPathAsIndex(elem: string): number {
  return +elem.substring(1, elem.length - 1);
}

/**
 * Sets a nested property such as "foo.bar.baz", initializing intermediate nodes if needed
 */
export function setNestedProperty(root: any, path: string, value: any): any {
  let node = root;
  const pathParts = path.split(/\.|(\[\d+\])/).filter((part) => !!part);
  const length = pathParts.length;
  for (let i = 0; i < length - 1; i++) {
    let elem: string | number = pathParts[i];
    if (isArrayIndex(elem)) {
      elem = getPathAsIndex(elem);
    }
    if (!node[elem]) {
      node[elem] = isArrayIndex(pathParts[i + 1]) ? [] : {};
    }
    node = node[elem];
  }
  let lastPathPart: string | number = pathParts[length - 1];
  if (isArrayIndex(lastPathPart)) {
    lastPathPart = getPathAsIndex(lastPathPart);
  }
  node[lastPathPart] = value;
  return root;
}

export function getNestedProperty(root: any, path: string): any {
  let node = root;
  const pathParts = path.split(/\.|\[(\d+)\]/).filter((part) => !!part);
  for (let part of pathParts) {
    node = node[part];
    if (typeof node === "undefined") {
      return node;
    }
  }
  return node;
}
