import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import QueryString from 'query-string'

import Config from './config'

// version
import Version from './services/Version'
console.log(`[APP] v${Version}`)

import {
  AuthenticationStore as auth, StackStore, AuditStore
} from './stores'

import './Styles.scss'
import './Print.scss'

import ErrorBoundary from './components/errors/ErrorBoundary'
import Master from './areas/Master'

import './assets/icon.png'
import './assets/spinner.svg'
import { Stores } from './services'

let hash = QueryString.parse(location.hash)
if (hash.mode === "logout") {
  auth.SignOut()
}

// init auth
auth.Initialise()
  .then(() => {

    let stores = new Stores([
      { name: "StackStore", store: new StackStore(auth) },
      { name: "AuditStore", store: new AuditStore(auth) },      
    ])

    // render
    render((
      <ErrorBoundary>
        <Provider
          Authentication={auth}
          Settings={auth.Settings}  
          Stores={stores}        
          {...stores}
        >
          <BrowserRouter>
            <Master />
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    ), document.getElementById('root'));

  })