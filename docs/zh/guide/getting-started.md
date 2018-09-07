# 快速上手

::: warning 注意
请确保你的 Node.js 版本 >= 8。
:::

::: tip 提示
默认通过路径上传图片，默认上传图床为[SM.MS](https://sm.ms/)。
:::

## 全局安装

> 使用CLI部分

```bash
# 安装
yarn global add picgo # 或者 npm install picgo -g

# 上传图片
picgo upload /xxx/xxx.jpg
```

## 现有项目

> 使用API部分

```bash
yarn add picgo -D # 或者 npm intall picgo -D
```
创建一个js文件（例如picgo.js）：
```js
const PicGo = require('picgo')
const picgo = new PicGo() // 将使用默认的配置文件：~/.picgo/config.json

// 上传图片
picgo.upload(['/xxx/xxx.jpg'])
```
运行js：

```sh
node picgo.js
```
