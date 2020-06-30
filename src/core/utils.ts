export function isNullOrUndefined(value?: any): boolean {
  return typeof value === "undefined" || value === null;
}
export function isBlank(str: string): boolean {
  return !str || /^\s*$/.test(str);
}

export function isFalse(value: boolean): boolean {
  return value === false;
}

/**
 * Sets a nested property such as "foo.bar.baz", initializing intermediate nodes if needed
 */
export function setNestedProperty(root: any, path: string, value: any): any {
  let node = root;
  const pathParts = path.split(".");
  const length = pathParts.length;
  for (let i = 0; i < length - 1; i++) {
    const elem = pathParts[i];
    if (!node[elem]) {
      node[elem] = {};
    }
    node = node[elem];
  }
  node[pathParts[length - 1]] = value;
  return root;
}

export function getNestedProperty(root: any, path: string): any {
  let node = root;
  const pathParts = path.split(".");
  for (let part of pathParts) {
    node = node[part];
    if (typeof node === "undefined") {
      return node;
    }
  }
  return node;
}
