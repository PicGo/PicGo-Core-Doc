# GUI Plugin Development

## Overview

GUI plugins are plugins that run inside the Electron version of [PicGo](https://github.com/Molunerfinn/PicGo). They support most capabilities available to regular plugins (see [Plugin Development](/dev-guide/cli)), and additionally provide `guiApi` and other GUI-specific events to make your plugin more powerful inside PicGo.

![](https://pic.molunerfinn.com/picgo/docs/50515434-bc9e8180-0adf-11e9-8c71-0e39973c06b1.png)

Since PicGo 2.0, the plugin system is built on top of PicGo-Core. During an upload, your plugin (Uploader, Transformer, etc.) participates in the PicGo-Core lifecycle. That means a CLI plugin usually runs in PicGo with little or no change.

However, sometimes you need additional capabilities, for example:

- Delete the remote file when an image is removed from the gallery
- Upload via an image URL
- Migrate image links inside Markdown using PicGo’s upload API

These workflows typically require extra user input and interaction beyond the default “upload area”. For GUI plugins, PicGo provides special APIs to support these out-of-band features.

::: warning Important
Make sure you’ve read the non-GUI [Plugin Development](/dev-guide/cli) guide first—concepts introduced there won’t be repeated here.
:::

## guiMenu

`guiMenu` is the main entry point for giving your plugin interactive controls. It lets your plugin expose custom menu items in PicGo’s plugin page:

![](https://pic.molunerfinn.com/picgo/docs/202211131506889.png)

`guiMenu` is a function. PicGo passes in `ctx` (the PicGo instance) so you can access PicGo methods. It should return an **array**.

Each menu item has two fields:

- `label`: the display text.
- `handle`: the function to run when clicked. Using `async` is recommended. PicGo passes `ctx` and `guiApi` into `handle`—`ctx` is PicGo itself, and `guiApi` is described below.

Example:

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Open InputBox',
      async handle (ctx, guiApi) {
        // do something...
      }
    },
    {
      label: 'Open File Explorer',
      async handle (ctx, guiApi) {
        // do something...
      }
    },
    // ...
  ]
}
```

`guiMenu` should be exported from your plugin’s `module.exports`. For example, given a regular plugin:

```js
const handle = ctx => {
  const input = ctx.input
  let output
  // do something
  ctx.output = output
  return ctx
}

module.exports = ctx => {
  const register = () => {
    ctx.helper.transformer.register('test', { handle })
  }
  return {
    register,
    transformer: 'test'
  }
}
```
Add `guiMenu` like this:

```js
const handle = ctx => {
  const input = ctx.input
  let output
  // do something
  ctx.output = output
  return ctx
}

const guiMenu = ctx => {
  return [
    {
      label: 'Open InputBox',
      async handle (ctx, guiApi) {
        // do something...
      }
    },
    {
      label: 'Open File Explorer',
      async handle (ctx, guiApi) {
        // do something...
      }
    },
    // ...
  ]
}

module.exports = ctx => {
  const register = () => {
    ctx.helper.transformer.register('test', { handle })
  }
  return {
    register,
    guiMenu, // <-- register here
    transformer: 'test'
  }
}
```

## Default menu items

As described in [Plugin Development – Handling Config](/dev-guide/cli#handling-config), if your plugin provides configuration in the `Plugin`, `Uploader`, or `Transformer` dimension, PicGo will generate default configuration items in the plugin context menu:

![defautl-config](https://pic.molunerfinn.com/picgo/docs/default-config.png)

After clicking, PicGo converts your configuration schema into a visual form:

![setting-context-menu](https://pic.molunerfinn.com/picgo/docs/setting-context-menu.png)

If the default menu item labels (derived from the `name` field) are not friendly enough, provide an `alias` field to show a better label in the form.

Example:

```js
const conf = [
  {
    alias: 'Repository name',
    name: 'repo',
    type: 'input',
    default: userConfig.repo || '',
    required: true
  },
  // ...
]
```

When the user confirms, PicGo writes the configuration into the config file according to the configuration dimension.

## guiApi

::: warning Note
The API version in this section follows the PicGo [Electron app](https://github.com/Molunerfinn/PicGo), not the PicGo-Core version.
:::

As mentioned above, each menu item has a `handle` function. The first parameter is `ctx`, and the second is `guiApi`.

`guiApi` currently provides:

- `guiApi.showInputBox`: open an input box
- `guiApi.showFileExplorer`: open a file picker
- `guiApi.upload`: upload via PicGo’s internal uploader
- `guiApi.showNotification`: show a system notification <Badge text="2.0.1+"/>
- `guiApi.showMessageBox`: show a system dialog <Badge text="2.1.0+"/>
- `guiApi.galleryDB`: access gallery data <Badge text="2.3.0+"/>

More APIs may be added over time.

### showInputBox([option])

Opens an input dialog for user input.

- option: `Object` | `undefined`
- return: a Promise that resolves to the user’s input. Using `async/await` is recommended.

`option` is optional. You can pass `{ title, placeholder }` to customize the dialog title and the input placeholder.

![](https://pic.molunerfinn.com/picgo/docs/5c39aa4dab0b4.png)

Example:

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Open InputBox',
      async handle (ctx, guiApi) {
        const value = await guiApi.showInputBox({
          title: 'Open dialog',
          placeholder: 'Enter file path'
        })
        console.log(value)
      }
    }
  ]
}
```

### showFileExplorer([option])

Opens a file picker and returns the selected file/folder paths.

- option: `Object` | `undefined`
- return: a Promise that resolves to an array of selected paths. Using `async/await` is recommended.

`option` is optional. It should be a valid Electron dialog [options object](https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback) (multi-select, files vs folders, etc.).

![](https://pic.molunerfinn.com/picgo/docs/file-expoler.gif)

Example:

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Open File Explorer',
      async handle (ctx, guiApi) {
        const files = await guiApi.showFileExplorer({
          properties: ['openFile', 'multiSelections']
        })
        console.log(files)
      }
    }
  ]
}
```

### upload([file])

Uploads using PicGo’s internal pipeline. This can update gallery data automatically and copy the URL to the clipboard after a successful upload.

- file: `Array` | `undefined`
- return: a Promise that resolves to PicGo’s output array after a successful upload.

::: tip Tip
In practice, you can collect input via `showInputBox` or pick files via `showFileExplorer`, then upload via `upload()`.

That said, writing an Uploader or Transformer plugin is still recommended if you want to take over the PicGo upload lifecycle.
:::

Example:

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Standalone upload',
      async handle (ctx, guiApi) {
        const files = await guiApi.showFileExplorer({
          properties: ['openFile', 'multiSelections']
        })
        guiApi.upload(files)
      }
    }
  ]
}
```

### showNotification(option) <Badge text="2.0.1+" />

Shows a system notification.

- option: `Object` | `undefined`
- return: `undefined`

`option` is required and should include `{ title, body }`.

![](https://pic.molunerfinn.com/picgo/docs/5c3db88042a0f.png)

Example:

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Show notification',
      async handle (ctx, guiApi) {
        guiApi.showNotification({
          title: 'Tip',
          body: 'This tip comes from the plugin'
        })
      }
    }
  ]
}
```

### showMessageBox([option]) <Badge text="2.1.0+" />

Shows a system dialog.

- option: `Object` | `{ title: '', message: '', type: 'info', buttons: ['Yes', 'No'] }`
- return: `{ result, checkboxChecked }`

![](https://pic.molunerfinn.com/picgo/docs/20190611110904.png)

For full `option` parameters, see Electron’s [dialog.showMessageBox](https://electronjs.org/docs/api/dialog#dialogshowmessageboxbrowserwindow-options-callback). In the returned value, `result` is the index of the clicked button. For example, if you click “Yes”, you may get:

```js
{
  result: 0,
  checkboxChecked: false // if checkboxLabel is provided, a checkbox will be shown; otherwise it defaults to false
}
```

Example:

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Show MessageBox',
      async handle (ctx, guiApi) {
        const result = await guiApi.showMessageBox({
          title: 'This is the title',
          message: 'This is the message',
          type: 'info',
          buttons: ['Yes', 'No']
        })
        console.log(result) // { result: 0, checkboxChecked: false }
      }
    }
  ]
}
```

### galleryDB <Badge text="2.3.0+" />

Since 2.3.0, PicGo provides a dedicated gallery database API, including read/update/delete/insert operations. See [api-guiApi-galleryDB](/api/#guiapi-gallerydb) for details.

## i18n <Badge text="2.3.1+" />

PicGo currently supports:

- zh-CN (default)
- zh-TW
- en

If your plugin wants to add i18n support, see [cli-i18n](/dev-guide/cli#i18n-internationalization).

If you want to add a new built-in language to PicGo GUI, refer to the [documentation](https://github.com/Molunerfinn/PicGo/blob/dev/CONTRIBUTING.md#i18n).


## Keyboard shortcuts <Badge text="2.2.0+" />

Since PicGo 2.2.0, plugins can register global shortcuts to implement convenience features.

To register shortcuts, export a `commands` function that returns an **array of shortcut definitions**. Each `commandItem` includes:

- `key: string` - default shortcut
- `name: string` - unique identifier (used to distinguish from others)
- `label: string` - label shown to users
- `handle: async (ctx, guiApi) => {}` - shortcut handler

Example:

```js
const commands = (ctx) => {
  const config = ctx.getConfig('xxx')
  return [{
    label: 'Quick Capture',
    name: 'quickCapture',
    key: 'Ctrl+Shift+0',
    async handle (ctx, guiApi) {
      // ...do what your shortcut needs to do here
    }
  }]
}
```

Like `guiMenu`, `commands` should be exported from your plugin’s `module.exports`. For example:

```js
// ...
const commands = ctx => {}
module.exports = ctx => {
  const register = () => {}
  return {
    register,
    commands // <- register here
  }
}
```

After installing the plugin, open “PicGo Settings → Shortcuts” to see the registered shortcuts.

![shortkey-setting-screenshot](https://pic.molunerfinn.com/picgo/docs/shortKey-setting-screenshot.png)

PicGo assigns a config namespace based on the plugin name and `commandItem.name`, and generates config keys in the form `${pluginName}:${commandItem.name}` (you usually don’t need to care about this detail):

```json
"shortKey": {
  "picgo:upload": {
    "enable": false,
    "key": "Ctrl+Shift+U",
    "name": "upload",
    "label": "Quick Upload"
  },
  "picgo-plugin-test:test": {
    "enable": true,
    "name": "test",
    "label": "Quick Capture",
    "key": "Ctrl+Shift+0"
  }
}
```

You can refer to [picgo-plugin-quick-capture](https://github.com/PicGo/picgo-plugin-quick-capture) as a reference implementation.


## Events

PicGo emits events in certain situations. Plugins can listen to these events to implement additional behaviors. You can register event listeners inside your plugin’s `register` function.

### remove

When a user deletes images from the gallery and confirms, PicGo emits the `remove` event:

![](https://pic.molunerfinn.com/picgo/docs/5c39b3c8746cf.png)

The `remove` event provides an array of deleted images (even if there is only one):

```json
[
  {
    "fileName": "20190112165042.png",
    "width": 1660,
    "height": 932,
    "extname": ".png",
    "imgUrl": "https://yyyy/xxxx.png",
    "type": "tcyun",
    "id": "564b4cb8-3f1c-4af3-88b0-e9ba7f970468"
  },
  {
    "fileName": "new.jpg",
    "width": 1648,
    "height": 936,
    "extname": ".gif",
    "imgUrl": "https://i.loli.net/2019/01/12/xxxx.jpg",
    "type": "smms",
    "id": "8532567a-a307-426e-8d10-c54aecc2100d"
  }
]
```

You can read fields like `type` (which image host was used), filename, URL, extension, etc.

**Since GUI VERSION 2.3.0, you can also receive `guiApi` as the second argument.**

Example:

```js
module.exports = ctx => {
  const register = () => {
    ctx.on('remove', (files, guiApi) => {
      console.log(files, guiApi)
    })
  }
  return {
    register
  }
}
```

## Other notes

### Uploader display name

If you write an Uploader plugin, PicGo will automatically show it in the image host list. You can customize the display name via the `name` option. If you omit `name`, PicGo will display the uploader’s registered `id`.

![](https://pic.molunerfinn.com/picgo/docs/5c39e91a73099.png)

```js
const handle = ctx => {
  // ...
}
module.exports = ctx => {
  const register = () => {
    ctx.helper.uploader.register('test', { 
      handle,
      name: 'Weibo Image Host Plus'
    })
  }
  return {
    register,
    uploader: 'test'  // uploader id
  }
}
```
If your `Uploader` provides a `config` schema, PicGo will also display it in the UI.