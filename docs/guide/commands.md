# CLI Commands

PicGo can be used directly from the command line. After installing `picgo` globally, run `picgo -h` to see all available commands:

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

::: tip Tip
Options wrapped in `<>` are required, and options wrapped in `[]` are optional.
Some commands have aliases—for example, `picgo upload` can be shortened to `picgo u`.
:::

The CLI is built with [commander.js](https://github.com/tj/commander.js/) and [inquirer.js](https://github.com/SBoudrias/Inquirer.js/). Below is a walkthrough of the commands and how to use them.

## use

> Select a PicGo module. There are three kinds of modules: 1) transformer 2) uploader 3) plugins

```bash
$ picgo use -h

  Usage: use [module]

  use modules of picgo
```

PicGo ships with the following built-ins:

- transformer:
  - path
  - base64
- uploader:
  - smms -> SM.MS
  - tcyun -> Tencent Cloud COS
  - upyun -> UpYun
  - aliyun -> Alibaba Cloud OSS
  - qiniu -> Qiniu Cloud
  - imgur -> Imgur
  - github -> GitHub

::: tip Tip
In most CLI workflows, you only need to select `path` as the PicGo `transformer`.
:::

Use `picgo use` or `picgo use uploader|transformer|plugins` to pick the module you want. This opens an interactive prompt:

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

After you choose, PicGo will upload using the selected module. Some modules need configuration before you can use them (for example, tokens/keys for an image host). In that case, use `set|config` (described below) to configure the module.

## config|set

> Configure module settings. There are three kinds of modules: 1) transformer 2) uploader 3) plugins

```bash
$ picgo set -h

  Usage: set|config [options] <module> [name]

  configure config of picgo modules

  Options:

    -h, --help  output usage information
```

::: tip Tip
Most of the time you only need to configure an Uploader. You can run `picgo set uploader` (or `picgo set uploader weibo|tcyun|...`) to jump straight into the interactive prompt.
:::

For the detailed configuration fields of built-in uploaders (image hosts), refer to PicGo’s configuration [wiki](https://github.com/Molunerfinn/PicGo/wiki/%E8%AF%A6%E7%BB%86%E7%AA%97%E5%8F%A3%E7%9A%84%E4%BD%BF%E7%94%A8)。

If an uploader/transformer/plugin has no configurable options, PicGo will still report success—this is expected.

```bash
$ picgo set transformer path
[PicGo SUCCESS]: Configure config successfully!
```

## upload|u

> Upload images to an image host. Typically you upload local files (multiple files separated by spaces). You can also upload the first image from your clipboard.

::: tip Tip
Before uploading, make sure you’ve selected the right module with `use` and configured the target image host with `set`.
:::

```bash
$ picgo u ./Test-example.jpg ./test-qiniu.png
[PicGo INFO]: Before transform
[PicGo INFO]: Transforming...
[PicGo INFO]: Before upload
[PicGo INFO]: Uploading...
[PicGo SUCCESS]:
https://i.loli.net/2018/09/06/5b9134645b9df.jpg
https://i.loli.net/2018/09/06/5b9134651af34.png
```

If you don’t provide any input files, PicGo uploads the first image from your clipboard (due to cross-platform limitations it will be converted to PNG). This is especially handy for uploading screenshots.

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

> Install PicGo plugins from npm. Plugin packages are named with the `picgo-plugin-` prefix. When installing/uninstalling/updating, you only need to provide the short name (without the `picgo-plugin-` prefix). You can install multiple plugins by separating them with spaces.

::: tip Tip
PicGo installs plugins into the directory where your config file lives. With the default config under `~/.picgo/`, plugins will be installed into `~/.picgo/node_modules/`.
:::

You can search for PicGo [plugins](https://www.npmjs.com/search?q=picgo-plugin-) on npm. Plugins follow the naming pattern `picgo-plugin-[name]`, and can be installed with:

```bash
picgo install [name]
```
After installing, you can use `picgo ch plugins` to enable or disable the plugin.

## uninstall|rm

> Uninstall a PicGo plugin. PicGo will throw an error if the plugin is not installed.

```bash
picgo uninstall [name]
```

## update

> Update an installed PicGo plugin. PicGo will throw an error if the plugin is not installed.

```bash
picgo update [name]
```

## init

> Download and generate a PicGo plugin development template.

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

Similar to `vue-cli`’s `init`, PicGo provides an official template: [picgo-template-plugin](https://github.com/PicGo/picgo-template-plugin). When running `init`, you can use `plugin` as the template name. Internally, if the template is not in `username/repo` form, PicGo automatically prefixes it with `PicGo/picgo-template-`.

This command helps you bootstrap a PicGo plugin quickly. For details, see [Plugin Development](/dev-guide/cli).

## i18n

> Switch PicGo’s UI language. Supported languages:

- zh-CN (default)
- zh-TW
- en

Example:

```bash
picgo i18n en
```

## -v, --version

Run `picgo -v` or `picgo --version` to print the current PicGo version.

## -d, --debug

Add `-d` or `--debug` to any valid command to enter debug mode. PicGo will print more detailed error information, including where the error occurred.

## -c, --config

Add `-c <path>` to specify the PicGo config file path. The default config file is `~/.picgo/config.json`.

::: tip Tip
PicGo loads plugins from the `node_modules` directory next to the config file.
:::

## -s, --silent

Add `-s` or `--silent` to any valid command to enter silent mode. PicGo will output nothing except error messages.
