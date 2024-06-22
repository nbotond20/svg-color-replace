# SVG Color Replace

This action replaces colors in SVG files with CSS variables coming from a JSON color token set.

## Inputs

| Name                          | Description                                                    | Required | Default |
| ----------------------------- | -------------------------------------------------------------- | -------- | ------- |
| `svg-folder-path`             | The path to the folder containing the SVG files.               | Yes      | N/A     |
| `token-set-input-paths`       | The path to the JSON file containing the color token set.      | Yes      | N/A     |
| `base-token-set-input-path`   | The path to the JSON file containing the base color token set. | Yes      | N/A     |
| `dry-run`                     | Whether to run the action without modifying the files.         | No       | `false` |
| `token-set-keys`              | The keys to use from the token set.                            | No       | N/A     |
| `prefer-deep-key`             | Whether to prefer deep keys over shallow keys.                 | No       | `false` |
| `file-extensions`             | The file extensions to process.                                | No       | `["*"]` |
| `inject-into-html`            | Whether to inject the CSS file into the HTML file.             | No       | `false` |
| `html-path`                   | The path to the HTML file to inject the CSS file into.         | No       | N/A     |
| `css-file-output-folder-path` | The path to the folder to output the CSS file to.              | No       | N/A     |
| `css-file-href-prefix`        | The prefix to use for the CSS file href.                       | No       | N/A     |

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
          svg-folder-path: 'path/to/svg/folder'
          token-set-input-paths: |
            ["path/to/color/token/set.json", "path/to/other/color/token/set.json"]
          base-token-set-input-path: 'path/to/base/color/token/set.json'
          dry-run: false
          token-set-keys: '["color"]'
          prefer-deep-key: false
          file-extensions: '[".svg"]'
          inject-into-html: false
          html-path: 'path/to/html/file'
          css-file-output-folder-path: 'path/to/css/folder'
          css-file-href-prefix: 'path/to/css/folder'
```
