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

## upload(\<input\>)

- 说明：picgo的上传函数
- input: Array\<any\>

upload接收的是一个数组。picgo默认的两种transformer，支持path数组以及base64图片信息数组。参考[Transformer](http://localhost:8080/PicGo-Core-Doc/zh/dev-guide/#transformer)章节。

示例：

```js
picgo.upload(['/xxx/xxx.jpg', '/yyy/yyy.png'])
```

## getConfig([name])

- 说明：获取picgo的config信息
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

- 说明：配置picgo的config但不写入配置文件，用于上下文临时使用。
- config: object

需要传入一个合法的对象去配置picgo的config信息。 **这个方法不会写入配置文件** ，一次流程执行结束后不会改变配置文件本身，却可以在流程过程中实现后续部件读取的配置。

示例：

```js
picgo.setConfig({
  'picBed.current': 'gitlab'
})
```

## saveConfig(config)

- 说明：配置picgo的config并写入配置文件，用于持久化保存配置。
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

## emit(event, [message])

- 说明：事件派发。继承于EventEmmitter。
- event: string
- message: any

通过`emit`可以派发事件，再通过`on`方法监听。

::: tip 提示
一个特殊的事件名是`notification`，picgo以及一些插件将会使用这个事件名，详情可以查看[消息通知](/zh/dev-guide/#消息通知)章节。
:::

示例：

```js
picgo.emit('xxx', { message: 'xxx' })
```

## on(event, [callback])

- 说明：事件监听。继承于EventEmmitter。
- event: string
- callback: function

通过`on`可以监听`emit`派发的事件。

```js
picgo.emit('xxx', message => {
  console.log(message) // { message: 'xxx' }
})
```

## input

- type: Array\<any\>

picgo的输入。是一个数组。

## output

- type: Array\<any\>

picgo的输出。是一个数组。通常上传成功之后要给这个数组里每一项加入`imgUrl`项。可以参考picgo默认的[smms](https://github.com/PicGo/PicGo-Core/blob/dev/src/plugins/uploader/smms.ts#L25-L37) Uploader。

::: warning 注意
input通过Transformer之后就会进入output数组中，而不是经过Uploader才会变成output。
:::

## configPath

- type: string

picgo的config所在路径。

## baseDir

- type: string

picgo的config文件所在的文件夹路径。

## helper

helper是picgo的主要插件的集中管理者，包含5个部件，拥有相同的api，不过所在生命周期不同，详情可见[生命周期流程](/zh/dev-guide/#插件开发指南)。因此只介绍`helper.transformer`即可。

### helper.transformer

#### register(name, plugin)

- name: string
- plugin: object

如果你只是要开发一个简单的插件，而不是发布一个npm包的话（发布picgo的npm插件包请查看[插件开发指南](/zh/dev-guide/)），那么只需要调用`helper[module].register`方法即可。

第一个参数代表插件的名字（相同的部件只能拥有唯一的name，不过不同的部件可以拥有相同的name），第二个参数应当是一个对象，至少包括一个`handle`方法供picgo调用。如果你还想要拥有[配置项](/zh/dev-guide/#配置项的处理)功能，可以考虑再加入`config`和`handleConfig`方法供picgo调用。

示例：

```js
picgo.helper.transformer.register('test', {
  handle (ctx) {
    return ctx
  },
  config (ctx) {
    return [...]
  },
  handleConfig (ctx) {
    const answer = ctx.cmd.inquirer.prompt([...])
    ctx.saveConfig('picgo-plugin-test', answer)
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

## cmd

用于提供picgo的命令行程序。

### cmd.program

用于注册CLI命令。实际上是一个[commander.js](https://github.com/tj/commander.js/)的实例，用法和`commander.js`几乎一致。 **不过请不要手动调用picgo.cmd.program.parse(process.argv)否则会导致出错** 。参考[注册命令](/zh/dev-guide/#注册命令)一章。

示例：

```js
picgo.cmd.program
  .commands('test', 'This is a test commands')
  .action(() => {
    console.log(123)
  })
```

### cmd.inquirer

用于提供CLI命令行交互。实际上是一个[inquirer.js](https://github.com/SBoudrias/Inquirer.js/)的实例，用法和`inquirer.js`一致。参考[配置项的处理](/zh/dev-guide/#配置项的处理)一章。通常用在插件的[handleConfig](/zh/dev-guide/#handleconfig方法)方法里。

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
