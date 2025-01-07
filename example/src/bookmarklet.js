javascript: (function () {
  const e = document.createElement('div')
  e.id = 'ai-search-bar'
  document.body.appendChild(e)
  const t = (t) =>
    new Promise((n, o) => {
      if (document.querySelector(`script[src="${t}"]`)) return void n()
      const a = document.createElement('script')
      a.src = t
      a.onload = n
      a.onerror = () => o(new Error(`Failed to load script: ${t}`))
      document.head.appendChild(a)
    })
  const n = (t) =>
    new Promise((n, o) => {
      const a = document.createElement('link')
      a.rel = 'stylesheet'
      a.href = t
      a.onload = () => {
        const s = document.styleSheets
        for (let i = 0; i < s.length; i++) {
          if (s[i].href === t) {
            console.log('CSS loaded and applied:', t)
            n()
            return
          }
        }
        o(new Error('CSS file loaded but not applied'))
      }
      a.onerror = () => o(new Error(`Failed to load CSS: ${t}`))
      document.head.appendChild(a)
    })
  ;(async function () {
    try {
      await n(
        'https://cdn.jsdelivr.net/npm/react-ai-search-bar@1.0.4-beta.14/dist/index.umd.css'
      )
      await t('https://unpkg.com/react@18.2.0/umd/react.production.min.js')
      await t(
        'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'
      )
      await Promise.all([
        t('https://unpkg.com/axios/dist/axios.min.js'),
        t('https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js'),
        t(
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/js/all.min.js'
        )
      ])
      await t(
        'https://cdn.jsdelivr.net/npm/react-ai-search-bar@1.0.4-beta.14/dist/index.umd.js'
      )
      if (typeof window.reactAiSearchBar === 'undefined') {
        throw new Error('reactAiSearchBar not loaded correctly')
      }
      const container = document.getElementById('ai-search-bar')
      const root = ReactDOM.createRoot(container)
      root.render(
        React.createElement(window.reactAiSearchBar, {
          apiKey: 'your-api-key-here'
        })
      )
    } catch (e) {
      console.error('Error initializing search bar:', e)
    }
  })()
})()
