import React, { useState } from 'react'
import styles from './styles.module.css'

export const SearchBar = ({ text, placeholder }) => {
  const [input, setInput] = useState('')

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {input ? (
        <div className={styles.searchOverlay}>
          <div className={styles.searchResultBox}>HI</div>
        </div>
      ) : null}
    </div>
  )
}
