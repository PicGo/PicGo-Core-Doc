
# Using PicGo in Node.js

Using PicGo in an existing Node.js project is straightforward. Point PicGo to a config file (or let it use the default one), and call `upload` once your configuration is valid.

::: warning Note
To support the local plugin system, PicGo only works in a Node.js environment (including the Electron main process). It does not support browser environments.
:::

## Initialization

If you need to initialize PicGo with a custom config file, see [Configuration](/guide/config). Note that initialization differs across versions.

### Use the default config file

#### Since v1.5.0+
```js
// since v1.5.0

// CommonJS
const { PicGo } = require('picgo')
// or ES modules
import { PicGo } from 'picgo'

const picgo = new PicGo() // <- Uses the default config file
```

#### Before v1.5.0

```js
// before v1.5.0

const PicGo = require('picgo')
const picgo = new PicGo() // <- Uses the default config file
```

### Use a custom config file

#### Since v1.5.0+
```js
// since v1.5.0

// CommonJS
const { PicGo } = require('picgo')
// or es6
import { PicGo } from 'picgo'

const picgo = new PicGo('/xxx/xxx.json') // <- Pass the config file path when constructing
```


#### Before v1.5.0

```js
// before v1.5.0

const PicGo = require('picgo')
const picgo = new PicGo('/xxx/xxx.json') // <- Pass the config file path when constructing
```


## Upload

```js
const main = async () => {
  const res = await picgo.upload(['/xxx/xxx.jpg']) // <- Always pass an array, even if you only upload one image

  // Since 1.4.21 you can get the upload output
  console.log(res) // ['https:/xxx.com/xxx.jpg']
}

```

## Event listeners

During the upload lifecycle, PicGo emits several events and passes useful parameters to event handlers.

If you need a refresher on the lifecycle diagram, see [Overview](/guide/).

### uploadProgress

- Parameter: `Number`
- Description: upload progress. You can use it to drive a progress bar. Possible values are `0`, `30`, `60`, `100`, and `-1`. `-1` means upload failed; `100` means upload succeeded.

```js
picgo.on('uploadProgress', progress => {
  console.log(progress)
})
```

### beforeTransform

- Parameter: `ctx`
- Description: fired before the input enters the transformer. You can read the input via `ctx.input`.

```js
picgo.on('beforeTransform', ctx => {
  console.log(ctx.input) // ['/xxx/xxx.jpg']
})
```

### beforeUpload

- Parameter: `ctx`
- Description: fired before the output enters the uploader. You can read the **output** after the transformer via `ctx.output`.

```js
picgo.on('beforeUpload', ctx => {
  console.log(ctx.output) // [{ base64Image, fileName, width, height, extname }]
})
```

### afterUpload

- Parameter: `ctx`
- Description: fired after the uploader successfully uploads. You can read the **output** after the uploader via `ctx.output`.

```js
picgo.on('afterUpload', ctx => {
  console.log(ctx.output) // [{fileName, width, height, extname, imgUrl}] <- Note that imgUrl is now included.
})
```

### finished

- Parameter: `ctx`
- Description: fired after the uploader succeeds **and** after `afterUploadPlugins` have run. Use it to get the final **output**.

```js
picgo.on('finished', ctx => {
  console.log(ctx.output) // [{fileName, width, height, extname, imgUrl}] <- Note that imgUrl is now included.
})
```

### failed

- Parameter: `error`
- Description: fired when an upload fails or an error is thrown during the lifecycle. You can catch the error here. (Before v1.2.10 you couldn’t get the error details, but you could still listen to this event.)

```js
picgo.on('failed', error => {
  console.log(error) // error message
})
```

### notification

- Parameter: `notice`
- Description: upload failure notifications emitted by an uploader. Listen to this to show user-facing messages.

```js
picgo.on('notification', notice => {
  console.log(notice) // { title, body, text? }
})
```

`title` and `body` are **always present**. `text` is optional extra information (for example, a URL where the user can look up an error code) and can be `undefined`.

## Lifecycle plugins

In addition to listening to lifecycle events, you can plug into those lifecycle stages to implement more advanced behaviors—for example, renaming files or compressing images in `beforeUpload`, or adding watermarks in `beforeTransform`.

PicGo exposes a `helper` object that contains plugin containers for the lifecycle stages. Register a plugin via `register()`. You register an object that must include a `handle` method, and PicGo will pass `ctx` into `handle`.

::: warning Note
Register your plugins **before** calling `upload()`, otherwise they won’t take effect.
:::

### helper.beforeTransformPlugins

> Called after the `beforeTransform` event is emitted.

```js
picgo.helper.beforeTransformPlugins.register('name', {
  handle: function (ctx) {
    console.log(ctx.input)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

### helper.beforeUploadPlugins

> Called after the `beforeUpload` event is emitted.

```js
picgo.helper.beforeUploadPlugins.register('name', {
  handle: function (ctx) {
    console.log(ctx.output)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

### helper.afterUploadPlugins

> Called after `afterUpload` is emitted and before `finished`.

```js
picgo.helper.afterUploadPlugins.register('name', {
  handle: function (ctx) {
    console.log(ctx.output)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

If you want to build more advanced features (plugin-specific configuration, naming your plugin, publishing it for others), see [Plugin Development](/dev-guide/cli).

## Logging <Badge text="1.3.7+" />

PicGo’s [logger](https://github.com/PicGo/PicGo-Core/blob/dev/src/lib/Logger.ts#L38-L56) module supports persistent log writing. You can call `picgo.log.xxx` to write logs, where `xxx` can be `success`, `warn`, `info`, or `error`.

Logger calls create a `picgo.log` file next to your PicGo config file, and the same logs are also printed to the console.

Example:

```
2019-04-18 13:52:58 [PicGo INFO] Before transform
2019-04-18 13:52:58 [PicGo INFO] Transforming...
2019-04-18 13:52:58 [PicGo INFO] Before upload
2019-04-18 13:52:58 [PicGo INFO] Uploading...
2019-04-18 13:53:01 [PicGo SUCCESS] 
https://xxxx.png
```

## Loading third-party plugins <Badge text="1.4.19+" />

- Since 1.4.19, PicGo exposes `pluginHandler` and `pluginLoader` for working with third-party plugins.
- Since 1.5.0, PicGo also exposes `use()` to make manual plugin loading easier.

In short:

- `pluginHandler`: install/update/uninstall plugins via npm.
- `pluginLoader`: dynamically register/get/unregister plugins at runtime.

Both can be used to bring in plugins, but they differ:

1. `pluginHandler` uses npm to install/uninstall plugins. This is persistent—after restarting PicGo, installed plugins are auto-loaded.
2. `pluginLoader` is for dynamic runtime loading, useful when you need to load different plugins on the fly.


### use <Badge text="1.5.0+" />

- (plugin: IPicGoPlugin, name?: string): IPicGoPluginInterface

Manually load a third-party plugin. If the second parameter `name` is omitted, PicGo will instantiate the plugin without registering it into PicGo’s plugin list—this is handy for dynamic loading. Example:

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
    current: 'minio',
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


### pluginHandler

- install([...pluginName]): Promise<[IPluginHandlerResult](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L339)>
- update([...pluginName]): Promise<[IPluginHandlerResult](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L339)>
- uninstall([...pluginName]): Promise<[IPluginHandlerResult](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L339)>

PicGo exposes three methods corresponding to `npm install`, `npm update`, and `npm uninstall`.


All three methods accept an array. `pluginName` can be:

1. The full package name, e.g. `picgo-plugin-xxx`.
2. The short name, e.g. `xxx`.
3. A scoped package, e.g. `@xxx/picgo-plugin-yyy`.
4. A local path, e.g. `./xxx/yyy/picgo-plugin-zzz`.

The result indicates whether the operation succeeded. Example:

```js
const main = async () => {
  const res = await picgo.pluginHandler.install(['xxx'])
  if (res.success) {
    console.log(res.body) // ['picgo-plugin-xxx']
  } else {
    console.log(res.body) // error message
  }
}
```

See [api-pluginHandler](/api/#pluginhandler) for details.

### pluginLoader

- registerPlugin(pluginName, plugin): register a plugin dynamically
- unregisterPlugin(pluginName): unregister a plugin dynamically
- getPlugin(pluginName): get a plugin
- hasPlugin(pluginName): check whether a plugin exists

Example:

```js
const pluginXXX = require('picgo-plugin-xxx')
console.log(picgo.pluginLoader.hasPlugin('xxx')) // false

// Note: pluginName must be unique
picgo.pluginLoader.registerPlugin('xxx', pluginXXX)

console.log(picgo.pluginLoader.hasPlugin('xxx')) // true
```

See [api-pluginLoader](/api/#pluginloader) for details.

## Notes for bundling with Webpack

If you want to integrate PicGo into a Node.js project bundled by `webpack` (for example, an Electron project), you may see errors like `Can't find module "."` during bundling. This happens because webpack can’t reliably handle PicGo’s dynamic `require()` for plugins.

For PicGo, dynamically loaded plugins do **not** need to be bundled, because PicGo loads them at runtime rather than at build time. You can work around this by bypassing webpack’s `require`:

```js
const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require
const PicGo = requireFunc('picgo')
const picgo = new PicGo()
```

For more background, see this [issue](https://github.com/webpack/webpack/issues/4175)。
