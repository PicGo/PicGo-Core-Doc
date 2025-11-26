import { defineConfig, DefaultTheme } from 'vitepress'
import { getNestedSidebarItems } from './utils/sidebar'

const EDIT_LINK_PATTERN = 'https://github.com/PicGo/PicGo-Core-Doc/edit/master/docs/:path'

const communityNavItems = [
  {
    text: 'PicGo',
    link: 'https://github.com/Molunerfinn/PicGo'
  },
  {
    text: 'Awesome-PicGo',
    link: 'https://github.com/PicGo/Awesome-PicGo'
  }
]

const zhNav = [
  {
    text: '指南',
    link: '/guide/'
  },
  {
    text: '插件开发指南',
    items: [
      { text: '插件开发', link: '/dev-guide/cli' },
      { text: 'GUI 插件开发', link: '/dev-guide/gui' },
      { text: '插件测试与发布', link: '/dev-guide/deploy' }
    ]
  },
  {
    text: 'API 列表',
    link: '/api/'
  },
  ...communityNavItems
]

const zhGuideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '指南',
    items: [
      { text: '介绍', link: '/guide/', items: getNestedSidebarItems('/guide/'), collapsed: true },
      { text: '快速开始', link: '/guide/getting-started', items: getNestedSidebarItems('/guide/getting-started'), collapsed: true },
      { text: '配置文件', link: '/guide/config', items: getNestedSidebarItems('/guide/config'), collapsed: true },
      { text: '命令列表', link: '/guide/commands', items: getNestedSidebarItems('/guide/commands'), collapsed: true },
      { text: 'Node.js 使用', link: '/guide/use-in-node', items: getNestedSidebarItems('/guide/use-in-node'), collapsed: true }
    ]
  }
]

const zhDevSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '插件开发指南',
    items: [
      { text: '插件开发', link: '/dev-guide/cli', items: getNestedSidebarItems('/dev-guide/cli'), collapsed: true },
      { text: 'GUI 插件开发', link: '/dev-guide/gui', items: getNestedSidebarItems('/dev-guide/gui'), collapsed: true },
      { text: '插件测试与发布', link: '/dev-guide/deploy', items: getNestedSidebarItems('/dev-guide/deploy'), collapsed: true }
    ]
  }
]

const zhApiSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'API 列表',
    items: [
      { text: 'API 列表', link: '/api/', items: getNestedSidebarItems('/api/'), collapsed: true }
    ]
  }
]

const zhThemeConfig = {
  nav: zhNav,
  sidebar: {
    '/guide/': zhGuideSidebar,
    '/dev-guide/': zhDevSidebar,
    '/api/': zhApiSidebar
  },
  editLink: {
    pattern: EDIT_LINK_PATTERN,
    text: '在 GitHub 上编辑此页'
  },
  outline: {
    label: '本页目录',
    level: 'deep'
  }
} as const

export default defineConfig({
  title: 'PicGo-Core',
  description: 'PicGo 的核心组件',
  base: '/PicGo-Core-Doc/',
  head: [
    ['meta', { name: 'google-site-verification', content: 'I9agtjzUmnyUxzdpci2kQuXzlOgw7qBLqR5w6PgUnjQ' }],
    [
      'link',
      {
        rel: 'icon',
        href: 'https://pic.molunerfinn.com/picgo/docs/logo-150.png'
      }
    ]
  ],
  sitemap: {
    hostname: 'https://picgo.github.io/PicGo-Core-Doc/'
  },
  themeConfig: {
    logo: 'https://pic.molunerfinn.com/picgo/docs/picgo-logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/PicGo/PicGo-Core' }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2018 - Now Molunerfinn'
    }
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'PicGo-Core',
      description: 'PicGo 的核心组件',
      link: '/',
      themeConfig: zhThemeConfig
    }
  }
})