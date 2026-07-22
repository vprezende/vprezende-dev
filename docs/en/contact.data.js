import { createContentLoader } from 'vitepress'

export default createContentLoader('en/contact/*.md', {
  transform(raw) {
    return raw[0]?.frontmatter || {}
  }
})
