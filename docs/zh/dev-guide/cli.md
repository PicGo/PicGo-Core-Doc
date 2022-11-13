---
sidebarDepth: 2
---

# 插件开发

## 简介

picgo是个上传的流程系统。因此插件其实就是针对这个流程系统的某个部件或者某些部件的开发。

再附一下流程图:

![flow](https://pic.molunerfinn.com/picgo/docs/core-lifecycle.png)

其中可以供开发的部件总共有5个：

两个模块：

1. Transformer
2. Uploader

::: tip 提示
这两个部件在上传的生命周期里各只会调用一次。比如picgo默认带有8种Uploader，但是在一次上传过程中 **只会调用某一个** 选定的Uploader来上传。
:::

三个生命周期插件入口：

1. beforeTransformPlugins
2. beforeUploadPlugins
3. afterUploadPlugins

::: tip 提示
这三个生命周期插件只要存在就会调用。比如你安装了两个插件，它们都书写了`beforeTransformPlugins`，那么这两个插件的`beforeTransformPlugins` **都会被调用** 。
:::

通常来说如果你只是要实现一个picgo默认不支持的图床的话，你只需要开发一个`Uploader`。

如果你要实现一个通过图片url地址，就能上传到现有的图床的功能的话，可以考虑开发一个`Transformer`或者一个`beforeTransformPlugins`。

当然在这过程中你可以获取picgo提供的其他丰富的[API](/zh/api/)。

## 概述

上述5个部件都是[LifecyclePlugins](https://github.com/PicGo/PicGo-Core/blob/dev/src/lib/LifecyclePlugins.ts)类的实例化,因此都会提供一个`register`方法用于给部件注册。

::: warning 注意
`register`的第一个参数为id，是某个部件里的唯一标识符；第二个参数才为插件的具体实现。
:::

不管是哪种部件，都应该暴露一个`handle`方法用于picgo来调用。而picgo会给每个`handle`方法传入picgo的`ctx`，方便你获取input、output、config等信息。

而一个 **插件本身** 通过实现一个`register`方法来供picgo的`pluginLoader`来加载。插件本身应该是一个npm包，这样才能被picgo正确安装及使用。 

插件的目录结构可以很简单：

```bash
.
├── README.md
├── index.js      # plugin
└── package.json
```

一个`index.js`，以及`package.json`里指定`main`字段为`index.js`即可。

也即格式如下：

```js
const handle = ctx => {
  return ctx.output
}

module.exports = ctx => {
  const register = () => { // 插件的register
    ctx.helper.transformer.register('test', { handle }) // 这里的transformer可以替换成uploader等你想开发的部部件的名字。
  }
  return {
    register,
    transformer: 'test'
  }
}
```

**也可以使用picgo提供的官方的[插件模板](#使用插件模板)，下文会介绍。**

### Transformer

[Transformer](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/index.ts)的作用是把input输入的内容（比如path）转化成Uploader可以`上传的内容`。

默认的Transformer有两个，一个是[path](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/path.ts)一个是[base64](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/base64.ts)。

其中`path`接收的是一个路径数组：`[path1, path2, ...]`，并将其转换为output数组。

`base64`将直接接收一个Uploader可支持的output数组。

默认的Uploader可支持的output格式如下：

::: tip 提示
其中buffer和base64值二选一即可，如果传入的是path数组，PicGo **默认输出是buffer值** 。
:::

```js
[
  {
    buffer: 'xxx', // 图片的buffer值，buffer和base64值二选一即可
    base64Image: 'xxxx', // 图片的base64值，buffer和base64值二选一即可
    fileName: 'xxxx', // 图片的文件名
    width: 'xxxx', // 图片宽度
    height: 'xxxx', // 图片高度
    extname: '.xxx' // 图片格式的扩展名 比如.jpg | .png
  },
  {
    ...
  },
  ...
]
```

所以如果你只是开发一个Transformer的话，那么接收input而来的信息之后你只需要在`ctx.output`里输出成如上格式即可。

例如：

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
    transformer: 'test' // 请将transformer的id注册在这里
  }
}
```

### Uploader

[Uploader](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/index.ts)的作用是把`ctx.output`内容上传到指定地方，并输出新的`ctx.output`（包含了图片上传的URL等）。

Uploader里可以实现自己的上传逻辑。你可以通过`Transformer`传来的`ctx.output`获取你想要的图片的基本信息。然后实现一些比较有趣的功能，比如你想上传到自己的FTP服务器都可以实现。

::: warning 注意
上传成功后你必须往`ctx.output`里的每一项加入一个`imgUrl`的属性，里面写入图片上传成功后的URL，以便PicGo（electron版本）获取图片地址并显示在相册中。如果你上传的是一个非图片文件，请提供一个`url`属性以及一个`imgUrl`属性，其中`imgUrl`可以是文件类型的缩略图的URL。而`url`将会决定用户拿到剪贴板的地址是什么。如果没有`url`将会取`imgUrl`的值。
**另外注册的Uploader的id不能和现有的Uploader重复**，现有的Uploader可以在[配置列表](/zh/guide/config.html)看到。
:::

推荐可以使用[ctx.request](/zh/api/#request)来发送请求，它能自动读取PicGo配置里的`proxy`值。

例如：

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
    uploader: 'test'  // 请将uploader的id注册在这里
  }
}
```

通过Uploader上传结束后，输出的结果为：

```js
[
  {
    fileName: 'xxxx', // 图片的文件名
    width: 'xxxx', // 图片宽度
    height: 'xxxx', // 图片高度
    extname: '.xxx' // 图片格式的扩展名 比如.jpg | .png
    url: 'https://xxxxxx.jpg', // 文件的地址，如果文件是图片，那么跟imgUrl一致
    imgUrl: 'https://xxxxx.jpg', // 图片的地址，如果文件不是图片，那么这个地址可以是文件类型的缩略图地址
  },
  {
    ...
  },
  ...
]
```

### beforeTransformPlugins

这个部分的插件在input输入后，Transformer转换前调用。例如你要做一个通过图片URL获取图片并将其转换为output数组的插件，就可以通过这个部分的插件实现。

::: tip 提示
这三个生命周期插件的注册方法跟上面两个部分是一样的。这里只举例`beforeTransformPlugins`的注册。
:::

例如：

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

这个部分的插件在Transformer输出之后，在Uploader上传之前调用。主要处理Transformer输出的output。

### afterUploadPlugins

这个部分的插件在Transformer输出之后，在Uploader上传之前调用。主要处理Uploader上传成功后的output。

## 高级技巧

### 部件组合

你要实现的功能可能`Transformer`还不够，还需要`Uploader`来实现。或者你需要做的是接管整个上传流程，开发完整的5个部件。没有关系，你可以在自己的插件里注册多个部件的组合。

::: warning 注意
同一个插件有且只能拥有一个相同的部分。比如你不能一个插件里书写两个Uploader。如果你的插件包括了`Uploader`或`Transformer`，请在最后将他们的`id`声明出来，如下例。
:::

例如：

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
    uploader: 'test', // 声明注册的uploader的id
    transformer: 'test' // 声明注册的transformer的id
  }
}
```

### 配置项的处理

::: tip 提示
配置项处理目前只支持`Uploader`、`Transformer`和`Plugin`三个维度。
:::

上面说了，每个部件都应该暴露一个`handle`方法，以及每个插件都应该暴露一个`register`方法用于picgo调用。如果你的插件想要拥有配置项（通常Uploader都会有配置项），那么你可以再实现一个方法——`config`。

当你实现了配置项方法了之后，可以通过CLI的`set|config`方法来进行设置，比如：

![](https://cdn.jsdelivr.net/gh/Molunerfinn/test/picgo/picgo-settings-cli.gif)

#### config方法

config方法应该返回一个合法的[问题](https://github.com/SBoudrias/Inquirer.js#question)数组，用于[inquirer](https://github.com/SBoudrias/Inquirer.js)来调用。你可以参考picgo里的[weibo](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/weibo.ts) Uploader的实现。

并且注意，config方法也会接收来自picgo传入的ctx方便你使用（比如获取之前用户的设置）。config方法的实现例子如下：

```js
const config = ctx => {
  const prompts = [...]
  return prompts
}
```

::: tip 提示
单独抽离config方法出来，是为了让PicGo（electron）版本能够用UI界面显示配置信息。
:::

示例：

```js
const handle = ctx => {
  return ctx
}

const transformerConfig = ctx => {
  return [...]
}

const pluinConfig = ctx => {
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

::: warning 注意
这里有个约定俗成的规定，你的`Uploader`的配置项会存放在picgo配置项的`picBed`下。比如你的Uploader的name为`gitlab`，那么保存的时候会保存到`picBed.gitlab`下。你的`plugin`本身如果有配置项，那么你的plugin配置项会直接存放在picgo配置项下，并且以你的`plugin`命名。`Transformer`的配置项会放在picgo配置项的`transformer`下。
关于配置相关的部分你应该查看[配置文件](/zh/guide/config.html)一章。
:::

所以一个实现了`Uploader`叫`gitlab`，`Transformer`叫`gitlab`，`plugin`叫`picgo-plugin-gitlab`的插件，它写入picgo的配置文件后，picgo的配置文件应该长这样：

```json
{
  "picBed": {
    "current": "gitlab",
    "gitlab": {
      // ... Uploader配置项
    },
    // ...
  },
  "picgoPlugins": {...}, // 此项为picgo自动生成，不需配置
  "picgo-plugin-gitlab": {
    // ... plugin配置项
  },
  // ...
  "transformer": {
    "gitlab": {
      // ... Transformer配置项
    },
    // ...
  }
}
```

::: tip 提示
你最好只在你需要配置的部分（比如Uploader是几乎必须的）加入`config`而不是滥用这个方式，否则它将会提高用户使用的门槛和步骤。
:::

### 消息通知

在上传过程中，有可能会遇到上传失败。这个时候如果你是一个Uploader的开发者，你应该将这个错误通知出去。可以参考picgo的[qiniu](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/qiniu.ts#L55-L58) Uploader的实现。

这里主要通过调用picgo给予的`ctx.emit`方法，可以emit一个叫做`notification`的事件来实现。具体格式如下：

```js
const handle = ctx => {
  try {
    // ... do something
  } catch (err) {
    ctx.emit('notification', {
      title: 'XXXX错误',
      body: 'XXXXXXXXXX',
      text: ''
    })
  }
}
```

一个notification **必须要有`title`和`body`字段** 。至于`text`字段，如果存在，它将会被复制到用户的剪贴板里。这个特性在某些时候很有用。例如你需要用户在收到通知后，打开某个网站查看错误信息的话，text字段可以放入这个网址，那么用户收到通知后直接粘贴到网址栏即可访问。

### 注册CLI命令

picgo自带的CLI命令可以通过这个[章节](/zh/guide/commands.html)找到。如果你的插件也想增加CLI命令的话，可以通过picgo提供的`ctx.cmd.program`实例来实现。这个实例其实就是个[commander](https://github.com/tj/commander.js/)实例。

::: warning 注意
你需要将注册的命令通过`ctx.cmd.register`来注册。用法与`Uploader`等的`register`方法一致。这个目的主要是保证命令只在合适的时候被调用，否则容易出现内存泄露。
:::

例如：

```js
module.exports = ctx => {
  const register = () => {
    // 通过register注册
    ctx.cmd.register('test-cmd', {
      handle (ctx) {
       ctx.cmd.program
         .commands('test', 'This is a test commands')
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

::: warning 注意
你不需要调用`ctx.cmd.program.parse(process.argv)`！否则将会引发错误。picgo会自己调用这个命令。
:::

### 日志系统 <Badge text="1.3.7+"/>

如果你想记录下你的插件的行为，方便日后追查错误，可以查看[日志系统](/zh/guide/use-in-node.html#日志系统/)一章。

### i18n 国际化 <Badge text="1.5.0+"/>

从 `v1.5.0` 开始，picgo 支持国际化。如果你的插件配置需要配置国际化文案，可以参考本节。

picgo 默认提供三种内置语言：

- `zh-CN` (默认)
- `zh-TW`
- `en`

如果你的插件需要支持这几种语言的文案，可以使用 `ctx.i18n` 提供的[方法](/zh/api/#i18n)：

- 向已有的语言中添加语言包：`addLocale`: (language: string, locales: ILocale) => boolean
- 翻译文本：`translate`: (key: T, args?: {}) => string

实际使用可以参考 [picgo-plugin-pic-migrater](https://github.com/PicGo/picgo-plugin-pic-migrater/blob/dev/src/i18n/index.ts)，以下是一个简单的例子：

```js
const localesZH = {
  PIC_MIGRATER_CHOOSE_FILE: '选择文件',
  PIC_MIGRATER_CHOOSE_FOLDER: '选择文件夹',
}

const localesEN = {
  PIC_MIGRATER_CHOOSE_FILE: 'Choose File',
  PIC_MIGRATER_CHOOSE_FOLDER: 'Choose Folder',
}

module.exports = (ctx) => {
  const register = () => {
    // 向 zh-CN 和 en 中添加语言包
    ctx.i18n.addLocale('zh-CN', localesZH)
    ctx.i18n.addLocale('en', localesEN)
  }

  const config = (ctx) => {
    const text = ctx.i18n.translate('PIC_MIGRATER_CHOOSE_FILE')
    console.log(text) // 选择文件
  }

  return {
    register,
    config,
  }
}
```

如果还想添加新的语言、设置当前语言，可以参考 [picgo-i18n](/zh/api/#i18n) 的文档。

### 使用插件模板

为了方便开发者快速开发picgo的插件，PicGo官方提供了插件模板：[picgo-template-plugin](https://github.com/PicGo/picgo-template-plugin)，它的使用和[vue-cli](https://cli.vuejs.org/)的`init`很类似。要使用官方的plugin模板你只需要：

```bash
picgo init plugin <your-project-name>
```

如果你已经创建过一次模板，下次可以使用离线模式：

```bash
picgo init plugin <your-project-name> --offline
```

如果你想要使用自己的模板，可以使用`user/repo`来下载指定的GitHub仓库的模板：

```bash
picgo init user/repo <your-project-name>
```

然后根据提示创建项目即可。官方插件模板里提供了`TypeScript`和`JavaScript`两种模板，开发者可以二选一。推荐使用`TypeScript`模板来得到更好的语法提示。

### 开发插件模板

如果你觉得官方的插件模板不够好用，你也可以开发自己的插件模板。不过注意点如下：

1. 你的仓库里必须要有一个`index.js`用于插件模板的配置。
2. 你的仓库里必须要有一个`template`文件夹用于存放模板文件。
3. picgo的template渲染引擎是[ejs](https://ejs.co/)，简单高效。

`index.js`文件里支持的导出内容有：

1. prompts，用于插件初始化的时候提供命令行选项供用户选择。必须提供一个合法的[inquirer.js](https://github.com/SBoudrias/Inquirer.js/)的问题 **数组**。【几乎是必选】
2. filters，用于根据用户回答prompts提供的答案来筛选文件。是一个 **对象**。【可选】
3. complete，用于在模板渲染完执行的操作，是一个 **函数**。picgo会传入{ answers， options, files, ctx }。其中answers为用户回答的prompts的结果，options有当前执行的插件名、目的路径、是否离线等等（可以参考这个声明文件：[options](https://github.com/PicGo/PicGo-Core/blob/dev/src/utils/interfaces.ts#L52-L61))，files为生成的模板文件名的数组，ctx为picgo本身。【可选】
4. completeMessage，用于在渲染结束后输出自定义文本。【可选】

以上皆可参考vue-cli2的模板语法，以及[picgo-template-plugin](https://github.com/PicGo/picgo-template-plugin)本身。有疑问可以在官方模板仓库里的[issues](https://github.com/PicGo/picgo-template-plugin/issues)里指出。

### 开发GUI插件

所谓的GUI插件就是指运行在electron版本的[PicGo](https://github.com/Molunerfinn/PicGo)里的插件。

理论上来说CLI部分的插件除了`注册CLI命令`的部分在GUI里用不到之外，其他的部分 **都可以正常在GUI里使用**。不过electron版本的PicGo为`PicGo-Core`的插件提供了额外的`guiApi`和一系列GUI事件，可以让你的插件在electron版本的PicGo里更加强大。详细可以查看[GUI插件开发一章](/zh/dev-guide/gui.html)。