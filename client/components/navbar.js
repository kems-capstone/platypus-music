import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';

import {
  Menu,
  Icon,
  Dropdown,
  Image,
  Button,
  Grid,
  Input,
  MenuMenu
} from 'semantic-ui-react';
import history from '../history';

const Navbar = ({handleClick, isLoggedIn, roomState}) => {
  return (
    <div id="navbar">
      {isLoggedIn ? (
        <Menu id="navbar-menu" pointing fixed="bottom">
          <Menu.Item
            id="navbar-menuitem"
            as="a"
            href="/dashboard"
            icon="home"
          />
          {roomState.room.id ? (
            <Menu.Item
              id="navbar-menuitem"
              as="a"
              href={`/room/${roomState.room.id}`}
              icon="bars"
            />
          ) : (
            <Menu.Item id="navbar-menuitem" icon="bars" disabled />
          )}
          <div id="navbar-menuitem">
            <Dropdown icon="user" className="user-icon">
              <Dropdown.Menu>
                {/* <Dropdown.Item as="a" href="/userProfile" text="User Profile" /> */}
                <Dropdown.Item
                  as="a"
                  href="/home"
                  text="Log Out"
                  onClick={handleClick}
                />
              </Dropdown.Menu>
              {/* </Menu.Item> */}
            </Dropdown>
          </div>
        </Menu>
      ) : null}
    </div>

    // <Menu color="violet" inverted id="navBar" fixed="top">

    // <Link className="nav-text" to="/home">
    //   <Menu.Item id="navbar-title-and-image-container">
    //     <div id="nav-title">
    //       <div className="nav-title-text">Platypus</div>
    //     </div>
    //   </Menu.Item>
    // </Link>

    //   {isLoggedIn ? (
    // <Menu.Menu position="right">
    //   <Menu.Item>
    //     <Link className="nav-text" to="/dashboard">
    //       Dashboard
    //     </Link>
    //   </Menu.Item>
    // <Menu.Item id="menu-dropdown">
    //   <Button class="ui icon button">
    //   <Dropdown icon="user" button className="icon">
    //     <Dropdown.Menu>
    //       <Dropdown.Header
    //         className="user"
    //         content={<Link to="/userProfile">User Profile</Link>}
    //       />
    // <Dropdown.Header
    //   onClick={handleClick}
    //   content={<Link to="/userProfile">Log Out</Link>}
    // />
    //     </Dropdown.Menu>
    //   </Dropdown>
    //   </Button>
    // </Menu.Item>
    //     </Menu.Menu>
    //   ) : (
    //     <Menu.Menu position="right">
    //
    //       <Menu.Item>
    //         <Link to="/signup">Sign Up</Link>
    //       </Menu.Item>
    //     </Menu.Menu>
    //   )}
    // </Menu>
  );
};
/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    roomState: state.room
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
