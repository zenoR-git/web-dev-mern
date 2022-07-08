import React from 'react'
import reactDOM from 'react-dom'
import  App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {Provider} from 'react-redux' 
import {PersistGate} from 'redux-persist/integration/react'        
import persistStore from 'redux-persist/es/persistStore';
import store from './store';

const persistedStore = persistStore(store)

const root = document.getElementById("root")

reactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
           <App />
        </PersistGate>
    </Provider>
    ,root)