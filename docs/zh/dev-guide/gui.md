# GUI插件开发

## 简介

GUI插件指的是运行在electron版本的[PicGo](https://github.com/Molunerfinn/PicGo)里的插件。它支持绝大多数在普通插件里的能实现的[功能](/zh/dev-guide/cli.html)，还增加了额外的`guiApi`和其他的GUI特有的事件，让你的插件在PicGo里更加强大。

![](https://user-images.githubusercontent.com/12621342/50515434-bc9e8180-0adf-11e9-8c71-0e39973c06b1.png)

## 概述

PicGo在2.0版本之后支持的插件系统其实就是以PicGo-Core为底层核心实现的。在PicGo上传的过程中，你书写的插件（包括Uploader、Transformer等等）都会进入PicGo-Core的上传流程中，所以如果你写了一个CLI版本的插件，基本都能无缝运行在PicGo里。

不过有的时候我们还需要一些额外的功能。比如用户在PicGo相册里删除了某张图片，如果这张图片是在
