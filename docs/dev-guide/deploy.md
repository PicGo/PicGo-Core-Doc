
# 插件测试与发布

## 插件测试

### 普通插件

首先确保你全局安装了`picgo`：

```bash
yarn global add picgo

# or

npm install picgo -g
```

**然后运行一下`picgo -h`看看是否安装成功。（这步是必须的，因为第一次安装需要先运行一下，然后picgo会创建默认的配置文件和生成package.json等初始化操作）**

然后将你所写的插件的文件夹放到picgo[默认的配置文件](/guide/config#%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)所在的目录里。**注意插件文件夹名字必须以`picgo-plugin-`作为前缀，否则安装的时候picgo将不会读取。**

然后在picgo默认配置文件所在的目录下，输入：

```bash
npm install ./picgo-plugin-<your-plugin-name>
```

这样就能将你的插件安装到picgo所在的配置文件夹内，picgo在运行的时候也能读取了。之后可以根据你的开发需要，修改你的插件内容，并运行picgo相应的命令查看效果和测试。

### GUI插件

如果你想要开发一个GUI插件，那么你首先要去下载一下[PicGo](https://github.com/Molunerfinn/PicGo/releases)并安装。安装完毕后请打开软件，第一次运行将初始化配置。

**如果你使用 PicGo 2.3.0+ 版本，可以直接使用插件导入功能，选择你所开发的picgo插件目录即可：**

![](https://pic.molunerfinn.com/picgo/docs/202108282004729.png)

否则参考如下：

electron版的PicGo配置文件的路径在不同的系统里是不同的：

- Windows: `%APPDATA%\picgo\data.json`
- Linux: `$XDG_CONFIG_HOME/picgo/data.json` or `~/.config/picgo/data.json`
- macOS: `~/Library/Application\ Support/picgo/data.json`

举例，在windows里你可以在：

`C:\Users\你的用户名\AppData\Roaming\picgo\data.json`找到它。

在linux里你可以在：

`~/.config/picgo/data.json`里找到它。

macOS同理。

此时你的插件目录比如在 `/usr/home/picgo-plugin-<your-plugin-name>`里，

在PicGo默认配置文件所在的目录下，输入：

```bash
npm install /usr/home/picgo-plugin-<your-plugin-name>
```

这样就能将你的插件安装到PicGo所在的配置文件夹内，PicGo在运行的时候也能读取了。

::: warning 注意
GUI插件的任何修改都需要 **重启** PicGo才能生效，重启不代表关闭主窗口再重新打开，而是 **完全退出** 整个PicGo的进程，然后再打开PicGo才能看到效果。主要原因是底层依赖了Node.js的`require`来加载插件，所以有运行时的缓存。PicGo在 `2.0.2` 版本开始，可以通过右键菜单栏图标或者Mini窗口找到「重启应用」的按钮来快速重启应用。
:::

## 插件发布

为了让一个插件能够被其它人使用，你必须遵循`picgo-plugin-<name>`的命名约定将其发布到npm上。插件遵循命名约定之后就可以：

- 被其他用户搜索到。
- 通过`picgo install <name>`或者`picgo add <name>`来安装。

比如你发布了一个叫做`picgo-plugin-wow`的插件，那么用户可以通过`picgo install wow`来安装。

PicGo的官方插件，你可以在PicGo的[GitHub主页](https://github.com/PicGo)找到。

### GUI插件

如果你的插件不是专门针对GUI进行优化的（比如添加了guiMenu等），那么在electron版本的PicGo上安装的时候会有如下提示信息：

![](https://pic.molunerfinn.com/picgo/docs/5c39ce32045a7.png)

并且如果未对GUI进行优化的插件，会在右上角显示一个`CLI`的标志：

![](https://pic.molunerfinn.com/picgo/docs/5c39ce678a412.png)

如果你想要你的插件在[PicGo](https://github.com/Molunerfinn/PicGo)软件上显示出图标、简介等信息，请遵循以下要求：

- 在npm包的根目录里放置一张`logo.png`，否则将会显示`PicGo`的默认LOGO。
- 在`package.json`里增加`description`字段用于介绍你的插件以及`homepage`字段用于指向你的插件的主页地址。
- 在`package.json`的`keywords`里添加`"picgo-gui-plugin"`用于告诉用户你的插件已经针对PicGo软件进行了优化。

示例：

```json
{
  "description": "This is a picgo plugin",
  "homepage": "https://github.com/XXX/XXX#readme",
  "keywords": [
    "picgo-gui-plugin"
  ]
}
```

- 如果你有`Uploader`或者`Transformer`，你需要将它们在插件的主入口文件中指明出来，以便PicGo能定位到它们：

示例：

```js
const register = () => {
  ctx.helper.uploader.register('temp', {
    handle (ctx) {
      // ...
    },
    config (ctx) {
      // ...
    }
  })

  ctx.helper.transformer.register('temp', {
    handle (ctx) {
      // ...
    },
    config (ctx) {
      // ...
    }
  })
}

module.exports = {
  return {
    register,
    uploader: 'temp', // <- 指明你的Uploader的name
    transformer: 'temp' // <- 指明你的Transformer的name
  }
}
```

### 提交Awesome-PicGo

为了让你的插件可以被更多人知道，在你发布完插件之后，可以向[Awesome-PicGo](https://github.com/PicGo/Awesome-PicGo)项目提交一份PR，把你的优秀项目添加到Awesome-list里！

注意添加之前看看[CONTRIBUTING](https://github.com/PicGo/Awesome-PicGo/blob/master/CONTRIBUTING.md)是否符合添加要求
