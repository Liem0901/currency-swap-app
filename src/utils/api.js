import axios from 'axios'

/**
 * Custom GET request wrapper
 * @param {string} url - The URL to make the request to
 * @param {object} config - Optional axios configuration
 * @returns {Promise} - Axios response promise
 */
export const _get = async (url, config = {}) => {
    try {
        const response = await axios.get(url, config)
        return response
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}

/**
 * Custom POST request wrapper
 * @param {string} url - The URL to make the request to
 * @param {object} data - The data to send
 * @param {object} config - Optional axios configuration
 * @returns {Promise} - Axios response promise
 */
export const _post = async (url, data, config = {}) => {
    try {
        const response = await axios.post(url, data, config)
        return response
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}
