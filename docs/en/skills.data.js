import { createContentLoader } from 'vitepress'

export default createContentLoader('en/skills/*.md', {
  transform(raw) {
    const skills = {}
    raw.forEach(page => {
      const key = page.url.split('/').pop().replace('.html', '')
      skills[key] = page.frontmatter.skills || []
    })
    return skills
  }
})
