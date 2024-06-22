import { CssMap } from '../generateCssMaps'

export const getObjectPathFromCssVariable = (cssVariable: string) => {
  const path = cssVariable.split('--')[1]
  return path.split('-').filter(Boolean).join('.')
}
