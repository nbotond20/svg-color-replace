# SVG Color Replace

This action replaces colors in SVG files with CSS variables coming from a JSON color token set.

## Inputs

| Name                 | Description                                                                                                                      | Required |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| token-set-input-path | The path to the JSON file containing the token set                                                                               | true     |
| svg-folder-path      | The path to the folder containing the SVG files to process                                                                       | true     |
| dry-run              | If true, the action will not write any files, only log the changes that would be made                                            | false    |
| token-set-key        | The key in the token set to use for the color replacement (e.g. "color.primary")                                                 | false    |
| prefer-deep-key      | If true, the action will prefer a deep key in the token set (e.g. "color.primary.500") over a shallow key (e.g. "color.primary") | false    |
| css-map-output-path  | The path to a JSON file to write the CSS variable map to                                                                         | false    |
| file-extensions      | The file extensions to process (e.g. ".svg, .tsx")                                                                               | false    |
| inject-into-html     | If true, the action will inject the CSS variables into the head of the HTML file                                                 | false    |
| html-path            | The path to the HTML file to inject the CSS variables into                                                                       | false    |
| css-output-path      | The path to the CSS file to write the CSS variables to                                                                           |

## Example usage

_Check the repo for the latest release. This version number is just an example._

```yaml
name: Replace colors in SVG files
on:
  push:
    branches:
      - main
jobs:
  replace-svg-colors:
    runs-on: ubuntu-latest
    steps:
      - name: Replace colors in SVG files
        uses: nbotond20/svg-color-replace@v1.0.0
        with:
          token-set-input-path: './color-tokens.json'
          svg-folder-path: './src/assets/svg'
          css-output-path: './src/styles/colors.css'
          inject-into-html: true
          html-path: './public/index.html'
          file-extensions: |
            [
              ".svg"
            ]
```
