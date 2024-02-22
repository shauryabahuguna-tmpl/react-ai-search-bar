import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Search, Send, X as Cross } from 'react-feather'

export const SearchBar = ({ text, placeholder }) => {
  const [input, setInput] = useState('')
  const [searched, setSearched] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [displayedProducts, setDisplayedProducts] = useState([])

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
      },
      {
        title: 'Product 4',
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
    }
  }, [input])

  const handleClear = () => {
    setInput('')
    setSearched(false)
    setDisplayedText('')
    setDisplayedProducts([])
  }

  useEffect(() => {
    if (searched) {
      let index = 0
      const interval = setInterval(() => {
        setDisplayedText((prevText) => prevText + sample.message[index])
        index++
        if (index === sample.message.length) {
          clearInterval(interval)
          setDisplayedProducts(sample.options)
        }
      }, 30)
      return () => clearInterval(interval)
    }
  }, [searched, sample.message])

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Search className={styles.searchIcon} color='grey' size={18} />
        <input
          className={styles.input}
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder || 'Hi, How can I help you?'}
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
          <div className={styles.innerSearch}>
            <p className={styles.message}>{displayedText}</p>
            {displayedProducts?.length > 0 ? (
              <div className={styles.cardContainer}>
                {displayedProducts.map((e, index) => {
                  return (
                    <a className={styles.singleCard} href={e.link} key={index}>
                      <img src={e.image_link} alt='abc' target='_blank' />
                      <div className={styles.content}>
                        <h3>{e.title}</h3>
                        <p>{e.description}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
