import { createContentLoader } from 'vitepress'

export default createContentLoader('pt/contact/*.md', {
  transform(raw) {
    return raw[0]?.frontmatter || {}
  }
})
