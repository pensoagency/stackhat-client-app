export default {

  apiServiceBaseUri: "unset",

  clientBaseUri: "unset",
  clientId: "ReactAppClient",
  showConfigInTitle: false,

  auth: {
    idleTimeoutMs: (1000 * 60) * 15, //  15 minutes
    //idleTimeoutMs: 3000, // 3 seconds, for testing
    versionCheck: {
      enabled: false,
      intervalMs: (1000 * 60) * 2, // 2 minutes    
      //intervalMs: (2000), // 2 seconds, for testing      
    }
  },

  theme: {
    logoContainer: "unset"
  },

  errors: {
    showDetail: false
  }

}