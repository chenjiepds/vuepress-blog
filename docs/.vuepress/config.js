module.exports = {
    title: '杰遨星辰的博客',
    description: '陈杰的博客',
    head: [
        ['link', {
            rel: 'icon',
            href: `/favicon.ico`
        }]
    ],
    themeConfig: {
        nav: [
          { text: '主页', link: '/' },
          { text: '基础知识', link: '/accumulate/' },
          { text: '面试题库', link: '/interview/' },
          { text: 'Github', link: 'https://github.com/chenjiepds' }
        ]
    },
    sidebarDepth: 2,
    sidebar: 'auto', // 侧边栏配置
    lastUpdated: 'Last Updated', 
    dest: './docs/.vuepress/dist',
    ga: '',
    evergreen: true,
}