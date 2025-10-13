// src/config/environment.js
const config = {
  development: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    DEBUG: true
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || '/api',
    DEBUG: false
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];