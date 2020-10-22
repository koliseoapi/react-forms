export function isNullOrUndefined(value: any): boolean {
  return typeof value === "undefined" || value === null;
}
export function isBlank(str: string | null | undefined): boolean {
  return !str || /^\s*$/.test(str);
}

export function isFalse(value: boolean | null | undefined): boolean {
  return value === false;
}

/**
 * Sets a nested property such as "foo.bar.baz", initializing intermediate nodes if needed
 */
export function setNestedProperty(root: any, path: string, value: any): any {
  let node = root;
  const pathParts = path.split(".");
  const length = pathParts.length;
  for (let i = 0; i < length; i++) {
    const [, attr, , arrayIndexStr] =
      /([^[]+)(\[(\d+)\])?/.exec(pathParts[i]) || [];
    if (!arrayIndexStr) {
      if (i == length - 1) {
        node[attr] = value;
      } else if (!node[attr]) {
        node[attr] = {};
      }
      node = node[attr];
    } else {
      if (!node[attr]) {
        node[attr] = [];
      }
      const array = node[attr];
      const arrayIndex = +arrayIndexStr;
      if (i == length - 1) {
        array[arrayIndex] = value;
      } else if (!array[arrayIndex]) {
        array[arrayIndex] = {};
      }
      node = array[arrayIndex];
    }
  }
  return root;
}

export function getNestedProperty(root: any, path: string): any {
  let node = root;
  const pathParts = path.split(/[.[\]]/).filter((part) => !!part);
  for (let part of pathParts) {
    node = node[part];
    if (typeof node === "undefined") {
      return undefined;
    }
  }
  return node;
}
