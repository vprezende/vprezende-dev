import { createContentLoader } from 'vitepress'

export default createContentLoader('en/about/*.md', {
  render: true,
  transform(raw) {
    const about = {}
    raw.forEach(page => {
      const key = page.url.split('/').pop().replace('.html', '')
      if (key === 'bio') {
        about.bio = {
          title: page.frontmatter.title || 'About Me',
          html: page.html
        }
      } else {
        about[key] = {
          title: page.frontmatter.title,
          list: page.frontmatter.list || [],
          ...page.frontmatter
        }
      }
    })
    return about
  }
})
