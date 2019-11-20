import React from 'react'
import { render } from 'react-dom'
import { Panel } from 'react-bootstrap'
import LoginLogo from './areas/public/LoginLogo'

import './Styles.scss'
import './Print.scss'

document.body.className = "public"

// render
render((
  <div className="master" >
    <div className="main container-fluid">
      <div className="text-center">
        <form className="form-signin">
          <LoginLogo />
          <div>
            <Panel>
              <Panel.Body>
                <div>
                  <p>An error occurred, please try again.</p>
                  <p>If the problem persists contact support.</p>
                </div>
              </Panel.Body>
            </Panel>
          </div>
        </form>
      </div>
    </div>
  </div>
), document.getElementById('root'));

