import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import { getNestedSidebarItems } from './utils/sidebar'

const EDIT_LINK_PATTERN = 'https://github.com/PicGo/PicGo-Core-Doc/edit/master/docs/:path'
const NEW_SITE_ORIGIN = 'https://docs.picgo.app'
const NEW_SECTION_BASE = '/core/'
const LEGACY_BASE = '/PicGo-Core-Doc/'

const normalizeRelativePath = (relativePath: string): { localePrefix: string; path: string } => {
  const withoutExt = relativePath.replace(/\.md$/, '')
  const isZh = withoutExt.startsWith('zh/')
  const localePrefix = isZh ? '/zh' : ''
  const localizedPath = isZh ? withoutExt.slice(3) : withoutExt

  if (!localizedPath || localizedPath === 'index') {
    return { localePrefix, path: '' }
  }

  if (localizedPath.endsWith('/index')) {
    return { localePrefix, path: `${localizedPath.slice(0, -'/index'.length)}/` }
  }

  return { localePrefix, path: localizedPath }
}

const buildCanonicalUrl = (relativePath: string): string => {
  const { localePrefix, path } = normalizeRelativePath(relativePath)
  const base = `${NEW_SITE_ORIGIN}${localePrefix}${NEW_SECTION_BASE}`
  const normalizedPath = path.replace(/^\/+/, '')
  return `${base}${normalizedPath}`
}

const buildRedirectScript = (): string => `\n(function() {\n  var newHost = '${NEW_SITE_ORIGIN}';\n  var sectionBase = '${NEW_SECTION_BASE}';\n  var oldBase = '${LEGACY_BASE}';\n  var path = window.location.pathname || '/';\n\n  if (path.startsWith(oldBase)) {\n    path = path.slice(oldBase.length);\n  } else {\n    path = path.replace(/^\\/+/, '');\n  }\n\n  var isZh = path.startsWith('zh/');\n  if (isZh) {\n    path = path.slice(3);\n  }\n\n  if (path === '' || path === 'index.html') {\n    path = '';\n  } else if (path.endsWith('/index.html')) {\n    path = path.slice(0, -'/index.html'.length) + '/';\n  } else if (path.endsWith('.html')) {\n    path = path.slice(0, -'.html'.length);\n  }\n\n  if (path.startsWith('/')) {\n    path = path.slice(1);\n  }\n\n  var newUrl = newHost + (isZh ? '/zh' : '') + sectionBase + path + window.location.search + window.location.hash;\n  if (newUrl !== window.location.href) {\n    window.location.replace(newUrl);\n  }\n})();\n`

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

// --- Chinese Config (Now at /zh/) ---

const zhNav = [
  { text: '指南', link: '/zh/guide/' },
  {
    text: '插件开发指南',
    items: [
      { text: '插件开发', link: '/zh/dev-guide/cli' },
      { text: 'GUI 插件开发', link: '/zh/dev-guide/gui' },
      { text: '插件测试与发布', link: '/zh/dev-guide/deploy' }
    ]
  },
  { text: 'API 列表', link: '/zh/api/' },
  ...communityNavItems
]

// --- English Config (Default at /) ---

const enNav = [
  { text: 'Guide', link: '/guide/' },
  {
    text: 'Plugin Dev',
    items: [
      { text: 'Plugin Development', link: '/dev-guide/cli' },
      { text: 'GUI Plugin Development', link: '/dev-guide/gui' },
      { text: 'Testing & Publishing', link: '/dev-guide/deploy' }
    ]
  },
  { text: 'API', link: '/api/' },
  ...communityNavItems
]

const zhGuideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '指南',
    items: [
      { text: '介绍', link: '/zh/guide/', items: getNestedSidebarItems('/zh/guide/'), collapsed: true },
      { text: '快速开始', link: '/zh/guide/getting-started', items: getNestedSidebarItems('/zh/guide/getting-started'), collapsed: true },
      { text: '配置文件', link: '/zh/guide/config', items: getNestedSidebarItems('/zh/guide/config'), collapsed: true },
      { text: '命令列表', link: '/zh/guide/commands', items: getNestedSidebarItems('/zh/guide/commands'), collapsed: true },
      { text: 'Node.js 使用', link: '/zh/guide/use-in-node', items: getNestedSidebarItems('/zh/guide/use-in-node'), collapsed: true }
    ]
  }
]

const zhDevSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '插件开发指南',
    items: [
      { text: '插件开发', link: '/zh/dev-guide/cli', items: getNestedSidebarItems('/zh/dev-guide/cli'), collapsed: true },
      { text: 'GUI 插件开发', link: '/zh/dev-guide/gui', items: getNestedSidebarItems('/zh/dev-guide/gui'), collapsed: true },
      { text: '插件测试与发布', link: '/zh/dev-guide/deploy', items: getNestedSidebarItems('/zh/dev-guide/deploy'), collapsed: true }
    ]
  }
]

const zhApiSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'API 列表',
    items: [
      { text: 'API 列表', link: '/zh/api/', items: getNestedSidebarItems('/zh/api/'), collapsed: true }
    ]
  }
]

const enGuideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Guide',
    items: [
      { text: 'Overview', link: '/guide/', items: getNestedSidebarItems('/guide/'), collapsed: true },
      { text: 'Getting Started', link: '/guide/getting-started', items: getNestedSidebarItems('/guide/getting-started'), collapsed: true },
      { text: 'Configuration', link: '/guide/config', items: getNestedSidebarItems('/guide/config'), collapsed: true },
      { text: 'CLI Commands', link: '/guide/commands', items: getNestedSidebarItems('/guide/commands'), collapsed: true },
      { text: 'Use in Node.js', link: '/guide/use-in-node', items: getNestedSidebarItems('/guide/use-in-node'), collapsed: true }
    ]
  }
]

const enDevSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Plugin Development',
    items: [
      { text: 'Plugin Development', link: '/dev-guide/cli', items: getNestedSidebarItems('/dev-guide/cli'), collapsed: true },
      { text: 'GUI Plugin Development', link: '/dev-guide/gui', items: getNestedSidebarItems('/dev-guide/gui'), collapsed: true },
      { text: 'Testing & Publishing', link: '/dev-guide/deploy', items: getNestedSidebarItems('/dev-guide/deploy'), collapsed: true }
    ]
  }
]

const enApiSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'API',
    items: [{ text: 'API', link: '/api/', items: getNestedSidebarItems('/api/'), collapsed: true }]
  }
]

const zhThemeConfig = {
  nav: zhNav,
  sidebar: {
    '/zh/guide/': zhGuideSidebar,
    '/zh/dev-guide/': zhDevSidebar,
    '/zh/api/': zhApiSidebar
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

const enThemeConfig = {
  nav: enNav,
  sidebar: {
    '/guide/': enGuideSidebar,
    '/dev-guide/': enDevSidebar,
    '/api/': enApiSidebar
  },
  editLink: {
    pattern: EDIT_LINK_PATTERN,
    text: 'Edit this page on GitHub'
  },
  outline: {
    label: 'On this page',
    level: 'deep'
  }
} as const

export default defineConfig({
  title: 'PicGo-Core',
  description: 'The core engine behind PicGo',
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
  transformHead: ({ pageData }) => {
    const canonicalUrl = buildCanonicalUrl(pageData.relativePath)
    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { 'http-equiv': 'refresh', content: `0;url=${canonicalUrl}` }],
      ['script', {}, buildRedirectScript()]
    ]
  },
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
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                displayDetails: 'Display detailed results',
                resetButtonTitle: 'Clear search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for this query',
                footer: {
                  selectText: 'select',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: 'navigate',
                  navigateUpKeyAriaLabel: 'Arrow up',
                  navigateDownKeyAriaLabel: 'Arrow down',
                  closeText: 'close',
                  closeKeyAriaLabel: 'Escape'
                }
              }
            }
          },
          zh: {
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
      label: 'English',
      lang: 'en-US',
      title: 'PicGo-Core',
      description: 'The core engine behind PicGo',
      link: '/',
      themeConfig: enThemeConfig
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'PicGo-Core',
      description: 'PicGo 的核心组件',
      link: '/zh/',
      themeConfig: zhThemeConfig
    }
  }
})
