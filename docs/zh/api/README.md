---
sidebar: auto
---

# API 列表

picgo 本身是一个流程系统应用。除了最关键的上传之外，picgo 还支持配置、log 输出、插件、命令行交互等等功能。

## ctx

picgo 传入插件的`ctx`其实就是 picgo 本身。`ctx`拥有 picgo 暴露的所有对象和方法。所以 picgo 本身拥有的方法，你在插件里使用的`ctx`也具备同样的方法。

首先我们来初始化一个 picgo 实例。

```js
const PicGo = require('picgo')
const picgo = new PicGo()
```

接下去介绍 picgo 的详细 API。

## upload([input])

picgo 的上传函数。

- input: Array\<any\> || `undefined`
- return: Promise<[IImgInfo[]](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178) | Error> <Badge text="1.4.21+" />

upload 接收两种情况：

- 空数组或者`undefined`

当为空数组或者`undefined`的时候，picgo 将会上传剪贴板里的第一张图片（由于跨平台限制只能为 **`png`** 格式）。若剪贴板里不存在图片将会报错。

::: tip 提示
Linux 平台需要安装`xclip`
:::

示例：

```js
picgo.upload()

// or

picgo.upload([])
```

- 非空数组

当为非空数组的时候，对应于 picgo 默认的两种 transformer，支持 path 数组以及 base64 图片信息数组。参考 [Transformer](/zh/dev-guide/cli.html#transformer) 章节。

示例：

```js
picgo.upload(['/xxx/xxx.jpg', '/yyy/yyy.png'])
```

从 `v1.4.21+` 开始，支持调用后获取结果：

```js
const main = async () => {
  const res = await picgo.upload(['/xxx/xxx.jpg', '/yyy/yyy.png'])
  console.log(res) // [https://xxx.com/xxxxx.jpg, https://xxx.com/yyyyy.jpg]
}
```

## getConfig([name])

获取 picgo 的 config 信息。

- name: string

默认的配置长这样：

```json
{
  "picBed": {
    "current": "smms"
  }
}
```

你可以通过`getConfig()`获取完整信息：

```js
picgo.getConfig()
```

输出：

```json
{
  "picBed": {
    "current": "smms"
  },
  "plugins": {...}
}
```

或者你可以选择你要查看的具体配置项：

```js
picgo.getConfig('picBed.current') // 支持多级查找
```

输出：`smms`。

## setConfig(config)

配置 picgo 的 config 但不写入配置文件，用于上下文使用。

- config: object

需要传入一个合法的对象去配置 picgo 的 config 信息。 **这个方法不会写入配置文件** ，一次流程执行结束后不会改变配置文件本身，却可以在流程过程中实现后续部件读取的配置。

::: warning 注意
如果是 GUI 插件，setConfig 虽然不会写入配置文件，但是会一直保存在 config 上下文中，如果插件有重置的需求，请在合适的地方调用 `unsetConfig`（见下文） 来重置 config。
:::

示例：

```js
picgo.setConfig({
  'picBed.current': 'gitlab'
})
```

## saveConfig(config)

配置 picgo 的 config 并写入配置文件，用于持久化保存配置。

- config: object

需要传入一个合法的对象去配置 picgo 的 config 信息。**这个方法会写入配置文件**，并影响之后每次 picgo 读取的配置文件。

示例：

```js
picgo.saveConfig({
  'picgo-plugin-test': {
    xxx: 'xxx',
    yyy: 'yyy'
  }
})
```

## unsetConfig(key, propName) <Badge text="1.4.0+" />

删除 picgo 的 config 中的某个配置但不写入配置文件，用于上下文使用。

- key: string
- propName: string

传入需要删除的字段来删除 picgo 的 config 信息。 **这个方法不会写入配置文件** ，一次流程执行结束后不会改变配置文件本身。

示例：

原始的 config：

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

unsetConfig 后的 config:

```json
{
  "picgoPlugin": {}
}
```

## removeConfig(key, propName) <Badge text="1.4.0+" />

删除 picgo 的 config 中的某个配置并写入配置文件，用于持久化保存配置。

- key: string
- propName: string

传入需要删除的字段来删除 picgo 的 config 信息。 **这个方法会写入配置文件** ，并影响之后每次 picgo 读取的配置文件。

示例：

原始的 config file：

```json
{
  "picgoPlugin": {
    "picgo-plugin-xxx": { ... }
  }
}
```

```js
picgo.removesetConfig('picgoPlugin', 'picgo-plugin-xxx')
```

removesetConfig 后的 config file:

```json
{
  "picgoPlugin": {}
}
```

## emit(event, [message])

事件派发。继承于 EventEmmitter。

- event: string
- message: any

通过`emit`可以派发事件，再通过`on`方法监听。

::: tip 提示
一个特殊的事件名是`notification`，picgo 以及一些插件将会使用这个事件名，详情可以查看 [消息通知](/zh/dev-guide/cli.html#消息通知)章节。
:::

示例：

```js
picgo.emit('xxx', { message: 'xxx' })
```

## on(event, [callback])

事件监听。继承于 EventEmmitter。

- event: string
- callback: function

通过`on`可以监听`emit`派发的事件。picgo 自带的事件可以参考 [事件监听](/zh/guide/use-in-node.html#事件监听)一章。

```js
picgo.emit('xxx', message => {
  console.log(message) // { message: 'xxx' }
})
```

## input

- type: Array\<any\>

picgo 的输入。是一个数组。

```js
console.log(picgo.input)
```

## output

- type: Array\<any\>

picgo 的输出。是一个数组。通常上传成功之后要给这个数组里每一项加入`imgUrl`以及`url`项。可以参考 picgo 默认的 [smms](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/smms.ts#L25-L37) Uploader。

::: warning 注意
input 通过 Transformer 之后就会进入 output 数组中，而不是经过 Uploader 才会变成 output。
:::

```js
console.log(picgo.output)
```

## configPath

- type: string

picgo 的 config 所在路径。

```js
console.log(picgo.configPath)
```

## baseDir

- type: string

picgo 的 config 文件所在的文件夹路径。

```js
console.log(picgo.baseDir)
```

## VERSION

- type: string

获取当前 picgo 的版本。

```js
console.log(picgo.VERSION) // x.x.x
```

## GUI_VERSION

- type: string || undefined

如果当前环境为 PicGo GUI，可以获取当前 PicGo GUI 的版本，否则是undefined。

```js
console.log(picgo.GUI_VERSION) // x.x.x
```

## helper

helper 是 picgo 的主要插件的集中管理者，包含 5 个部件，拥有相同的 api，不过所在生命周期不同，详情可见 [生命周期流程](/zh/dev-guide/cli.html)。因此只介绍`helper.transformer`即可。

### helper.transformer

#### register(id, plugin)

- id: string
- plugin: object

如果你只是要开发一个简单的插件，而不是发布一个 npm 包的话（发布 picgo 的 npm 插件包请查看 [插件开发指南](/zh/dev-guide/cli.html)），那么只需要调用`helper[module].register`方法即可。

第一个参数代表插件的 id（相同的部件只能拥有唯一的 id，不过不同的部件可以拥有相同的 id），第二个参数应当是一个对象，至少包括一个`handle`方法供 picgo 调用。如果你还想要拥有 [配置项](/zh/dev-guide/cli.html#配置项的处理)功能，可以考虑再加入`config`方法供 picgo 调用。

示例：

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

同上。

### helper.beforeTransformPlugins

同上，不过不拥有配置项功能。

### helper.beforeUploadPlugins

同上，不过不拥有配置项功能。

### helper.afterUploadPlugins

同上，不过不拥有配置项功能。

## Request.request

**v1.5.0开始这个属性将被废弃，请直接使用 [`ctx.request`](#request)。**

Request.request 是 picgo 内部暴露的一个 [Request-Promise-Native](https://github.com/request/request-promise-native) 对象，拥有一个可以使用 [request](https://github.com/request/request) 库里的所有方法，并且返回的是原生的 Promise。

::: tip 小贴士
值得注意的是，使用这个对象来发送请求的话，能自动读取用户配置给 picgo 的 `proxy` 值。比较适合用于书写 Uploder 的核心部分。
:::

示例：

```js
picgo.Request.request({
  method: 'post',
  uri: 'xxxx',
  body: fs.readFileSync('yyy')
})
```

## request <Badge text="1.4.16+" />

从 `v1.4.16` 开始，默认的请求方法从 `ctx.Request.request` 换成了 `ctx.request`。目前的底层实现是 [Request-Promise-Native](https://github.com/request/request-promise-native) ，从 `v1.5.0` 开始，将会换成 [got](https://github.com/sindresorhus/got)。

示例：

```js
picgo.request({
  method: 'post',
  uri: 'xxxx',
  body: fs.readFileSync('yyy')
})
```

## cmd

用于提供 picgo 的命令行程序。

### cmd.program

用于注册 CLI 命令。实际上是一个 [commander.js](https://github.com/tj/commander.js/) 的实例，用法和`commander.js`几乎一致。 **不过请不要手动调用 picgo.cmd.program.parse(process.argv) 否则会导致出错** 。参考 [注册命令](/zh/dev-guide/cli.html#注册 cli 命令)一章。

示例：

```js
picgo.cmd.program
  .commands('test', 'This is a test commands')
  .action(() => {
    console.log(123)
  })
```

### cmd.inquirer

用于提供 CLI 命令行交互。实际上是一个 [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) 的实例，用法和`inquirer.js`一致。参考 [配置项的处理](/zh/dev-guide/cli.html#配置项的处理）一章。通常 PicGo 内部会将其和插件的 [config](/zh/dev-guide/cli.html#config 方法)方法一起使用。

示例：

```js
const handleConfig = async ctx => {
  const prompts = config(ctx)
  const answer = await ctx.cmd.inquirer.prompt(prompts)
  ctx.saveConfig({ // 调用 saveConfig 保存配置
    'picBed.xxx': answer
  })
}
```

:::tip 提示
你可以通过这个工具来制作你自己的命令行交互。不过需要注意的是，通常你应该直接使用插件的 [config](/zh/dev-guide/cli.html#config 方法)方法来实现命令行交互，并且 PicGo 会自动存储`config`相关配置项的结果。
:::

## log

用于在命令行输出漂亮的信息，给予用户提示。

截图：

![](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/20180912153940.png)

### log.info(message)

- message: string

示例：

```js
picgo.log.info('Hello world')
```

### log.warn(message)

- message: string

示例：

```js
picgo.log.warn('Hello world')
```

### log.success(message)

- message: string

示例：

```js
picgo.log.success('Hello world')
```

### log.error(message)

- message: string | error

示例：

```js
picgo.log.error('Hello world')
```

## PluginHandler <Badge text="1.4.0+" />

提供了安装、更新、卸载 picgo 插件的底层接口。同时还暴露了对应的成功、失败事件用于开发者处理。 **它依赖于系统 npm 命令。**

### pluginHandler.install([...pluginName])

- return: Promise<[IPluginHandlerResult](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L339)> <Badge text="1.4.19+" />

用于安装插件，接收一个数组作为参数。其中 `pluginName`：

1. 可以为完整的 picgo 插件名字，比如 `picgo-plugin-xxx`。
2. 也可以是简化名 `xxx`。
3. 支持scope类型插件，比如 `@xxx/picgo-plugin-yyy`。
4. 还支持本地路径。例如 `./xxx/yyy/picgo-plugin-zzz`。

```js
const res = picgo.pluginHandler.install(['xxx'])
picgo.on('installSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('installFailed', err => {})

// v1.4.19 开始会直接返回调用结果。示例：
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

用于卸载插件，接收一个数组作为参数。其中 `pluginName`：

1. 可以为完整的 picgo 插件名字，比如 `picgo-plugin-xxx`。
2. 也可以是简化名 `xxx`。
3. 支持scope类型插件，比如 `@xxx/picgo-plugin-yyy`。
4. 还支持本地路径。例如 `./xxx/yyy/picgo-plugin-zzz`。

```js
const res = picgo.pluginHandler.uninstall(['xxx'])
picgo.on('uninstallSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('uninstallFailed', err => {})

// v1.4.19 开始会直接返回调用结果。示例：
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

用于更新插件，接收一个数组作为参数。其中 `pluginName`：

1. 可以为完整的 picgo 插件名字，比如 `picgo-plugin-xxx`。
2. 也可以是简化名 `xxx`。
3. 支持scope类型插件，比如 `@xxx/picgo-plugin-yyy`。
4. 还支持本地路径。例如 `./xxx/yyy/picgo-plugin-zzz`。

```js
const res = picgo.pluginHandler.update(['xxx'])
picgo.on('updateSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('updateFailed', err => {})

// v1.4.19 开始会直接返回调用结果。示例：
res.then((result) => {
  if (result.success) {
    console.log(result.body) // ['picgo-plugin-xxx']
  } else {
    console.log(result.body) // error message
  }
})
```

## PluginLoader <Badge text="1.4.17+" />

提供了动态加载、卸载 picgo 插件的方法。比较适合用于在 Node 项目中使用 picgo 时动态引入插件。

### pluginLoader.registerPlugin(pluginName, plugin)

- pluginName: string
- plugin: [IPicGoPlugin](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L352)

用于注册并加载插件。

示例：

```js
const pluginXXX = require('picgo-plugin-xxx')

// 注意pluginName要唯一
picgo.pluginLoader.registerPlugin('xxx', pluginXXX)
```

### pluginLoader.unregisterPlugin(pluginName)

用于卸载插件。

示例：

```js
// 注意pluginName要唯一
picgo.pluginLoader.unregisterPlugin('xxx')
```

### pluginLoader.getPlugin(pluginName)

- return: plugin -> [IPicGoPlugin](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L352)

用于获取某个插件。

示例：

```js
const plugin = picgo.pluginLoader.getPlugin('xxx')
```

### pluginLoader.hasPlugin(pluginName)

用于确认是否存在某个插件。

- return: boolean

示例：

```js
const res = picgo.pluginLoader.hasPlugin('xxx') // true or false
```

## guiApi <Badge text="GUI VERSION 2.0.0+" />

**guiApi 仅在 electron 版本的 PicGo 里提供，详细信息可以参考 [GUI 插件开发一章](/zh/dev-guide/gui.html)。**

### guiApi.showInputBox([option])

调用之后打开一个输入弹窗，可以用于接受用户输入。

- option: Object || `undefined`
- return: 返回一个 Promise 对象，resolve 的值是用户输入的结果。

其中 option 是可选值，可以传入一个`{title, placeholder}`的对象，用于弹窗的标题和输入框的`placeholder`显示。

```js
const guiMenu = ctx => {
  return [
    {
      label: '打开 InputBox',
      async handle (ctx, guiApi) {
        const value = await guiApi.showInputBox({
          title: '打开对话框',
          placeholder: '请输入文件地址'
        })
        console.log(value)
      }
    }
  ]
}
```

### guiApi.showFileExplorer([option])

调用之后打开一个文件浏览器，可以得到用户选择的文件（夹）路径。

- option: Object || `undefined`
- return: 返回一个 Promise 对象，resolve 的值是用户选择的文件路径数组。

其中 option 是可选值，可以传入一个合法的 electron 的 dialog 的 [options 对象](https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback)，用于指定是否可多选，用于选择文件还是文件夹等等。

```js
const guiMenu = ctx => {
  return [
    {
      label: '打开文件浏览器',
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

调用之后使用 PicGo 底层来上传，可以实现自动更新相册图片、上传成功后自动将 URL 写入剪贴板。

- file: Array || `undefined`
- return: 返回一个 Promise 对象，resolve 的值是 PicGo 上传成功后的 output 值，是一个数组。所以推荐用`async await`获取。

::: tip 提示
实际上如果通过上面的`showInputBox`获得输入项，或者`showFileExplorer`选中文件，再通过`upload`上传的话，也可以很好的达到上传的目的。
推荐还是书写 Uploader 或者 Transformer 等插件，来实现接管 PicGo 的上传流程。
:::

示例：

```js
const guiMenu = ctx => {
  return [
    {
      label: '独立上传',
      async handle (ctx, guiApi) {
        const files = await guiApi.showFileExplorer({
          properties: ['openFile', 'multiSelections'
        })
        guiApi.upload(files)
      }
    }
  ]
}
```

### guiApi.showNotification(option) <Badge text="2.0.1+" />

调用之后弹出系统通知窗口。

- option: Object || `undefined`
- return: undefined（无返回值）

其中 option 是必选值，需要提供`{title, body}`用于通知窗口的显示。

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo-doc/5c3db88042a0f.png)

示例：

```js
const guiMenu = ctx => {
  return [
    {
      label: '显示通知',
      async handle (ctx, guiApi) {
        guiApi.showNotification({
          title: '提示',
          body: '本提示来自插件'
        })
      }
    }
  ]
}
```

### guiApi.showMessageBox([option]) <Badge text="2.1.0+" />

调用之后弹出系统的对话框窗口。

- option: Object || `{title: '', message: '', type: 'info', buttons: ['Yes', 'No']}`
- return: Object -> `{result, checkboxChecked}`

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo/20190611110904.png)

其中，option 的完整参数可以参考 Electron 的 [dialog.showMessageBox](https://electronjs.org/docs/api/dialog#dialogshowmessageboxbrowserwindow-options-callback)。返回的值里，`result`为你指定的 buttons 的 index 值。比如上图如果我点了`是 (Y)`, 那么我会收到如下返回值：

```js
{
  result: 0,
  checkboxChecked: false // 如果你在 options 里指定了 checkboxLabel 则会出现一个 checkbox，如果不提供，默认返回 false
}
```

示例：

```js
const guiMenu = ctx => {
  return [
    {
      label: '显示 MessageBox',
      async handle (ctx, guiApi) {
        const result = await guiApi.showMessageBox({
          title: '这是 title',
          message: '这是 message',
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

从 PicGo GUI 2.3.0 开始，相册数据使用 `galleryDB` 操作，不再使用 config 里的 `uploaded` 字段。

galleryDB的使用可以参考 [PicGo/store](https://github.com/PicGo/store#get-getfilter-ifilter) 提供的api，以此为准。下文不一定更新及时。

#### galleryDB.get(filter?)

- filter: undefined || Object -> [IFilter](https://github.com/PicGo/store/blob/dev/src/types/index.ts)
- return: Promise<[IImgInfo[]](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)>

获取相册列表。可以提供filter字段用于过滤，如果不提供则默认获取全部列表。示例：

```js
const guiMenu = ctx => {
  return [
    {
      label: '获取相册数据',
      async handle (ctx, guiApi) {
        const result = await guiApi.galleryDB.get({
          orderBy: 'asc', // 升序
          limit: 10, // 取10个
          offset: 5 // 从index 5之后开始取（slice(5))
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

往相册中插入数据。注意插入的数据一定要是符合要求的 output 中的格式（参考 [transformer 一章](../dev-guide/cli.md#transformer)，否则无法展示在相册中。

#### galleryDB.insertMany([...value])

- input: Array -> [IImgInfo[]](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)
- return: Promise<[IResult[]](https://github.com/PicGo/store/blob/dev/src/types/index.ts)>

往相册中批量插入数据。注意插入的数据一定要是符合要求的 output 数组格式（参考 [transformer 一章](../dev-guide/cli.md#transformer)，否则无法展示在相册中。

#### galleryDB.updateById(id, value)

- id: string 相册中某张图片的id
- value: [IImgInfo](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)
- return: Promise\<boolean\>

根据相册数据中的id更新某张图片的信息。返回boolean。如果更新成功返回true，反之返回false。

#### galleryDB.getById(id)

- id: string 相册中某张图片的id
- return: Promise<[IImgInfo](https://github.com/PicGo/PicGo-Core/blob/f133d57562c413b0b6f9a9ca9a93bf19c1768f1f/src/types/index.d.ts#L169-L178)>

根据id获取某张图片的信息。

#### galleryDB.removeById(id)

- id: string 相册中某张图片的id
- return: void

根据id删除某张图片的信息。无返回值。

**注意，删除图片是敏感操作，GUI版本会提示用户是否允许删除。**
