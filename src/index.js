import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'
import { Search, X, ChevronRight } from 'react-feather'
import axios from 'axios'
import Cookies from 'js-cookie'
const image =
  'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALZSURBVHgBpZRbSBRRGMe/c87MzqzruKtWVBCKlA/2Ug9CBKFW9BKRUonRg/pShmQqJAQGG+iDZGSGLxn5ICkhVA+BGHiBCiMyo3oxuhgRYW7ruPfduXydMazcm1p/+HOG7ww//t93zgxAGr044x6ZrOschHWIpNqYrLtSGqUZ42GqYITKxRXdlVOwBgmpNvwsp5rDIESdJMIcR3lpTcCkCYcbB/OjBvvkZ7kQYAo3U1XRvqu9vegzrCIaXxitv5WnGWQ8SLN5SgW8ogDzEnOpkjFU4552rQv47GzHHgR4FCMZ+SGWCT6RgWqj4LUx8Ii0eMEhje/v/JgHq7X85UJtScCfW6fCpnJV2CovsC3gsTmtZDDPYT+4AxweYRQMSsLExLssRtrGWnZ8SEjo7SrvBxEnEGmVQURZJyJoVIQoJRDmDgkUwtzW6uNgbntIpDVow/eHO2fa44ECQSIjEkAeFgkFE9iSeRLQLROy9KzxdBELztcM3pdkIpgmOBISZjfdP0GRHeDQfkA+QY4DC4+/Bkx+G4HymogQ4Ht3dICy4ebCxqQzXNbj+puFiyxrxEs353tsCnyXGcxJwtKh+PkMeatTIR1qXp/f/hZSaMUp7+s5/U6jWCaANiPxfuwGgkM3IZObr8/lmP9gOlgC0FJF18lZBKyyG1F/pmaCk9sV02eViK1yomm3Gv++++LLorRAS6e6Dr2SjOCgU49BjmbAxhjeG2gtSPhKOlqmq106Pulr/HPhkwItKRgcUAwvZGsRfQOY3fH7t5vfbMvSNbdLD2Zn4tfW5XrKv42lh+cGrkWIMnu8+8j1v+sDTWMlOtIeEaM7ZfSDw1gERff0OXXf5bTAZBpqeLCXAT4VUONXKAyyGQS76QMHqiCLgel1Ay0N1/XlZ5BAp4ShYxIGQYagTxJibYsi6/0noCV0u+nMnDoq2qKlRNAbCq723oD/1bdLtSVzbVUr7uVPEBYtBEZu1NcAAAAASUVORK5CYII='
const SearchBar = () => {
  const baseUrl = 'https://api-search.tunica.tech'

  const sessionCookie = Cookies.get('session')
  const sessionData = sessionCookie ? JSON.parse(sessionCookie) : null
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [boxVisible, setBoxVisible] = useState(false)
  const [result, setResult] = useState({})
  const [newSearch, setNewSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const resultsContainerRef = useRef(null)

  const handleToggle = () => {
    setIsExpanded((prev) => {
      const nextState = !prev
      if (!prev) {
        setTimeout(() => {
          document.getElementById('ai-search-input').focus()
        }, 300)
      } else {
        setSearchQuery('')
        if (resultsContainerRef.current) {
          resultsContainerRef.current.style.display = 'none'
        }
      }
      return nextState
    })
  }

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      setNewSearch(true)
      if (resultsContainerRef.current) {
        resultsContainerRef.current.style.display = 'block'
        setBoxVisible(true)
      }
    } else {
      if (resultsContainerRef.current) {
        resultsContainerRef.current.style.display = 'none'
      }
    }
  }

  const closeSearch = () => {
    handleToggle()
    setBoxVisible(false)
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  const removeSearchQuery = () => {
    setSearchQuery('')
    setBoxVisible(false)
  }

  const removeSearchResponse = () => {
    setBoxVisible(false)
    setSearchQuery('')
  }

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

  useEffect(() => {
    if (!searchQuery) {
      setResult({})
      setBoxVisible(false)
    }
  }, [searchQuery])

  useEffect(() => {
    async function postData() {
      try {
        setLoading(true)
        const response = await axios.post(
          `${baseUrl}/api/searches/${sessionData?.website}`,
          {
            query: searchQuery,
            sessionId: sessionData?.session?.id,
            userUuid: sessionData?.session?.userId
          }
        )
        setResult(response.data)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    if (newSearch) {
      postData()
    }
    return () => {
      setNewSearch(false)
    }
  }, [newSearch])

  useEffect(() => {
    const createSession = async () => {
      try {
        let currentUrl = window.location.href
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
  }, [window.location.href])

  useEffect(() => {
    setTimeout(() => {
      handleToggle()
    }, 1000)
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsExpanded(true)
      } else {
        if (!boxVisible) {
          setIsExpanded(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [boxVisible])

  return (
    <div
      className={`${styles.searchWrapper} ${boxVisible ? styles.hidden : ''}  `}
    >
      <div className={`${styles.searchContainer} `}>
        <div
          className={`${styles.aiSearchBarHeader} ${
            isExpanded ? styles.expanded : ''
          } ${!isExpanded ? styles.contract : ''} ${
            boxVisible ? styles.slideTop : ''
          } 
        `}
        >
          <div className={`${styles.searchInputWrapper} `}>
            <span
              className={styles.imageIconRounded}
              onClick={() => {
                closeSearch()
              }}
            >
              <img src={image} />
            </span>
            <input
              type='text'
              id='ai-search-input'
              className={styles.aiSearchBarInput}
              placeholder='How far is the hotel from bus stop?'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <span className={styles.searchIcon}>
              {searchQuery && (
                <X color='#303030' size='22' onClick={removeSearchQuery} />
              )}

              <Search color='#303030' size='22' onClick={handleSearch} />
            </span>
          </div>
        </div>

        {searchQuery && (
          <div
            className={`${styles.aiSearchResultsContainer} ${
              boxVisible ? styles.visibile : ''
            } `}
            ref={resultsContainerRef}
          >
            {loading ? (
              <div style={{ padding: '10px' }}>
                <div className={styles.skeletonLine}>
                  <span className={styles.skeleton} />
                </div>
                <div className={`${styles.skeletonSquareContainer}`}>
                  <span className={styles.skeletonSquare}></span>
                  <span className={styles.skeletonSquare}></span>
                </div>
              </div>
            ) : (
              <div className={styles.aiSearchBarResponse}>
                <div className={styles.crossIcon}>
                  <X
                    size='14'
                    color='#000000'
                    style={{ paddingLeft: '2px', cursor: 'pointer' }}
                    onClick={() => {
                      removeSearchResponse()
                    }}
                  />
                </div>

                <div className={styles.hideOverFlow}>
                  <p style={{ margin: 0 }}>{result?.sanitizedMessage}</p>

                  {result?.relatedData?.map((e, index) =>
                    e.pageUrl ? (
                      <div key={index}>
                        <div className={styles.aiSearchBarLink}>
                          <div className={styles.linkIcon}>
                            <ChevronRight
                              size='12'
                              color='#00000080'
                              style={{ paddingLeft: '2px' }}
                            />
                          </div>
                          <a
                            href={e.pageUrl}
                            style={{ margin: 0 }}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() => handleClick(e.pageUrl, e.id)}
                          >
                            {e?.title || 'No title available'}
                          </a>
                        </div>
                        <p className={styles.description}>
                          {e?.description || 'No description available.'}
                        </p>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
