---
sidebarDepth: 3
---
# 配置文件

picgo 需要配置文件来启动。当你未指定配置文件的时候，picgo 将会使用默认配置文件来启动。

## 默认配置文件

picgo 的默认配置文件为`~/.picgo/config.json`。其中`~`为用户目录。不同系统的用户目录不太一样。

linux 和 macOS 均为`~/.picgo/config.json`。

windows 则为`C:\Users\你的用户名\.picgo\config.json`。

### 自动生成

**通常来说你只需要配置 `Uploader` 即可，所以你可以通过 `picgo set uploader` 来进入交互式命令行，配置成功后会自动生成配置文件，无需复制粘贴！其他更多的命令可以参考 [CLI 命令](/zh/guide/commands.html) 一章。**

::: warning 注意
同时，填好图床配置之后，请务必通过 `picgo use uploader` 选择当前要使用的 `Uploader`。
:::

```bash
$ picgo set uploader
? Choose a(n) uploader (Use arrow keys)
  smms
❯ tcyun
  github
  qiniu
  imgur
  aliyun
  upyun
(Move up and down to reveal more choices)
```

### 手动生成

如果你要手动生成配置文件，需要自己创建对应的目录、JSON 文件以及至少有如下的配置项（因此还是推荐通过命令行自动生成配置文件）：

```json
{
  "picBed": {
    "uploader": "smms", // 代表当前的默认上传图床为 SM.MS,
    "smms": {
      "token": "" // 从 https://sm.ms/home/apitoken 获取的 token
    }
  },
  "picgoPlugins": {} // 为插件预留
}
```

## picBed

作为 picgo 最主要的配置项，picBed 里包括了当前上传图床，以及所有上传图床的配置。

::: warning 插件开发者注意
如果一个 Uploader 的名字为`xxx`，那么它的配置信息会放置在`picBed.xxx`里。这个将有助于 PicGo 的 electron 版本进行配置。
:::

### picBed.uploader

- type: string
- default: `smms`

表明当前的上传图床是哪个。默认值是`smms`。

### picBed.current

作用与`picBed.uploader`一致，主要是为了兼容 PicGo 的 electron 版本而留下的配置。未来有可能抛弃。

### picBed.smms <Badge text="1.4.7+" />

SMMS 图床的相关配置。注册并登录 [smms](https://sm.ms/home/apitoken) 获取 `token`。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#smms) 进行配置。

默认值如下：

```json
{
  "token": "" // 注册后获取的 api token
}
```

### picBed.qiniu

七牛图床的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#七牛图床)进行配置。

默认值如下：

```json
{
  "accessKey": "",
  "secretKey": "",
  "bucket": "", // 存储空间名
  "url": "", // 自定义域名
  "area": "z0" | "z1" | "z2" | "na0" | "as0", // 存储区域编号
  "options": "", // 网址后缀，比如？imgslim
  "path": "" // 自定义存储路径，比如 img/
}
```

### picBed.upyun

又拍云的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#又拍云)进行配置。

默认值如下：

```json
{
  "bucket": "", // 存储空间名，及你的服务名
  "operator": "", // 操作员
  "password": "", // 密码
  "options": "", // 针对图片的一些后缀处理参数
  "path": "", // 自定义存储路径，比如 img/
  "url": "" // 加速域名，注意要加 http://或者 https://
}
```

### picBed.tcyun

腾讯云 COS 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#腾讯云 cos) 进行配置。

默认值如下：

```json
{
  "secretId": "",
  "secretKey": "",
  "bucket": "", // 存储桶名，v4 和 v5 版本不一样
  "appId": "",
  "area": "", // 存储区域，例如 ap-beijing-1
  "path": "", // 自定义存储路径，比如 img/
  "customUrl": "", // 自定义域名，注意要加 http://或者 https://
  "version": "v5" | "v4" // COS 版本，v4 或者 v5
}
```

### picBed.github

GitHub 图床的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#github 图床)进行配置。

默认值如下：

```json
{
  "repo": "", // 仓库名，格式是 username/reponame
  "token": "", // github token
  "path": "", // 自定义存储路径，比如 img/
  "customUrl": "", // 自定义域名，注意要加 http://或者 https://
  "branch": "" // 分支名，默认是 main
}
```

### picBed.aliyun

阿里云 OSS 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#阿里云 oss) 进行配置。

默认值如下：

```json
{
  "accessKeyId": "",
  "accessKeySecret": "",
  "bucket": "", // 存储空间名
  "area": "", // 存储区域代号
  "path": "", // 自定义存储路径
  "customUrl": "", // 自定义域名，注意要加 http://或者 https://
  "options": "" // 针对图片的一些后缀处理参数 PicGo 2.2.0+ PicGo-Core 1.4.0+
}
```

### picBed.imgur

Imgur 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#imgur 图床)进行配置。

默认值如下：

```json
{
  "clientId": "", // imgur 的 clientId
  "proxy": "" // 代理地址，仅支持 http 代理
}
```

## picgoPlugins

这个配置项将会将所有插件名放置进去。主要用于判断插件是否被启用或者禁用。 **picgo 自动生成，不需要配置！**

示例：

```json
{
  "picgo-plugin-xxx": true, // 该插件被启用
  "picgo-plugin-yyy": false // 该插件被禁用
}
```

## transformer

这个配置项主要用于存放第三方插件里的 Transformer 的相关配置。

::: warning 插件开发者注意
如果一个 Transformer 的名字为`xxx`，那么它的配置信息会放置在`transformer.xxx`里。这将有助于 PicGo 的 electron 版本进行配置。
:::

默认值：`{}`

## picgo-plugin-*

如果你为 picgo 开发了一个插件，如果这个插件本身需要一些配置项，那么这个插件对应的配置应该直接放置在配置文件下的同名配置里：

示例：

```json
"picgo-plugin-xxx": {
  "config1": "",
  "config2": ""
}
```
