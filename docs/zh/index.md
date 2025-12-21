---
layout: home
hero:
  name: PicGo-Core
  text: 最佳图片上传引擎
  tagline: 通过 CLI 或 API，将图片上传无缝集成到你的构建脚本、编辑器或任何 Node.js 工作流中。
  image:
    src: https://pic.molunerfinn.com/picgo/docs/picgo-logo.png
    alt: PicGo-Core Logo
    width: 256
  actions:
    - theme: brand
      text: 指南
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/PicGo/PicGo-Core
    - theme: alt
      text: PicGo Homepage
      link: https://picgo.app
features:
  - title: 命令行自动化
    details: 一行命令即可上传图片并获取链接。完美集成到你的 Shell 脚本或 CI/CD 流程中。
  - title: 极速集成 SDK
    details: 不想处理复杂的鉴权和上传逻辑？引入 PicGo-Core，让你的 Node.js 应用瞬间拥有图床能力。
  - title: 无限扩展生态
    details: 基于强大的插件系统，你可以自定义上传前后的压缩、水印等图片处理，或对接任何私有图床。
footer: MIT Licensed | Copyright © 2018 - Now Molunerfinn
---

```bash
# 通过 CLI 上传一张图片
npx picgo upload /path/to/image.png
```

```js
// 无缝集成你的 Node.js 工作流
const { PicGo } = require('picgo')
const picgo = new PicGo()

// 上传一张图片，只需一行代码
picgo.upload(['/path/to/image.png'])
```