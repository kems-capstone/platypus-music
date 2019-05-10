import React from 'react';
import user from '../store/user';
import {Link} from 'react-router-dom';
import {getRoomThunk} from '../store';
import {connect} from 'react-redux';

const Dashboard = props => {
  console.log('props in dashboard', props);
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
        <Link to="/playlist">Go to Playlist</Link>
        {/* <button type="button">Join a room</button> */}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(Dashboard);
