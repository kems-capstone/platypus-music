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
        <Link to="/create-room">
          <Button className="ui primary basic B" type="button">
            Create a room
          </Button>
        </Link>
        <br />
        <Link to={`/room/${props.roomState.room.id}`}>
          <Button
            type="button"
            className="ui primary basic button"
            onClick={id => props.getCurrentRoom(props.user.id)}
          >
            Go to current room
          </Button>
        </Link>
        <br />
        <Link to="/joinroom">
          <Button type="button" className="ui primary basic button">
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
