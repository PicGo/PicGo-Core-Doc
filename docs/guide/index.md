# Overview

PicGo-Core is the underlying engine used by PicGo. You can think of it as a lightweight, extensible upload workflow.

::: tip Tip
Unless explicitly stated otherwise, `picgo` and `PicGo-Core` refer to the same thing in this documentation. `PicGo` refers to the [Electron app](https://github.com/Molunerfinn/PicGo).
:::

## Features

- CLI support
- Programmatic API
- Plugin system

## How does it work?

The diagram below shows the PicGo-Core lifecycle:

![flow](https://pic.molunerfinn.com/picgo/docs/core-lifecycle.png)

### The 4 components

1. **Input**: accepts images from external sources. By default this is a file path or full Base64 image data.
2. **Transformer**: converts the input into an image object that can be uploaded (width/height, Base64/buffer, filename, etc.).
3. **Uploader**: uploads the transformed output to a target destination. The default uploader is SM.MS.
4. **Output**: the upload result. Typically you read the final URL from `imgUrl`.

### The 3 lifecycle hooks

1. `beforeTransform`: access input info
2. `beforeUpload`: access the output after the transformer
3. `afterUpload`: access the final output

You can provide images via the CLI or via the API, and PicGo will upload them following this lifecycle and return the URL.

::: tip Tip
Plugins can provide custom Uploaders and Transformers, and can also hook into these lifecycle stages to implement more advanced workflows.
:::
