import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counterSlice'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, counterReducer)

export const store = configureStore({
  reducer: {
    counter: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
})

export const persistor = persistStore(store)
