// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toQueryParams = (obj: any) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join('&')
