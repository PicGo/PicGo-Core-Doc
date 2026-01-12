# 配置文件

picgo 需要配置文件来启动。当你未指定配置文件的时候，picgo 将会使用默认配置文件来启动。

## 默认配置文件

picgo 的默认配置文件为`~/.picgo/config.json`。其中`~`为用户目录。不同系统的用户目录不太一样。

linux 和 macOS 均为`~/.picgo/config.json`。

windows 则为`C:\Users\你的用户名\.picgo\config.json`。

### 自动生成

**通常来说你只需要配置 `Uploader` 即可，所以你可以通过 `picgo set uploader` 来进入交互式命令行，配置成功后会自动生成配置文件，无需复制粘贴！其他更多的命令可以参考 [CLI 命令](/zh/guide/commands) 一章。**

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

SMMS 图床的相关配置。注册并登录 [smms](https://sm.ms/home/apitoken) 获取 `token`。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#smms) 进行配置。

默认值如下：

```json
{
  "token": "" // 注册后获取的 api token
}
```

### picBed.qiniu

七牛图床的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#七牛图床)进行配置。

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

又拍云的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#又拍云)进行配置。

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

腾讯云 COS 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#腾讯云 cos) 进行配置。

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

GitHub 图床的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#github 图床)进行配置。

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

阿里云 OSS 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#阿里云 oss) 进行配置。

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

Imgur 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#imgur 图床)进行配置。

默认值如下：

```json
{
  "clientId": "", // imgur 的 clientId
  "proxy": "" // 代理地址，仅支持 http 代理
}
```

### picBed.proxy

自定义代理配置，picgo 内部使用 `request` 进行图片上传等网络请求，`picBed.proxy` 将会被用作 [request 的 proxy 配置](https://github.com/request/request#proxies)，目前只支持 HTTP 代理。 默认为空表示不设置代理。

示例：

```json
{
  "proxy": "http://127.0.0.1:1081",
}
```

## uploader <Badge text="1.8.0+" />

PicGo 支持为同一种 uploader 保存多份“命名配置”。

数据的唯一来源（SSOT）存放在 `uploader.<type>`：

- `uploader.<type>.configList`: 配置列表数组。
- `uploader.<type>.defaultId`: 当前启用配置的 `_id`。

`configList` 中每一项都会包含一些元信息字段：

- `_id`（UUID v4）
- `_configName`（同一 uploader 类型下唯一；比较时大小写不敏感）
- `_createdAt` / `_updatedAt`（时间戳）

为了兼容插件生态，`picBed.<type>` 会作为当前启用配置的**只读镜像**，切换配置时会被覆盖更新。

::: tip 迁移说明
如果你以前是通过 `picBed.<type>` 配置 uploader，PicGo 会在启动时自动迁移到新结构。
:::

示例：

```json
{
  "uploader": {
    "github": {
      "defaultId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "configList": [
        {
          "_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "_configName": "Work",
          "_createdAt": 1700000000000,
          "_updatedAt": 1700000000000,
          "repo": "user/repo",
          "token": "******"
        }
      ]
    }
  }
}
```

管理/切换配置请参考 [CLI 命令](/zh/guide/commands)（`picgo use uploader ...`、`picgo uploader ...`），或使用 Node.js API（`ctx.uploaderConfig`）。

## picgoPlugins

这个配置项将会将所有插件名放置进去。主要用于判断插件是否被启用或者禁用。 **picgo 自动生成，不需要配置！**

示例：

```json
{
  "picgo-plugin-xxx": true, // 该插件被启用
  "picgo-plugin-yyy": false // 该插件被禁用
}
```

## settings

一些与具体 uploader/transformer/plugin 无关的通用设置。

### settings.urlRewrite.rules <Badge text="1.8.1+" />

可选的 URL 重写规则。配置后，PicGo 会在 **Uploader 执行结束之后**、**afterUploadPlugins 执行之前** 对上传结果中的 `imgUrl` 做 URL rewrite。

- type: Array\<Rule\>
- default: 未配置（不执行 rewrite；不会输出警告）

每条规则支持：

- `match` (string, required): JavaScript `RegExp` 的源字符串（不需要写两侧的 `/`）。
- `replace` (string, required): 替换字符串（支持 `$1`、`$2`... 分组引用）。
- `enable` (boolean, optional): 默认 `true`；只有显式设置为 `false` 才会禁用该规则。
- `global` (boolean, optional): 对应正则的 `g` flag；默认 `false`。
- `ignoreCase` (boolean, optional): 对应正则的 `i` flag；默认 `false`。

行为说明：

- 规则按数组顺序依次匹配；对每张图片只应用第一条命中的启用规则（First Match Wins）。
- 如果 rewrite 导致 `imgUrl` 发生变化，会把原始 URL 保存到 `originImgUrl`（只会设置一次，不会被覆盖）。
- `match` 无法编译成正则时会输出 error 并跳过该规则，上传流程不会失败。
- rewrite 结果为空字符串时会输出 warning，但仍会继续。

#### 对插件开发者 / Node.js 调用方的影响

- `afterUploadPlugins` 拿到的 `ctx.output` 里 `imgUrl` 已经是 **重写后的** 值；如需上传器产出的原始 URL，请读取 `originImgUrl`。
- Node.js API `picgo.upload()` 返回的 `IImgInfo[]` 里 `imgUrl` 也是 **重写后的** 值；如需重写前的值，请读取 `originImgUrl`。
- 只有当 PicGo 实际发生 URL 重写时才会设置 `originImgUrl`；否则它会保持为 `undefined`。

#### 示例

示例（简单前缀替换 / 切换到 CDN）：

把：

- `https://example.com/images/2026/1.png`
- 重写为 `https://cdn.example.com/blog-images/2026/1.png`

```json
{
  "settings": {
    "urlRewrite": {
      "rules": [
        {
          "match": "https://example.com/images/",
          "replace": "https://cdn.example.com/blog-images/"
        }
      ]
    }
  }
}
```

示例（忽略大小写：统一扩展名）：

把：

- `https://cdn.example.com/blog-images/2026/1.PNG`
- 重写为 `https://cdn.example.com/blog-images/2026/1.png`

```json
{
  "settings": {
    "urlRewrite": {
      "rules": [
        {
          "match": "PNG",
          "replace": "png",
          "ignoreCase": true
        }
      ]
    }
  }
}
```

示例（global：替换 URL 中所有下划线）：

把：

- `https://cdn.example.com/blog_images/2026/hello_world.png`
- 重写为 `https://cdn.example.com/blog-images/2026/hello-world.png`

```json
{
  "settings": {
    "urlRewrite": {
      "rules": [
        {
          "match": "_",
          "replace": "-",
          "global": true
        }
      ]
    }
  }
}
```

::: tip 正则与转义
`match` 是 JavaScript 正则表达式的源字符串。进阶用法中你可能需要在 JSON 字符串里转义反斜杠，例如要匹配 `.` 需要写成 `\\.`。
:::

进阶：分组引用（`$1`、`$2`...）

把：

- `https://example.com/images/2026/1.png`
- 重写为 `https://cdn.example.com/blog-images/2026/1.png`

如果 `match` 里用括号捕获了 URL 的某一段，就可以在 `replace` 里用 `$1`、`$2`... 引用（例如 `$1` 表示第 1 个分组，`$2` 表示第 2 个分组）。
在下面这个例子里，`$1` 会捕获到 `images`，`$2` 会捕获剩余路径（`2026/1.png`）：

```json
{
  "settings": {
    "urlRewrite": {
      "rules": [
        {
          "match": "^https://example\\.com/(images)/(.*)$",
          "replace": "https://cdn.example.com/blog-$1/$2"
        }
      ]
    }
  }
}
```

进阶示例（把 GitHub raw URL 重写为 jsDelivr）：

把：

- `https://raw.githubusercontent.com/user/repo/main/path/to/1.png`
- 重写为 `https://cdn.jsdelivr.net/gh/user/repo@main/path/to/1.png`

```json
{
  "settings": {
    "urlRewrite": {
      "rules": [
        {
          "match": "^https://raw\\.githubusercontent\\.com/([^/]+)/([^/]+)/([^/]+)/(.*)$",
          "replace": "https://cdn.jsdelivr.net/gh/$1/$2@$3/$4"
        }
      ]
    }
  }
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
