---
layout: home
hero:
  name: PicGo-Core
  text: The ultimate image uploading engine
  tagline: Integrate image uploading into your build scripts, editors, or any Node.js workflow via CLI or API.
  image:
    src: https://pic.molunerfinn.com/picgo/docs/picgo-logo.png
    alt: PicGo-Core Logo
    width: 256
  actions:
    - theme: brand
      text: Guide
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/PicGo/PicGo-Core
    - theme: alt
      text: PicGo Homepage
      link: https://picgo.app
features:
  - title: CLI automation
    details: Upload images and get links with a single command. Fits perfectly into shell scripts and CI/CD pipelines.
  - title: Fast SDK integration
    details: Don’t want to deal with authentication and upload logic? Bring in PicGo-Core and add image-host capability to your Node.js app in minutes.
  - title: Extensible ecosystem
    details: Powered by a strong plugin system—add compression, watermarking, and other processing, or connect to any private image host.
footer: MIT Licensed | Copyright © 2018 - Now Molunerfinn
---

```bash
# Upload an image via CLI
npx picgo upload /path/to/image.png
```

```js
// Seamlessly integrate into your Node.js workflow
const { PicGo } = require('picgo')
const picgo = new PicGo()

// Upload an image with a single line
picgo.upload(['/path/to/image.png'])
```