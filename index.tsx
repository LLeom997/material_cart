import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Use type assertion for react-router-dom exports to bypass environment-specific type resolution issues
import * as reactRouterDom from 'react-router-dom';
import App from './App';

const { HashRouter } = reactRouterDom as any;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);