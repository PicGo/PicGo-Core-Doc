---
sidebar: auto
---

# API Reference

PicGo is a workflow-based application. Besides uploading (the core feature), PicGo also supports configuration management, logging, plugins, CLI interactions, and more.

## ctx

The `ctx` passed into plugins is essentially the PicGo instance itself. `ctx` contains all objects and methods exposed by PicGo, so anything PicGo can do, your plugin can do via `ctx` as well.

First, let's initialize a PicGo instance.

```js
// Common JS
const { PicGo } = require('picgo')
// ES Module
import { PicGo } from 'picgo'

const picgo = new PicGo()
```

Next, we'll go through the PicGo APIs.

## upload([input])

PicGo's upload function.

- input: Array\<any\> || `undefined`
- return: Promise<[IImgInfo[]](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178) | Error> <Badge text="1.4.21+" />

`upload` supports two cases:

- An empty array or `undefined`

When it is an empty array or `undefined`, PicGo uploads the first image in the clipboard (due to cross-platform limitations, only **`png`** is supported). If there is no image in the clipboard, it throws an error.

::: tip Tip
On Linux, you need to install `xclip`.
:::

Example:

```js
picgo.upload()

// or

picgo.upload([])
```

- A non-empty array

When it is a non-empty array, it works with PicGo's two built-in transformers and supports an array of paths or an array of base64 image strings. See the [Transformer](/dev-guide/cli#transformer) section.

Example:

```js
picgo.upload(['/xxx/xxx.jpg', '/yyy/yyy.png'])
```

From `v1.4.21+`, you can get the upload result from the return value:

```js
const main = async () => {
  const res = await picgo.upload(['/xxx/xxx.jpg', '/yyy/yyy.png'])
  console.log(res) // [https://xxx.com/xxxxx.jpg, https://xxx.com/yyyyy.jpg]
}
```

## getConfig([name])

Get PicGo configuration.

- name: string

The default config looks like this:

```json
{
  "picBed": {
    "current": "smms"
  }
}
```

You can call `getConfig()` to get the full config:

```js
picgo.getConfig()
```

Output:

```json
{
  "picBed": {
    "current": "smms"
  },
  "plugins": {...}
}
```

Or you can read a specific config value:

```js
picgo.getConfig('picBed.current') // supports nested lookup
```

Output: `smms`.

## setConfig(config)

Set PicGo config in memory without writing to the config file (context-only).

- config: object

Pass a valid object to update PicGo config. **This method does not write to the config file**. It will not change the config file after the workflow finishes, but it allows subsequent modules in the current workflow to read the updated values.

::: warning Note
For GUI plugins, even though `setConfig` does not write to the config file, it stays in the config context. If your plugin needs to reset it, call `unsetConfig` (see below) at an appropriate time.
:::

Example:

```js
picgo.setConfig({
  'picBed.current': 'gitlab'
})
```

## saveConfig(config)

Set PicGo config and write it to the config file (persistent).

- config: object

Pass a valid object to update PicGo config. **This method writes to the config file** and affects what PicGo reads in subsequent runs.

Example:

```js
picgo.saveConfig({
  'picgo-plugin-test': {
    xxx: 'xxx',
    yyy: 'yyy'
  }
})
```

## unsetConfig(key, propName) <Badge text="1.4.0+" />

Remove a config entry from PicGo in memory without writing to the config file (context-only).

- key: string
- propName: string

Pass the field you want to remove. **This method does not write to the config file** and will not change the config file after the workflow finishes.

Example:

Original config:

```json
{
  "picgoPlugin": {
    "picgo-plugin-xxx": { ... }
  }
}
```

```js
picgo.unsetConfig('picgoPlugin', 'picgo-plugin-xxx')
```

Config after `unsetConfig`:

```json
{
  "picgoPlugin": {}
}
```

## removeConfig(key, propName) <Badge text="1.4.0+" />

Remove a config entry and write the change to the config file (persistent).

- key: string
- propName: string

Pass the field you want to remove. **This method writes to the config file** and affects what PicGo reads in subsequent runs.

Example:

Original config file:

```json
{
  "picgoPlugin": {
    "picgo-plugin-xxx": { ... }
  }
}
```

```js
picgo.removeConfig('picgoPlugin', 'picgo-plugin-xxx')
```

Config file after `removeConfig`:

```json
{
  "picgoPlugin": {}
}
```

## emit(event, [message])

Dispatch an event. Inherited from `EventEmitter`.

- event: string
- message: any

Use `emit` to dispatch events, and use `on` to listen.

::: tip Tip
A special event name is `notification`. PicGo and some plugins use it. See [Notifications](/dev-guide/cli#notifications).
:::

Example:

```js
picgo.emit('xxx', { message: 'xxx' })
```

## on(event, [callback])

Listen to an event. Inherited from `EventEmitter`.

- event: string
- callback: function

Use `on` to listen to events dispatched via `emit`. For built-in events, see [Event listeners](/guide/use-in-node#event-listeners).

```js
picgo.on('xxx', message => {
  console.log(message) // { message: 'xxx' }
})
```

## input

- type: Array\<any\>

PicGo input. This is an array.

```js
console.log(picgo.input)
```

## output

- type: Array\<any\>

PicGo output. This is an array. Typically, after an upload succeeds, you add `imgUrl` and `url` to each item in this array. See the built-in [smms](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/smms.ts#L25-L37) Uploader.

::: warning Note
After input goes through the Transformer, it enters the `output` array. It does not wait until the Uploader step to become `output`.
:::

```js
console.log(picgo.output)
```

## configPath

- type: string

Path to the PicGo config file.

```js
console.log(picgo.configPath)
```

## baseDir

- type: string

Directory that contains the PicGo config file.

```js
console.log(picgo.baseDir)
```

## VERSION

- type: string

Get the current PicGo version.

```js
console.log(picgo.VERSION) // x.x.x
```

## GUI_VERSION

- type: string || undefined

If running inside PicGo GUI, this returns the PicGo GUI version. Otherwise it is `undefined`.

```js
console.log(picgo.GUI_VERSION) // x.x.x
```

## helper

`helper` is PicGo's plugin container manager. It contains 5 module containers with the same API, but they run at different lifecycle stages (see [Plugin Development](/dev-guide/cli)). So we only detail `helper.transformer` below.

### helper.transformer

#### register(id, plugin)

- id: string
- plugin: object

If you just want to develop a simple plugin (instead of publishing it as an npm package—see [Plugin Development](/dev-guide/cli)), you only need to call `helper[module].register`.

The first argument is the plugin id (within the same module container, ids must be unique; different module containers can reuse the same id). The second argument should be an object that includes at least a `handle` method for PicGo to call.

If you also want [Handling Config](/dev-guide/cli#handling-config), you can add a `config` method for PicGo to call.

Example:

```js
picgo.helper.transformer.register('test', {
  handle (ctx) {
    return ctx
  },
  config (ctx) {
    return [...]
  }
})
```

### helper.uploader

Same as above.

### helper.beforeTransformPlugins

Same as above, but does not support `config`.

### helper.beforeUploadPlugins

Same as above, but does not support `config`.

### helper.afterUploadPlugins

Same as above, but does not support `config`.

## uploaderConfig <Badge text="1.8.0+" />

Uploader multi-config manager.

It manages per-uploader named configs stored under `uploader.<type>` and keeps `picBed.<type>` synced as a mirror of the active config.

Config names are matched case-insensitively (whitespace is trimmed).

### uploaderConfig.listUploaderTypes()

List installed/available uploader types.

### uploaderConfig.getConfigList(type)

Get all configs for an uploader type.

### uploaderConfig.getActiveConfig(type)

Get the active config for an uploader type (may be `undefined` if no configs exist).

### uploaderConfig.use(type, configName?)

Activate a config (by name) for an uploader type, and set it as the current uploader (`picBed.current` / `picBed.uploader`).

### uploaderConfig.createOrUpdate(type, configName?, configPatch?)

Create a config or update an existing config (by name), and **activate it on save**.

### uploaderConfig.copy(type, configName, newConfigName)

Copy a config into a new config name (**does not** switch current uploader).

### uploaderConfig.rename(type, oldName, newName)

Rename a config.

### uploaderConfig.remove(type, configName)

Remove a config. If you remove the last config, PicGo clears `picBed.<type>` to avoid credential residue.

Example:

```js
// Switch to a named uploader config
picgo.uploaderConfig.use('github', 'Work')

// Create/update a config and activate it
picgo.uploaderConfig.createOrUpdate('github', 'Work', { repo: 'user/repo' })
```

## Request.request <Badge type="warning" text="deprecate" />

**Since v1.5.0 this property is deprecated. Use [`ctx.request`](#request) instead.**

The following is the pre-1.5.0 documentation, which is deprecated and no longer maintained:

`Request.request` is a [Request-Promise-Native](https://github.com/request/request-promise-native) instance exposed by PicGo internally. It supports the same API as [request](https://github.com/request/request) and returns native Promises.

::: tip Tip
When you use this object to send requests, it automatically reads the user's `proxy` value from PicGo config. This is useful for the core logic of an Uploader.
:::


Example:

```js
picgo.Request.request({
  method: 'post',
  uri: 'xxxx',
  body: fs.readFileSync('yyy')
})
```

## request <Badge text="1.4.16+" /> <Badge text="1.5.0+" />

::: tip Tip
When you use this object to send requests, it automatically reads the user's `proxy` value from PicGo config. This is useful for the core logic of an Uploader.
:::

Starting from `v1.4.16`, the default request API changed from `ctx.Request.request` to `ctx.request`.

- Before `v1.5.0`, the underlying implementation is [Request-Promise-Native](https://github.com/request/request-promise-native)
- Since `v1.5.0`, the underlying implementation is [axios](https://github.com/axios/axios)

We will not cover the legacy implementation here; instead we focus on the new one.

In general, request options follow the [axios request config docs](https://github.com/axios/axios#request-config). However, for compatibility with the old `request` API, PicGo behaves slightly differently:

1. If the request config does not include `resolveWithFullResponse: true`, the returned value is `response.data` instead of the full `response` (which includes `status`, etc).
2. If you want the return value to be a `Buffer`, set `responseType` to `arraybuffer`.

PicGo provides some helpful types:

1. `IReqOptions`: request config type with `resolveWithFullResponse: true`.
2. `IReqOptionsWithArrayBufferRes`: request config type with `resolveWithFullResponse: true` and `responseType: 'arraybuffer'`.
3. `IReqOptionsWithBodyResOnly`: the raw axios request config type; return value is only `response.data`.

::: tip Note
`request` still returns a Promise, so `async/await` is recommended.
:::

Example:

```ts
import { IReqOptions } from 'picgo'

const opt: IReqOptions = {
  method: 'post',
  url: 'xxxx',
  data: {},
  resolveWithFullResponse: true // <-- set to true to return status, etc
}

interface IRes {
  // ...
}

const res = await ctx.request(opt) // { status: number, data: IRes }

// ------------------------------

import { IReqOptionsWithArrayBufferRes } from 'picgo'

const opt: IReqOptionsWithArrayBufferRes = {
  method: 'post',
  url: 'xxxx',
  data: {},
  resolveWithFullResponse: true, // <-- set to true to return status, etc
  responseType: 'arraybuffer' // <-- set to arraybuffer so data is a Buffer
}

const res = await ctx.request(opt) // { status: number, data: Buffer }

// ------------------------------

import { IReqOptionsWithBodyResOnly } from 'picgo'

const opt: IReqOptionsWithBodyResOnly = {
  method: 'post',
  url: 'xxxx',
  data: {},
}

interface IRes {
  // ...
}

const res: IRes = await ctx.request(opt) // IRes
```

## cmd

Provides PicGo's CLI utilities.

### cmd.program

Used to register CLI commands. This is a [commander.js](https://github.com/tj/commander.js/) instance and its usage is almost the same as commander.

**Do not call `picgo.cmd.program.parse(process.argv)` manually, otherwise it will error.**

See [Registering CLI Commands](/dev-guide/cli#registering-cli-commands).

Example:

```js
picgo.cmd.program
  .commands('test', 'This is a test commands')
  .action(() => {
    console.log(123)
  })
```

### cmd.inquirer

Used to provide interactive CLI prompts. This is an [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) instance and its usage is the same as inquirer.

See [Handling Config](/dev-guide/cli#handling-config). PicGo typically uses this together with a plugin's `config` method.

Example:

```js
const handleConfig = async ctx => {
  const prompts = config(ctx)
  const answer = await ctx.cmd.inquirer.prompt(prompts)
  ctx.saveConfig({ // call saveConfig to persist config
    'picBed.xxx': answer
  })
}
```

::: tip Tip
You can build your own CLI interactions with this tool. However, in most cases you should implement interactivity via the plugin `config` method, and PicGo will automatically persist the `config` results for you.
:::

## log

Used to print user-friendly messages in the CLI.

Screenshot:

![](https://pic.molunerfinn.com/picgo/docs/logs.png)

### log.info(message)

- message: string

Example:

```js
picgo.log.info('Hello world')
```

### log.warn(message)

- message: string

Example:

```js
picgo.log.warn('Hello world')
```

### log.success(message)

- message: string

Example:

```js
picgo.log.success('Hello world')
```

### log.error(message)

- message: string | error

Example:

```js
picgo.log.error('Hello world')
```

## PluginHandler <Badge text="1.4.0+" />

Provides low-level APIs to install, update, and uninstall PicGo plugins. It also emits success/failure events for handling results.

**It depends on the system `npm` command.**

### pluginHandler.install([...pluginName])

- return: Promise<[IPluginHandlerResult](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L339)> <Badge text="1.4.19+" />

Installs plugins. Accepts an array argument. `pluginName` can be:

1. A full PicGo plugin name, e.g. `picgo-plugin-xxx`.
2. A shorthand name, e.g. `xxx`.
3. A scoped plugin, e.g. `@xxx/picgo-plugin-yyy`.
4. A local path, e.g. `./xxx/yyy/picgo-plugin-zzz`.

```js
const res = picgo.pluginHandler.install(['xxx'])
picgo.on('installSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('installFailed', err => {})

// Since v1.4.19 it returns the result directly. Example:
res.then((result) => {
  if (result.success) {
    console.log(result.body) // ['picgo-plugin-xxx']
  } else {
    console.log(result.body) // error message
  }
})
```


### pluginHandler.uninstall([...pluginName])

- return: Promise<[IPluginHandlerResult](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L339)> <Badge text="1.4.19+" />

Uninstalls plugins. Accepts an array argument. `pluginName` can be:

1. A full PicGo plugin name, e.g. `picgo-plugin-xxx`.
2. A shorthand name, e.g. `xxx`.
3. A scoped plugin, e.g. `@xxx/picgo-plugin-yyy`.
4. A local path, e.g. `./xxx/yyy/picgo-plugin-zzz`.

```js
const res = picgo.pluginHandler.uninstall(['xxx'])
picgo.on('uninstallSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('uninstallFailed', err => {})

// Since v1.4.19 it returns the result directly. Example:
res.then((result) => {
  if (result.success) {
    console.log(result.body) // ['picgo-plugin-xxx']
  } else {
    console.log(result.body) // error message
  }
})
```

### pluginHandler.update([...pluginName])

- return: Promise<[IPluginHandlerResult](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L339)> <Badge text="1.4.19+" />

Updates plugins. Accepts an array argument. `pluginName` can be:

1. A full PicGo plugin name, e.g. `picgo-plugin-xxx`.
2. A shorthand name, e.g. `xxx`.
3. A scoped plugin, e.g. `@xxx/picgo-plugin-yyy`.
4. A local path, e.g. `./xxx/yyy/picgo-plugin-zzz`.

```js
const res = picgo.pluginHandler.update(['xxx'])
picgo.on('updateSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('updateFailed', err => {})

// Since v1.4.19 it returns the result directly. Example:
res.then((result) => {
  if (result.success) {
    console.log(result.body) // ['picgo-plugin-xxx']
  } else {
    console.log(result.body) // error message
  }
})
```

## PluginLoader <Badge text="1.4.17+" />

Provides methods to dynamically load/unload PicGo plugins. This is useful when using PicGo inside a Node.js project and you want to load plugins on demand.

### pluginLoader.registerPlugin(pluginName, plugin)

- pluginName: string
- plugin: [IPicGoPlugin](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L352)

Registers and loads a plugin.

Example:

```js
const pluginXXX = require('picgo-plugin-xxx')

// pluginName must be unique
picgo.pluginLoader.registerPlugin('xxx', pluginXXX)
```

### pluginLoader.unregisterPlugin(pluginName)

Unloads a plugin.

Example:

```js
// pluginName must be unique
picgo.pluginLoader.unregisterPlugin('xxx')
```

### pluginLoader.getPlugin(pluginName)

- return: plugin -> [IPicGoPlugin](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L352)

Gets a plugin.

Example:

```js
const plugin = picgo.pluginLoader.getPlugin('xxx')
```

### pluginLoader.hasPlugin(pluginName)

Checks whether a plugin exists.

- return: boolean

Example:

```js
const res = picgo.pluginLoader.hasPlugin('xxx') // true or false
```

## use <Badge text="1.5.0+" />

A simpler plugin loading approach than [PluginLoader](#pluginloader). Suitable for dynamically loading plugins when using PicGo in a Node.js project.

- (plugin: IPicGoPlugin, name?: string): IPicGoPluginInterface

1. The first argument is the exported PicGo plugin object, typically provided as an npm package.
2. If the second argument `name` is omitted, PicGo will only instantiate the plugin but will not register it into PicGo's plugin list. This is useful when you need to dynamically load a plugin. Example:

```js
const { PicGo } = require('picgo')
const PluginMigrater = require('picgo-plugin-pic-migrater')
const MinioUploader = require('picgo-plugin-minio')

const picgo = new PicGo()

const plugin = picgo.use(PluginMigrater) // will not register this plugin, just use it
picgo.use(MinioUploader, 'minio') // will register this plugin

picgo.setConfig({
  'picgo-plugin-pic-migrater': {
    newFileSuffix: '_new',
    include: '',
    exclude: ''
  },
  picBed: {
    current: 'minio', // use minio config
    uploader: 'minio',
    minio: {
      endpoint: 'http://localhost:9000',
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
      bucket: 'picgo',
      path: '/',
      useSSL: false
    }
  }
})

// will use minio for migrating
plugin.migrateFiles(['/xxx/yyy.md']) // { total: number, success: number }
```

## i18n <Badge text="1.5.0+" />

Provides internationalization support. Currently supported languages:

- `zh-CN` (default)
- `zh-TW`
- `en`

If you want to contribute a default language pack to PicGo, refer to this [PR](https://github.com/PicGo/PicGo-Core/pull/135).

### i18n.addLocale(language: string, locales: ILocale)

Adds locale entries to an existing language.

- language: string
- locales: `[key: string]: any`
- return: boolean, whether the locale was added successfully

```js
picgo.i18n.addLocale('zh-CN', {
  'PICGO_CURRENT_PICBED': 'Current image host'
})

const text = picgo.i18n.translate('PICGO_CURRENT_PICBED') // Current image host
```

### i18n.translate(key: T, args?: {}) => string

Translates text.

- key: string | T (T is an enum type that contains all text keys)
- args: object (optional). If the text has params, pass them here.
- return: string

```js
picgo.i18n.addLocale('zh-CN', {
  'PICGO_CURRENT_PICBED': 'Current image host is ${current}'
})

const text = picgo.i18n.translate('PICGO_CURRENT_PICBED', {
  current: 'sm.ms'
}) // Current image host is sm.ms
```

### i18n.setLanguage(language: string)

Sets the current language.

```js
picgo.i18n.setLanguage('zh-TW')
```

### i18n.addLanguage(language: string, locales: ILocale)

- language: string
- locales: `[key: string]: any`

Adds a new language. If you add a new language, it is recommended to implement [all default keys](https://github.com/PicGo/PicGo-Core/blob/dev/src/i18n/zh-CN.ts), otherwise you may run into unexpected issues.

```js
picgo.i18n.addLanguage('jp', {
  // ...
})
```

### i18n.getLanguageList()

- return: string[]

Returns the list of supported languages.

```js
const list = picgo.i18n.getLanguageList() // ['zh-CN', 'zh-TW', 'en']
```


## guiApi <Badge text="GUI VERSION 2.0.0+" />

**`guiApi` is only available in the Electron version of PicGo. For details, see [GUI Development](/dev-guide/gui).**

### guiApi.showInputBox([option])

Opens an input dialog so you can get user input.

- option: Object || `undefined`
- return: Promise that resolves to the user's input.

`option` is optional. You can pass `{ title, placeholder }` for the dialog title and input placeholder.

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Open InputBox',
      async handle (ctx, guiApi) {
        const value = await guiApi.showInputBox({
          title: 'Open dialog',
          placeholder: 'Please enter a file path'
        })
        console.log(value)
      }
    }
  ]
}
```

### guiApi.showFileExplorer([option])

Opens a file explorer so you can get file/folder paths selected by the user.

- option: Object || `undefined`
- return: Promise that resolves to an array of selected paths.

`option` is optional. You can pass a valid Electron dialog [options object](https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback) to control multi-select, file vs folder selection, etc.

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Open file explorer',
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

### guiApi.upload([file])

Uses PicGo core to upload. It can automatically update the gallery and write the URL to the clipboard after upload succeeds.

- file: Array || `undefined`
- return: Promise that resolves to PicGo's output array after a successful upload. `async/await` is recommended.

::: tip Tip
In practice, you can combine `showInputBox`/`showFileExplorer` with `upload` to implement a simple upload flow.

However, for more robust integrations, it is still recommended to implement an Uploader or Transformer plugin to take control of PicGo's upload workflow.
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

### guiApi.showNotification(option) <Badge text="2.0.1+" />

Shows a system notification.

- option: Object || `undefined`
- return: undefined

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
          body: 'This notification is from a plugin'
        })
      }
    }
  ]
}
```

### guiApi.showMessageBox([option]) <Badge text="2.1.0+" />

Shows a system message box dialog.

- option: Object || `{title: '', message: '', type: 'info', buttons: ['Yes', 'No']}`
- return: Object -> `{result, checkboxChecked}`

![](https://pic.molunerfinn.com/picgo/docs/20190611110904.png)

For the full `option` parameters, refer to Electron's [dialog.showMessageBox](https://electronjs.org/docs/api/dialog#dialogshowmessageboxbrowserwindow-options-callback).

In the returned value, `result` is the index of the button you clicked. For example, if you clicked "Yes", you would get something like:

```js
{
  result: 0,
  checkboxChecked: false // if you set checkboxLabel in options, a checkbox will appear
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
          title: 'This is title',
          message: 'This is message',
          type: 'info',
          buttons: ['Yes', 'No']
        })
        console.log(result) // { result: 0, checkboxChecked: false }
      }
    }
  ]
}
```

### guiApi.galleryDB <Badge text="GUI VERSION 2.3.0+" />

Starting from PicGo GUI 2.3.0, gallery data is managed via `galleryDB` instead of the `uploaded` field in config.

For `galleryDB`, refer to the API provided by [PicGo/store](https://github.com/PicGo/store#get-getfilter-ifilter) as the source of truth. The docs below may not always be up to date.

#### galleryDB.get(filter?)

- filter: undefined || Object -> [IFilter](https://github.com/PicGo/store/blob/dev/src/types/index.ts)
- return: Promise<[IImgInfo[]](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)>

Gets the gallery list. You can provide `filter` to filter results; if omitted, it returns all items.

Example:

```js
const guiMenu = ctx => {
  return [
    {
      label: 'Get gallery data',
      async handle (ctx, guiApi) {
        const result = await guiApi.galleryDB.get({
          orderBy: 'asc', // ascending
          limit: 10, // take 10 items
          offset: 5 // start after index 5 (slice(5))
        })
        console.log(result) // [{...}, {...}, {...}, ...]
      }
    }
  ]
}
```

#### galleryDB.insert(value)

- value: Object -> [IImgInfo](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)
- return: Promise<[IResult](https://github.com/PicGo/store/blob/dev/src/types/index.ts)>

Inserts an item into the gallery.

Note that the inserted data must match the required output format (see [Transformer](/dev-guide/cli#transformer)), otherwise it cannot be displayed in the gallery.

#### galleryDB.insertMany([...value])

- input: Array -> [IImgInfo[]](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)
- return: Promise<[IResult[]](https://github.com/PicGo/store/blob/dev/src/types/index.ts)>

Batch inserts items into the gallery.

Note that the inserted data must match the required output array format (see [Transformer](/dev-guide/cli#transformer)), otherwise it cannot be displayed in the gallery.

#### galleryDB.updateById(id, value)

- id: string (the id of an image in the gallery)
- value: [IImgInfo](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)
- return: Promise\<boolean\>

Updates an item by id. Returns a boolean: `true` if updated successfully, otherwise `false`.

#### galleryDB.getById(id)

- id: string (the id of an image in the gallery)
- return: Promise<[IImgInfo](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)>

Gets an item by id.

#### galleryDB.removeById(id)

- id: string (the id of an image in the gallery)
- return: void

Removes an item by id. No return value.

**Note: deleting images is a sensitive operation. The GUI version will prompt the user for confirmation.**

#### galleryDB.overwrite(value)

- value: [IImgInfo[]](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)
- return: Promise<[IResult[]](https://github.com/PicGo/store/blob/dev/src/types/index.ts)>

Overwrites gallery data. **This clears existing data before overwriting.**

**Note: overwriting the image list is a sensitive operation. The GUI version will prompt the user for confirmation.**
