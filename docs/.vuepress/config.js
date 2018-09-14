module.exports = {
  title: 'PicGo-Core',
  head: [
    [
      'link', {
        rel: 'icon', href: 'https://user-images.githubusercontent.com/12621342/33876119-85a5148e-df5f-11e7-8843-46224e595d52.png'
      }
    ]
  ],
  base: '/PicGo-Core-Doc/',
  locales: {
    '/zh/': {
      lang: 'zh-CN',
      title: 'PicGo-Core',
      description: 'PicGo核心组件'
    }
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
          '/zh/guide/': genSidebarConfig('指南')
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: '插件开发指南',
            link: '/zh/dev-guide/'
          },
          {
            text: 'API列表',
            link: '/zh/api/'
          }
        ]
      },
      '/zh/': {
        sidebar: {
          '/zh/guide/': genSidebarConfig('指南')
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: '插件开发指南',
            link: '/zh/dev-guide/'
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

function genSidebarConfig (title) {
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
