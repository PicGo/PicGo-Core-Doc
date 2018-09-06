module.exports = {
  title: 'PicGo-Core',
  locales: {
    '/zh/': {
      lang: 'zh-CN',
      title: 'PicGo-Core',
      description: 'PicGo核心组件'
    }
  },
  description: 'PicGo的核心组件',
  themeConfig: {
    locales: {
      '/zh/': {
        sidebar: {
          '/zh/guide/': genSidebarConfig('指南')
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
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
        'commands',
      ]
    }
  ]
}
