import { createContentLoader } from 'vitepress'

export default createContentLoader('pt/projects/*.md', {
  render: true,
  transform(raw) {
    const list = []
    let status = {}
    
    raw.forEach(page => {
      const filename = page.url.split('/').pop().replace('.html', '')
      if (filename === 'status') {
        status = page.frontmatter.status || {}
      } else {
        list.push({
          title: page.frontmatter.title,
          tags: page.frontmatter.tags || [],
          status: page.frontmatter.status || 'public',
          code: page.frontmatter.code,
          design: page.frontmatter.design,
          desc: page.html
        })
      }
    })
    
    return { list, status }
  }
})
