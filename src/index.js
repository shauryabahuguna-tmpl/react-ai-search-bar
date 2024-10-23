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
import Cookies from 'js-cookie'

const brokenImg =
  'data:image/png;base64,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'

const arrowImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGgSURBVHgBzZjvbYMwEMVfpH6PN8AbJBtAJ0hHyCjdgFHSDcwGbSdwO0FgAuoDI1EIEXdg8JOejAXYPx/+g32ATMr54nx2znxe9+7/eH85Fz79RWClzsa5FviGtkFRQQ1tnU9YQfS58pWghs59+SJptK2sA5rKT8CU3gBMBKg3BGMBqh3A+oBP+2Cozj/X+RTYaWewzukjOBsJnBmCXSIB+xe9Fw93BVNKKRyPx1nPVlWFsizB0LvzK11oCFpnra3n6n6/164x3DoURU60zhVFgSzLJu9TZMndNUWZGb3mJ2H16UNrPYpskiTccpppxYQCo5Q+qRDuk+BsKDAC6vICOOIKB4bewBHA1QgJtjvcM7A14GwosIVwxNWMiiBgC+EMweWhwBbCNfPclQs3F4xsjGmeEyxfzQqhOC9RJTSxzgFb6ARehgsoiATHN/SUBqxI4tHJgIkEzOKB0kjgzphQtLsvUtT7VpJGpDv+PQBZYFsCisA6RXs+1xcNb7sSlEF7jry63tAuLZtAHSCTRhvN1Kca49N02qQWzt/OHz7P0h+/tCFH2HuH4QAAAABJRU5ErkJggg=='

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
  const topPosition = top || '60px'
  const sessionCookie = Cookies.get('session')
  const sessionData = sessionCookie ? JSON.parse(sessionCookie) : null
  const baseUrl = 'https://ai-search-backend-231618241117.us-central1.run.app'

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
        const response = await axios.post(
          `${baseUrl}/api/searches/${sessionData?.website}`,
          {
            query: input,
            sessionId: sessionData?.session?.id,
            userUuid: sessionData?.session?.userId
          }
        )
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

  useEffect(() => {
    const createSession = async () => {
      try {
        let currentUrl = 'https://www.sorteddeli.com/'

        if (currentUrl.endsWith('/')) {
          currentUrl = currentUrl.slice(0, -1)
        }
        let requestBody
        if (sessionData) {
          requestBody = {
            websiteUrl: currentUrl,
            sessionId: sessionData?.session?.id,
            userUuid: sessionData?.session?.userId
          }
        } else {
          requestBody = {
            websiteUrl: currentUrl
          }
        }
        const response = await axios.post(`${baseUrl}/api/sessions`, {
          ...requestBody
        })

        if (response.data) {
          const session = response.data
          Cookies.set('session', JSON.stringify(session), { expires: 30 })
        }
      } catch (error) {
        console.error('Error creating session:', error)
      }
    }

    createSession()
  }, [])

  const currentPlaceholder = Array.isArray(placeholder)
    ? placeholder[currentPlaceholderIndex]
    : placeholder

  const handleClick = (pageUrl, id) => {
    axios
      .post(`${baseUrl}/api/clicks/${result?.searchData?.id}`, {
        productId: id,
        url: pageUrl
      })
      .then(() => {})
      .catch((error) => {
        console.error('API error:', error)
      })
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Search className={styles.searchIcon} color='grey' size={22} />
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
                }`}
              >
                <div>
                  <div className={styles.skeletonLine}>
                    <span className={styles.skeleton} />
                    <span className={styles.skeleton} />
                    <span className={styles.skeleton} />
                  </div>
                  <div className={`${styles.skeletonSquareContainer}`}>
                    <span className={styles.skeletonSquare}></span>
                    <span className={styles.skeletonSquare}></span>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div
                className={`${styles.innerSearch} ${
                  searchTheme === 'light' ? styles.light : ''
                } ${styles.centerAlign}`}
              >
                <p>
                  There was an error in processing. Please try again in
                  sometime.
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
                    __html: DOMPurify.sanitize(result?.sanitizedMessage)
                  }}
                />
                {result?.relatedData?.length > 0 ? (
                  <div className={styles.cardContainer}>
                    {result?.relatedData?.map((e, index) => {
                      return e.pageUrl ? (
                        <a
                          className={`${styles.singleCard} ${
                            searchTheme === 'light' ? styles.light : ''
                          }`}
                          target='_blank'
                          rel='noopener noreferrer'
                          href={e.pageUrl}
                          key={index}
                          style={{ '--index': index }}
                          onClick={() => handleClick(e.pageUrl, e.id)}
                        >
                          {e?.image !== '' ? (
                            <img src={e.image} alt='abc' target='_blank' />
                          ) : (
                            <img
                              src={brokenImg}
                              alt='broken image'
                              target='_blank'
                            />
                          )}
                          <div className={styles.content}>
                            {e.title ? <h3>{e.title}</h3> : null}
                            {e.customAttributes ? (
                              <h3>
                                {Object.keys(e.customAttributes).find(
                                  (key) => key.toLowerCase() === 'price'
                                )
                                  ? `Price: ${
                                      e.customAttributes[
                                        Object.keys(e.customAttributes).find(
                                          (key) => key.toLowerCase() === 'price'
                                        )
                                      ]
                                    }`
                                  : null}
                              </h3>
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
    </div>
  )
}

export default SearchBar
