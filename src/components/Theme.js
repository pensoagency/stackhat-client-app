import React from 'react';
import { inject, observer } from 'mobx-react'
import { Style } from 'react-style-tag'

class Theme extends React.Component {

  render() {

    let theme_header_bgcolour = "#25273a",
      theme_footer_bgcolour = "#25273a",
      theme_header_nav_colour = "#fff",
      theme_header_nav_hover_colour = "#c2b896",
      theme_header_nav_active_colour = "#fff",
      theme_header_nav_active_bgcolour = "#555",
      theme_header_nav_hover_bgcolour = "#555",
      theme_subnav_colour,
      theme_subnav_active_bgcolour,
      theme_button_primary_bgcolour,
      theme_button_primary_colour,
      theme_button_bgcolour,
      theme_button_colour


    return (
      <Style>{`
          body { background-color: ${theme_footer_bgcolour} !important; }
          .navbar-default { background-color: ${theme_header_bgcolour} !important; }
          .navbar-nav a:not(.active) { color: ${theme_header_nav_colour} !important; }
          .navbar-nav a.active { color: ${theme_header_nav_active_colour} !important; background-color: ${theme_header_nav_active_bgcolour} !important; }
          .navbar-nav a:hover { color: ${theme_header_nav_hover_colour} !important; background-color: ${theme_header_nav_hover_bgcolour} !important; }
          .subnav .nav a:not(.active) { color: ${theme_subnav_colour} !important; } 
          .subnav .nav a.active { background-color: ${theme_subnav_active_bgcolour} !important; }           
          .btn-primary { color: ${theme_button_primary_colour}; background-color: ${theme_button_primary_bgcolour} !important; }
          .btn-default { color: ${theme_button_colour}; background-color: ${theme_button_bgcolour} !important; }          
        `}</Style>
    )

  }
}

export default inject("Authentication")(observer(Theme))