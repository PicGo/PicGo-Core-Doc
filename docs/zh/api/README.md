---
sidebar: auto
---

# API列表

picgo本身是一个流程系统应用。除了最关键的上传之外，picgo还支持配置、log输出、插件、命令行交互等等功能。

## ctx

picgo传入插件的`ctx`其实就是picgo本身。`ctx`拥有picgo暴露的所有对象和方法。所以picgo本身拥有的方法，你在插件里使用的`ctx`也具备同样的方法。

首先我们来初始化一个picgo实例。

```js
const PicGo = require('picgo')
const picgo = new PicGo()
```

接下去介绍picgo的详细API。

## upload([input])

picgo的上传函数。

- input: Array\<any\> || `undefined`

upload接收两种情况：

- 空数组或者`undefined`

当为空数组或者`undefined`的时候，picgo将会上传剪贴板里的第一张图片（由于跨平台限制只能为 **`png`** 格式）。若剪贴板里不存在图片将会报错。

::: tip 提示
Linux平台需要安装`xclip`
:::

示例：

```js
picgo.upload()

// or

picgo.upload([])
```

- 非空数组

当为非空数组的时候，对应于picgo默认的两种transformer，支持path数组以及base64图片信息数组。参考[Transformer](/zh/dev-guide/cli.html#transformer)章节。

示例：

```js
picgo.upload(['/xxx/xxx.jpg', '/yyy/yyy.png'])
```

## getConfig([name])

获取picgo的config信息。

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

配置picgo的config但不写入配置文件，用于上下文使用。

- config: object

需要传入一个合法的对象去配置picgo的config信息。 **这个方法不会写入配置文件** ，一次流程执行结束后不会改变配置文件本身，却可以在流程过程中实现后续部件读取的配置。

::: warning 注意
如果是GUI插件，setConfig虽然不会写入配置文件，但是会一直保存在config上下文中，如果插件有重置的需求，请在合适的地方调用 `unsetConfig`（见下文) 来重置config。
:::

示例：

```js
picgo.setConfig({
  'picBed.current': 'gitlab'
})
```

## saveConfig(config)

配置picgo的config并写入配置文件，用于持久化保存配置。

- config: object

需要传入一个合法的对象去配置picgo的config信息。**这个方法会写入配置文件**，并影响之后每次picgo读取的配置文件。

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

删除picgo的config中的某个配置但不写入配置文件，用于上下文使用。

- key: string
- propName: string

传入需要删除的字段来删除picgo的config信息。 **这个方法不会写入配置文件** ，一次流程执行结束后不会改变配置文件本身。

示例：

原始的config：
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

unsetConfig后的config:

```json
{
  "picgoPlugin": {}
}
```

## removeConfig(key, propName) <Badge text="1.4.0+" />

删除picgo的config中的某个配置并写入配置文件，用于持久化保存配置。

- key: string
- propName: string

传入需要删除的字段来删除picgo的config信息。 **这个方法会写入配置文件** ，并影响之后每次picgo读取的配置文件。

示例：

原始的config file：
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

removesetConfig后的config file:

```json
{
  "picgoPlugin": {}
}
```

## emit(event, [message])

事件派发。继承于EventEmmitter。

- event: string
- message: any

通过`emit`可以派发事件，再通过`on`方法监听。

::: tip 提示
一个特殊的事件名是`notification`，picgo以及一些插件将会使用这个事件名，详情可以查看[消息通知](/zh/dev-guide/cli.html#消息通知)章节。
:::

示例：

```js
picgo.emit('xxx', { message: 'xxx' })
```

## on(event, [callback])

事件监听。继承于EventEmmitter。

- event: string
- callback: function

通过`on`可以监听`emit`派发的事件。picgo自带的事件可以参考[事件监听](/zh/guide/use-in-node.html#事件监听)一章。

```js
picgo.emit('xxx', message => {
  console.log(message) // { message: 'xxx' }
})
```

## input

- type: Array\<any\>

picgo的输入。是一个数组。

```js
console.log(picgo.input)
```

## output

- type: Array\<any\>

picgo的输出。是一个数组。通常上传成功之后要给这个数组里每一项加入`imgUrl`以及`url`项。可以参考picgo默认的[smms](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/smms.ts#L25-L37) Uploader。

::: warning 注意
input通过Transformer之后就会进入output数组中，而不是经过Uploader才会变成output。
:::

```js
console.log(picgo.output)
```

## configPath

- type: string

picgo的config所在路径。

```js
console.log(picgo.configPath)
```

## baseDir

- type: string

picgo的config文件所在的文件夹路径。

```js
console.log(picgo.baseDir)
```

## helper

helper是picgo的主要插件的集中管理者，包含5个部件，拥有相同的api，不过所在生命周期不同，详情可见[生命周期流程](/zh/dev-guide/cli.html)。因此只介绍`helper.transformer`即可。

### helper.transformer

#### register(id, plugin)

- id: string
- plugin: object

如果你只是要开发一个简单的插件，而不是发布一个npm包的话（发布picgo的npm插件包请查看[插件开发指南](/zh/dev-guide/cli.html)），那么只需要调用`helper[module].register`方法即可。

第一个参数代表插件的id（相同的部件只能拥有唯一的id，不过不同的部件可以拥有相同的id），第二个参数应当是一个对象，至少包括一个`handle`方法供picgo调用。如果你还想要拥有[配置项](/zh/dev-guide/cli.html#配置项的处理)功能，可以考虑再加入`config`方法供picgo调用。

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

Request.request是picgo内部暴露的一个[Request-Promise-Native](https://github.com/request/request-promise-native)对象，拥有一个可以使用[request](https://github.com/request/request)库里的所有方法，并且返回的是原生的Promise。

::: tip 小贴士
值得注意的是，使用这个对象来发送请求的话，能自动读取用户配置给picgo的 `proxy` 值。比较适合用于书写Uploder的核心部分。
:::

示例：

```js
picgo.Request.request({
  method: 'post',
  uri: 'xxxx',
  body: fs.readFileSync('yyy')
})
```

## cmd

用于提供picgo的命令行程序。

### cmd.program

用于注册CLI命令。实际上是一个[commander.js](https://github.com/tj/commander.js/)的实例，用法和`commander.js`几乎一致。 **不过请不要手动调用picgo.cmd.program.parse(process.argv)否则会导致出错** 。参考[注册命令](/zh/dev-guide/cli.html#注册cli命令)一章。

示例：

```js
picgo.cmd.program
  .commands('test', 'This is a test commands')
  .action(() => {
    console.log(123)
  })
```

### cmd.inquirer

用于提供CLI命令行交互。实际上是一个[inquirer.js](https://github.com/SBoudrias/Inquirer.js/)的实例，用法和`inquirer.js`一致。参考[配置项的处理](/zh/dev-guide/cli.html#配置项的处理)一章。通常PicGo内部会将其和插件的[config](/zh/dev-guide/cli.html#config方法)方法一起使用。

示例：

```js
const handleConfig = async ctx => {
  const prompts = config(ctx)
  const answer = await ctx.cmd.inquirer.prompt(prompts)
  ctx.saveConfig({ // 调用saveConfig保存配置
    'picBed.xxx': answer
  })
}
```

:::tip 提示
你可以通过这个工具来制作你自己的命令行交互。不过需要注意的是，通常你应该直接使用插件的[config](/zh/dev-guide/cli.html#config方法)方法来实现命令行交互，并且PicGo会自动存储`config`相关配置项的结果。
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

提供了安装、更新、卸载picgo插件的底层接口。同时还暴露了对应的成功、失败事件用于开发者处理。

### pluginHandler.install([...pluginName])

用于安装插件，接收一个数组作为参数。其中 `pluginName` 不包括 `picgo-plugin-` 的前缀。比如一个叫做 `plugin-plugin-xxx` 的插件， `pluginName` 为 `xxx`。

```js
picgo.pluginHandler.install(['xxx'])
picgo.on('installSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('installFailed', err => {})
```

### pluginHandler.uninstall([...pluginName])

用于安装插件，接收一个数组作为参数。其中 `pluginName` 不包括 `picgo-plugin-` 的前缀。比如一个叫做 `plugin-plugin-xxx` 的插件， `pluginName` 为 `xxx`。

```js
picgo.pluginHandler.uninstall(['xxx'])
picgo.on('uninstallSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('uninstallFailed', err => {})
```

### pluginHandler.update([...pluginName])

用于安装插件，接收一个数组作为参数。其中 `pluginName` 不包括 `picgo-plugin-` 的前缀。比如一个叫做 `plugin-plugin-xxx` 的插件， `pluginName` 为 `xxx`。

```js
picgo.pluginHandler.update(['xxx'])
picgo.on('updateSuccess', (res) => {
  console.log(res) // ['picgo-plugin-xxx']
})
picgo.on('updateFailed', err => {})
```

## guiApi

**guiApi仅在electron版本的PicGo里提供，详细信息可以参考[GUI插件开发一章](/zh/dev-guide/gui.html)。**

### guiApi.showInputBox([option])

调用之后打开一个输入弹窗，可以用于接受用户输入。

- option: Object || `undefined`
- return: 返回一个Promise对象，resolve的值是用户输入的结果。

其中option是可选值，可以传入一个`{title, placeholder}`的对象，用于弹窗的标题和输入框的`placeholder`显示。

```js
const guiMenu = ctx => {
  return [
    {
      label: '打开InputBox',
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

### showFileExplorer([option])

调用之后打开一个文件浏览器，可以得到用户选择的文件（夹）路径。

- option: Object || `undefined`
- return: 返回一个Promise对象，resolve的值是用户选择的文件路径数组。

其中option是可选值，可以传入一个合法的electron的dialog的[options对象](https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback)，用于指定是否可多选，用于选择文件还是文件夹等等。

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

### upload([file])

调用之后使用PicGo底层来上传，可以实现自动更新相册图片、上传成功后自动将URL写入剪贴板。

- file: Array || `undefined`
- return: 返回一个Promise对象，resolve的值是PicGo上传成功后的output值，是一个数组。所以推荐用`async await`获取。

::: tip 提示
实际上如果通过上面的`showInputBox`获得输入项，或者`showFileExplorer`选中文件，再通过`upload`上传的话，也可以很好的达到上传的目的。
推荐还是书写Uploader或者Transformer等插件，来实现接管PicGo的上传流程。
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

### showNotification(option) <Badge text="2.0.1+" />

调用之后弹出系统通知窗口。

- option: Object || `undefined`
- return: undefined(无返回值)

其中option是必选值，需要提供`{title, body}`用于通知窗口的显示。

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

### showMessageBox([option]) <Badge text="2.1.0+" />

调用之后弹出系统的对话框窗口。

- option: Object || `{title: '', message: '', type: 'info', buttons: ['Yes', 'No']}`
- return: Object -> `{result, checkboxChecked}`

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo/20190611110904.png)

其中，option的完整参数可以参考Electron的[dialog.showMessageBox](https://electronjs.org/docs/api/dialog#dialogshowmessageboxbrowserwindow-options-callback)。返回的值里，`result`为你指定的buttons的index值。比如上图如果我点了`是(Y)`,那么我会收到如下返回值：

```js
{
  result: 0,
  checkboxChecked: false // 如果你在options里指定了checkboxLabel则会出现一个checkbox，如果不提供，默认返回false
}
```

示例：

```js
const guiMenu = ctx => {
  return [
    {
      label: '显示MessageBox',
      async handle (ctx, guiApi) {
        const result = await guiApi.showMessageBox({
          title: '这是title',
          message: '这是message',
          type: 'info',
          buttons: ['Yes', 'No']
        })
        console.log(result) // { result: 0, checkboxChecked: false }
      }
    }
  ]
}
```