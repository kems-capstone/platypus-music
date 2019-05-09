import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Message} from 'semantic-ui-react';
import roomReducer, {addRoomThunk} from '../store/roomReducer';
import {Link} from 'react-router-dom'

class CreateRoom extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    event.preventDefault();
    this.props.addRoomThunk(this.props.form.createRoom.values.roomName);
  }
  render() {
    return (
      <div className="form-container">
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
          <h3>Room Code:</h3>
          <Message>1234</Message>

          <button type="submit">Create Room</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    form: state.form,
    room: state
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
