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

## uploader <Badge text="1.8.0+" />

PicGo supports multiple named configurations per uploader type.

The source of truth is stored under `uploader.<type>`:

- `uploader.<type>.configList`: an array of configs.
- `uploader.<type>.defaultId`: the `_id` of the active config.

Each item in `configList` includes metadata fields:

- `_id` (UUID v4)
- `_configName` (unique within the same uploader type, case-insensitive)
- `_createdAt` / `_updatedAt` (timestamps)

For plugin compatibility, `picBed.<type>` is a **read-only mirror** of the active config and will be overwritten when you switch configs.

::: tip Migration
If you previously configured an uploader under `picBed.<type>`, PicGo migrates it automatically on startup.
:::

Example:

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

To manage or switch configs, see [CLI Commands](/guide/commands) (`picgo use uploader ...`, `picgo uploader ...`) or use the Node.js API (`ctx.uploaderConfig`).

## picgoPlugins

This section stores all plugin names and is mainly used to determine whether a plugin is enabled or disabled. **It is generated by PicGo automatically—you don’t need to edit it.**

Example:

```json
{
  "picgo-plugin-xxx": true, // enabled
  "picgo-plugin-yyy": false // disabled
}
```

## settings

General settings not tied to a specific uploader/transformer/plugin.

### settings.urlRewrite.rules <Badge text="1.8.1+" />

Opt-in URL rewrite rules. When configured, PicGo applies URL rewrite **after uploader execution** and **before `afterUploadPlugins`**.

- type: Array\<Rule\>
- default: not set (no rewrite; no warnings)

Each rule supports:

- `match` (string, required): JavaScript `RegExp` source (no surrounding `/`).
- `replace` (string, required): Replacement string (supports `$1`, `$2`, ...).
- `enable` (boolean, optional): defaults to `true`; only explicit `false` disables the rule.
- `global` (boolean, optional): maps to the regex `g` flag; defaults to `false`.
- `ignoreCase` (boolean, optional): maps to the regex `i` flag; defaults to `false`.

Behavior:

- Rules are evaluated in array order; **first enabled match wins** (only one rule is applied per image).
- If rewrite changes `imgUrl`, PicGo stores the original URL in `originImgUrl` (set once and never overwritten).
- Invalid regex patterns are logged and skipped without failing the upload.
- If a rewrite produces an empty string, PicGo logs a warning and continues.

#### For plugin authors and Node.js users

- `afterUploadPlugins` will see the **rewritten** `imgUrl` in `ctx.output`; use `originImgUrl` to access the original URL produced by the uploader.
- `picgo.upload()` (Node.js API) returns `IImgInfo[]` with the **rewritten** `imgUrl`; use `originImgUrl` if you need the pre-rewrite value.
- `originImgUrl` is only set when PicGo actually rewrites the URL; otherwise it stays `undefined`.

#### Examples

Example (simple prefix rewrite / switch to CDN):

Rewrite:

- `https://example.com/images/2026/1.png`
- → `https://cdn.example.com/blog-images/2026/1.png`

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

Example (ignore case: normalize file extension):

Rewrite:

- `https://cdn.example.com/blog-images/2026/1.PNG`
- → `https://cdn.example.com/blog-images/2026/1.png`

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

Example (global: replace all underscores in the URL):

Rewrite:

- `https://cdn.example.com/blog_images/2026/hello_world.png`
- → `https://cdn.example.com/blog-images/2026/hello-world.png`

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

::: tip Regex and escaping
`match` is a JavaScript regular expression source. For advanced patterns you may need to escape backslashes in JSON strings, e.g. `\\.` for a literal dot.
:::

Advanced: capture groups (`$1`, `$2`, ...)

Rewrite:

- `https://example.com/images/2026/1.png`
- → `https://cdn.example.com/blog-images/2026/1.png`

If your `match` uses parentheses to capture parts of the URL, you can reference them in `replace` (e.g. `$1` for the first group, `$2` for the second).
In this example, `$1` is the captured `images`, and `$2` is the rest of the path (`2026/1.png`):

```json
{
  "settings": {
    "urlRewrite": {
      "rules": [
        {
          "match": "^https://example.com/(images)/(.*)$",
          "replace": "https://cdn.example.com/blog-$1/$2"
        }
      ]
    }
  }
}
```

Advanced example (rewrite GitHub raw URLs to jsDelivr):

Rewrite:

- `https://raw.githubusercontent.com/user/repo/main/path/to/1.png`
- → `https://cdn.jsdelivr.net/gh/user/repo@main/path/to/1.png`

```json
{
  "settings": {
    "urlRewrite": {
      "rules": [
        {
          "match": "^https://raw.githubusercontent.com/([^/]+)/([^/]+)/([^/]+)/(.*)$",
          "replace": "https://cdn.jsdelivr.net/gh/$1/$2@$3/$4"
        }
      ]
    }
  }
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
