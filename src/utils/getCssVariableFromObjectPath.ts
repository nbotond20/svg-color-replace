export const getCssVariableFromObjectPath = (path: string) => {
  const pathArray = path.split('.')
  return `--${pathArray.join('-')}`
}
