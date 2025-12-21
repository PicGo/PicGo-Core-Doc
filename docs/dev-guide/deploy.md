
# Testing & Publishing Plugins

## Testing plugins

### Regular (CLI) plugins

First, make sure you have `picgo` installed globally:

```bash
yarn global add picgo

# or

npm install picgo -g
```

**Then run `picgo -h` to confirm the installation works. (This is required: on the first run PicGo initializes by creating the default config file and generating `package.json`, etc.)**

Next, place your plugin folder under the directory where PicGo’s [default config file](/guide/config#default-config-file) lives. **The plugin folder name must start with `picgo-plugin-`, otherwise PicGo won’t load it.**

Then, in the same directory as the default config file, run:

```bash
npm install ./picgo-plugin-<your-plugin-name>
```

This installs your plugin into PicGo’s config directory so PicGo can load it at runtime. After that, iterate on your plugin and run PicGo commands to test.

### GUI plugins

If you want to develop a GUI plugin, first download and install [PicGo](https://github.com/Molunerfinn/PicGo/releases). On first launch, the app will initialize its configuration.

**If you’re using PicGo 2.3.0+, you can use the plugin import feature and select your plugin directory directly:**

![](https://pic.molunerfinn.com/picgo/docs/202108282004729.png)

Otherwise:

The PicGo (Electron) config file path differs by OS:

- Windows: `%APPDATA%\picgo\data.json`
- Linux: `$XDG_CONFIG_HOME/picgo/data.json` or `~/.config/picgo/data.json`
- macOS: `~/Library/Application\ Support/picgo/data.json`

For example, on Windows you can find it at:

`C:\Users\<your-username>\AppData\Roaming\picgo\data.json`.

On Linux you can find it at:

`~/.config/picgo/data.json`.

Same idea on macOS.

Assume your plugin directory is `/usr/home/picgo-plugin-<your-plugin-name>`.

In the directory where PicGo’s config lives, run:

```bash
npm install /usr/home/picgo-plugin-<your-plugin-name>
```

This installs your plugin into PicGo’s config directory so PicGo can load it.

::: warning Note
Any change to a GUI plugin requires restarting PicGo to take effect. “Restart” does not mean closing and reopening the main window—you must **fully quit** the PicGo process and then launch it again.

This is because PicGo loads plugins via Node.js `require()`, which caches modules at runtime. Since PicGo `2.0.2`, you can use the tray icon menu or the mini window’s “Restart App” button to restart quickly.
:::

## Publishing plugins

To make your plugin usable by others, publish it to npm following the naming convention `picgo-plugin-<name>`. Once you follow the convention, your plugin can:

- Be discovered by other users.
- Be installed via `picgo install <name>` or `picgo add <name>`.

For example, if you publish `picgo-plugin-wow`, users can install it via `picgo install wow`.

You can find official PicGo plugins on PicGo’s [GitHub org page](https://github.com/PicGo).

### GUI plugins

If your plugin is not optimized for the GUI (for example, it doesn’t implement `guiMenu`), PicGo (Electron) will show a prompt like this during installation:

![](https://pic.molunerfinn.com/picgo/docs/5c39ce32045a7.png)

Plugins that are not optimized for the GUI will show a `CLI` badge in the top-right:

![](https://pic.molunerfinn.com/picgo/docs/5c39ce678a412.png)

If you want your plugin to display an icon and description inside the [PicGo](https://github.com/Molunerfinn/PicGo) app, follow these requirements:

- Put a `logo.png` at the npm package root, otherwise PicGo will show the default logo.
- Add `description` and `homepage` fields to `package.json`.
- Add `"picgo-gui-plugin"` to `package.json.keywords` to indicate your plugin is optimized for the PicGo GUI.

Example:

```json
{
  "description": "This is a picgo plugin",
  "homepage": "https://github.com/XXX/XXX#readme",
  "keywords": [
    "picgo-gui-plugin"
  ]
}
```

- If your plugin provides an `Uploader` or a `Transformer`, you should declare them in the plugin entry file so PicGo can locate them:

Example:

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
    uploader: 'temp', // <- declare your uploader name
    transformer: 'temp' // <- declare your transformer name
  }
}
```

### Submitting to Awesome-PicGo

To help more people discover your plugin, you can submit a PR to [Awesome-PicGo](https://github.com/PicGo/Awesome-PicGo) after publishing and add your project to the awesome list.

Before submitting, make sure you comply with the requirements in [CONTRIBUTING](https://github.com/PicGo/Awesome-PicGo/blob/master/CONTRIBUTING.md).
