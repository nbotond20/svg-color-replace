export const parseAsArray = <T = string>(input: string | string[], name: string): T[] => {
  if (Array.isArray(input)) {
    return input as T[]
  }
  let parsed: T[]
  try {
    const trimmed = input.trim()
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error(`Error parsing JSON. (${name})`)
  }

  if(!Array.isArray(parsed)) {
    throw new Error(`Expected an array. (${name})`)
  }

  return parsed
}
