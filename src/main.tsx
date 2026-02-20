import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Debug utilities for development (exposed on window.cosmicDebug)
import { validateGeneKeysProfile, formatValidationReport } from './services/profileValidation'

if (import.meta.env.DEV) {
  // @ts-expect-error - Expose debug utilities to window in dev mode
  window.cosmicDebug = {
    validateGeneKeysProfile,
    formatValidationReport,
    // Quick validation helper - call with profile from context
    validateProfile: (profile: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const report = validateGeneKeysProfile(profile as any);
      console.log(formatValidationReport(report));
      return report;
    },
  };
  console.log('🔮 Cosmic Debug utilities available at window.cosmicDebug');
  console.log('   Usage: cosmicDebug.validateProfile(profile)');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
