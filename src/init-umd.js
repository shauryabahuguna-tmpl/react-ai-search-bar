import React from 'react'
import ReactDOM from 'react-dom'
import SearchBar from './index'

// Function to dynamically mount the SearchBar component
const initializeAISearch = (options = {}) => {
  const targetDiv = document.getElementById('ai-search-bar')
  if (!targetDiv) {
    console.error(
      "Target div with ID 'ai-search-bar' not found. Make sure it exists in the DOM."
    )
    return
  }

  ReactDOM.render(
    <React.StrictMode>
      <SearchBar {...options} />
    </React.StrictMode>,
    targetDiv
  )
}

// Dependency checker
const checkDependencies = () => {
  return (
    typeof React !== 'undefined' &&
    typeof ReactDOM !== 'undefined' &&
    typeof axios !== 'undefined' &&
    typeof Cookies !== 'undefined'
  )
}

// Script loader
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Stylesheet loader
const loadStylesheet = (href) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = resolve
    link.onerror = reject
    document.head.appendChild(link)
  })
}

// Main initializer
const init = async () => {
  if (!checkDependencies()) {
    try {
      await Promise.all([
        loadScript(
          'https://unpkg.com/react@18.2.0/umd/react.production.min.js'
        ),
        loadScript(
          'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'
        ),
        loadScript('https://unpkg.com/axios/dist/axios.min.js'),
        loadScript(
          'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js'
        ),
        loadStylesheet(
          'https://cdn.jsdelivr.net/npm/react-ai-search-bar@1.0.5-beta.11.staging/dist/index.umd.css'
        )
      ])
    } catch (err) {
      console.error('Failed to load one or more dependencies:', err)
      return
    }
  }

  initializeAISearch()
}

// Auto-init when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Expose globally
  window.initializeAISearch = initializeAISearch
}
