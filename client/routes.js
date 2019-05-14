import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Login, Signup, UserHome} from './components';
import {me, getRoomThunk, refreshRoom} from './store';
import {
  Playlist,
  Dashboard,
  Homepage,
  CreateRoom,
  Room,
  JoinRoom
} from './components';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const {isLoggedIn} = this.props;


    let num = this.props.roomState.room.id
    console.log('Router', this.props)
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Homepage} />
        <Route exact path="/home" component={Homepage} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/playlist" component={Playlist} />
            <Route exact path="/create-room" component={CreateRoom} />
            <Route exact path="/joinroom" component={JoinRoom} />
            {/* <Route exact path='/room/' component={Room} /> */}
            {this.props.roomState.room.id ?
            <Route exact path={`/room/${num}`} component={Room} />
            :
            null
            }
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}

        <Route
          path="*"
          render={() => {
            return <h1>404, we cannot find what you are looking for!</h1>;
          }}
        />
      </Switch>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    roomState: state.room
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me());
      dispatch(refreshRoom());
    }
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
