import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Message, Button} from 'semantic-ui-react';
import roomReducer, {addRoomThunk} from '../store/roomReducer';

class CreateRoom extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    event.preventDefault();
   this.props.addRoomThunk(
      this.props.form.createRoom.values.roomName,
      this.props.user
    );

  }
  render() {
    return (
      <div>
        <h1>Create Room</h1>
        <div >
          <form
          id="createRoom-formContainer"
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

            <Button color='violet' type="submit">Create Room</Button>
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
