import Config from 'react-global-configuration'
import { merge } from 'lodash'
import BaseConfig from './Base'
import DevConfig from './Dev'
import DevTestConfig from './DevTest'
import DevDemoConfig from './DevDemo'
import TestConfig from './Test'
import DemoConfig from './Demo'
import LiveConfig from './Live'

let { location } = window

let config = null
let clientBaseUri = location.hostname // client app base
switch (clientBaseUri) {
  case "localhost":
    clientBaseUri += `:${location.port}` // append port
    switch (location.port) {
      case "5001":
        config = DevConfig
        break
      case "5002":
        config = DevTestConfig
        break
      case "5003":
        config = DevDemoConfig
        break
      default:
        throw Error("Unable to locate suitable environment configuration.")
    }
    break
  case "test":
    config = TestConfig
    break
  case "demo":
    config = DemoConfig
    break
  case "live":
    config = LiveConfig
    break
  default:
    throw Error("Unable to locate suitable environment configuration.")
}

config.clientBaseUri = `${location.protocol}//${clientBaseUri}/`

Config.set(merge(BaseConfig, config))

// document title?
if (config.showConfigInTitle) {
  document.title = `${config.configTitle} ${document.title}`
}

console.log(`[CONFIG] Using (${location.hostname}:${location.port}):`, Config.get())