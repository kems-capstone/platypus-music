import React, {Component} from 'react'
import {connect} from 'react-redux'

class Homepage extends Component {
  constructor(props) {
    super(props)
    console.log('Props on homepage', props)
  }

  render() {
    return (
      <div className="homepage" id="homepageBackgrouund">
        <div className="homepageText">
          <h1>Welcome to Platypus!</h1>
          <p>
            Platypus is a crowd-sourcing playlist app, that lets everyone be the
            DJ.
          </p>
          <p>
            Create your own room or enter the secret room code to join one that
            is already playing.
          </p>
        </div>
      </div>
    )
  }
}

export default connect(null, null)(Homepage)
