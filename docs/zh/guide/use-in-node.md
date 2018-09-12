---
sidebarDepth: 3
---

# 在Node里使用picgo

在现有的Node项目里使用picgo是很方便的。你只需要指定配置文件（或者不指定使用默认的），在配置文件里的配置合法的情况下调用upload上传即可。

## 配置文件

picgo的默认配置文件为`~/.picgo/config.json`。其中`~`为用户目录。不同系统的用户目录不太一样。

linux和macOS均为`~/.picgo/config.json`。

windows则为`C:\Users\你的用户名\.picgo\config.json`。

配置文件需要至少有如下的配置项：

```json
{
  "picBed": {
    "current": "smms" // 代表当前的默认上传图床为SM.MS
  }
}
```

## 初始化

### 使用默认配置文件

```js
const PicGo = require('picgo')
const picgo = new PicGo() // <- 将使用默认的配置文件
```

### 使用自定义配置文件

```js
const PicGo = require('picgo')
const picgo = new PicGo('/xxx/xxx.json') // <- 在实例化的时候传入配置文件的路径
```

## 上传

```js
picgo.upload(['/xxx/xxx.jpg']) // <- 请确保upload函数里的参数为一个数组，哪怕只有一张图片
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
picgo.helper.beforeTransformPlugins.register({
  handle: function (ctx) {
    console.log(ctx.input)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

### helper.beforeUploadPlugins

> 该插件会在`beforeUpload`事件触发后调用

```js
picgo.helper.beforeUploadPlugins.register({
  handle: function (ctx) {
    console.log(ctx.output)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

### helper.afterUploadPlugins

> 该插件会在`afterUpload`事件触发后，`finished`事件触发前调用

```js
picgo.helper.afterUploadPlugins.register({
  handle: function (ctx) {
    console.log(ctx.output)
  }
})

picgo.upload(['/xxx/xxx.jpg'])
```

当然如果你想实现更加复杂的操作，比如增加自有插件配置、设置插件名字或者想把你的插件开放给更多人使用，欢迎查阅[插件开发](/zh/dev-guide/)相关章节。
