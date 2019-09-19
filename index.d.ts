export function hasDeepProperty(
  obj: object,
  propertyPath: string | string[]
): boolean;
export function getDeepProperty(
  obj: object,
  propertyPath: string | string[]
): unknown | undefined;
export function setDeepProperty<T extends object>(
  obj?: T,
  property: string | string[],
  value: unknown
): T;
export function setDeepProperty<T extends object>(
  obj?: T,
  properties: Record<string, any>
): T;
export function deleteDeepProperty<T extends object>(
  obj?: T,
  property: string
): T;
