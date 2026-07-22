import { createContentLoader } from 'vitepress'

export default createContentLoader('en/experience/*.md', {
  render: true,
  transform(raw) {
    return raw.map(page => ({
      id: page.frontmatter.id,
      role: page.frontmatter.role,
      company: page.frontmatter.company,
      period: page.frontmatter.period,
      desc: page.html
    })).sort((a, b) => a.id - b.id)
  }
})
