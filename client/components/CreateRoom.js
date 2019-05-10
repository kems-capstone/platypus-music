import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Message} from 'semantic-ui-react';
import roomReducer, {addRoomThunk} from '../store/roomReducer';

class CreateRoom extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async handleSubmit() {
    event.preventDefault();
    await this.props.addRoomThunk(
      this.props.form.createRoom.values.roomName,
      this.props.user
    );
    this.props.history.push('/room');
  }
  render() {
    return (
      <div id="createRoom-formContainer">
        <h1>Create Room</h1>
        <form
          className="form-popup"
          name="createRoomForm"
          onSubmit={this.handleSubmit}
        >
          <Field
            className="form-input"
            type="text"
            component="input"
            name="roomName"
            placeholder="room name"
          />

          <button type="submit">Create Room</button>
          <Message>
            <p id="createRoom-codeExplanation">
              Your room code will be displayed in your room
            </p>
            <p id="createRoom-codeExplanation">
              Give your friends your room code so they can join you!
            </p>
          </Message>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    form: state.form,
    room: state.room.room,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addRoomThunk: formData => dispatch(addRoomThunk(formData))
  };
};

export default reduxForm({
  form: 'createRoom'
})(connect(mapStateToProps, mapDispatchToProps)(CreateRoom));
