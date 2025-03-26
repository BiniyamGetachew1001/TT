import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BookmarkProvider } from './contexts/BookmarkContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BookmarkProvider>
      <App />
    </BookmarkProvider>
  </React.StrictMode>,
)
