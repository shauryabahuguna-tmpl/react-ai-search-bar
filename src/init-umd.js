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

// Expose the component directly
ReactAISearchBar.SearchBar = SearchBar

// Expose globally
if (typeof window !== 'undefined') {
  window.ReactAISearchBar = ReactAISearchBar
  window.initializeAISearch = ReactAISearchBar.initializeAISearch
}

export default ReactAISearchBar
