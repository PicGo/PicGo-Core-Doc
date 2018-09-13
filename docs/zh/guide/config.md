---
sidebarDepth: 3
---
# 配置文件

picgo需要配置文件来启动。当你未指定配置文件的时候，picgo将会使用默认配置文件来启动。

## 默认配置文件

picgo的默认配置文件为`~/.picgo/config.json`。其中`~`为用户目录。不同系统的用户目录不太一样。

linux和macOS均为`~/.picgo/config.json`。

windows则为`C:\Users\你的用户名\.picgo\config.json`。

配置文件需要至少有如下的配置项：

```json
{
  "picBed": {
    "uploader": "smms" // 代表当前的默认上传图床为SM.MS
  },
  "plugins": {} // 为插件预留
}
```

## picBed

作为picgo最主要的配置项，picBed里包括了当前上传图床，以及所有上传图床的配置。

::: warning 插件开发者注意
如果一个Uploader的名字为`xxx`，那么它的配置信息应当放置在`picBed.xxx`里。这个将有助于PicGo的electron版本进行配置。
:::

### picBed.uploader

- type: string
- default: `smms`

表明当前的上传图床是哪个。默认值是`smms`。（它不需要额外配置）

### picBed.current

作用与`picBed.uploader`一致，主要是为了兼容PicGo的electron版本而留下的配置。未来有可能抛弃。

### picBed.weibo

微博图床的相关配置。可以查看PicGo的[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8#微博图床)进行配置。

默认值如下：

```json
{
  "chooseCookie": true | false,
  "username": "",
  "password": "",
  "quality": "thumbnail" | "mw690" | "large",
  "cookie": ""
}
```

### picBed.qiniu

七牛图床的相关配置。可以查看PicGo的[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8#七牛图床)进行配置。

默认值如下：

```json
{
  "accessKey": "",
  "secretKey": "",
  "bucket": "",
  "url": "",
  "area": "",
  "options": ""
}
```

### picBed.upyun

又拍云的相关配置。可以查看PicGo的[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8#又拍云)进行配置。

默认值如下：

```json
{
  "bucket": "",
  "operator": "",
  "password": "",
  "options": "",
  "path": "",
  "url": ""
}
```

### picBed.tcyun

腾讯云COS的相关配置。可以查看PicGo的[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8#腾讯云cos)进行配置。

默认值如下：

```json
{
  "secretId": "",
  "secretKey": "",
  "bucket": "",
  "appId": "",
  "area": "",
  "path": "",
  "customUrl": "",
  "version": "v5" | "v4"
}
```

### picBed.github

GitHub图床的相关配置。可以查看PicGo的[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8#github图床)进行配置。

默认值如下：

```json
{
  "repo": "",
  "token": "",
  "path": "",
  "customUrl": "",
  "branch": "",
  "username": ""
}
```

### picBed.aliyun

阿里云OSS的相关配置。可以查看PicGo的[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8#阿里云oss)进行配置。

默认值如下：

```json
{
  "accessKeyId": "",
  "accessKeySecret": "",
  "bucket": "",
  "area": "",
  "path": "",
  "customUrl": ""
}
```

### picBed.imgur

Imgur的相关配置。可以查看PicGo的[wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8#imgur)进行配置。

默认值如下：

```json
{
  "clientId": "",
  "proxy": ""
}
```

## plugins

这个配置项将会将所有插件名放置进去。主要用于判断插件是否被启用或者禁用。

示例：

```json
{
  "picgo-plugin-xxx": true, // 该插件被启用
  "picgo-plugin-yyy": false // 该插件被禁用
}
```

## transformer

这个配置项主要用于存放第三方插件里的Transformer的相关配置。

::: warning 插件开发者注意
如果一个Transformer的名字为`xxx`，那么它的配置信息应当放置在`transformer.xxx`里。这将有助于PicGo的electron版本进行配置。
:::

默认值：`{}`

## picgo-plugin-*

如果你为picgo开发了一个插件，如果这个插件本身需要一些配置项，那么你应该把这个插件对应的配置直接放置在配置文件下的同名配置里：

::: warning 插件开发者注意
如果一个插件的名字为`picgo-plugin-xxx`，那么它的配置信息应当放置在`picgo-plugin-xxx`里。这将有助于PicGo的electron版本进行配置。
:::

示例：

```json
"picgo-plugin-xxx": {
  "config1": "",
  "config2": ""
}
```

