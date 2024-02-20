import React from 'react'

import { SearchBar } from 'react-ai-search-bar'
import 'react-ai-search-bar/dist/index.css'

const App = () => {
  return <div className='container'>
    <div>LOGO</div>
    <ul className='list'>
      <li>one</li>
      <li>two</li>
      <li>three</li>
      <li>four</li>
    </ul>
    <SearchBar text="Create React Library Example 😄" placeholder="Enter your Query" />
    <button>
      Login
    </button>
  </div>
}

export default App
