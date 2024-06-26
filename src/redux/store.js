import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { api } from "./api";
import authSlice from './slice/authSlice';
import { 
    persistStore, 
    persistReducer,
    FLUSH,  
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root',
    storage,
  }

const rootReducer = combineReducers({
    auth: authSlice,
});

const  persistedReducer =  persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        persistedReducer 
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({serializableCheck: {ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]}}),
            api.middleware],
});

export const persistor = persistStore(store);
export default store;