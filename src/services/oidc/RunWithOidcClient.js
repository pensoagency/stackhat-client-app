import React from 'react'

export default (authContext, app, appError) => {

  //it must run in iframe too for refreshToken (parsing hash and get token)
  authContext.handleWindowCallback();

  // Clear the resource cache on new login
  authContext.invalidateResourceTokens();

  //prevent iframe double app !!!
  if (window === window.parent) {
    if (!authContext.isCallback(window.location.hash)) {
      const resource = authContext.config.client_id;
      const token = authContext.getCachedToken(resource);
      const user = authContext.getCachedUser();

      if (!token || !user) {
        authContext
          .login()
          .catch(err => appError())
      } else {
        app();
      }
    }
  }
}