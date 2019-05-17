import React from 'react';
import user from '../store/user';
import {Link} from 'react-router-dom';
import {getRoomThunk} from '../store';
import {connect} from 'react-redux';
import {Button} from 'semantic-ui-react';

const Dashboard = props => {
  return (
    <div id="dashboard-buttons">
      <h1>Dashboard</h1>
      <div>
      {props.roomState.room.id ? <Link to={`/room/${props.roomState.room.id}`}>
          <Button
            type="button"
            id="dashboardButton-currentRoom"
            onClick={id => props.getCurrentRoom(props.user.id)}
          >
            Go to current room
          </Button>
        </Link> : null }
        <br />
        <Link to="/create-room">
          <Button id="dashboardButton" type="button">
            Create a room
          </Button>
        </Link>
        <br />



        <Link to="/joinroom">
          <Button type="button" id="dashboardButton">
            Join a room
          </Button>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    roomState: state.room
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCurrentRoom: id => dispatch(getRoomThunk(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
