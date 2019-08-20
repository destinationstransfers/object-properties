export function hasDeepProperty(
  obj: object,
  propertyPath: string | string[]
): boolean;
export function getDeepProperty(
  obj: object,
  propertyPath: string | string[]
): any;
export function setDeepProperty(
  obj?: object,
  property: string | string[],
  value: any
): object;
export function setDeepProperty(
  obj?: object,
  properties: Record<string, any>
): object;
