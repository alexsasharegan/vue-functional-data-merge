export type AttrsClass =
  string | string[] | Record<string, boolean> | (string|Record<string, boolean>)[];

function reorganize(attrsClass: AttrsClass): AttrsClass {
  if (!Array.isArray(attrsClass)) {
    return attrsClass;
  }

  const objectIndices: number[] = [];
  for (let i = 0; i < attrsClass.length; i += 1) {
    if (typeof attrsClass[i] === 'object') {
      objectIndices.push(i);
    }
  }
  for (let i = objectIndices.length - 1; i >= 0; i -= 1) {
    const item = attrsClass[objectIndices[i]] as Record<string, boolean>;
    attrsClass.splice(objectIndices[i], 1);
    (attrsClass as Record<string, boolean>[]).push(item);
  }
  return attrsClass;
}

export function mergeClass(
  attrsClass: AttrsClass | undefined,
  classes: AttrsClass,
): AttrsClass {
  if(classes === '') {
    return attrsClass;
  }

  if (attrsClass === undefined) {
    return classes;
  }

  if (typeof attrsClass === 'string') {
    attrsClass = [
      attrsClass,
    ] as string[];
  } else if (!Array.isArray(attrsClass) && typeof attrsClass === 'object') {
    attrsClass = [
      attrsClass,
    ] as (string|Record<string, boolean>)[];
  }

  if (typeof classes === 'string') {
    attrsClass.push(classes);
    return reorganize(attrsClass);
  }

  if (Array.isArray(classes)) {
    for (let i = 0; i < classes.length; i += 1) {
      const item = classes[i];
      if (typeof item !== 'object') {
        const attrItem = attrsClass.find((x) => x === item);
        if (attrItem === undefined) attrsClass.push(item);
      }
    }
  }

  const objectIndex: number = attrsClass.findIndex((x) => typeof x === 'object');
  let classesRecord: Record<string, boolean> | null = null;

  if (!Array.isArray(classes) && typeof classes === 'object') {
    if (objectIndex === -1) {
      (attrsClass as (string|Record<string, boolean>)[]).push(classes);
      return reorganize(attrsClass);
    }

    classesRecord = classes;
  }

  if (classesRecord == null && Array.isArray(classes)) {
    const classObjectIndex: number = classes.findIndex((x) => typeof x === 'object');
    if (classObjectIndex >= 0) classesRecord = classes[classObjectIndex] as Record<string, boolean>;
  }

  if (objectIndex !== -1 && classesRecord != null) {
    Object.keys(classesRecord).forEach((key) => {
      if (Array.isArray(attrsClass) && classesRecord != null) {
        (attrsClass[objectIndex] as Record<string, boolean>)[key] = classesRecord[key];
      }
    });
  } else if (objectIndex === -1 && classesRecord != null) {
    (attrsClass as Record<string, boolean>[]).push(classesRecord);
  }

  return reorganize(attrsClass);
}
