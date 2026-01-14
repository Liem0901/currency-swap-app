import { useState, useEffect } from 'react'
import Select from 'react-select'
import { _get } from './utils/api'
import { showSwapSuccessToast } from './components/ToastAlert'
import './App.css'

function App() {
  const [prices, setPrices] = useState({})
  const [tokens, setTokens] = useState([])
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [swapping, setSwapping] = useState(false) // Loading state

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      setLoading(true)
      const response = await _get('https://interview.switcheo.com/prices.json')
      const data = response.data

      // handle duplicates by taking the most recent price
      const priceMap = {}
      const tokenSet = new Set()

      // Sort by date (most recent first) to handle duplicates
      const sortedData = [...data].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      )

      // Build price map, keeping only the first (most recent) entry for each currency
      sortedData.forEach(({ currency, price }) => {
        if (price != null && price > 0 && !priceMap[currency]) {
          priceMap[currency] = price
          tokenSet.add(currency)
        }
      })

      // Create tokens array sorted alphabetically
      const validTokens = Array.from(tokenSet)
        .sort((a, b) => a.localeCompare(b))
        .map(token => ({ token, price: priceMap[token] }))

      setTokens(validTokens)
      setPrices(priceMap)

      // Set default tokens if available
      if (validTokens.length >= 2) {
        setFromToken(validTokens[0].token)
        setToToken(validTokens[1].token)
      }
    } catch (error) {
      console.error('Error fetching prices:', error)
      setErrors({ fetch: 'Failed to load token prices. Please refresh the page.' })
    } finally {
      setLoading(false)
    }
  }

  const getTokenIcon = (token) => {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`
  }

  // Convert tokens to react-select format
  const tokenOptions = tokens.map(({ token }) => ({
    value: token,
    label: token
  }))

  // Custom option renderer with icon
  const formatOptionLabel = ({ value, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <img
        src={getTokenIcon(value)}
        alt={value}
        style={{ width: '24px', height: '24px', borderRadius: '50%' }}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
      <span>{label}</span>
    </div>
  )

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: state.isFocused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.2)',
      borderWidth: '0.1rem',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(255, 255, 255, 0.1)' : 'none',
      minHeight: '42px',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)'
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#1a1a1a',
      border: '0.1rem solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      marginTop: '4px',
      zIndex: 1000
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 1000
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? 'rgba(255, 255, 255, 0.1)'
        : state.isSelected
          ? 'rgba(255, 255, 255, 0.15)'
          : 'transparent',
      color: '#ffffff',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#ffffff'
    }),
    input: (base) => ({
      ...base,
      color: '#ffffff'
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.4)'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.8)',
      '&:hover': {
        color: '#ffffff'
      }
    })
  }

  const calculateExchangeRate = () => {
    if (!fromToken || !toToken || !prices[fromToken] || !prices[toToken]) {
      return null
    }
    return prices[fromToken] / prices[toToken]
  }

  const handleFromAmountChange = (value) => {
    const numValue = value.replace(/[^0-9.]/g, '')
    setFromAmount(numValue)
    setErrors({ ...errors, fromAmount: '' })

    if (numValue && fromToken && toToken) {
      const rate = calculateExchangeRate()
      if (rate) {
        const calculated = (parseFloat(numValue) * rate).toFixed(6)
        setToAmount(calculated.replace(/\.?0+$/, ''))
      }
    } else {
      setToAmount('')
    }
  }

  const handleToAmountChange = (value) => {
    const numValue = value.replace(/[^0-9.]/g, '')
    setToAmount(numValue)
    setErrors({ ...errors, toAmount: '' })

    if (numValue && fromToken && toToken) {
      const rate = calculateExchangeRate()
      if (rate) {
        const calculated = (parseFloat(numValue) / rate).toFixed(6)
        setFromAmount(calculated.replace(/\.?0+$/, ''))
      }
    } else {
      setFromAmount('')
    }
  }

  const handleFromTokenChange = (selectedOption) => {
    const token = selectedOption ? selectedOption.value : ''
    if (token === toToken) {
      // Swap tokens if selecting the same token
      setToToken(fromToken)
    }
    setFromToken(token)
    setErrors({ ...errors, fromToken: '' })

    if (fromAmount && token && toToken) {
      const rate = calculateExchangeRate()
      if (rate) {
        const calculated = (parseFloat(fromAmount) * rate).toFixed(6)
        setToAmount(calculated.replace(/\.?0+$/, ''))
      }
    }
  }

  const handleToTokenChange = (selectedOption) => {
    const token = selectedOption ? selectedOption.value : ''
    if (token === fromToken) {
      // Swap tokens if selecting the same token
      setFromToken(toToken)
    }
    setToToken(token)
    setErrors({ ...errors, toToken: '' })

    if (fromAmount && fromToken && token) {
      const rate = calculateExchangeRate()
      if (rate) {
        const calculated = (parseFloat(fromAmount) * rate).toFixed(6)
        setToAmount(calculated.replace(/\.?0+$/, ''))
      }
    }
  }

  const swapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount

    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!fromToken) {
      newErrors.fromToken = 'Please select a token to swap from'
    }

    if (!toToken) {
      newErrors.toToken = 'Please select a token to swap to'
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      newErrors.fromAmount = 'Please enter a valid amount greater than 0'
    }

    if (fromToken === toToken) {
      newErrors.general = 'Cannot swap the same token'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSwapping(true)

    // Simulate swap transaction
    setTimeout(() => {
      setSwapping(false)

      // Show success toast notification
      showSwapSuccessToast(fromAmount, fromToken, toAmount, toToken)

      setFromAmount('')
      setToAmount('')
    }, 1500)
  }

  const exchangeRate = calculateExchangeRate()

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading token prices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="swap-container">
        <div className="swap-header">
          <h1>Currency Swap</h1>
          <p className="subtitle">Exchange tokens at the best rates</p>
        </div>

        {errors.fetch && (
          <div className="error-banner">
            {errors.fetch}
          </div>
        )}

        <form onSubmit={handleSubmit} className="swap-form">
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          {/* From Token Section */}
          <div className="token-section">
            <label className="section-label">From</label>
            <div className="token-input-group">
              <div className="token-select-wrapper">
                {fromToken && (
                  <img
                    src={getTokenIcon(fromToken)}
                    alt={fromToken}
                    className="token-icon"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <Select
                  value={tokenOptions.find(option => option.value === fromToken) || null}
                  onChange={handleFromTokenChange}
                  options={tokenOptions}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Select token"
                  styles={selectStyles}
                  className={`react-select-container ${errors.fromToken ? 'error' : ''}`}
                  classNamePrefix="react-select"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
              <div className="amount-input-wrapper">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  placeholder="0.00"
                  className={`amount-input ${errors.fromAmount ? 'error' : ''}`}
                />
                {fromToken && prices[fromToken] && (
                  <span className="token-price">${prices[fromToken].toFixed(4)}</span>
                )}
              </div>
            </div>
            {errors.fromToken && <div className="error-message">{errors.fromToken}</div>}
            {errors.fromAmount && <div className="error-message">{errors.fromAmount}</div>}
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={swapTokens}
            className="swap-button"
            aria-label="Swap tokens"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
            </svg>
          </button>

          {/* To Token Section */}
          <div className="token-section">
            <label className="section-label">To</label>
            <div className="token-input-group">
              <div className="token-select-wrapper">
                {toToken && (
                  <img
                    src={getTokenIcon(toToken)}
                    alt={toToken}
                    className="token-icon"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <Select
                  value={tokenOptions.find(option => option.value === toToken) || null}
                  onChange={handleToTokenChange}
                  options={tokenOptions}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Select token"
                  styles={selectStyles}
                  className={`react-select-container ${errors.toToken ? 'error' : ''}`}
                  classNamePrefix="react-select"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
              <div className="amount-input-wrapper">
                <input
                  type="text"
                  value={toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  placeholder="0.00"
                  className={`amount-input ${errors.toAmount ? 'error' : ''}`}
                />
                {toToken && prices[toToken] && (
                  <span className="token-price">${prices[toToken].toFixed(4)}</span>
                )}
              </div>
            </div>
            {errors.toToken && <div className="error-message">{errors.toToken}</div>}
            {errors.toAmount && <div className="error-message">{errors.toAmount}</div>}
          </div>

          {/* Exchange Rate Display */}
          {exchangeRate && fromToken && toToken && (
            <div className="exchange-rate">
              <span>1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={swapping || !fromToken || !toToken || !fromAmount}
          >
            {swapping ? (
              <>
                <div className="button-spinner"></div>
                Swapping...
              </>
            ) : (
              'Swap Tokens'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="swap-footer">
          <p>| Currency Swap By WILLIAM THOMAS</p>
        </div>
      </div>
    </div>
  )
}

export default App
