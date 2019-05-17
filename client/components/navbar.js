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
              icon="music"
            />
          ) : (
            <Menu.Item id="navbar-menuitem" icon="music" disabled />
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
      ) : (
        <Menu id="navbar-menu" pointing fixed="bottom">
          <Menu.Item id="navbar-menuitem" as="a" href="/home" icon="home" />

          <Menu.Item
            id="navbar-menuitem"
            as="a"
            href="/dashboard"
            icon="music"
            disabled
          />

          <Menu.Item id="navbar-menuitem" as="a" href="/login" icon="user" />
        </Menu>
      )}
    </div>
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
