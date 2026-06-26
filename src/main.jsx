import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// グローバルなデフォルトスタイルをリセットする
const globalStyle = document.createElement('style')
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; }
  button { font-family: inherit; }
`
document.head.appendChild(globalStyle)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
