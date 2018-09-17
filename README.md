# New WB

Installer script for [WB Starter](https://github.com/wbrowar/WB-Starter)

## Requirements
- [Node.js](https://nodejs.org/en/) (requires v10+)
- [Composer](https://getcomposer.org)

## Installation
**New WB** is a Node module that should be installed globally and it downloads the rest of its dependencies via `npm` and `composer`.

To set up **New WB**, run `npm install -g new-wb` to install it to your global NPM modules folder.

## Usage
Follow these steps to generate a new Craft 3 website:

1. `cd` into your parked Valet directory (or wherever you host local web projects)
2. Run `new-wb`
3. Enter in the required information requested by various sets of prompts. Questions are asked by different installation tools—and may change over time.
    
By default and when possible, command line output is suppressed, however, you can see all command output and confirmation logs by adding the `--verbose` option. This could be useful for debugging.

## Options
Arguments that are available when running `new-wb`:

| Argument | Default | Description |
| --- | --- | --- |
| `--dev` | *false* | Use the `dev` branch of WB Starter for installation. |
| `--verbose` | *false* | Displays command confirmations and extra command line output. |

## Contributing
To test locally, remove any existing versions of `new-wb`, clone this repo, and run this command:

```
npm uninstall -g new-wb && npm install -g PATH_TO_LOCAL
```