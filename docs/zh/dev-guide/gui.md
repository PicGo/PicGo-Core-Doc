---
sidebarDepth: 3
---
# GUI插件开发

## 概述

GUI插件指的是运行在electron版本的[PicGo](https://github.com/Molunerfinn/PicGo)里的插件。它支持绝大多数在普通插件里能实现的[功能](/zh/dev-guide/cli.html)，还增加了额外的`guiApi`和其他的GUI特有的事件，让你的插件在PicGo里更加强大。

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo-doc/50515434-bc9e8180-0adf-11e9-8c71-0e39973c06b1.png)

PicGo在2.0版本之后支持的插件系统其实就是以PicGo-Core为底层核心实现的。在PicGo上传图片的过程中，你书写的插件（包括Uploader、Transformer等等）都会进入PicGo-Core的上传流程中，所以如果你写了一个CLI版本的插件，基本都能无缝运行在PicGo里。

不过有的时候我们还需要一些额外的功能，比如：

- 相册里图片删除之后，对应的云端也删除图片
- 通过url地址上传图片
- 通过PicGo提供的上传接口，将某些MarkDown里的图片地址进行图床迁移

等等。这些操作或多或少需要额外的信息输入与交互，而不仅仅是依赖PicGo本身的上传区域来进行上传。所以针对GUI插件，PicGo提供了一些特殊的API来支持这些独立于常规上传流程之外的功能。

::: warning 警告
确保你已经阅读过非GUI版本的[插件开发](/zh/dev-guide/cli.html)，之前提到的概念在GUI版本的插件概述里将不会重复。
:::

## guiMenu

guiMenu是PicGo提给给插件的自主控制权的主入口。它的作用是在PicGo的插件页面给予每个插件自主的菜单项，如下图：

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo-doc/5c39a2f60a32a.png)

guiMenu是一个function，PicGo会传入`ctx`（picgo本身）方便开发者使用picgo自带的一些方法，最后应该返回一个 **数组**。

每个menuItem只有两个属性，

- 一个是`label`，用于显示菜单文本。
- 一个是`handle`，用于点击之后执行相应的操作。其中`handle`是一个`function`，推荐写成`async function`，方便控制流程。`handle`里会传入`ctx`和`guiApi`，`ctx`就是picgo本身，而`guiApi`后文会详细介绍。

代码示例：

```js
const guiMenu = ctx => {
  return [
    {
      label: '打开InputBox',
      async handle (ctx, guiApi) {
        // do something...
      }
    },
    {
      label: '打开FileExplorer',
      async handle (ctx, guiApi) {
        // do something...
      }
    },
    // ...
  ]
}
```

guiMenu应该在插件的`module.exports`里暴露出去。例如你已经写了一个普通的picgo插件如下：

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
那么加入`guiMenu`应该是这样：

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
      label: '打开InputBox',
      async handle (ctx, guiApi) {
        // do something...
      }
    },
    {
      label: '打开FileExplorer',
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
    guiMenu, // <-- 在这里注册
    transformer: 'test'
  }
}
```

## 默认菜单项

根据[插件开发-配置项处理](/zh/dev-guide/cli.html#配置项的处理)一章的描述，如果你的插件提供了 `Plugin` 或 `Uploader` 或 `Transformer` 维度的配置，会在插件的右键菜单生成对应默认的配置菜单：

![defautl-config](https://cdn.jsdelivr.net/gh/Molunerfinn/test/PicGo/default-config.png)

点击之后，PicGo会根据提供的配置项，转换生成可视化的配置表单：

![setting-context-menu](https://cdn.jsdelivr.net/gh/Molunerfinn/test/PicGo/setting-context-menu.png)

如果觉得菜单项都是英文不好理解（默认取的是 `name` 值），你可以通过配置每个菜单项的 `alias` 字段，来让表单显示成 `alias` 的文字。

例子：

```js
const conf = [
  {
    alias: '仓库名',
    name: 'repo',
    type: 'input',
    default: userConfig.repo || '',
    required: true
  },
  // ...
]
```

当用户点击确定之后，PicGo会根据配置项维度的不同，自动根据规则写入配置文件。

## guiApi

::: warning 注意
本章节的api版本是跟随PicGo的[Electron版本](https://github.com/Molunerfinn/PicGo)，而不是PicGo-Core的版本，请务必注意
:::

上文介绍了每个菜单项都应该对应一个`handle`方法，用于执行点击菜单后的操作。其中传入的第一个参数为`ctx`，第二个参数为`guiApi`。

guiApi目前提供了如下的api：

- `guiApi.showInputBox` 用于打开一个输入框
- `guiApi.showFileExplorer` 用于打开文件浏览器
- `guiApi.upload` 用于调用PicGo内部的上传方法上传
- `guiApi.showNotification` 用于调用系统级别的通知 <Badge text="2.0.1+"/>
- `guiApi.showMessageBox` 用于调用系统级别的对话框 <Badge text="2.1.0+"/>
- `guiApi.galleryDB` 用于操作相册数据 <Badge text="2.3.0+"/>

后续会逐渐增加。

### showInputBox([option])

调用之后打开一个输入弹窗，可以用于接受用户输入。

- option: Object || `undefined`
- return: 返回一个Promise对象，resolve的值是用户输入的结果。所以推荐用`async await`的方式获取。

其中option是可选值，可以传入一个`{title, placeholder}`的对象，用于弹窗的标题和输入框的`placeholder`显示。

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo-doc/5c39aa4dab0b4.png)

示例：

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
- return: 返回一个Promise对象，resolve的值是用户选择的文件路径数组。所以推荐用`async await`的方式获取。

其中option是可选值，可以传入一个合法的electron的dialog的[options对象](https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback)，用于指定是否可多选，用于选择文件还是文件夹等等。

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo-doc/5c39aea61e80d.gif)

示例：

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

### galleryDB <Badge text="2.3.0+" />

2.3.0版本开始，提供了专门的相册数据操作api。包括了获取、更新、删除、插入等操作。详细说明可以参考 [api-guiApi-galleryDB](../api/README.md#guiapi-gallerydb)。


## 快捷键系统 <Badge text="2.2.0+" />

从PicGo的2.2.0版本开始，插件支持注册全局快捷键了，可以注册快捷键来让实现一些便捷功能。

要注册插件需要暴露一个 `commands` function，并返回一个 **快捷键数组**。每个 `commandItem` 有如下几个属性：

- key: string - 预设的快捷键
- name: string - 快捷键的唯一标识（用于和其他快捷键区分）
- label: string - 快捷键对用户展示的作用名称
- handle: async (ctx, guiApi) => {} - 快捷键的处理函数

代码示例：

```js
const commands = (ctx) => {
  const config = ctx.getConfig('xxx')
  return [{
    label: '快捷截图',
    name: 'quickCapture',
    key: 'Ctrl+Shift+0',
    async handle (ctx, guiApi) {
      // ...在这里实现你的快捷键要做的操作
    }
  }]
}
```

跟guiMenu相同，commands应该在插件的`module.exports`里暴露出去。例如：

```js
// ...
const commands = ctx => {}
module.exports = ctx => {
  const register = () => {}
  return {
    register,
    commands // <- 在这里注册
  }
}
```

当安装了插件之后，可以在「PicGo设置-快捷键设置」打开快捷键设置界面，就可以看到注册的快捷键。

![shortkey-setting-screenshot](https://cdn.jsdelivr.net/gh/Molunerfinn/test/PicGo/shortKey-setting-screenshot.png)

PicGo会根据插件的名字以及快捷键Item的name值，给快捷键分配不同的配置作用域，从而生成配置文件，生成的配置文件的key名的规则为 `${pluginName}:${commandItem.name}`（开发者无需关注）：

```json
"shortKey": {
  "picgo:upload": {
    "enable": false,
    "key": "Ctrl+Shift+U",
    "name": "upload",
    "label": "快捷上传"
  },
  "picgo-plugin-test:test": {
    "enable": true,
    "name": "test",
    "label": "快捷截图",
    "key": "Ctrl+Shift+0"
  }
}
```

可以参考插件[picgo-plugin-quick-capture](https://github.com/PicGo/picgo-plugin-quick-capture)的写法。


## 事件

PicGo在一些情况下会触发一些事件，这些事件可以被插件监听从而实现一些额外的功能。你可以在你的插件的`register`里监听这些事件。

### remove

当用户在相册里点击删除，并且确定的时候，将会触发`remove`事件：

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo-doc/5c39b3c8746cf.png)

`remove`事件会发送删除的图片列表（哪怕只有一张也是以数组格式传递），格式大概如下：

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

你可以从中获取`type`值（上传的图床类型），文件名、URL、后缀等等信息。

**从 GUI VERSION 2.3.0 开始，你可以在第二个参数拿到 guiApi。**

示例：

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

## 其他

### Uploader的名字

如果你写了一个`Uploader`的插件，PicGo将会自动将其显示到图床列表里。你可以自定义一下这个图床要显示的名字，通过`name`选项来实现。如果你不提供这个`name`选项，那么PicGo将会显示Uploader注册的时候的`id`值。

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test@master/picgo-doc/5c39e91a73099.png)

```js
const handle = ctx => {
  // ...
}
module.exports = ctx => {
  const register = () => {
    ctx.helper.uploader.register('test', { 
      handle,
      name: '微博图床Plus'
    })
  }
  return {
    register,
    uploader: 'test'  // Uploader的id
  }
}
```
如果你的`Uploader`提供了`config`配置，那么在PicGo上也会相应显示出来。