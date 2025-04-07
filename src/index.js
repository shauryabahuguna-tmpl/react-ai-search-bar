import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'
// import { Search, X, ChevronRight } from 'react-feather'
import axios from 'axios'
import Cookies from 'js-cookie'
import ReactDOM from 'react-dom'

const SearchIcon =
  'https://res.cloudinary.com/dyhcgyoop/image/upload/v1742893541/Group_72837222_b6jryy.svg'

const SearchBar = () => {
  const placeholder = [
    'Ask me anything...',
    'How can I help you?',
    'What do you need help finding?',
    'Seeking inspiration? Let us assist you.',
    'What product or topic interests you?'
  ]
  const baseUrl = 'https://api-search.tunica.tech'
  const Url = window?.location?.origin
  // const Url = 'https://www.tunica.tech/'

  const sessionCookie = Cookies.get('session')
  const sessionData = sessionCookie ? JSON.parse(sessionCookie) : null
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [boxVisible, setBoxVisible] = useState(false)
  const [result, setResult] = useState({})
  const [ragSession, setRagSession] = useState('')
  const [newSearch, setNewSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isContracted, setIsContracted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [slideDown, setSlideDown] = useState(false)
  const [slidedDown, setSlidedDown] = useState(false)
  const resultsContainerRef = useRef(null)
  const resultInputRef = useRef(null)
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [themes, setThemes] = useState({
    primaryColor: '#2c9adf',
    secondaryColor: '#2C9ADF80',
    shadowColor: '#2C9ADF40',
    imageURL:
      'https://res.cloudinary.com/dyhcgyoop/image/upload/v1742889067/placeholder_image_eyqzla.png',
    placement: 'left'
  })
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [containerVisibility, setContainerVisibility] = useState(false)

  const currentPlaceholder = Array.isArray(placeholder)
    ? placeholder[currentPlaceholderIndex]
    : placeholder
  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
    setIsContracted((prev) => !prev)
  }

  const handleSearch = () => {
    setContainerVisibility(true)
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
    setContainerVisibility(false)
  }

  const removeSearchResponse = () => {
    setBoxVisible(false)
    setSearchQuery('')
  }

  const handleClick = (pageUrl, id) => {
    axios
      .post(`${baseUrl}/api/clicks/${sessionData?.website}`, {
        productId: id,
        url: pageUrl
      })
      .then(() => {})
      .catch((error) => {
        console.error('API error:', error)
      })
  }

  useEffect(() => {
    if (Url) {
      let newTheme = {}
      switch (true) {
        case Url.includes('giridharpaiassociates'):
          newTheme = {
            primaryColor: '#97B412',
            secondaryColor: '#97B41280',
            shadowColor: '#97b41240',
            imageURL:
              'https://res.cloudinary.com/dyhcgyoop/image/upload/v1742888889/gpa_ad23da.png',
            placement: 'left'
          }
          break

        case Url.includes('primevp'):
          newTheme = {
            primaryColor: '#FF7900',
            secondaryColor: '#FF790080',
            shadowColor: '#FF790040',
            imageURL:
              'https://res.cloudinary.com/dyhcgyoop/image/upload/v1742903106/LOGO_bcwpn4.png',
            placement: 'center'
          }
          break

        case Url.includes('ethinos'):
          newTheme = {
            primaryColor: '#000000',
            secondaryColor: '#00000080',
            shadowColor: '#00000040',
            imageURL:
              'https://res.cloudinary.com/dyhcgyoop/image/upload/v1743066570/Mask_group_1_vsknj2.png',
            placement: 'center'
          }
          break

        case Url.includes('tunica'):
          newTheme = {
            primaryColor: '#F40F0F',
            secondaryColor: '#F40F0F80',
            shadowColor: '#F40F0F40',
            imageURL:
              'https://res.cloudinary.com/dyhcgyoop/image/upload/v1743067153/Group_7064_qgu3i4.png',
            placement: 'center'
          }
          break

        default:
          newTheme = {
            primaryColor: '#2c9adf',
            secondaryColor: '#2C9ADF80',
            shadowColor: '#2C9ADF40',
            imageURL:
              'https://res.cloudinary.com/dyhcgyoop/image/upload/v1742889067/placeholder_image_eyqzla.png',
            placement: 'center'
          }
      }
      setThemes(newTheme)

      // Apply CSS variables to the wrapper element (body or a specific div)
      document.documentElement.style.setProperty(
        '--primaryColor',
        newTheme.primaryColor
      )
      document.documentElement.style.setProperty(
        '--secondaryColor',
        newTheme.secondaryColor
      )
      document.documentElement.style.setProperty(
        '--shadowColor',
        newTheme.shadowColor
      )
    }
  }, [Url])

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
    if (!searchQuery) {
      setResult({})
      setContainerVisibility(false)
      if (document.activeElement !== resultInputRef.current) {
        setBoxVisible(false)
      }
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
            userUuid: sessionData?.session?.userId,
            ragSession: ragSession
          }
        )
        setResult(response.data)
        setRagSession(response.data.ragSession)
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
  }, [window.location.origin])

  useEffect(() => {
    setTimeout(() => {
      setIsExpanded(true)
    }, 1000)
  }, [])

  useEffect(() => {
    const inputElement = resultInputRef.current

    // Track keyboard state
    const handleFocus = () => {
      setIsKeyboardOpen(true)
      setIsContracted(false)
      setIsExpanded(true)

      // Check if input is in view and scroll if needed
      if (inputElement) {
        const rect = inputElement.getBoundingClientRect()
        const isInView =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)

        if (!isInView) {
          // Calculate how much to scroll to bring input into view
          const scrollAmount = rect.bottom - (window.innerHeight - 100) // 100px padding from bottom
          if (scrollAmount > 0) {
            window.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            })
          }
        }
      }
    }

    const handleBlur = (e) => {
      // Only update keyboard state if we're not clicking within the input
      if (e.relatedTarget !== inputElement) {
        setIsKeyboardOpen(false)
      }
    }

    const handleScroll = () => {
      if (!inputElement) return

      if (window.scrollY === 0) {
        if (!searchQuery) {
          setIsExpanded(true)
          setIsContracted(false)
        }
        setSlidedDown(false)
      } else {
        if (!boxVisible) {
          setSlidedDown(false)

          // Only contract if keyboard is not open
          if (!isKeyboardOpen) {
            setIsContracted(true)
            setIsExpanded(false)
          }
        }
      }
    }

    // Add focus/blur listeners if input exists
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus)
      inputElement.addEventListener('blur', handleBlur)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus)
        inputElement.removeEventListener('blur', handleBlur)
      }
    }
  }, [boxVisible, searchQuery, isKeyboardOpen])

  // Add a new effect to handle input state
  useEffect(() => {
    const inputElement = resultInputRef.current
    if (!inputElement) return

    const handleTouchStart = (e) => {
      e.preventDefault() // Prevent default to avoid double handling
      inputElement.focus()
    }

    const handleClick = (e) => {
      e.preventDefault() // Prevent default to avoid double handling
      inputElement.focus()
    }

    inputElement.addEventListener('touchstart', handleTouchStart, {
      passive: false
    })
    inputElement.addEventListener('click', handleClick, { passive: false })

    return () => {
      inputElement.removeEventListener('touchstart', handleTouchStart)
      inputElement.removeEventListener('click', handleClick)
    }
  }, [])

  // Modify the input element to ensure it's not disabled when keyboard is open
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    // Ensure input stays enabled when typing
    setIsContracted(false)
    setIsExpanded(true)
  }

  useEffect(() => {
    if (!boxVisible && hasInteracted) {
      setSlideDown(true)
      setSlidedDown(true)
      setHasInteracted(false)
    } else {
      setSlideDown(false)
    }
  }, [searchQuery, boxVisible])

  return themes.placement === 'left' ? (
    <div
      className={`${styles.searchWrapper} ${boxVisible ? styles.hidden : ''} `}
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
              <img src={themes?.imageURL} className={styles.placeholderImage} />
            </span>
            <input
              type='text'
              ref={resultInputRef}
              id='ai-search-bar'
              className={`${styles.aiSearchBarInput} ${
                showPlaceholder ? '' : styles.placeholderHidden
              } ${isContracted ? styles.inputContracted : ''}`}
              placeholder={currentPlaceholder || 'Hi, How can I help you?'}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isContracted && !isKeyboardOpen}
              autoComplete='off'
              autoCorrect='off'
            />
            <span className={styles.searchIcon}>
              {searchQuery && (
                <div
                  className={styles.searchCross}
                  onClick={removeSearchQuery}
                  style={{ marginRight: '8px' }}
                >
                  {/* X */}
                  <svg
                    width='10'
                    height='11'
                    viewBox='0 0 10 11'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9 1.5L1 9.5M1 1.5L9 9.5'
                      stroke={themes?.primaryColor}
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              )}

              <div onClick={handleSearch}>
                {/* Search Glass */}
                <div className={styles.newSearchIcon}>
                  <img
                    src={SearchIcon}
                    alt='search'
                    style={{ height: '23px', width: '23px' }}
                  />
                </div>
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
              <div className={styles.loadingContainer}>
                <div className={styles?.baseStarDiv}>
                  <svg
                    width='268'
                    height='267'
                    viewBox='0 0 268 267'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className={styles.baseStar}
                  >
                    <g opacity='0.3'>
                      <g filter='url(#filter0_f_1988_3526)'>
                        <circle
                          cx='133.79'
                          cy='133.589'
                          r='99.1225'
                          transform='rotate(58.73 133.79 133.589)'
                          fill='url(#paint0_linear_1988_3526)'
                        />
                      </g>
                      <g filter='url(#filter1_f_1988_3526)'>
                        <path
                          d='M123 92.9454C154.602 84.4777 183.52 113.395 175.052 144.997V144.997C166.584 176.599 127.082 187.183 103.948 164.049V164.049C80.8139 140.915 91.3985 101.413 123 92.9454V92.9454Z'
                          fill='url(#paint1_linear_1988_3526)'
                        />
                      </g>
                    </g>
                    <defs>
                      <filter
                        id='filter0_f_1988_3526'
                        x='0.383385'
                        y='0.183189'
                        width='266.813'
                        height='266.813'
                        filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'
                      >
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='BackgroundImageFix'
                          result='shape'
                        />
                        <feGaussianBlur
                          stdDeviation='17.135'
                          result='effect1_foregroundBlur_1988_3526'
                        />
                      </filter>
                      <filter
                        id='filter1_f_1988_3526'
                        x='65.7712'
                        y='65.7507'
                        width='136.476'
                        height='136.475'
                        filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'
                      >
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='BackgroundImageFix'
                          result='shape'
                        />
                        <feGaussianBlur
                          stdDeviation='12.8512'
                          result='effect1_foregroundBlur_1988_3526'
                        />
                      </filter>
                      <linearGradient
                        id='paint0_linear_1988_3526'
                        x1='55.1593'
                        y1='48.1274'
                        x2='193.518'
                        y2='232.711'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#FFD600' />
                        <stop offset='1' stopColor='#FF0000' stopOpacity='0' />
                      </linearGradient>
                      <linearGradient
                        id='paint1_linear_1988_3526'
                        x1='194.104'
                        y1='73.8931'
                        x2='73.8959'
                        y2='194.101'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop
                          offset='0.23'
                          stopColor='#FF0000'
                          stopOpacity='0.75'
                        />
                        <stop offset='1' stopColor='#00FFFF' stopOpacity='0' />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className={styles.overlayStars}>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.03 88.8411C109.285 87.8341 110.715 87.834 110.97 88.841L111.425 90.6465C112.767 95.9629 117.172 100.022 122.566 101.007C123.659 101.207 123.659 102.793 122.566 102.993C117.172 103.978 112.767 108.037 111.425 113.353L110.97 115.159C110.715 116.166 109.285 116.166 109.03 115.159L108.575 113.353C107.233 108.037 102.828 103.978 97.4342 102.993C96.3405 102.793 96.3405 101.207 97.4342 101.007C102.828 100.022 107.233 95.9629 108.575 90.6465L109.03 88.8411Z'
                        fill='url(#paint0_linear_2002_62)'
                      />
                      <path
                        d='M100.305 56.9804C100.401 56.1548 101.599 56.1548 101.695 56.9804L101.813 57.9898C102.172 61.08 104.528 63.5622 107.595 64.0827L108.933 64.3099C109.71 64.4418 109.71 65.5582 108.933 65.6901L107.595 65.9173C104.528 66.4378 102.172 68.92 101.813 72.0102L101.695 73.0196C101.599 73.8452 100.401 73.8452 100.305 73.0196L100.187 72.0102C99.828 68.92 97.4724 66.4378 94.4053 65.9173L93.0668 65.6901C92.2896 65.5582 92.2896 64.4418 93.0668 64.3099L94.4053 64.0827C97.4724 63.5622 99.828 61.08 100.187 57.9898L100.305 56.9804Z'
                        fill='url(#paint1_linear_2002_62)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_62'
                          x1='110'
                          y1='84.4516'
                          x2='110'
                          y2='119.548'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_62'
                          x1='101'
                          y1='53'
                          x2='101'
                          y2='77'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      width='400'
                      height='400'
                      className={styles?.star}
                      viewBox='0 0 150 150'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        opacity='0.5'
                        d='M55.1757 53.7016C55.2567 53.3596 55.7433 53.3597 55.8243 53.7016L56.2373 55.4436C56.6667 57.2549 58.1314 58.6378 59.9644 58.9624L61.1466 59.1718C61.5135 59.2368 61.5135 59.7632 61.1466 59.8282L59.9644 60.0376C58.1314 60.3622 56.6667 61.7451 56.2373 63.5563L55.8243 65.2984C55.7433 65.6403 55.2567 65.6403 55.1757 65.2984L54.7627 63.5564C54.3333 61.7451 52.8686 60.3622 51.0356 60.0376L49.8534 59.8282C49.4865 59.7632 49.4865 59.2368 49.8534 59.1718L51.0356 58.9624C52.8686 58.6378 54.3333 57.2549 54.7627 55.4436L55.1757 53.7016Z'
                        fill='url(#paint0_linear_2002_75)'
                      />
                      <path
                        d='M75.6523 35.9902C75.7003 35.5774 76.2997 35.5774 76.3477 35.9902L76.4063 36.4949C76.586 38.04 77.7638 39.2811 79.2973 39.5414L79.9666 39.6549C80.3552 39.7209 80.3552 40.2791 79.9666 40.3451L79.2973 40.4586C77.7638 40.7189 76.586 41.96 76.4063 43.5051L76.3477 44.0098C76.2997 44.4226 75.7003 44.4226 75.6523 44.0098L75.5937 43.5051C75.414 41.96 74.2362 40.7189 72.7027 40.4586L72.0334 40.3451C71.6448 40.2791 71.6448 39.7209 72.0334 39.6549L72.7027 39.5414C74.2362 39.2811 75.414 38.04 75.5937 36.4949L75.6523 35.9902Z'
                        fill='url(#paint1_linear_2002_75)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_75'
                          x1='55.5'
                          y1='52.3333'
                          x2='55.5'
                          y2='66.6667'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_75'
                          x1='76'
                          y1='34'
                          x2='76'
                          y2='46'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.757 96.0201C109.818 95.764 110.182 95.764 110.243 96.0201L110.888 98.7229C111.206 100.06 112.278 101.087 113.627 101.348L115.731 101.755C116.001 101.807 116.001 102.193 115.731 102.245L113.627 102.652C112.278 102.913 111.206 103.94 110.888 105.277L110.243 107.98C110.182 108.236 109.818 108.236 109.757 107.98L109.112 105.277C108.794 103.94 107.722 102.913 106.373 102.652L104.269 102.245C103.999 102.193 103.999 101.807 104.269 101.755L106.373 101.348C107.722 101.087 108.794 100.06 109.112 98.7229L109.757 96.0201Z'
                        fill='url(#paint0_linear_2002_80)'
                      />
                      <path
                        d='M100.826 62.9951C100.85 62.7887 101.15 62.7887 101.174 62.9951L101.203 63.2475C101.293 64.02 101.882 64.6406 102.649 64.7707L102.983 64.8275C103.178 64.8604 103.178 65.1396 102.983 65.1725L102.649 65.2293C101.882 65.3594 101.293 65.98 101.203 66.7525L101.174 67.0049C101.15 67.2113 100.85 67.2113 100.826 67.0049L100.797 66.7525C100.707 65.98 100.118 65.3594 99.3513 65.2293L99.0167 65.1725C98.8224 65.1396 98.8224 64.8604 99.0167 64.8275L99.3513 64.7707C100.118 64.6406 100.707 64.02 100.797 63.2475L100.826 62.9951Z'
                        fill='url(#paint1_linear_2002_80)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_80'
                          x1='110'
                          y1='94.7742'
                          x2='110'
                          y2='109.226'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_80'
                          x1='101'
                          y1='62'
                          x2='101'
                          y2='68'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.031 89.827C109.285 88.821 110.715 88.821 110.969 89.827L111.323 91.2234C112.605 96.2827 116.721 100.128 121.856 101.063C122.898 101.253 122.898 102.747 121.856 102.937C116.721 103.872 112.605 107.717 111.323 112.777L110.969 114.173C110.715 115.179 109.285 115.179 109.031 114.173L108.677 112.777C107.395 107.717 103.279 103.872 98.1441 102.937C97.1022 102.747 97.1022 101.253 98.1441 101.063C103.279 100.128 107.395 96.2827 108.677 91.2234L109.031 89.827Z'
                        fill='url(#paint0_linear_2002_86)'
                      />
                      <path
                        opacity='0.5'
                        d='M80.1757 78.7016C80.2567 78.3597 80.7433 78.3597 80.8243 78.7016L81.2373 80.4437C81.6667 82.255 83.1314 83.6378 84.9644 83.9624L86.1466 84.1718C86.5135 84.2368 86.5135 84.7633 86.1466 84.8283L84.9644 85.0376C83.1314 85.3622 81.6667 86.7451 81.2373 88.5564L80.8243 90.2985C80.7433 90.6404 80.2567 90.6404 80.1757 90.2985L79.7627 88.5564C79.3333 86.7451 77.8686 85.3622 76.0356 85.0376L74.8534 84.8283C74.4865 84.7633 74.4865 84.2368 74.8534 84.1718L76.0356 83.9624C77.8686 83.6378 79.3333 82.255 79.7627 80.4437L80.1757 78.7016Z'
                        fill='url(#paint1_linear_2002_86)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_86'
                          x1='110'
                          y1='85.4839'
                          x2='110'
                          y2='118.516'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_86'
                          x1='80.5'
                          y1='77.3334'
                          x2='80.5'
                          y2='91.6667'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.676 92.9819C109.759 92.6436 110.24 92.6436 110.324 92.9819L111.432 97.4858C111.869 99.2629 113.305 100.62 115.104 100.957L118.918 101.672C119.281 101.74 119.281 102.26 118.918 102.328L115.104 103.042C113.305 103.38 111.869 104.737 111.432 106.514L110.324 111.018C110.24 111.356 109.759 111.356 109.676 111.018L108.568 106.514C108.131 104.737 106.695 103.38 104.896 103.042L101.081 102.328C100.719 102.26 100.719 101.74 101.081 101.672L104.896 100.957C106.695 100.62 108.131 99.2629 108.568 97.4858L109.676 92.9819Z'
                        fill='url(#paint0_linear_2002_92)'
                      />
                      <path
                        d='M79.527 67.1048C79.7701 66.079 81.2299 66.079 81.473 67.1048L82.7119 72.331C84 77.7648 88.3942 81.9135 93.8931 82.8873L97.4398 83.5154C98.5406 83.7103 98.5406 85.2898 97.4398 85.4847L93.8931 86.1128C88.3942 87.0867 84 91.2353 82.7119 96.6691L81.473 101.895C81.2299 102.921 79.7701 102.921 79.527 101.895L78.2881 96.6691C77 91.2353 72.6058 87.0867 67.1069 86.1128L63.5602 85.4847C62.4594 85.2898 62.4594 83.7103 63.5602 83.5154L67.1069 82.8873C72.6058 81.9135 77 77.7648 78.2881 72.331L79.527 67.1048Z'
                        fill='url(#paint1_linear_2002_92)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_92'
                          x1='110'
                          y1='91.3333'
                          x2='110'
                          y2='112.667'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_92'
                          x1='80.5'
                          y1='63.0001'
                          x2='80.5'
                          y2='106'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.aiSearchBarResponse}>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    removeSearchResponse()
                  }}
                  className={styles.crossIcon}
                >
                  {/* X */}
                  <svg
                    width='10'
                    height='11'
                    viewBox='0 0 10 11'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9 1.5L1 9.5M1 1.5L9 9.5'
                      stroke={themes?.primaryColor}
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>

                <div className={styles.hideOverFlow}>
                  <p style={{ margin: 0 }}>{result?.sanitizedMessage}</p>

                  {result?.relatedData?.map((e, index) =>
                    e.pageUrl ? (
                      <div key={index}>
                        <div className={styles.aiSearchBarLink}>
                          <div className={styles.linkIcon}>
                            {/* Chevron */}
                            <svg
                              style={{ width: '8px' }}
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 320 512'
                              fill={themes?.primaryColor}
                            >
                              <path
                                stroke={themes?.primaryColor}
                                d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
                              />
                            </svg>
                          </div>

                          {e?.title ? (
                            <a
                              href={e.pageUrl}
                              style={{ margin: 0 }}
                              target='_blank'
                              rel='noopener noreferrer'
                              onClick={() => handleClick(e.pageUrl, e.id)}
                            >
                              {e?.title || 'No title available'}
                            </a>
                          ) : null}
                        </div>

                        {e?.description &&
                        e?.description !== 'No description' ? (
                          <p className={styles.description}>{e?.description}</p>
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
  ) : (
    <div>
      <div className={`${styles.searchWrapper} ${styles.new}`}>
        <div
          className={`${styles.searchContainer} ${styles.new} ${
            searchQuery ? styles.hasInput : ''
          }`}
        >
          <div className={`${styles.aiSearchBarHeader} ${styles.new}`}>
            <div className={`${styles.searchInputWrapper} `}>
              <span className={styles.imageIconRounded} onClick={closeSearch}>
                <img
                  src={themes?.imageURL}
                  className={styles.placeholderImage}
                  alt='logo'
                />
              </span>
              <input
                type='text'
                ref={resultInputRef}
                id='ai-search-bar'
                className={`${styles.aiSearchBarInput}`}
                placeholder={currentPlaceholder || 'Hi, How can I help you?'}
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isContracted && !isKeyboardOpen}
                autoComplete='off'
                autoCorrect='off'
              />
              <span className={styles.searchIcon}>
                {searchQuery && (
                  <div
                    className={styles.searchCross}
                    onClick={removeSearchQuery}
                    style={{ marginRight: '8px' }}
                  >
                    <svg
                      width='10'
                      height='11'
                      viewBox='0 0 10 11'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M9 1.5L1 9.5M1 1.5L9 9.5'
                        stroke={themes?.primaryColor}
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                )}
                <div onClick={handleSearch}>
                  <div className={styles.newSearchIcon}>
                    <img
                      src={SearchIcon}
                      alt='search'
                      style={{ height: '23px', width: '23px' }}
                    />
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      {containerVisibility &&
        (loading ? (
          <div className={`${styles.backdrop}`}>
            <div className={styles.searchOuterContainer}>
              <div className={styles.loadingContainer}>
                <div className={styles?.baseStarDiv}>
                  <svg
                    width='268'
                    height='267'
                    viewBox='0 0 268 267'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className={styles.baseStar}
                  >
                    <g opacity='0.3'>
                      <g filter='url(#filter0_f_1988_3526)'>
                        <circle
                          cx='133.79'
                          cy='133.589'
                          r='99.1225'
                          transform='rotate(58.73 133.79 133.589)'
                          fill='url(#paint0_linear_1988_3526)'
                        />
                      </g>
                      <g filter='url(#filter1_f_1988_3526)'>
                        <path
                          d='M123 92.9454C154.602 84.4777 183.52 113.395 175.052 144.997V144.997C166.584 176.599 127.082 187.183 103.948 164.049V164.049C80.8139 140.915 91.3985 101.413 123 92.9454V92.9454Z'
                          fill='url(#paint1_linear_1988_3526)'
                        />
                      </g>
                    </g>
                    <defs>
                      <filter
                        id='filter0_f_1988_3526'
                        x='0.383385'
                        y='0.183189'
                        width='266.813'
                        height='266.813'
                        filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'
                      >
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='BackgroundImageFix'
                          result='shape'
                        />
                        <feGaussianBlur
                          stdDeviation='17.135'
                          result='effect1_foregroundBlur_1988_3526'
                        />
                      </filter>
                      <filter
                        id='filter1_f_1988_3526'
                        x='65.7712'
                        y='65.7507'
                        width='136.476'
                        height='136.475'
                        filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'
                      >
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='BackgroundImageFix'
                          result='shape'
                        />
                        <feGaussianBlur
                          stdDeviation='12.8512'
                          result='effect1_foregroundBlur_1988_3526'
                        />
                      </filter>
                      <linearGradient
                        id='paint0_linear_1988_3526'
                        x1='55.1593'
                        y1='48.1274'
                        x2='193.518'
                        y2='232.711'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#FFD600' />
                        <stop offset='1' stopColor='#FF0000' stopOpacity='0' />
                      </linearGradient>
                      <linearGradient
                        id='paint1_linear_1988_3526'
                        x1='194.104'
                        y1='73.8931'
                        x2='73.8959'
                        y2='194.101'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop
                          offset='0.23'
                          stopColor='#FF0000'
                          stopOpacity='0.75'
                        />
                        <stop offset='1' stopColor='#00FFFF' stopOpacity='0' />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className={styles.overlayStars}>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.03 88.8411C109.285 87.8341 110.715 87.834 110.97 88.841L111.425 90.6465C112.767 95.9629 117.172 100.022 122.566 101.007C123.659 101.207 123.659 102.793 122.566 102.993C117.172 103.978 112.767 108.037 111.425 113.353L110.97 115.159C110.715 116.166 109.285 116.166 109.03 115.159L108.575 113.353C107.233 108.037 102.828 103.978 97.4342 102.993C96.3405 102.793 96.3405 101.207 97.4342 101.007C102.828 100.022 107.233 95.9629 108.575 90.6465L109.03 88.8411Z'
                        fill='url(#paint0_linear_2002_62)'
                      />
                      <path
                        d='M100.305 56.9804C100.401 56.1548 101.599 56.1548 101.695 56.9804L101.813 57.9898C102.172 61.08 104.528 63.5622 107.595 64.0827L108.933 64.3099C109.71 64.4418 109.71 65.5582 108.933 65.6901L107.595 65.9173C104.528 66.4378 102.172 68.92 101.813 72.0102L101.695 73.0196C101.599 73.8452 100.401 73.8452 100.305 73.0196L100.187 72.0102C99.828 68.92 97.4724 66.4378 94.4053 65.9173L93.0668 65.6901C92.2896 65.5582 92.2896 64.4418 93.0668 64.3099L94.4053 64.0827C97.4724 63.5622 99.828 61.08 100.187 57.9898L100.305 56.9804Z'
                        fill='url(#paint1_linear_2002_62)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_62'
                          x1='110'
                          y1='84.4516'
                          x2='110'
                          y2='119.548'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_62'
                          x1='101'
                          y1='53'
                          x2='101'
                          y2='77'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      width='400'
                      height='400'
                      className={styles?.star}
                      viewBox='0 0 150 150'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        opacity='0.5'
                        d='M55.1757 53.7016C55.2567 53.3596 55.7433 53.3597 55.8243 53.7016L56.2373 55.4436C56.6667 57.2549 58.1314 58.6378 59.9644 58.9624L61.1466 59.1718C61.5135 59.2368 61.5135 59.7632 61.1466 59.8282L59.9644 60.0376C58.1314 60.3622 56.6667 61.7451 56.2373 63.5563L55.8243 65.2984C55.7433 65.6403 55.2567 65.6403 55.1757 65.2984L54.7627 63.5564C54.3333 61.7451 52.8686 60.3622 51.0356 60.0376L49.8534 59.8282C49.4865 59.7632 49.4865 59.2368 49.8534 59.1718L51.0356 58.9624C52.8686 58.6378 54.3333 57.2549 54.7627 55.4436L55.1757 53.7016Z'
                        fill='url(#paint0_linear_2002_75)'
                      />
                      <path
                        d='M75.6523 35.9902C75.7003 35.5774 76.2997 35.5774 76.3477 35.9902L76.4063 36.4949C76.586 38.04 77.7638 39.2811 79.2973 39.5414L79.9666 39.6549C80.3552 39.7209 80.3552 40.2791 79.9666 40.3451L79.2973 40.4586C77.7638 40.7189 76.586 41.96 76.4063 43.5051L76.3477 44.0098C76.2997 44.4226 75.7003 44.4226 75.6523 44.0098L75.5937 43.5051C75.414 41.96 74.2362 40.7189 72.7027 40.4586L72.0334 40.3451C71.6448 40.2791 71.6448 39.7209 72.0334 39.6549L72.7027 39.5414C74.2362 39.2811 75.414 38.04 75.5937 36.4949L75.6523 35.9902Z'
                        fill='url(#paint1_linear_2002_75)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_75'
                          x1='55.5'
                          y1='52.3333'
                          x2='55.5'
                          y2='66.6667'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_75'
                          x1='76'
                          y1='34'
                          x2='76'
                          y2='46'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.757 96.0201C109.818 95.764 110.182 95.764 110.243 96.0201L110.888 98.7229C111.206 100.06 112.278 101.087 113.627 101.348L115.731 101.755C116.001 101.807 116.001 102.193 115.731 102.245L113.627 102.652C112.278 102.913 111.206 103.94 110.888 105.277L110.243 107.98C110.182 108.236 109.818 108.236 109.757 107.98L109.112 105.277C108.794 103.94 107.722 102.913 106.373 102.652L104.269 102.245C103.999 102.193 103.999 101.807 104.269 101.755L106.373 101.348C107.722 101.087 108.794 100.06 109.112 98.7229L109.757 96.0201Z'
                        fill='url(#paint0_linear_2002_80)'
                      />
                      <path
                        d='M100.826 62.9951C100.85 62.7887 101.15 62.7887 101.174 62.9951L101.203 63.2475C101.293 64.02 101.882 64.6406 102.649 64.7707L102.983 64.8275C103.178 64.8604 103.178 65.1396 102.983 65.1725L102.649 65.2293C101.882 65.3594 101.293 65.98 101.203 66.7525L101.174 67.0049C101.15 67.2113 100.85 67.2113 100.826 67.0049L100.797 66.7525C100.707 65.98 100.118 65.3594 99.3513 65.2293L99.0167 65.1725C98.8224 65.1396 98.8224 64.8604 99.0167 64.8275L99.3513 64.7707C100.118 64.6406 100.707 64.02 100.797 63.2475L100.826 62.9951Z'
                        fill='url(#paint1_linear_2002_80)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_80'
                          x1='110'
                          y1='94.7742'
                          x2='110'
                          y2='109.226'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_80'
                          x1='101'
                          y1='62'
                          x2='101'
                          y2='68'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.031 89.827C109.285 88.821 110.715 88.821 110.969 89.827L111.323 91.2234C112.605 96.2827 116.721 100.128 121.856 101.063C122.898 101.253 122.898 102.747 121.856 102.937C116.721 103.872 112.605 107.717 111.323 112.777L110.969 114.173C110.715 115.179 109.285 115.179 109.031 114.173L108.677 112.777C107.395 107.717 103.279 103.872 98.1441 102.937C97.1022 102.747 97.1022 101.253 98.1441 101.063C103.279 100.128 107.395 96.2827 108.677 91.2234L109.031 89.827Z'
                        fill='url(#paint0_linear_2002_86)'
                      />
                      <path
                        opacity='0.5'
                        d='M80.1757 78.7016C80.2567 78.3597 80.7433 78.3597 80.8243 78.7016L81.2373 80.4437C81.6667 82.255 83.1314 83.6378 84.9644 83.9624L86.1466 84.1718C86.5135 84.2368 86.5135 84.7633 86.1466 84.8283L84.9644 85.0376C83.1314 85.3622 81.6667 86.7451 81.2373 88.5564L80.8243 90.2985C80.7433 90.6404 80.2567 90.6404 80.1757 90.2985L79.7627 88.5564C79.3333 86.7451 77.8686 85.3622 76.0356 85.0376L74.8534 84.8283C74.4865 84.7633 74.4865 84.2368 74.8534 84.1718L76.0356 83.9624C77.8686 83.6378 79.3333 82.255 79.7627 80.4437L80.1757 78.7016Z'
                        fill='url(#paint1_linear_2002_86)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_86'
                          x1='110'
                          y1='85.4839'
                          x2='110'
                          y2='118.516'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_86'
                          x1='80.5'
                          y1='77.3334'
                          x2='80.5'
                          y2='91.6667'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className={styles?.star}
                      width='400'
                      height='400'
                      viewBox='0 0 200 200'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M109.676 92.9819C109.759 92.6436 110.24 92.6436 110.324 92.9819L111.432 97.4858C111.869 99.2629 113.305 100.62 115.104 100.957L118.918 101.672C119.281 101.74 119.281 102.26 118.918 102.328L115.104 103.042C113.305 103.38 111.869 104.737 111.432 106.514L110.324 111.018C110.24 111.356 109.759 111.356 109.676 111.018L108.568 106.514C108.131 104.737 106.695 103.38 104.896 103.042L101.081 102.328C100.719 102.26 100.719 101.74 101.081 101.672L104.896 100.957C106.695 100.62 108.131 99.2629 108.568 97.4858L109.676 92.9819Z'
                        fill='url(#paint0_linear_2002_92)'
                      />
                      <path
                        d='M79.527 67.1048C79.7701 66.079 81.2299 66.079 81.473 67.1048L82.7119 72.331C84 77.7648 88.3942 81.9135 93.8931 82.8873L97.4398 83.5154C98.5406 83.7103 98.5406 85.2898 97.4398 85.4847L93.8931 86.1128C88.3942 87.0867 84 91.2353 82.7119 96.6691L81.473 101.895C81.2299 102.921 79.7701 102.921 79.527 101.895L78.2881 96.6691C77 91.2353 72.6058 87.0867 67.1069 86.1128L63.5602 85.4847C62.4594 85.2898 62.4594 83.7103 63.5602 83.5154L67.1069 82.8873C72.6058 81.9135 77 77.7648 78.2881 72.331L79.527 67.1048Z'
                        fill='url(#paint1_linear_2002_92)'
                      />
                      <defs>
                        <linearGradient
                          id='paint0_linear_2002_92'
                          x1='110'
                          y1='91.3333'
                          x2='110'
                          y2='112.667'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                        <linearGradient
                          id='paint1_linear_2002_92'
                          x1='80.5'
                          y1='63.0001'
                          x2='80.5'
                          y2='106'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor={themes?.primaryColor} />
                          <stop
                            offset='0.22'
                            stopColor={themes?.primaryColor}
                          />
                          <stop offset='1' stopColor={themes?.primaryColor} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.backdrop}`}>
            <div className={styles.searchOuterContainer}>
              <div className={styles.searchResultContainer}>
                <div className={styles.searchResultDescription}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {result?.sanitizedMessage ? (
                      <p>{result?.sanitizedMessage}</p>
                    ) : (
                      <p>No result found</p>
                    )}

                    <div
                      className={styles.closeIcon}
                      onClick={removeSearchQuery}
                    >
                      <svg
                        width='19'
                        height='19'
                        viewBox='0 0 19 19'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M15.5 7.5H11.5M11.5 7.5V3.5M11.5 7.5L17.5 1.5M3.5 11.5H7.5M7.5 11.5V15.5M7.5 11.5L1.5 17.5'
                          stroke={themes?.primaryColor}
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className={styles.searchContainerGrid}>
                  {result?.relatedData?.map((e, index) => (
                    <div key={index} className={styles.searchResultCard}>
                      <img
                        src={e.image}
                        alt='Product Development'
                        className={styles.searchResultImage}
                      />
                      <div className={styles.searchResultContent}>
                        <p className={styles.searchResultTitle}>
                          {e?.title || 'No title available'}
                        </p>
                        <p className={styles.searchResultDescription}>
                          {e?.description || 'No description available'}
                        </p>

                        <a
                          href={e.pageUrl}
                          style={{ margin: 0 }}
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={() => handleClick(e.pageUrl, e.id)}
                          className={styles.searchResultReadMore}
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
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
            'https://cdn.jsdelivr.net/npm/react-ai-search-bar@1.0.5-beta.3.staging/dist/index.umd.css'
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
