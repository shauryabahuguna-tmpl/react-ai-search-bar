import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Search, Send, X as Cross } from 'react-feather'

export const SearchBar = ({ text, placeholder }) => {
  const [input, setInput] = useState('')
  const [searched, setSearched] = useState(false)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSendClick = (e) => {
    setSearched(true)
  }

  useEffect(() => {
    if (input === '') {
      setSearched(false)
    }
  }, [input])

  console.log(input)

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Search className={styles.searchIcon} color='grey' size={18} />
        <input
          className={styles.input}
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder || 'Hi, How can I help you?'}
        />
        {input ? (
          <Cross className={styles.close} color='grey' size={16} />
        ) : null}
        <Send
          color={input ? 'green' : 'grey'}
          size={16}
          className={`${styles.sendIcon} ${input ? styles.iconActive : null}`}
          onClick={input ? handleSendClick : null}
        />
      </div>
      <div
        className={`${styles.searchOverlay} ${
          searched ? styles.slideDown : styles.slideUp
        }`}
      >
        <div className={styles.searchResultBox}>
          <div className={styles.innerSearch}>{input}</div>
        </div>
      </div>
    </div>
  )
}
