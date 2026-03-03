import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { FrappeProvider } from 'frappe-react-sdk'

// Redux
import { Provider } from 'react-redux'
import { store, persistor } from './app/store'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FrappeProvider
          url="http://127.0.0.1:8000"
          enableSocket={true}
          socketPort={9000}
        >
          <App />
        </FrappeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
)
