import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MinimalApp from './MinimalApp';
import reportWebVitals from './reportWebVitals';

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Create React root
const root = ReactDOM.createRoot(container);

// Render the app - using MinimalApp to test basic functionality (StrictMode disabled for debugging)
root.render(<MinimalApp />);

// Performance monitoring
reportWebVitals(console.log);

// Hot Module Replacement for development - disabled for production debugging
// @ts-ignore
// if (module.hot) {
//   // @ts-ignore
//   module.hot.accept();
// } 