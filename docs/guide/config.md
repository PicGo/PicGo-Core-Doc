# Configuration

PicGo requires a configuration file to run. If you don’t specify one, PicGo will start with the default config file.

## Default config file

The default config file is `~/.picgo/config.json`, where `~` is your home directory.

- Linux and macOS: `~/.picgo/config.json`
- Windows: `C:\Users\<your-username>\.picgo\config.json`

### Generate automatically

**In most cases you only need to configure an `Uploader`, so you can run `picgo set uploader` to enter the interactive prompt. After configuration succeeds, PicGo will generate the config file automatically—no copying/pasting required. For more commands, see [CLI Commands](/guide/commands).**

::: warning Note
After configuring your image host, don’t forget to select the uploader you want to use via `picgo use uploader`.
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

### Create manually

If you want to create the config file manually, you need to create the directory and JSON file yourself, and at minimum include the following fields (this is why the CLI-generated config is recommended):

```json
{
  "picBed": {
    "uploader": "smms", // the default image host is SM.MS
    "smms": {
      "token": "" // token from https://sm.ms/home/apitoken
    }
  },
  "picgoPlugins": {} // reserved for plugins
}
```

## picBed

As PicGo’s most important configuration section, `picBed` contains the currently selected image host and the configuration for all image hosts.

::: warning Plugin authors
If an Uploader is named `xxx`, its configuration should be placed under `picBed.xxx`. This is important for the PicGo Electron app to render configuration UI.
:::

### picBed.uploader

- type: string
- default: `smms`

Indicates which image host is currently selected. The default is `smms`.

### picBed.current

Same purpose as `picBed.uploader`. This exists mainly for compatibility with the PicGo Electron app and may be removed in the future.

### picBed.smms <Badge text="1.4.7+" />

Configuration for the SM.MS image host. Register and log in to [SM.MS](https://sm.ms/home/apitoken) to get a `token`. You can also refer to PicGo’s [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config#smms).

Defaults:

```json
{
  "token": "" // API token obtained after registration
}
```

### picBed.qiniu

Configuration for the Qiniu image host. Refer to PicGo’s [wiki](https://picgo.github.io/PicGo-Doc/guide/config#qiuniu-image-host).

Defaults:

```json
{
  "accessKey": "",
  "secretKey": "",
  "bucket": "", // bucket name
  "url": "", // custom domain
  "area": "z0" | "z1" | "z2" | "na0" | "as0", // region code
  "options": "", // URL suffix, e.g. ?imgslim
  "path": "" // custom storage path, e.g. img/
}
```

### picBed.upyun

Configuration for UpYun. Refer to PicGo’s [wiki](https://picgo.github.io/PicGo-Doc/guide/config#upyun-cloud).

Defaults:

```json
{
  "bucket": "", // bucket name / service name
  "operator": "", // operator
  "password": "", // password
  "options": "", // image processing options
  "path": "", // custom storage path, e.g. img/
  "url": "" // CDN domain, must include http:// or https://
}
```

### picBed.tcyun

Configuration for Tencent Cloud COS. Refer to PicGo’s [wiki](https://picgo.github.io/PicGo-Doc/guide/config#tencent-cloud-cos).

Defaults:

```json
{
  "secretId": "",
  "secretKey": "",
  "bucket": "", // bucket name (differs between v4 and v5)
  "appId": "",
  "area": "", // region, e.g. ap-beijing-1
  "path": "", // custom storage path, e.g. img/
  "customUrl": "", // custom domain, must include http:// or https://
  "version": "v5" | "v4" // COS version: v4 or v5
}
```

### picBed.github

Configuration for using GitHub as an image host. Refer to PicGo’s [wiki](https://picgo.github.io/PicGo-Doc/guide/config#github-image-host).

Defaults:

```json
{
  "repo": "", // repo in the form username/reponame
  "token": "", // github token
  "path": "", // custom storage path, e.g. img/
  "customUrl": "", // custom domain, must include http:// or https://
  "branch": "" // branch name, default is main
}
```

### picBed.aliyun

Configuration for Alibaba Cloud OSS. Refer to PicGo’s [wiki](https://picgo.github.io/PicGo-Doc/guide/config#aliyun-oss).

Defaults:

```json
{
  "accessKeyId": "",
  "accessKeySecret": "",
  "bucket": "", // bucket name
  "area": "", // region code
  "path": "", // custom storage path
  "customUrl": "", // custom domain, must include http:// or https://
  "options": "" // image processing options (PicGo 2.2.0+ / PicGo-Core 1.4.0+)
}
```

### picBed.imgur

Configuration for Imgur. Refer to PicGo’s [wiki](https://picgo.github.io/PicGo-Doc/guide/config#imgur-image-host).

Defaults:

```json
{
  "clientId": "", // Imgur clientId
  "proxy": "" // proxy address (HTTP proxy only)
}
```

### picBed.proxy

Custom proxy configuration. PicGo uses `request` for network requests (image uploading, etc.). `picBed.proxy` is used as [request’s proxy option](https://github.com/request/request#proxies). Only HTTP proxies are supported. An empty value means no proxy.

Example:

```json
{
  "proxy": "http://127.0.0.1:1081",
}
```

## picgoPlugins

This section stores all plugin names and is mainly used to determine whether a plugin is enabled or disabled. **It is generated by PicGo automatically—you don’t need to edit it.**

Example:

```json
{
  "picgo-plugin-xxx": true, // enabled
  "picgo-plugin-yyy": false // disabled
}
```

## transformer

This section stores configuration for Transformers provided by third-party plugins.

::: warning Plugin authors
If a Transformer is named `xxx`, its configuration should be placed under `transformer.xxx`. This helps the PicGo Electron app render its UI.
:::

Default: `{}`

## picgo-plugin-*

If you develop a PicGo plugin and it requires configuration, you should place the plugin configuration at the top level, under a key that matches the plugin package name:

Example:

```json
"picgo-plugin-xxx": {
  "config1": "",
  "config2": ""
}
```
