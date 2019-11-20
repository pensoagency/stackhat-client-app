import { RunWithOidcClient, OidcAuthenticationContext } from './services/oidc'
import QueryString from 'query-string'
import Axios from 'axios'
import Config from 'react-global-configuration'
import Configure from './config'

let hash = QueryString.parse(location.hash)
if (hash.mode === "sso") {

  require('./indexBusy')

  Axios.get(`${Config.get().apiServiceBaseUri}api/AuthInstance/${hash.tid}`)
    .then((config) => {

      let redirect_uri = window.location.href.split("?")[0].split("#")[0]

      let client = new OidcAuthenticationContext({
        authority: config.data.instance,
        client_id: hash.cid,
        redirect_uri: redirect_uri,
        post_logout_redirect_uri: redirect_uri,
        response_type: 'id_token',
        scope: 'openid profile email',
        filterProtocolClaims: true,
        loadUserInfo: true
      }, hash)

      RunWithOidcClient(
        client,
        () => { require('./indexApp') },
        () => { require('./indexError') }
      )

    }).catch((err) => {
      console.log(err)
      require('./indexError')
    })

} else {
  require('./indexApp')
}