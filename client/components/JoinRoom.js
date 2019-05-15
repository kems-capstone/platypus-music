import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {joinRoomThunk, listenForRoomDataThunk, getRoomThunk} from '../store';
import {Button} from 'semantic-ui-react'

class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    // this.props.updateRoomStore();
  }
handleSubmit() {
    event.preventDefault();
    let key = this.props.form.joinRoom.values.joinRoom;

    key = key.toUpperCase();

  this.props.authenticate(key);

  }
  render() {
    return (
      <div >

        <form id='joinRoomContainer'
          className="form-popup"
          name="createRoomForm"
          onSubmit={this.handleSubmit}
        >

          <Field
          id='joinRoomField'
            className="form-input"
            type="text"
            component="input"
            name="joinRoom"
            placeholder="Enter your room key"
          />
          <Button id='joinRoomButton'color='violet' type="submit">Join Room</Button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  form: state.form,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  authenticate: code => dispatch(joinRoomThunk(code)),
  updateRoomStore: () => dispatch(listenForRoomDataThunk()),
  getRoomThunk: userId => dispatch(getRoomThunk(userId))
});

export default reduxForm({
  form: 'joinRoom'
})(connect(mapStateToProps, mapDispatchToProps)(JoinRoom));
