import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

import {Menu, Icon, Dropdown, Image, Button} from 'semantic-ui-react'

const Navbar = ({handleClick, isLoggedIn}) => (
  <Menu color="purple" inverted id="navBar" fixed="top">
    <Menu.Item id="navbar-title-and-image-container">
      <div id="nav-title">
        <div className="nav-title-text">Platypus</div>
      </div>
    </Menu.Item>
    <Menu.Item>
      <Link className="nav-text" to="/home">
        Home
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link className="nav-text" to="/dashboard">
        Dashboard
      </Link>
    </Menu.Item>
    {isLoggedIn ? (
      <Menu.Menu position='right' >
      <Menu.Item id="menu-dropdown">
        <Button size="huge">
          <Dropdown text="User" labeled button inverted>
            <Dropdown.Menu>
              <Dropdown.Header
                content={<Link to="/userProfile">User Profile</Link>}
              />
              <Dropdown.Header
                onClick={handleClick}
                content={<Link to="/userProfile">Log Out</Link>}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Button>
      </Menu.Item>
      </Menu.Menu>
    ) : (
      <Menu.Menu position='right' >
        <Menu.Item>
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/signup">Sign Up</Link>
        </Menu.Item>
      </Menu.Menu>

    )}
  </Menu>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
