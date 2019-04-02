---
sidebarDepth: 3
---
# GUI插件开发

## 概述

GUI插件指的是运行在electron版本的[PicGo](https://github.com/Molunerfinn/PicGo)里的插件。它支持绝大多数在普通插件里能实现的[功能](/zh/dev-guide/cli.html)，还增加了额外的`guiApi`和其他的GUI特有的事件，让你的插件在PicGo里更加强大。

![](https://user-images.githubusercontent.com/12621342/50515434-bc9e8180-0adf-11e9-8c71-0e39973c06b1.png)

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

![](https://i.loli.net/2019/01/12/5c39a2f60a32a.png)

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

## guiApi

上文介绍了每个菜单项都应该对应一个`handle`方法，用于执行点击菜单后的操作。其中传入的第一个参数为`ctx`，第二个参数为`guiApi`。

guiApi目前提供了如下的api：

- `guiApi.showInputBox` 用于打开一个输入框
- `guiApi.showFileExplorer` 用于打开文件浏览器
- `guiApi.upload` 用于调用PicGo内部的上传方法上传
- `guiApi.showNotification` 用于调用系统级别的通知 (v2.0.1)

后续会逐渐增加。

### showInputBox([option])

调用之后打开一个输入弹窗，可以用于接受用户输入。

- option: Object || `undefined`
- return: 返回一个Promise对象，resolve的值是用户输入的结果。所以推荐用`async await`的方式获取。

其中option是可选值，可以传入一个`{title, placeholder}`的对象，用于弹窗的标题和输入框的`placeholder`显示。

![](https://i.loli.net/2019/01/12/5c39aa4dab0b4.png)

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

![](https://i.loli.net/2019/01/12/5c39aea61e80d.gif)

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

### showNotification(option)

> v2.0.1开始支持

调用之后弹出系统通知窗口。

- option: Object || `undefined`
- return: undefined(无返回值)

其中option是必选值，需要提供`{title, body}`用于通知窗口的显示。

![](https://i.loli.net/2019/01/15/5c3db88042a0f.png)

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

## 事件

PicGo在一些情况下会触发一些事件，这些事件可以被插件监听从而实现一些额外的功能。你可以在你的插件的`register`里监听这些事件。

### remove

当用户在相册里点击删除，并且确定的时候，将会触发`remove`事件：

![](https://i.loli.net/2019/01/12/5c39b3c8746cf.png)

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

示例：

```js
module.exports = ctx => {
  const register = () => {
    ctx.on('remove', files => {
      console.log(files)
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

![](https://i.loli.net/2019/01/12/5c39e91a73099.png)

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