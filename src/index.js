import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'
// import { Search, X, ChevronRight } from 'react-feather'
import axios from 'axios'
import Cookies from 'js-cookie'
import ReactDOM from 'react-dom'

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
  const [isContracted, setIsContracted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [slideDown, setSlideDown] = useState(false)
  const [slidedDown, setSlidedDown] = useState(false)
  const resultsContainerRef = useRef(null)

  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
    setIsContracted((prev) => !prev)
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
    if (!boxVisible) {
      setSlidedDown(false)
      handleToggle()
      setBoxVisible(false)
    }
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
      setHasInteracted(true)

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
        const Url = window.location.href
        const currentUrl = Url.endsWith('/') ? Url.slice(0, -1) : Url
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
      setIsExpanded(true)
    }, 1000)
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        if (!searchQuery) {
          setIsExpanded(true)
          setIsContracted(false)
        }

        setSlidedDown(false)
      } else {
        if (!boxVisible) {
          setSlidedDown(false)
          if (!searchQuery) {
            setIsContracted(true)
            setIsExpanded(false)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [boxVisible, searchQuery])
  useEffect(() => {
    if (!boxVisible && hasInteracted) {
      setSlideDown(true)
      setSlidedDown(true)
      setHasInteracted(false)
    } else {
      setSlideDown(false)
    }
  }, [searchQuery, boxVisible])

  return (
    <div
      className={`${styles.searchWrapper} ${boxVisible ? styles.hidden : ''}  `}
    >
      <div className={`${styles.searchContainer} `}>
        <div
          className={`${styles.aiSearchBarHeader} 
          ${
            slidedDown
              ? ''
              : isContracted
              ? styles.contract
              : isExpanded
              ? styles.expanded
              : ''
          }
    ${boxVisible ? styles.slideTop : ''} 
    ${slideDown && slidedDown ? styles.slideDown : ''}`}
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
                // <X color='#303030' size='22' onClick={removeSearchQuery} />
                <div onClick={removeSearchQuery} style={{ marginRight: '5px' }}>
                  <i style={{ width: '8px' }} className='fa-solid fa-x' />
                </div>
              )}

              {/* <Search color='#303030' size='22' onClick={handleSearch} /> */}
              <div onClick={handleSearch}>
                <i className='fa-solid fa-magnifying-glass' />
              </div>
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
                  <span className={styles.skeletonSquare} />
                  <span className={styles.skeletonSquare} />
                </div>
              </div>
            ) : (
              <div className={styles.aiSearchBarResponse}>
                <div className={styles.crossIcon}>
                  {/* <X
                    size='14'
                    color='#000000'
                    style={{ paddingLeft: '2px', cursor: 'pointer' }}
                    onClick={() => {
                      removeSearchResponse()
                    }}
                  /> */}
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      removeSearchResponse()
                    }}
                  >
                    <i style={{ width: '8px' }} className='fa-solid fa-x' />
                  </div>
                </div>

                <div className={styles.hideOverFlow}>
                  <p style={{ margin: 0 }}>{result?.sanitizedMessage}</p>

                  {result?.relatedData?.map((e, index) =>
                    e.pageUrl ? (
                      <div key={index}>
                        <div className={styles.aiSearchBarLink}>
                          <div className={styles.linkIcon}>
                            {/* <ChevronRight
                              size='12'
                              color='#00000080'
                              style={{ paddingLeft: '2px' }}
                            /> */}
                            <i
                              style={{ paddingLeft: '2px' }}
                              className='fa-solid fa-chevron-right'
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
                        {e?.description ? (
                          <p className={styles.description}>
                            {e?.description || 'No description available.'}
                          </p>
                        ) : null}
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

// Auto-initialize when the script loads
if (typeof window !== 'undefined') {
  // Check if required dependencies are loaded
  const checkDependencies = () => {
    return (
      typeof React !== 'undefined' &&
      typeof ReactDOM !== 'undefined' &&
      typeof axios !== 'undefined' &&
      typeof Cookies !== 'undefined'
    )
  }

  // Function to load script
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Function to load stylesheet
  const loadStylesheet = (href) => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.onload = resolve
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  // Initialize the component when all dependencies are loaded
  const initialize = async () => {
    if (!checkDependencies()) {
      try {
        // Load required dependencies
        await Promise.all([
          loadScript('https://unpkg.com/react@17/umd/react.production.min.js'),
          loadScript(
            'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js'
          ),
          loadScript('https://unpkg.com/axios/dist/axios.min.js'),
          loadScript(
            'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js'
          ),
          loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/js/all.min.js'
          ),
          // Load your styles.module.css
          loadStylesheet(
            'https://cdn.jsdelivr.net/npm/react-ai-search-bar@1.0.4-beta.16/dist/index.umd.css'
          )
        ])
      } catch (error) {
        console.error('Error loading dependencies:', error)
        return
      }
    }

    // Initialize the search bar
    initializeAISearch()
  }

  // Call initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }

  // Expose the initialize function globally
  window.initializeAISearch = initializeAISearch
}

export default SearchBar
