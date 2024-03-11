import React from 'react'

import SearchBar from 'react-ai-search-bar'
import 'react-ai-search-bar/dist/index.css'

const App = () => {
  const placeHolders = [
    'What product or topic interests you?',
    'What do you need help finding?',
    'Hi, How can I help you?',
    'Seeking inspiration? Let us assist you.',
    'Whats the focus of your search?',
    'How can we guide your journey?'
  ]
  return (
    <div className='container'>
      <div className='navbar'>
        <div>LOGO</div>
        <ul className='list'>
          <li>one</li>
          <li>two</li>
          <li>three</li>
          <li>four</li>
        </ul>
        <SearchBar
          placeholder={placeHolders}
          client='Sorted'
          top='80px'
          // theme='light'
        />
        <button>Login</button>
      </div> 
      <div className='innerContainer'></div>
    </div>
  )
}

export default App
