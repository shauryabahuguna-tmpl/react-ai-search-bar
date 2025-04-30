import React from 'react'
import ReactDOM from 'react-dom'
import SearchBar from './index'

// Create the main module object
const ReactAISearchBar = {}

// Function to dynamically mount the SearchBar component
ReactAISearchBar.initializeAISearch = (options = {}) => {
  const targetDiv = document.getElementById('ai-search-bar')
  if (!targetDiv) {
    console.error(
      "Target div with ID 'ai-search-bar' not found. Make sure it exists in the DOM."
    )
    return
  }

  // Handle both React 17 and React 18 rendering methods
  if (ReactDOM.createRoot) {
    // React 18+
    const root = ReactDOM.createRoot(targetDiv)
    root.render(
      <React.StrictMode>
        <SearchBar {...options} />
      </React.StrictMode>
    )
  } else {
    // React 17 and below
    ReactDOM.render(
      <React.StrictMode>
        <SearchBar {...options} />
      </React.StrictMode>,
      targetDiv
    )
  }
}

// Dependency checker
ReactAISearchBar.checkDependencies = () => {
  return (
    typeof React !== 'undefined' &&
    typeof ReactDOM !== 'undefined' &&
    typeof axios !== 'undefined' &&
    typeof Cookies !== 'undefined'
  )
}

// Script loader
ReactAISearchBar.loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Stylesheet loader
ReactAISearchBar.loadStylesheet = (href) => {
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
ReactAISearchBar.init = async (options = {}) => {
  if (!ReactAISearchBar.checkDependencies()) {
    try {
      await Promise.all([
        ReactAISearchBar.loadScript(
          'https://unpkg.com/react@18.2.0/umd/react.production.min.js'
        ),
        ReactAISearchBar.loadScript(
          'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'
        ),
        ReactAISearchBar.loadScript(
          'https://unpkg.com/axios/dist/axios.min.js'
        ),
        ReactAISearchBar.loadScript(
          'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js'
        ),
        ReactAISearchBar.loadStylesheet(
          'https://cdn.jsdelivr.net/npm/react-ai-search-bar@1.0.5-beta.12.staging/dist/index.umd.css'
        )
      ])
    } catch (err) {
      console.error('Failed to load one or more dependencies:', err)
      return
    }
  }

  ReactAISearchBar.initializeAISearch(options)
}

// Expose the component directly
ReactAISearchBar.SearchBar = SearchBar

// Auto-init when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ReactAISearchBar.init)
  } else {
    ReactAISearchBar.init()
  }

  // Expose globally
  window.ReactAISearchBar = ReactAISearchBar
  window.initializeAISearch = ReactAISearchBar.initializeAISearch
}

export default ReactAISearchBar
