---
sidebar: auto
---

# API列表

picgo本身是一个流程系统应用。除了最关键的上传之外，picgo还支持配置、log输出、插件、命令行交互等等功能。

picgo传入插件的`ctx`其实就是picgo本身。所以`ctx`拥有picgo暴露的所有对象和方法。所以picgo本身拥有的方法，你在插件里使用的`ctx`也具备同样的方法。

首先我们来初始化一个picgo实例。

```js
const PicGo = require('picgo')
const picgo = new PicGo()
```

接下去介绍picgo的详细API。

## upload()

## getConfig()

## setConfig()

## emit()

## on()

## helper

### helper.transformer

### helper.uploader

### helper.beforeTransformPlugins

### helper.beforeUploadPlugins

### helper.afterUploadPlugins

## cmd

### cmd.program

### cmd.inquirer

## log

### log.info

### log.warn

### log.success

### log.error
