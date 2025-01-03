import React from 'react'
import ReactDOM from 'react-dom'
import SearchBar from './SearchBar'

// Function to dynamically mount the SearchBar component
const initializeAISearch = (options = {}) => {
  const targetDiv = document.getElementById('ai-search-bar')
  if (targetDiv) {
    ReactDOM.render(
      <React.StrictMode>
        <SearchBar {...options} />
      </React.StrictMode>,
      targetDiv
    )
  } else {
    console.error("Target div with ID 'ai-search-bar' not found.")
  }
}

// Expose the function globally
window.initializeAISearch = initializeAISearch
