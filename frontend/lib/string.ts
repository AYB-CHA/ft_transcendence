export function camelCaseToNormal(camelString: string) {
  camelString = camelString.replace(/[A-Z]/g, (str) => " " + str.toLowerCase());
  return camelString[0].toUpperCase() + camelString.slice(1);
}
