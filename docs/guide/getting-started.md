# Getting Started

::: warning Note
Make sure your Node.js version is >= 16.
:::

::: tip Tip
The default image host is [SM.MS](https://sm.ms/).
:::

## Try it out (no install)

> If your npm is >= 5.2, you can try PicGo with `npx`. This command installs PicGo temporarily and removes it after you’re done.

```bash
npx picgo upload ./xxxx.jpg
```

## Install globally

> Using the CLI

```bash
# Install
yarn global add picgo # or npm install picgo -g

# Upload an image from a path
picgo upload /xxx/xxx.jpg

# Upload the first image in the clipboard (will be converted to PNG)
picgo upload
```

> Clipboard image uploading is implemented by [vs-picgo](https://github.com/Spades-S/vs-picgo). Thanks to [Spades-S](https://github.com/Spades-S)!

## Use in an existing project

> Using the API

```bash
yarn add picgo -D # or npm install picgo -D
```
Create a JS file (for example, `picgo.js`):
```js
// v1.4.x and earlier
const PicGo = require('picgo')

// v1.5.0+
const { PicGo } = require('picgo')

const picgo = new PicGo() // Uses the default config file: ~/.picgo/config.json

// Upload an image from a path
picgo.upload(['/xxx/xxx.jpg'])

// Upload the first image in the clipboard (will be converted to PNG)
picgo.upload()
```
Run it:

```sh
node picgo.js
```
