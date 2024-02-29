import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import {
  Search,
  Send,
  XCircle as Cross,
  ExternalLink as Link
} from 'react-feather'
import DOMPurify from 'dompurify'

export const SearchBar = ({ placeholder, theme }) => {
  const [input, setInput] = useState('')
  const [searched, setSearched] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [displayedFollowUp, setDisplayedFollowUp] = useState([])
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const searchTheme = theme || 'dark'

  const sample = {
    message: `Greetings, fellow traveler of the digital domain! 🚀 Step into the boundless expanse of AI-powered wonders,
    where the realms of imagination and innovation converge. Here, amidst the vast circuits of virtuality, you're not just a visitor;
    you're a pioneer forging paths into the future. In this grand sanctuary of artificial intelligence, the horizon stretches endlessly,
    offering limitless opportunities to explore, create, and learn. Whether you're a seasoned adventurer or a curious newcomer,
    you're embraced by the warmth of knowledge and the thrill of discovery.`,
    options: [
      {
        title: 'Product 1',
        image_link:
          'https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg',
        link: 'https://example.com/product1',
        description: 'Description of Product 1'
      },
      {
        title: 'Product 2',
        image_link:
          'https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg',
        link: 'https://example.com/product2',
        description: 'Description of Product 2'
      },
      {
        title: 'Product 3',
        image_link:
          'https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg',
        link: 'https://example.com/product3',
        description: 'Description of Product 3'
      }
    ],
    followup_questions: [
      'Would you like more information about any specific product?',
      'Are you looking for anything else?',
      'How can I assist you further?'
    ]
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSendClick = (e) => {
    setSearched(true)
  }

  const handleSendClickKeyboard = (e) => {
    if (e.keyCode === 13) {
      setSearched(true)
    }
  }

  useEffect(() => {
    if (input === '') {
      setSearched(false)
      setDisplayedText('')
      setDisplayedProducts([])
      setDisplayedFollowUp([])
    }
  }, [input])

  const handleClear = () => {
    setInput('')
    setSearched(false)
    setDisplayedText('')
    setDisplayedProducts([])
    setDisplayedFollowUp([])
  }

  const SetNextQuestion = (question) => {
    setInput(question)
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
        }, 300) // Delay to allow time for the transition
      }, 3000) // Change placeholder every 3 seconds

      return () => clearInterval(timer)
    }
  }, [placeholder])

  useEffect(() => {
    if (searched) {
      let index = 0
      const interval = setInterval(() => {
        setDisplayedText((prevText) => prevText + sample.message[index])
        index++
        if (index === sample.message.length) {
          clearInterval(interval)
          if (sample?.options?.length > 0) {
            setDisplayedProducts(sample?.options)
          }
          if (sample?.followup_questions?.length > 0) {
            setDisplayedFollowUp(sample?.followup_questions)
          }
        }
      }, 30)
      return () => clearInterval(interval)
    }
  }, [searched, sample.message])

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
      >
        <div className={styles.searchResultBox}>
          <div
            className={`${styles.innerSearch} ${
              searchTheme === 'light' ? styles.light : ''
            }`}
          >
            <p
              className={styles.message}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(displayedText)
              }}
            />
            {displayedProducts?.length > 0 ? (
              <div className={styles.cardContainer}>
                {displayedProducts.map((e, index) => {
                  return (
                    <a
                      className={`${styles.singleCard} ${
                        searchTheme === 'light' ? styles.light : ''
                      }`}
                      href={e.link}
                      key={index}
                      style={{ '--index': index }}
                    >
                      <img src={e.image_link} alt='abc' target='_blank' />
                      <div className={styles.content}>
                        {e.title ? <h3>{e.title}</h3> : null}
                        {e.description ? <p>{e.description}</p> : null}
                      </div>
                      <Link size={18} className={styles.linkIcon} />
                    </a>
                  )
                })}
              </div>
            ) : null}
            {displayedFollowUp?.length > 0 ? (
              <React.Fragment>
                <p
                  className={`${styles.suggested} ${
                    searchTheme === 'light' ? styles.light : ''
                  }`}
                >
                  Suggested Questions:{' '}
                </p>
                <div className={styles.buttonContainer}>
                  {displayedFollowUp.map((question, index) => {
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
        </div>
      </div>
    </div>
  )
}
