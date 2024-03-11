import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import {
  Search,
  Send,
  XCircle as Cross,
  ExternalLink as Link
} from 'react-feather'
import DOMPurify from 'isomorphic-dompurify'
import axios from 'axios'

const SearchBar = ({ placeholder, theme, client, top }) => {
  const [input, setInput] = useState('')
  const [searched, setSearched] = useState(false)
  const [newSearch, setNewSearch] = useState(false)
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [result, setResult] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const searchTheme = theme || 'dark'
  const searchClient = client || 'Tunica'
  const topPosition = top || '80px'

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSendClick = (e) => {
    setSearched(true)
    setNewSearch((prev) => !prev)
  }

  const handleSendClickKeyboard = (e) => {
    if (e.keyCode === 13) {
      setSearched(true)
      setNewSearch((prev) => !prev)
    }
  }

  useEffect(() => {
    if (input === '') {
      setSearched(false)
      setResult({})
      setLoading(false)
      setError(false)
    }
  }, [input])

  const handleClear = () => {
    setInput('')
    setSearched(false)
    setResult({})
    setLoading(false)
    setError(false)
  }

  const SetNextQuestion = (question) => {
    setInput(question)
    setNewSearch((prev) => !prev)
  }

  useEffect(() => {
    if (Array.isArray(placeholder) && placeholder.length > 1) {
      const timer = setInterval(() => {
        setShowPlaceholder(false)
        setTimeout(() => {
          setCurrentPlaceholderIndex(
            (prevIndex) => (prevIndex + 1) % placeholder.length
          )
          setShowPlaceholder(true)
        }, 300)
      }, 3000)

      return () => clearInterval(timer)
    }
  }, [placeholder])

  useEffect(() => {
    async function postData() {
      try {
        setLoading(true)
        const response = await axios.post('http://localhost:6060/api', {
          userQuery: input,
          clientId: searchClient
        })
        setResult(response.data)
        setError(false)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    postData()

    return () => {
      setResult({})
      setLoading(false)
      setError(false)
    }
  }, [newSearch])

  const currentPlaceholder = Array.isArray(placeholder)
    ? placeholder[currentPlaceholderIndex]
    : placeholder

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Search className={styles.searchIcon} color='grey' size={18} />
        <input
          className={`${styles.input} ${
            showPlaceholder ? '' : styles.placeholderHidden
          }`}
          value={input}
          onChange={handleInputChange}
          placeholder={currentPlaceholder || 'Hi, How can I help you?'}
          onKeyDown={input ? handleSendClickKeyboard : null}
        />
        {input ? (
          <Cross
            className={styles.close}
            color='grey'
            size={16}
            onClick={handleClear}
          />
        ) : null}
        <button
          onClick={input ? handleSendClick : null}
          className={`${styles.sendButton} ${input ? styles.iconActive : null}`}
          disabled={!input}
        >
          <Send color={input ? 'white' : 'grey'} size={16} />
        </button>
      </div>
      <div
        className={`${styles.searchOverlay} ${
          searched ? styles.slideDown : styles.slideUp
        }`}
        style={{ '--top-position': topPosition }}
      >
        <div className={styles.searchResultBox}>
          {loading ? (
            <div
              className={`${styles.innerSearch} ${
                searchTheme === 'light' ? styles.light : ''
              } ${styles.centerAlign}`}
            >
              <span className={styles.loader} />
            </div>
          ) : error ? (
            <div
              className={`${styles.innerSearch} ${
                searchTheme === 'light' ? styles.light : ''
              } ${styles.centerAlign}`}
            >
              <p>
                There was an error in processing. Please try again in sometime.
              </p>
            </div>
          ) : (
            <div
              className={`${styles.innerSearch} ${
                searchTheme === 'light' ? styles.light : ''
              }`}
            >
              <p
                className={styles.message}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(result?.summarizationText)
                }}
              />
              {result?.products?.length > 0 ? (
                <div className={styles.cardContainer}>
                  {result?.products?.map((e, index) => {
                    return e.product ? (
                      <a
                        className={`${styles.singleCard} ${
                          searchTheme === 'light' ? styles.light : ''
                        }`}
                        href={e.url}
                        key={index}
                        style={{ '--index': index }}
                      >
                        <img src={e.productImg} alt='abc' target='_blank' />
                        <div className={styles.content}>
                          {e.product ? <h3>{e.product}</h3> : null}
                          {e.productDescription ? (
                            <p>{e.productDescription}</p>
                          ) : null}
                        </div>
                        <Link size={18} className={styles.linkIcon} />
                      </a>
                    ) : null
                  })}
                </div>
              ) : null}
              {result?.followup?.length > 0 ? (
                <React.Fragment>
                  <p
                    className={`${styles.suggested} ${
                      searchTheme === 'light' ? styles.light : ''
                    }`}
                  >
                    Suggested Questions:{' '}
                  </p>
                  <div className={styles.buttonContainer}>
                    {result?.followup?.map((question, index) => {
                      return (
                        <button
                          className={`${styles.followUp} ${
                            searchTheme === 'light' ? styles.light : ''
                          }`}
                          key={index}
                          style={{ '--index': index }}
                          onClick={() => SetNextQuestion(question)}
                        >
                          {question}
                        </button>
                      )
                    })}
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar
