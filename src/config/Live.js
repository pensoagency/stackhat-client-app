export default {
  apiServiceBaseUri: "https://stackhat-api.pensoagency.com/",

  auth: {
    versionCheck: {
      enabled: true,
      intervalMs: (1000 * 60) * 2, // 2 minutes          
    }
  },

  theme: {
    logoContainer: "images-live"
  },  
}