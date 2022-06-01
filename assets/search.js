import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.basic.esm.min.js'
const options = {
  shouldSort: true,
  includeMatches: true,
  threshold: .1,
  keys: ["tags", "content"]
}
fetch(window.articleIndexUrl).catch(console.error).then(r => r.json()).then((data)=>{
  const f = new Fuse(data, options)
  const search = document.getElementById("search-input")
  const resultArea = document.getElementById('results')
  const forge = document.createElement('div')
  // const Tag = (t) => `<a href="${}">${t}</a>`
  search.addEventListener("input", (e) => {
    let results = f.search(search.value)
    console.log(results)
    Array.from(resultArea.children).forEach((c) => resultArea.removeChild(c))
    results.forEach(({item, matches}) => {
      const Context = ([start, end]) => {
        const leadUp = item.content.slice(Math.max(0, start - 20), start)
        const matched = item.content.slice(start, end+1)
        const followUp = item.content.slice(end+1, Math.min(item.content.length+1, end + 20))
        return `<div class="search-match-context">${leadUp}<b>${matched}</b>${followUp}</div>`
      }
      const d = item.permalink.split("til/")[1]
      const contentMatches = matches
        .filter(m => m.key == "content")
        .map(m => m.indices.map(Context).join(''))
        .join('')
      const tagMatches = matches
        .filter(m => m.key == "tags")
        .map(m => {
          const {value, indices} = m
          const [start, end] = indices[0]
          return `&nbsp;<span class="tag">${value.slice(0, start)}<b>${value.slice(start,end+1)}</b>${value.slice(end+1)}</span>`
        })
        .join("")
      console.log({tagMatches})
      forge.innerHTML = `<a style="color: var(--font); text-decoration: none" href="${item.permalink}">
      <div><code>${d}</code>${tagMatches}</div>
        <div>${contentMatches}</div>
      </a>`
      resultArea.appendChild(forge.children[0])
    });
  })
})