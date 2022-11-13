(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{287:function(s,t,a){"use strict";a.r(t);var n=a(14),r=Object(n.a)({},function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"配置文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#配置文件","aria-hidden":"true"}},[s._v("#")]),s._v(" 配置文件")]),s._v(" "),t("p",[s._v("picgo 需要配置文件来启动。当你未指定配置文件的时候，picgo 将会使用默认配置文件来启动。")]),s._v(" "),t("h2",{attrs:{id:"默认配置文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#默认配置文件","aria-hidden":"true"}},[s._v("#")]),s._v(" 默认配置文件")]),s._v(" "),t("p",[s._v("picgo 的默认配置文件为"),t("code",[s._v("~/.picgo/config.json")]),s._v("。其中"),t("code",[s._v("~")]),s._v("为用户目录。不同系统的用户目录不太一样。")]),s._v(" "),t("p",[s._v("linux 和 macOS 均为"),t("code",[s._v("~/.picgo/config.json")]),s._v("。")]),s._v(" "),t("p",[s._v("windows 则为"),t("code",[s._v("C:\\Users\\你的用户名\\.picgo\\config.json")]),s._v("。")]),s._v(" "),t("h3",{attrs:{id:"自动生成"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#自动生成","aria-hidden":"true"}},[s._v("#")]),s._v(" 自动生成")]),s._v(" "),t("p",[t("strong",[s._v("通常来说你只需要配置 "),t("code",[s._v("Uploader")]),s._v(" 即可，所以你可以通过 "),t("code",[s._v("picgo set uploader")]),s._v(" 来进入交互式命令行，配置成功后会自动生成配置文件，无需复制粘贴！其他更多的命令可以参考 "),t("RouterLink",{attrs:{to:"/zh/guide/commands.html"}},[s._v("CLI 命令")]),s._v(" 一章。")],1)]),s._v(" "),t("div",{staticClass:"custom-block warning"},[t("p",{staticClass:"custom-block-title"},[s._v("注意")]),s._v(" "),t("p",[s._v("同时，填好图床配置之后，请务必通过 "),t("code",[s._v("picgo use uploader")]),s._v(" 选择当前要使用的 "),t("code",[s._v("Uploader")]),s._v("。")])]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("$ picgo "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("set")]),s._v(" uploader\n? Choose a"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" uploader "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Use arrow keys"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n  smms\n❯ tcyun\n  github\n  qiniu\n  imgur\n  aliyun\n  upyun\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Move up and down to reveal "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("more")]),s._v(" choices"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br")])]),t("h3",{attrs:{id:"手动生成"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#手动生成","aria-hidden":"true"}},[s._v("#")]),s._v(" 手动生成")]),s._v(" "),t("p",[s._v("如果你要手动生成配置文件，需要自己创建对应的目录、JSON 文件以及至少有如下的配置项（因此还是推荐通过命令行自动生成配置文件）：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"picBed"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"uploader"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"smms"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 代表当前的默认上传图床为 SM.MS,")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"smms"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"token"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 从 https://sm.ms/home/apitoken 获取的 token")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"picgoPlugins"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 为插件预留")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br")])]),t("h2",{attrs:{id:"picbed"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed")]),s._v(" "),t("p",[s._v("作为 picgo 最主要的配置项，picBed 里包括了当前上传图床，以及所有上传图床的配置。")]),s._v(" "),t("div",{staticClass:"custom-block warning"},[t("p",{staticClass:"custom-block-title"},[s._v("插件开发者注意")]),s._v(" "),t("p",[s._v("如果一个 Uploader 的名字为"),t("code",[s._v("xxx")]),s._v("，那么它的配置信息会放置在"),t("code",[s._v("picBed.xxx")]),s._v("里。这个将有助于 PicGo 的 electron 版本进行配置。")])]),s._v(" "),t("h3",{attrs:{id:"picbed-uploader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-uploader","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.uploader")]),s._v(" "),t("ul",[t("li",[s._v("type: string")]),s._v(" "),t("li",[s._v("default: "),t("code",[s._v("smms")])])]),s._v(" "),t("p",[s._v("表明当前的上传图床是哪个。默认值是"),t("code",[s._v("smms")]),s._v("。")]),s._v(" "),t("h3",{attrs:{id:"picbed-current"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-current","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.current")]),s._v(" "),t("p",[s._v("作用与"),t("code",[s._v("picBed.uploader")]),s._v("一致，主要是为了兼容 PicGo 的 electron 版本而留下的配置。未来有可能抛弃。")]),s._v(" "),t("h3",{attrs:{id:"picbed-smms"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-smms","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.smms "),t("Badge",{attrs:{text:"1.4.7+"}})],1),s._v(" "),t("p",[s._v("SMMS 图床的相关配置。注册并登录 "),t("a",{attrs:{href:"https://sm.ms/home/apitoken",target:"_blank",rel:"noopener noreferrer"}},[s._v("smms"),t("OutboundLink")],1),s._v(" 获取 "),t("code",[s._v("token")]),s._v("。可以查看 PicGo 的 "),t("a",{attrs:{href:"https://picgo.github.io/PicGo-Doc/zh/guide/config.html#smms",target:"_blank",rel:"noopener noreferrer"}},[s._v("wiki"),t("OutboundLink")],1),s._v(" 进行配置。")]),s._v(" "),t("p",[s._v("默认值如下：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"token"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 注册后获取的 api token")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("h3",{attrs:{id:"picbed-qiniu"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-qiniu","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.qiniu")]),s._v(" "),t("p",[s._v("七牛图床的相关配置。可以查看 PicGo 的 "),t("a",{attrs:{href:"https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E4%B8%83%E7%89%9B%E5%9B%BE%E5%BA%8A",target:"_blank",rel:"noopener noreferrer"}},[s._v("wiki"),t("OutboundLink")],1),s._v("进行配置。")]),s._v(" "),t("p",[s._v("默认值如下：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"accessKey"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"secretKey"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"bucket"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 存储空间名")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"url"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义域名")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"area"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"z0"')]),s._v(" | "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"z1"')]),s._v(" | "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"z2"')]),s._v(" | "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"na0"')]),s._v(" | "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"as0"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 存储区域编号")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"options"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 网址后缀，比如？imgslim")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"path"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义存储路径，比如 img/")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br")])]),t("h3",{attrs:{id:"picbed-upyun"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-upyun","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.upyun")]),s._v(" "),t("p",[s._v("又拍云的相关配置。可以查看 PicGo 的 "),t("a",{attrs:{href:"https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E5%8F%88%E6%8B%8D%E4%BA%91",target:"_blank",rel:"noopener noreferrer"}},[s._v("wiki"),t("OutboundLink")],1),s._v("进行配置。")]),s._v(" "),t("p",[s._v("默认值如下：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"bucket"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 存储空间名，及你的服务名")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"operator"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 操作员")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"password"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 密码")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"options"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 针对图片的一些后缀处理参数")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"path"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义存储路径，比如 img/")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"url"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 加速域名，注意要加 http://或者 https://")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br")])]),t("h3",{attrs:{id:"picbed-tcyun"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-tcyun","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.tcyun")]),s._v(" "),t("p",[s._v("腾讯云 COS 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#腾讯云 cos) 进行配置。")]),s._v(" "),t("p",[s._v("默认值如下：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"secretId"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"secretKey"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"bucket"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 存储桶名，v4 和 v5 版本不一样")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"appId"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"area"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 存储区域，例如 ap-beijing-1")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"path"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义存储路径，比如 img/")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"customUrl"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义域名，注意要加 http://或者 https://")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"version"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"v5"')]),s._v(" | "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"v4"')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// COS 版本，v4 或者 v5")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br")])]),t("h3",{attrs:{id:"picbed-github"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-github","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.github")]),s._v(" "),t("p",[s._v("GitHub 图床的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#github 图床)进行配置。")]),s._v(" "),t("p",[s._v("默认值如下：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"repo"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 仓库名，格式是 username/reponame")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"token"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// github token")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"path"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义存储路径，比如 img/")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"customUrl"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义域名，注意要加 http://或者 https://")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"branch"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 分支名，默认是 main")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br")])]),t("h3",{attrs:{id:"picbed-aliyun"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-aliyun","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.aliyun")]),s._v(" "),t("p",[s._v("阿里云 OSS 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#阿里云 oss) 进行配置。")]),s._v(" "),t("p",[s._v("默认值如下：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"accessKeyId"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"accessKeySecret"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"bucket"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 存储空间名")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"area"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 存储区域代号")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"path"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义存储路径")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"customUrl"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 自定义域名，注意要加 http://或者 https://")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"options"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 针对图片的一些后缀处理参数 PicGo 2.2.0+ PicGo-Core 1.4.0+")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br")])]),t("h3",{attrs:{id:"picbed-imgur"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-imgur","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.imgur")]),s._v(" "),t("p",[s._v("Imgur 的相关配置。可以查看 PicGo 的 [wiki](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#imgur 图床)进行配置。")]),s._v(" "),t("p",[s._v("默认值如下：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"clientId"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// imgur 的 clientId")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"proxy"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 代理地址，仅支持 http 代理")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br")])]),t("h3",{attrs:{id:"picbed-proxy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picbed-proxy","aria-hidden":"true"}},[s._v("#")]),s._v(" picBed.proxy")]),s._v(" "),t("p",[s._v("自定义代理配置，picgo 内部使用 "),t("code",[s._v("request")]),s._v(" 进行图片上传等网络请求，"),t("code",[s._v("picBed.proxy")]),s._v(" 将会被用作 "),t("a",{attrs:{href:"https://github.com/request/request#proxies",target:"_blank",rel:"noopener noreferrer"}},[s._v("request 的 proxy 配置"),t("OutboundLink")],1),s._v("，目前只支持 HTTP 代理。 默认为空表示不设置代理。")]),s._v(" "),t("p",[s._v("示例：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"proxy"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"http://127.0.0.1:1081"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("h2",{attrs:{id:"picgoplugins"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picgoplugins","aria-hidden":"true"}},[s._v("#")]),s._v(" picgoPlugins")]),s._v(" "),t("p",[s._v("这个配置项将会将所有插件名放置进去。主要用于判断插件是否被启用或者禁用。 "),t("strong",[s._v("picgo 自动生成，不需要配置！")])]),s._v(" "),t("p",[s._v("示例：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"picgo-plugin-xxx"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 该插件被启用")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"picgo-plugin-yyy"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 该插件被禁用")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br")])]),t("h2",{attrs:{id:"transformer"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#transformer","aria-hidden":"true"}},[s._v("#")]),s._v(" transformer")]),s._v(" "),t("p",[s._v("这个配置项主要用于存放第三方插件里的 Transformer 的相关配置。")]),s._v(" "),t("div",{staticClass:"custom-block warning"},[t("p",{staticClass:"custom-block-title"},[s._v("插件开发者注意")]),s._v(" "),t("p",[s._v("如果一个 Transformer 的名字为"),t("code",[s._v("xxx")]),s._v("，那么它的配置信息会放置在"),t("code",[s._v("transformer.xxx")]),s._v("里。这将有助于 PicGo 的 electron 版本进行配置。")])]),s._v(" "),t("p",[s._v("默认值："),t("code",[s._v("{}")])]),s._v(" "),t("h2",{attrs:{id:"picgo-plugin"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#picgo-plugin","aria-hidden":"true"}},[s._v("#")]),s._v(" picgo-plugin-*")]),s._v(" "),t("p",[s._v("如果你为 picgo 开发了一个插件，如果这个插件本身需要一些配置项，那么这个插件对应的配置应该直接放置在配置文件下的同名配置里：")]),s._v(" "),t("p",[s._v("示例：")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"picgo-plugin-xxx"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"config1"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"config2"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br")])])])},[],!1,null,null,null);t.default=r.exports}}]);