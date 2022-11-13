---
sidebarDepth: 3
---

# 在Node里使用picgo

在现有的Node项目里使用picgo是很方便的。你只需要指定配置文件（或者不指定使用默认的），在配置文件里的配置合法的情况下调用upload上传即可。

::: warning 注意
由于需要支持本地插件系统的缘故，picgo仅支持node环境（包括electron的main process），不支持browser环境！
:::

## 初始化

初始化如果需要使用自定义的配置文件，请查看[配置文件](/zh/guide/config.html)一章。注意初始化方式分不同的版本。

### 使用默认配置文件

#### 从 v1.5.0+ 开始
```js
// since v1.5.0

// commonjs
const { PicGo } = require('picgo')
// 或者 es6
import { PicGo } from 'picgo'

const picgo = new PicGo() // <- 将使用默认的配置文件
```

#### v1.5.0 之前

```js
// before v1.5.0

const PicGo = require('picgo')
const picgo = new PicGo() // <- 将使用默认的配置文件
```

### 使用自定义配置文件

#### 从 v1.5.0+ 开始
```js
// since v1.5.0

// commonjs
const { PicGo } = require('picgo')
// or es6
import { PicGo } from 'picgo'

const picgo = new PicGo('/xxx/xxx.json') // <- 在实例化的时候传入配置文件的路径
```


#### v1.5.0 之前

```js
// before v1.5.0

const PicGo = require('picgo')
const picgo = new PicGo('/xxx/xxx.json') // <- 在实例化的时候传入配置文件的路径
```


## 上传

```js
const main = async () => {
  const res = await picgo.upload(['/xxx/xxx.jpg']) // <- 请确保upload函数里的参数为一个数组，哪怕只有一张图片

  // 从 1.4.21 开始可以获取上传后的output
  console.log(res) // ['https:/xxx.com/xxx.jpg']
}

```

## 事件监听

picgo在上传的生命周期里将会暴露一些事件，这些事件将会传入一些参数方便开发者使用。

如果忘记生命周期图可以参考[介绍](/zh/guide/)。

### uploadProgress

- 参数：Number
- 说明：该事件为上传进度事件，开发者可以实现进度条提示。值分别有0,30,60,100和-1。其中-1代表上传失败。100代表上传成功。

```js
picgo.on('uploadProgress', progress => {
  console.log(progress)
})
```

### beforeTransform

- 参数：ctx
- 说明：该事件为input进入transformer之前，可以拿到picgo的ctx。此处主要是可以通过ctx获取input值。

```js
picgo.on('beforeTransform', ctx => {
  console.log(ctx.input) // ['/xxx/xxx.jpg']
})
```

### beforeUpload

- 参数：ctx
- 说明：该事件为output进入uploader之前，可以拿到picgo的ctx。此处主要是可以通过ctx获取通过transformer之后的 **output** 值。

```js
picgo.on('beforeUpload', ctx => {
  console.log(ctx.output) // [{ base64Image, fileName, width, height, extname }]
})
```

### afterUpload

- 参数：ctx
- 说明：该事件为output通过uploader上传成功之后，可以拿到picgo的ctx。此处主要是通过ctx获取通过uploader之后的 **output** 值。

```js
picgo.on('afterUpload', ctx => {
  console.log(ctx.output) // [{fileName, width, height, extname, imgUrl}] <- 注意有imgUrl了。
})
```

### finished

- 参数：ctx
- 说明：该事件为output通过uploader上传成功之后，**并且通过了afterUploadPlugins插件处理之后才会触发** 可以拿到picgo的ctx。此处主要是可以获取最终的 **output** 值。

```js
picgo.on('finished', ctx => {
  console.log(ctx.output) // [{fileName, width, height, extname, imgUrl}] <- 注意有imgUrl了。
})
```

### failed

- 参数：error
- 说明：如果上传失败或者生命周期里发生错误将会被捕获，并触发 `failed` 事件，可以通过该事件捕获错误信息。 (v1.2.10 之前无法获取错误信息，但是可以监听该事件)

```js
picgo.on('failed', error => {
  console.log(error) // 错误信息
})
```

### notification

- 参数：notice
- 说明：在Uploader里，如果上传失败会传出失败的通知。可以监听这个事件给用户发起提示。

```js
picgo.on('notification', notice => {
  console.log(notice) // { title, body, text? }
})
```

其中title和body是 **一定会有的** 。text一般是额外信息，比如body里提示用户去某某网站查看错误码是什么原因，那么text通常是那个网站的网址，text可为`undefined`。

## 生命周期插件

除了生命周期事件你可以监听之外，你还可以接入这三个事件所在的生命周期，实现一些复杂的功能。比如在`beforeUpload`时改变上传的文件名、压缩图片等等。比如在`beforeTransform`之前给图片添加水印等等。

picgo暴露了一个`helper`对象，这个对象里拥有三个与上述生命周期相关的对象，可以通过它们的`register`方法注册，然后实现你的自定义功能。注意，你需要注册的是一个对象，这个对象里必须包括一个`handle`方法，用于picgo调用。picgo将会给这个handle传入ctx以便你的handle能够获取ctx里的内容。

::: warning 注意
一定要在upload方法调用之前注册你的plugins，否则将不会生效！
:::

### helper.beforeTransformPlugins

> 该插件会在`beforeTransform`事件触发后调用

```js
picgo.helper.beforeTransformPlugins.register('name', {
  handle: function (ctx) {
    console.log(ctx.input)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

### helper.beforeUploadPlugins

> 该插件会在`beforeUpload`事件触发后调用

```js
picgo.helper.beforeUploadPlugins.register('name', {
  handle: function (ctx) {
    console.log(ctx.output)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

### helper.afterUploadPlugins

> 该插件会在`afterUpload`事件触发后，`finished`事件触发前调用

```js
picgo.helper.afterUploadPlugins.register('name', {
  handle: function (ctx) {
    console.log(ctx.output)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

当然如果你想实现更加复杂的操作，比如增加自有插件配置、设置插件名字或者想把你的插件开放给更多人使用，欢迎查阅[插件开发](/zh/dev-guide/cli.html)相关章节。

## 日志系统 <Badge text="1.3.7+" />

picgo的[logger](https://github.com/PicGo/PicGo-Core/blob/dev/src/lib/Logger.ts#L38-L56)模块自带持久化日志写入功能。你可以使用 `picgo.log.xxx` 来生成持久化日志。其中 `xxx` 需要用`success`、`warn`、`info`、`error`来代替，分别表示4种不同类型的日志前缀。

调用`logger`模块的方法会在picgo的配置文件所在目录下生成一个叫做`picgo.log`的文件，该文件就是持久化日志文件。同时你也会在控制台看到同样的日志输出。

示例：

```
2019-04-18 13:52:58 [PicGo INFO] Before transform
2019-04-18 13:52:58 [PicGo INFO] Transforming...
2019-04-18 13:52:58 [PicGo INFO] Before upload
2019-04-18 13:52:58 [PicGo INFO] Uploading...
2019-04-18 13:53:01 [PicGo SUCCESS] 
https://xxxx.png
```

## 加载第三方插件 <Badge text="1.4.19+" />

- 从 1.4.19 开始，对外暴露 `pluginHandler` 和 `pluginLoader` 用于加载第三方插件。
- 从 1.5.0 开始，对外暴露 `use` 方法，用于更方便地手动加载第三方插件。

其中：

- `pluginHandler`：用于调用 npm 安装、更新、卸载插件。
- `pluginLoader`：用于动态加载、获取、卸载插件。

二者都能引入插件。不同点在于：

1. pluginHandler调用npm安装或者卸载插件，是一个持久化操作，下次启动picgo之后，picgo将会自动加载已经安装的插件。
2. pluginLoader用于动态加载插件，适用于需要在运行时动态加载不同插件的情况。


### use <Badge text="1.5.0+" />

- (plugin: IPicGoPlugin, name?: string): IPicGoPluginInterface

手动加载第三方插件。如果第二个参数 `name` 为空，则只会实例化这个插件而不会把插件注册进 PicGo 的列表里。这通常在你需要动态加载插件的时候使用。以下是实际例子：

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

对外暴露三个接口，分别对应 `npm install` 、`npm update` 、`npm uninstall` 。


三个接口都是接收一个数组作为参数。其中 `pluginName`：

1. 可以为完整的 picgo 插件名字，比如 `picgo-plugin-xxx`。
2. 也可以是简化名 `xxx`。
3. 支持scope类型插件，比如 `@xxx/picgo-plugin-yyy`。
4. 还支持本地路径。例如 `./xxx/yyy/picgo-plugin-zzz`。

返回的结果会告知调用结果。示例：

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

详细参考 [api-pluginHandler](../api/README.md#pluginhandler)。

### pluginLoader

- registerPlugin(pluginName, plugin) 动态加载插件
- unregisterPlugin(pluginName) 动态卸载插件
- getPlugin(pluginName) 获取插件
- hasPlugin(pluginName) 检查是否有某插件

示例：

```js
const pluginXXX = require('picgo-plugin-xxx')
console.log(picgo.pluginLoader.hasPlugin('xxx')) // false

// 注意pluginName要唯一
picgo.pluginLoader.registerPlugin('xxx', pluginXXX)

console.log(picgo.pluginLoader.hasPlugin('xxx')) // true
```

详细参考 [api-pluginLoader](../api/README.md#pluginloader)。

## Webpack打包注意事项

如果你想把picgo集成到一个通过`webpack`打包的node项目里（比如electron的项目），由于picgo加载插件的时候用到了动态的`require`，打包的时候可能会遇到`Can't find module "."`的错误。这是因为`webpack`对于动态加载模块并不能很好地处理。而对于picgo而言，它动态加载的插件并不需要webpack打包进去，因为picgo是在运行时加载插件而不是构建时加载插件。所以需要用一些方法来绕过webpack的打包：

```js
const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require
const PicGo = requireFunc('picgo')
const picgo = new PicGo()
```

更多细节可以查看相关[issue](https://github.com/webpack/webpack/issues/4175)。
