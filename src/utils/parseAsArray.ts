export const parseAsArray = <T = string>(input: string | string[], name: string): T[] => {
  if (Array.isArray(input)) {
    return input as T[]
  }
  try {
    const parsed = JSON.parse(input)
    if (!Array.isArray(parsed)) {
      throw new Error(`Not an array. (${name})`)
    }
    return parsed as T[]
  } catch {
    throw new Error(`Error parsing JSON. (${name})`)
  }
}
