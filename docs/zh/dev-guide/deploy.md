## 插件发布

为了让一个插件能够被其它人使用，你必须遵循`picgo-plugin-<name>`的命名约定将其发布到npm上。插件遵循命名约定之后就可以：

- 被其他用户搜索到。
- 通过`picgo install <name>`或者`picgo add <name>`来安装。

PicGo的官方插件，你可以在PicGo的[GitHub主页](https://github.com/PicGo)找到。

### GUI插件

![](https://user-images.githubusercontent.com/12621342/50515434-bc9e8180-0adf-11e9-8c71-0e39973c06b1.png)

如果你想要你的插件在[PicGo](https://github.com/Molunerfinn/PicGo)软件上显示出图标、简介等信息，请遵循以下要求：

- 在npm包的根目录里放置一张`logo.png`
- 在`package.json`里增加`description`字段用于介绍你的插件以及`homepage`字段用于指向你的插件的主页地址。
- 在`package.json`里添加`gui`字段用于告诉用于你的插件可以用于PicGo软件界面显示和使用。

示例：

```json
{
  "description": "This is a picgo plugin",
  "homepage": "https://github.com/XXX/XXX#readme",
  "gui": true
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