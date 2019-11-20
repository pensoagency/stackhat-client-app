import { RunWithOidcClient, OidcAuthenticationContext } from './services/oidc'
import Config from 'react-global-configuration'
import Configure from './config'

let config = Config.get("auth")

require('./indexBusy')

let redirect_uri = window.location.href.split("?")[0].split("#")[0]

let client = new OidcAuthenticationContext({
  authority: config.oidc.authority,
  client_id: config.oidc.client_id,
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