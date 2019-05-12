import React from 'react';
import user from '../store/user';
import {Link} from 'react-router-dom';
import {getRoomThunk} from '../store';
import {connect} from 'react-redux';

const Dashboard = props => {
  return (
    <div>
      <h1>Welcome back user</h1>
      <div>
        <Link to="/create-room">
          <button type="button">Create a room</button>
        </Link>
        <br />
        <Link to="/joinroom">Join a room</Link>

        <br />
        <button
          type="button"
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
