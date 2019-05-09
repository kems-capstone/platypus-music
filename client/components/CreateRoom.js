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
  handleSubmit() {
    event.preventDefault();
    this.props.addRoomThunk(this.props.form.createRoom.values.roomName, this.props.user);
    this.props.history.push('/room')
  }
  render() {
    console.log('*****this.props: ', this.props);
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
    room: state.room,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addRoomThunk: (formData, user) => dispatch(addRoomThunk(formData, user))
  };
};

export default reduxForm({
  form: 'createRoom'
})(connect(mapStateToProps, mapDispatchToProps)(CreateRoom));
