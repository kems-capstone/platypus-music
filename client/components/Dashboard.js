import React from 'react';
import user from '../store/user';
import {Link} from 'react-router-dom';

const Dashboard = props => {
  return (
    <div>
      <h1>Welcome back user</h1>
      <div>
        <button type="button">Create a room</button>
        <Link to="/playlist">Join a room</Link>
        {/* <button type="button">Join a room</button> */}
      </div>
    </div>
  );
};

export default Dashboard;
