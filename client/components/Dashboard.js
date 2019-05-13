import React from 'react';
import user from '../store/user';
import {Link} from 'react-router-dom';
import {getRoomThunk} from '../store';
import {connect} from 'react-redux';

const Dashboard = props => {
  return (
    <div id="dashboard-buttons">
      <h1>Welcome back user</h1>
      <div>
        <Link to="/create-room">
          <button className="ui primary basic button" type="button">
            Create a room
          </button>
        </Link>
        <br />
        <Link className="ui primary basic button" to="/joinroom">
          Join a room
        </Link>

        <br />
        <button
          type="button"
          className="ui primary basic button"
          onClick={id => props.getCurrentRoom(props.user.id)}
        >
          <Link to="/room">Go to current room</Link>
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCurrentRoom: id => dispatch(getRoomThunk(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
