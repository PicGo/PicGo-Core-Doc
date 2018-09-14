---
sidebar: auto
---

# 插件开发指南

picgo是个上传的流程系统。因此插件其实就是针对这个流程系统的某个部件或者某些部件的开发。

再附一下流程图:

![flow](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/picgo-core-fix.jpg)

其中可以供开发的部件总共有5个：

两个处理器：

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
`register`的第一个参数为name，是某个部件里的唯一标识符；第二个参数才为插件的具体实现。
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
    register
  }
}
```

### Transformer

[Transformer](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/index.ts)的作用是把input输入的内容（比如path）转化成Uploader可以`上传的内容`。

默认的Transformer有两个，一个是[path](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/path.ts)一个是[base64](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/transformer/base64.ts)。

其中`path`接收的是一个路径数组：`[path1, path2, ...]`，并将其转换为output数组。

`base64`将直接接收一个Uploader可支持的output数组。

默认的Uploader可支持的output格式如下：


```js
[
  {
    base64Image: 'xxxx', // 图片的base64值
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
    register
  }
}
```

### Uploader

[Uploader](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/index.ts)的作用是把`ctx.output`内容上传到指定地方，并输出新的`ctx.output`（包含了图片上传的URL等）。

Uploader里可以实现自己的上传逻辑。你可以通过`Transformer`传来的`ctx.output`获取你想要的图片的基本信息。然后实现一些比较有趣的功能，比如你想上传到自己的FTP服务器都可以实现。

::: warning 注意
上传成功后你必须往`ctx.output`里的每一项加入一个`imgUrl`的属性，里面写入图片上传成功后的URL，以便PicGo（electron版本）获取图片地址并显示在相册中。
:::

例如：

```js
const handle = ctx => {
  let output = ctx.output
  // do something for uploading
  for (let i in output) {
    output[i].imgUrl = 'https://xxxxx.jpg'
  }
  return ctx
}

module.exports = ctx => {
  const register = () => {
    ctx.helper.uploader.register('test', { handle })
  }
  return {
    register
  }
}
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
同一个插件有且只能拥有一个相同的部分。比如你不能一个插件里书写两个Uploader。
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
    register
  }
}
```

### 配置项的处理

::: tip 提示
配置项处理目前只支持`Uploader`、`Transformer`和`Plugin`三个维度。
:::

上面说了，每个部件都应该暴露一个`handle`方法，以及每个插件都应该暴露一个`register`方法用于picgo调用。如果你的插件想要拥有配置项（通常Uploader都会有配置项），那么你可以再实现两个方法。分别是`config`和`handleConfig`。

当你实现了配置项方法了之后，可以通过CLI的`set|config`方法来进行设置，比如：

![](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/picgo-settings-cli.gif)

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
    config: pluginConfig
  }
}

```

#### handleConfig方法

handleConfig方法就是picgo将会调用的方法了——在用户输入`picgo set <module> [name]`的命令时将会调用这个方法。同样的picgo将会往这个方法里传入ctx。你需要通过ctx给予的`cmd.inquirer`实例去调用`prompt`方法实现命令行交互。最后再将信息保存。

可以参考[weibo](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/weibo.ts#L144-L150) 的`handleConfig`的实现。

handleConfig方法的实现例子如下：

```js
const handleConfig = async ctx => {
  const prompts = config(ctx)
  const answer = await ctx.cmd.inquirer.prompt(prompts)
  ctx.saveConfig({ // 调用saveConfig保存配置
    'picBed.xxx': answer
  })
}
```

::: warning 注意
这里有个约定俗成的规定，你的Uploader的配置项应该存放在picgo配置项的`picBed`下。比如你的Uploader的name为`gitlab`，那么保存的时候应该保存到`picBed.gitlab`下。同样的你的plugin如果有配置项，那么你的plugin配置项应该直接存放在picgo配置项下，并且以你的plugin命名。Transformer的配置项应该放在picgo配置项的`transformer`下。
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
  "plugins": {...}, // 此项为picgo自动生成，不需配置
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
你最好只在你需要配置的部分（比如Uploader是几乎必须的）加入`config`以及`handleConfig`而不是滥用这个方式，否则它将会提高用户使用的门槛和步骤。
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

### 注册命令

picgo自带的CLI命令可以通过这个[章节](/zh/guide/commands)找到。如果你的插件也想增加CLI命令的话，可以通过picgo提供的`ctx.cmd.program`实例来实现。这个实例其实就是个[commander](https://github.com/tj/commander.js/)实例。

例如：

```js
module.exports = ctx => {
  const register = () => {
    ctx.cmd.program
      .commands('test', 'This is a test commands')
      .action(() => {
        console.log(123)
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

## 发布插件

为了让一个插件能够被其它开发者使用，你必须遵循`picgo-plugin-<name>`的命名约定将其发布到npm上。插件遵循命名约定之后就可以：

- 被其他开发者搜索到。
- 通过`picgo install <name>`或者`picgo add <name>`来安装。

picgo的官方插件，你可以在PicGo的[GitHub主页](https://github.com/PicGo)找到。

### 插件的UI显示

如果你想要你的插件在[PicGo](https://github.com/Molunerfinn/PicGo)软件上显示出图标、简介等信息，请遵循以下要求：

1. 在npm包的根目录里放置一张`logo.png`
2. 在`package.json`里增加`description`字段用于介绍你的插件以及`homepage`字段用于指向你的插件的主页地址。

示例：

```json
{
  "description": "This is a picgo plugin",
  "homepage": "https://github.com/XXX/XXX#readme"
}
```
