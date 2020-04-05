module.exports = {
  title: 'PicGo-Core',
  markdown: { lineNumbers: true },
  head: [
    [
      'link', {
        rel: 'icon', href: 'https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/New%20LOGO-150.png'
      }
    ]
  ],
  base: '/PicGo-Core-Doc/',
  locales: {
    '/': {
      lang: '简体中文',
    },
  },
  description: 'PicGo的核心组件',
  themeConfig: {
    repo: 'PicGo/PicGo-Core',
    docsRepo: 'PicGo/PicGo-Core-Doc',
    docsDir: 'docs',
    editLinks: true,
    locales: {
      '/': {
        sidebar: {
          '/zh/guide/': getGuideSidebar('指南'),
          '/zh/dev-guide/': getDevSidebar('插件开发指南')
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: '插件开发指南',
            link: '/zh/dev-guide/',
            items: [
              {
                text: '插件开发',
                link: '/zh/dev-guide/cli.html'
              },
              {
                text: 'GUI插件开发',
                link: '/zh/dev-guide/gui.html'
              },
              {
                text: '插件测试与发布',
                link: '/zh/dev-guide/deploy.html'
              },
            ]
          },
          {
            text: 'API列表',
            link: '/zh/api/'
          }
        ]
      },
      '/zh/': {
        sidebar: {
          '/zh/guide/': getGuideSidebar('指南'),
          '/zh/dev-guide/': getDevSidebar('插件开发指南')
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: '插件开发指南',
            link: '/zh/dev-guide/',
            items: [
              {
                text: '插件开发',
                link: '/zh/dev-guide/cli.html'
              },
              {
                text: 'GUI插件开发',
                link: '/zh/dev-guide/gui.html'
              },
              {
                text: '插件测试与发布',
                link: '/zh/dev-guide/deploy.html'
              },
            ]
          },
          {
            text: 'API列表',
            link: '/zh/api/'
          }
        ]
      }
    }
  }
}

function getGuideSidebar (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        '',
        'getting-started',
        'config',
        'commands',
        'use-in-node',
      ]
    }
  ]
}

function getDevSidebar (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'cli',
        'gui',
        'deploy'
      ]
    }
  ]
}
