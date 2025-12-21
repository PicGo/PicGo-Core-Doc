
# Plugin Development

## Introduction

PicGo is an upload workflow engine. A “plugin” is simply an implementation targeting one (or more) parts of that workflow.

Lifecycle diagram:

![flow](https://pic.molunerfinn.com/picgo/docs/core-lifecycle.png)

There are 5 extension points in total:

Two modules:

1. Transformer
2. Uploader

::: tip Tip
Each of these two components is called only once per upload lifecycle. For example, PicGo ships with multiple uploaders, but during one upload it will call **only one** selected uploader.
:::

Three lifecycle plugin entry points:

1. beforeTransformPlugins
2. beforeUploadPlugins
3. afterUploadPlugins

::: tip Tip
These lifecycle plugin hooks are invoked whenever they exist. For example, if you install two plugins and both implement `beforeTransformPlugins`, then **both** `beforeTransformPlugins` will be executed.
:::

If you just want to add an image host that PicGo doesn’t support out of the box, you usually only need to implement an `Uploader`.

If you want to upload by providing an image URL (and then upload that image to an existing image host), consider implementing a `Transformer` or a `beforeTransformPlugins` hook.

Along the way, you can also use other PicGo [APIs](/api/).

## Overview

All 5 extension points are instances of [LifecyclePlugins](https://github.com/PicGo/PicGo-Core/blob/dev/src/lib/LifecyclePlugins.ts), so they all provide a `register()` method.

::: warning Note
The first argument of `register()` is an `id` (unique within that extension point). The second argument is the plugin implementation.
:::

Regardless of which part you implement, you should expose a `handle` method that PicGo can call. PicGo passes `ctx` into each `handle`, so you can access input/output/config and more.

The **plugin package** itself should expose a `register` method so it can be loaded by `pluginLoader`. Plugins should be published as npm packages so PicGo can install and use them.

Your plugin package can have a minimal structure:

```bash
.
├── README.md
├── index.js      # plugin
└── package.json
```

Just provide an `index.js` and set `main` to `index.js` in `package.json`.

Example:

```js
const handle = ctx => {
  return ctx.output
}

module.exports = ctx => {
  const register = () => { // plugin register
    ctx.helper.transformer.register('test', { handle }) // replace transformer with uploader (etc.) depending on what you build
  }
  return {
    register,
    transformer: 'test'
  }
}
```

**You can also use PicGo’s official [plugin template](#using-the-plugin-template) (introduced later).**

### Transformer

The [Transformer](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/index.ts) converts the input (for example, file paths) into content that an Uploader can upload.

PicGo provides two built-in transformers: [path](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/path.ts) and [base64](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/base64.ts).

`path` accepts an array of paths (`[path1, path2, ...]`) and converts them into the output array.

`base64` accepts an output array in the format expected by uploaders.

The default uploader output format looks like this:

::: tip Tip
Provide either `buffer` or `base64Image`. If you pass a path array, PicGo **outputs buffers by default**.
:::

```js
[
  {
    buffer: 'xxx', // image buffer (choose buffer or base64Image)
    base64Image: 'xxxx', // image base64 (choose buffer or base64Image)
    fileName: 'xxxx', // filename
    width: 'xxxx', // width
    height: 'xxxx', // height
    extname: '.xxx' // file extension, e.g. .jpg | .png
  },
  {
    ...
  },
  ...
]
```

So if you’re only building a Transformer, you just need to set `ctx.output` in the format above.

Example:

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
    transformer: 'test' // expose the transformer id here
  }
}
```

### Uploader

The [Uploader](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/index.ts) uploads `ctx.output` to a target destination and outputs a new `ctx.output` containing upload results (URLs, etc.).

An uploader implements your upload logic. You can read image metadata from `ctx.output` produced by the Transformer, then implement anything you like—for example uploading to your own FTP server.

::: warning Note
After a successful upload, you must add an `imgUrl` field to each item in `ctx.output`. PicGo (Electron) uses this URL to show the image in the gallery.

If you upload a non-image file, provide both `url` and `imgUrl`. In that case, `imgUrl` can be a thumbnail URL, while `url` determines what gets copied to the clipboard. If `url` is missing, PicGo falls back to `imgUrl`.

**Also, your uploader id must not conflict with existing uploaders.** See the list in [Configuration](/guide/config).
:::

It’s recommended to use [ctx.request](/api/#request) for HTTP requests—it will automatically read `proxy` from the PicGo config.

Example:

```js
const handle = ctx => {
  let output = ctx.output
  // do something for uploading
  for (let i in output) {
    output[i].imgUrl = 'https://xxxxx.jpg'
    output[i].url = 'https://xxxxxx.jpg'
  }
  return ctx
}

module.exports = ctx => {
  const register = () => {
    ctx.helper.uploader.register('test', { handle })
  }
  return {
    register,
    uploader: 'test'  // expose the uploader id here
  }
}
```

After the uploader runs, the output looks like this:

```js
[
  {
    fileName: 'xxxx', // filename
    width: 'xxxx', // width
    height: 'xxxx', // height
    extname: '.xxx' // extension, e.g. .jpg | .png
    url: 'https://xxxxxx.jpg', // file URL (for images, equals imgUrl)
    imgUrl: 'https://xxxxx.jpg', // image URL (for non-images, can be a thumbnail URL)
  },
  {
    ...
  },
  ...
]
```

### beforeTransformPlugins

Plugins in this stage run after input is set and before the Transformer runs. For example, if you want to fetch an image via URL and convert it into the output array, you can implement it here.

::: tip Tip
Lifecycle plugin registration works the same as the Transformer/Uploader examples above. Here we only show `beforeTransformPlugins`.
:::

Example:

```js
const handle = ctx => {
  // do something for uploading
  ctx.input = [...]
  return ctx
}

module.exports = ctx => {
  const register = () => {
    ctx.helper.beforeTransformPlugins.register('test', { handle })
  }
  return {
    register
  }
}
```

### beforeUploadPlugins

Plugins in this stage run after the Transformer output is generated and before the Uploader starts uploading. They are mainly used to process the Transformer's output.

### afterUploadPlugins

Plugins in this stage run after uploading finishes successfully. They are mainly used to process the Uploader's output.

## Advanced Tips

### Combining Modules

What you want to build may not be achievable with only a `Transformer`—you might also need an `Uploader`. Or you may want to take over the entire upload workflow and implement all five modules. That's totally fine: a single plugin can register multiple modules.

::: warning Note
Within one plugin, you can only have one module of the same type. For example, you cannot define two Uploaders in a single plugin.

If your plugin includes an `Uploader` or a `Transformer`, declare their registered `id` at the end, as shown below.
:::

Example:

```js
const uploader = {
  handle (ctx) {
    // do something
  }
}
const transformer = {
  handle (ctx) {
    // do something
  }
}

const beforeUploadPlugins = {
  handle (ctx) {
    // do something
  }
}

module.exports = ctx => {
  const register = () => {
    ctx.helper.uploader.register('test', uploader)
    ctx.helper.transformer.register('test', transformer)
    ctx.helper.beforeUploadPlugins.register('test', beforeUploadPlugins)
  }
  return {
    register,
    uploader: 'test', // declare the registered uploader id
    transformer: 'test' // declare the registered transformer id
  }
}
```

### Handling Config

::: tip Tip
Config currently supports three dimensions: `Uploader`, `Transformer`, and `Plugin`.
:::

As mentioned above, each module should expose a `handle` method, and each plugin should expose a `register` method for PicGo to call.

If your plugin needs configuration (Uploaders usually do), you can implement one more method: `config`.

After you implement `config`, users can set it via the CLI `set|config` command, for example:

![](https://pic.molunerfinn.com/picgo/docs/picgo-settings-cli.gif)

#### The `config` method

The `config` method should return a valid array of [questions](https://github.com/SBoudrias/Inquirer.js#question) for [inquirer](https://github.com/SBoudrias/Inquirer.js) to prompt. You can refer to PicGo's [weibo](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/weibo.ts) Uploader implementation.

Also note: `config` receives the `ctx` passed in by PicGo so you can reuse existing settings (for example, reading the user's previous configuration). A minimal example:

```js
const config = ctx => {
  const prompts = [...]
  return prompts
}
```

::: tip Tip
Separating `config` is for the PicGo (Electron) version to render configuration in a UI.
:::

Example:

```js
const handle = ctx => {
  return ctx
}

const transformerConfig = ctx => {
  return [...]
}

const pluginConfig = ctx => {
  return [...]
}


module.exports = ctx => {
  const register = () => {
    ctx.helper.transformer.register('test', {
      handle,
      config: transformerConfig
    })
  }

  return {
    register,
    config: pluginConfig,
    transformer: 'test'
  }
}

```

::: warning Note
By convention, an `Uploader`'s configuration is stored under `picBed` in PicGo's config. For example, if your Uploader name is `gitlab`, its config will be stored at `picBed.gitlab`.

If your `plugin` itself has configuration, it will be stored at the top level of the PicGo config, keyed by your plugin name.

`Transformer` configuration is stored under `transformer`.

For more details, see the [Config File](/guide/config) chapter.
:::

So if you implement a plugin with `Uploader` id `gitlab`, `Transformer` id `gitlab`, and the plugin name `picgo-plugin-gitlab`, the PicGo config should look like this after it is written:

```json
{
  "picBed": {
    "current": "gitlab",
    "gitlab": {
      // ... Uploader config
    },
    // ...
  },
  "picgoPlugins": {...}, // auto-generated by PicGo; no manual config needed
  "picgo-plugin-gitlab": {
    // ... plugin config
  },
  // ...
  "transformer": {
    "gitlab": {
      // ... Transformer config
    },
    // ...
  }
}
```

::: tip Tip
Only add `config` where you actually need it (Uploaders almost always do). Overusing it increases the number of steps for users.
:::

### Notifications

During uploading, failures can happen. If you're developing an Uploader, you should notify users about the error. You can refer to PicGo's [qiniu](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/qiniu.ts#L55-L58) Uploader implementation.

This is done via PicGo's `ctx.emit` method by emitting a `notification` event. Format:

```js
const handle = ctx => {
  try {
    // ... do something
  } catch (err) {
    ctx.emit('notification', {
      title: 'XXXX Error',
      body: 'XXXXXXXXXX',
      text: ''
    })
  }
}
```

A notification **must include `title` and `body`**.

If `text` is present, it will be copied to the user's clipboard. This can be handy—for example, if you want the user to open a URL to view more details, you can put that URL into `text` so the user can paste it directly.

### Registering CLI Commands

PicGo's built-in CLI commands are listed in [CLI Commands](/guide/commands). If your plugin also wants to add CLI commands, you can use the `ctx.cmd.program` instance provided by PicGo. This instance is a [commander](https://github.com/tj/commander.js/) instance.

::: warning Note
You must register commands via `ctx.cmd.register` (same pattern as `Uploader.register`, etc.). This ensures commands are only wired up at the right time; otherwise, it's easy to cause memory leaks.
:::

Example:

```js
module.exports = ctx => {
  const register = () => {
    // register via ctx.cmd.register
    ctx.cmd.register('test-cmd', {
      handle (ctx) {
       ctx.cmd.program
         .commands('test', 'This is a test command')
         .action(() => {
           console.log(123)
         })
      }
    })
  }
  return {
    register
  }
}
```

::: warning Note
Do not call `ctx.cmd.program.parse(process.argv)`! PicGo will call it for you; calling it yourself will cause errors.
:::

### Logging System <Badge text="1.3.7+"/>

If you want to log plugin behavior for debugging later, see [Logging](/guide/use-in-node#logging).


### i18n (Internationalization) <Badge text="1.5.0+"/>

Starting from `v1.5.0`, PicGo supports internationalization. If your plugin needs localized copy (for config prompts, UI strings, etc.), this section is for you.

PicGo provides three built-in languages by default:

- `zh-CN` (default)
- `zh-TW`
- `en`

If your plugin wants to provide copy for these languages, you can use the methods provided by `ctx.i18n` (see [i18n](/api/#i18n)):

- Add locale entries to an existing language: `addLocale`: (language: string, locales: ILocale) => boolean
- Translate text: `translate`: (key: T, args?: {}) => string

For a real-world example, see [picgo-plugin-pic-migrater](https://github.com/PicGo/picgo-plugin-pic-migrater/blob/dev/src/i18n/index.ts). A minimal example:

```js
const localesZH = {
  PIC_MIGRATER_CHOOSE_FILE: '[ZH] Choose File',
  PIC_MIGRATER_CHOOSE_FOLDER: '[ZH] Choose Folder',
}

const localesEN = {
  PIC_MIGRATER_CHOOSE_FILE: 'Choose File',
  PIC_MIGRATER_CHOOSE_FOLDER: 'Choose Folder',
}

module.exports = (ctx) => {
  const register = () => {
    // add locales to zh-CN and en
    ctx.i18n.addLocale('zh-CN', localesZH)
    ctx.i18n.addLocale('en', localesEN)
  }

  const config = (ctx) => {
    const text = ctx.i18n.translate('PIC_MIGRATER_CHOOSE_FILE')
    console.log(text)
  }

  return {
    register,
    config,
  }
}
```

If you want to add more languages or set the current language, refer to the [picgo-i18n](/api/#i18n) docs.

### Using the Plugin Template

To help developers bootstrap PicGo plugins quickly, the PicGo team provides a plugin template: [picgo-template-plugin](https://github.com/PicGo/picgo-template-plugin). Its usage is similar to `init` in [vue-cli](https://cli.vuejs.org/).

To use the official plugin template:

```bash
picgo init plugin <your-project-name>
```

If you've created a template once, you can use offline mode next time:

```bash
picgo init plugin <your-project-name> --offline
```

If you want to use your own template, use `user/repo` to download a specific GitHub repo as the template:

```bash
picgo init user/repo <your-project-name>
```

Then follow the prompts to create the project.

The official template provides both `TypeScript` and `JavaScript` options. `TypeScript` is recommended for better type hints and tooling.

### Developing a Plugin Template

If the official template doesn't fit your needs, you can develop your own. Notes:

1. Your repo must have an `index.js` for template configuration.
2. Your repo must have a `template` folder to store template files.
3. PicGo's template renderer is [ejs](https://ejs.co/), which is simple and efficient.

`index.js` can export:

1. `prompts`: provides CLI options when initializing a plugin. Must be a valid **array** of [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) questions. (Usually required.)
2. `filters`: filters files based on the user's answers. An **object**. (Optional.)
3. `complete`: runs after the template is rendered. A **function**. PicGo passes `{ answers, options, files, ctx }`. `answers` are results from `prompts`; `options` includes the plugin name, destination path, offline mode, etc (see: [options](https://github.com/PicGo/PicGo-Core/blob/dev/src/utils/interfaces.ts#L52-L61)); `files` is an array of generated file names; `ctx` is the PicGo context. (Optional.)
4. `completeMessage`: prints custom text after rendering. (Optional.)

You can refer to vue-cli2 template syntax and [picgo-template-plugin](https://github.com/PicGo/picgo-template-plugin) itself. If you have questions, feel free to open an issue in the official template repo: [issues](https://github.com/PicGo/picgo-template-plugin/issues).

### Developing GUI Plugins

GUI plugins run in the Electron version of [PicGo](https://github.com/Molunerfinn/PicGo).

In general, everything described for CLI plugins can also be used in the GUI version, except the “Registering CLI Commands” part.

In addition, the Electron version of PicGo provides extra capabilities for PicGo-Core plugins, including `guiApi` and a set of GUI events, which can make your plugin much more powerful in the GUI context. See [GUI Development](/dev-guide/gui) for details.