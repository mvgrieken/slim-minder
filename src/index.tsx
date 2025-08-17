import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SimpleApp from './SimpleApp';
import SimpleAppWithDB from './SimpleAppWithDB';
import reportWebVitals from './reportWebVitals';

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Create React root
const root = ReactDOM.createRoot(container);

// Render the app - using SimpleAppWithDB for database testing
root.render(
  <React.StrictMode>
    <SimpleAppWithDB />
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals(console.log);

// Hot Module Replacement for development - disabled for production debugging
// @ts-ignore
// if (module.hot) {
//   // @ts-ignore
//   module.hot.accept();
// } 