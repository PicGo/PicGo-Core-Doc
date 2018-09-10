---
sidebar: auto
---

# 插件开发指南

picgo是个上传的流程系统。因此插件其实就是针对这个流程系统的某个部分或者某些部分的开发。

## 简介

再附一下流程图:

![flow](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/picgo-core-fix.jpg)

其中可以供开发的部分总共有5个：

两个部件：

1. Transformer（转换器）
2. Uploader（上传器）

三个生命周期插件入口：

1. beforeTransformPlugins
2. beforeUploadPlugins
3. afterUploadPlugins

通常来说如果你只是要实现一个picgo默认不支持的图床的话，你只需要开发一个`Uploader`。

如果你要实现一个通过图片url地址，就能上传到现有的图床的功能的话，可以考虑开发一个`Transformer`或者一个`beforeTransformPlugins`。

接下去会详细介绍每个部分的作用与能够获取的内容。

## Transformer
## Uploader
## beforeTransformPlugins
## beforeUploadPlugins
## afterUploadPlugins
