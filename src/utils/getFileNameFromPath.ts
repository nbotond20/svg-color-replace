export const getFileNameFromPath = (path: string, withExtension: boolean = false) => {
  const fileNameParts = path.split('/')
  return withExtension ? fileNameParts[fileNameParts.length - 1] : fileNameParts[fileNameParts.length - 1].split('.')[0]
}
