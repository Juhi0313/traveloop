import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

const rootEl = document.getElementById('root')!;

try {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} catch (e) {
  rootEl.innerHTML = `<div style="padding:40px;font-family:monospace;background:#fff1f2;min-height:100vh">
    <h1 style="color:#dc2626;font-size:24px;margin-bottom:16px">Mount error:</h1>
    <pre style="white-space:pre-wrap;word-break:break-all">${e}</pre>
  </div>`;
}
