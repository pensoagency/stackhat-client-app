import { OidcClient } from 'oidc-client'
import { AuthenticationContext } from 'react-adal'

class OidcAuthenticationContext {

  constructor(config, hash) {
    this.config = config
    this.client = new OidcClient(config)
    console.log("[OIDC]", config)    

    this.adalContext = new AuthenticationContext({
      tenant: hash.tid,
      clientId: hash.cid,
      endpoints: {
        api: hash.cid
      },
      cacheLocation: 'sessionStorage'
    })
  }
  
  handleWindowCallback = (hash) => {
    
  } 

  invalidateResourceTokens = () => {

  }

  isCallback = (hash) => {
    return this.adalContext.isCallback(hash)
  } 

  getCachedToken = (resource) => {

  }

  getCachedUser = () => {

  }

  login = () => {
    return this.client.createSigninRequest({ state: { bar: 15 } }).then((req) => {
      window.location = req.url
    })
  }

}

export default OidcAuthenticationContext