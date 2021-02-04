# New WB

Installer script for [WB Starter](https://github.com/wbrowar/WB-Starter)

## Requirements
- [Node.js](https://nodejs.org/en/) (requires v14+)
- [Composer](https://getcomposer.org) (Needed when installing PHP-based projects, only)

## Installation
**New WB** is a Node module that should be installed globally and it downloads the rest of its dependencies via `npm` and, when applicable, `composer`.

To set up **New WB**, run `npm install -g new-wb` to install it to your global NPM modules folder.

## Usage
Follow these steps to generate a new project:

1. `cd` into wherever you host local web projects (the project folder will be created within this folder).
2. Run `new-wb`.
3. Enter in the required information requested by various sets of prompts. Questions are asked by different installation tools and may change over time.
    
By default and when possible, command line output is suppressed, however, you can see debugging command output and confirmation logs by adding the `--verbose` option.

## Options
Arguments that are available when running `new-wb`:

| Argument | Default | Description |
| --- | --- | --- |
| `--dev` | *false* | Use the `dev` branch of WB Starter for installation. |
| `--local` | | Points to the root of a local, unzipped, version of WB-Starter to use that instead of downloading it from the repo. _NOTE: `--dev` will be ignored when using a local install._ |
| `--verbose` | *false* | Displays command confirmations and extra command line output. |

## Contributing
To test locally clone this repo, `cd` into it and run this command:

```
npm uninstall -g new-wb && npm install -g
```