export const getUniqueSVGColorsFromString = (svgString: string) => {
  const colors = svgString
    .match(/(fill|stroke)="(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)"/g)
    ?.map(color => {
      const colorName = color.split('=')[1].replace(/"/g, '')

      const isHex = colorName.match(/#[0-9A-Fa-f]{3,6}/)
      if (isHex) {
        return colorName.toLocaleLowerCase()
      }

      return undefined
    })
    .filter(Boolean) as string[]

  const uniqueColors = colors ? Array.from(new Set(colors)) : []

  return uniqueColors
}
