# CLI命令

picgo 支持命令行模式直接使用。在你全局安装了`picgo`之后，你可以通过`picgo -h`来查看所有命令：

```bash
$ picgo -h

  Usage: picgo [options] [command]

  Options:

    -v, --version                 output the version number
    -d, --debug                   debug mode
    -s, --silent                  silent mode
    -c, --config <path>           set config path
    -h, --help                    output usage information

  Commands:

    install|add [options] <plugins...>   install picgo plugin
    uninstall|rm <plugins...>            uninstall picgo plugin
    update [options] <plugins...>        update picgo plugin
    set|config <module> [name]           configure config of picgo modules
    upload|u [input...]                  upload, go go go
    use [module]                         use modules of picgo
    init [options] <template> [project]  create picgo plugin's development templates
    i18n [lang]                          change picgo language
    help [command]                       display help for command
```

::: tip 提示
其中，命令选项如果是用`<>`包围起来的为必须输入项，如果是用`[]`包围起来的则为可选输入项。
有些命令支持简写，比如`picgo upload`可以写为`picgo u`。
:::

picgo 命令行的实现来自于[commander.js](https://github.com/tj/commander.js/)与[inquirer.js](https://github.com/SBoudrias/Inquirer.js/)。下面将介绍各个命令以及如何配置。

## use

> 该命令用于选择picgo模块。模块主要有三种：1. transformer 2. uploader 3. plugins

```bash
$ picgo use -h

  Usage: use [module]

  use modules of picgo
```

picgo内置了如下的内容：

- transformer:
  - path
  - base64
- uploader:
  - smms -> SM.MS
  - tcyun -> 腾讯云COS
  - upyun -> 又拍云
  - aliyun -> 阿里云OSS
  - qiniu -> 七牛云
  - imgur -> Imgur
  - github -> GitHub

::: tip 提示
通常来说，在命令行模式下你只需要选择`path`作为picgo的`transformer`即可。
:::

具体使用可以通过`picgo use` 或者 `picgo use uploader|transformer|plugins`来选择你需要的模块内容，这将会进入一个交互式命令行：

```bash
$ picgo use
? Use an uploader (Use arrow keys)
  smms
❯ tcyun
  weibo
  github
  qiniu
  imgur
  aliyun
(Move up and down to reveal more choices)
```

选择完后，picgo将会使用你选择的模块进行上传。在上传前有些模块可能需要配置。比如一些图床的key、token等。这个时候你就需要下面会提到的命令`set|config`来配置你选择的模块内容。

## config|set

> 该命令用于配置某些模块的一些配置项。模块主要有三种：1. transformer 2. uploader 3. plugins

```bash
$ picgo set -h

  Usage: set|config [options] <module> [name]

  configure config of picgo modules

  Options:

    -h, --help  output usage information
```

::: tip 提示
通常来说，picgo默认只需要配置Uploader即可。所以你可以直接通过`picgo set uploader`或者`picgo set uploader weibo|tcyun|...`等命令直接进入交互式命令行。
:::

picgo内置的图床的配置项细节可以参考PicGo的配置[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8)。

如果某个uploader或者transformer或者plugin没有可配置项，picgo也会提示配置成功，不需要担心。

```bash
$ picgo set transformer path
[PicGo SUCCESS]: Configure config successfully!
```

## upload|u

> 该命令用于上传图片到图床。通常是上传磁盘上已有的图片，可以同时上传多张。上传多张图片的时候用空格隔开。也可以上传剪贴板里的第一张图片。

::: tip 提示
请确保你上传前使用了`use`以及`set`命令配置好了需要上传的图床。
:::

```bash
$ picgo u ./Test-测试.jpg ./test-qiniu.png
[PicGo INFO]: Before transform
[PicGo INFO]: Transforming...
[PicGo INFO]: Before upload
[PicGo INFO]: Uploading...
[PicGo SUCCESS]:
https://i.loli.net/2018/09/06/5b9134645b9df.jpg
https://i.loli.net/2018/09/06/5b9134651af34.png
```

如果不显式指定上传的文件，picgo将会上传剪贴板里的第一张图片（由于跨平台限制，上传时将会转为png格式）。通常这在截图后上传非常有用。

```bash
$ picgo u
[PicGo INFO]: Before transform
[PicGo INFO]: Transforming...
[PicGo INFO]: Before upload
[PicGo INFO]: Uploading...
[PicGo SUCCESS]:
https://i.loli.net/2018/09/06/5b9134645b9df.jpg
```

## install|add

> 该命令用于安装npm上的picgo的插件。picgo的插件名都是以`picgo-plugin-`开头的。在安装、卸载或者更新的时候，你只需要输入`name`值而不需要输入`picgo-plugin-`的前缀。可以一次性安装多个插件，用空格隔开即可。

::: tip 提示
PicGo会把插件安装在配置文件所在的目录下。默认配置文件在`~/.picgo/`下，所以插件会安装在`~/.picgo/node_modules/`下。
:::

你可以通过npm的官方网站查找目前所有的picgo的[插件](https://www.npmjs.com/search?q=picgo-plugin-)。picgo的插件命名规则为`picgo-plugin-[name]`。然后再通过：

```bash
picgo install [name]
```
来安装插件。你安装了之后，可以通过`picgo ch plugins`来选择开启或者禁用这个插件。

## uninstall|rm

> 该命令用于删除你所安装的picgo插件。如果不存在将会报错。

```bash
picgo uninstall [name]
```

## update

> 该命令用于更新已经安装的picgo插件。如果不存在将会报错。

```bash
picgo update [name]
```

## init

> 该命令用于下载和生成picgo的插件开发模板

```bash
$ picgo init -h
Usage: init [options] <template> [project]

Options:

  --clone     use git clone
  --offline   use cached template
  -h, --help  output usage information

Examples:

  # create a new project with an official template
  $ picgo init plugin my-project

  # create a new project straight from a github template
  $ picgo init username/repo my-project
```

类似于`vue-cli`的`init`命令，picgo也提供了官方的插件模板叫做[picgo-template-plugin](https://github.com/PicGo/picgo-template-plugin)，不过你在`init`的时候，模板名只需要写`plugin`，内部会自动判断如果非`username/repo`形式的话，自动加上`PicGo/picgo-template-`的前缀。

这个命令用于方便用户快速开发一个picgo插件。关于插件开发，可以查看[插件开发](/dev-guide/cli)一章。

## i18n

> 用于切换 picgo 的语言。目前支持的语言有：

- zh-CN (默认)
- zh-TW
- en

示例：

```bash
picgo i18n en
```

## -v, --version

输入`picgo -v`或者`picgo --version`将输出当前picgo的版本信息。

## -d, --debug

在输入任何有效命令的情况下加入`-d`或者`--debug`会进入`debug`模式。将会输出更加详细的报错信息，指出错误的具体位置。

## -c, --config

在输入任何有效命令的情况下加入`-c <path>`可以指定picgo的配置文件所在处。默认的配置文件是`~/.picgo/config.json`。

::: tip 提示
picgo将会读取配置文件所在目录下`node_modules`的插件。
:::

## -s, --silent

在输入任何有效命令的情况下加入`-s`或者`--silent`将会进入静默模式，除了报错信息之外，picgo在命令行里将不会输出任何信息。
