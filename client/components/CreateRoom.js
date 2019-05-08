import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Message} from 'semantic-ui-react';
import {addRoomThunk} from '../store/roomReducer';

class CreateRoom extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    event.preventDefault();
    // console.log(this.props.form);
    console.log(this.props);
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
            name="room-name"
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

// const CreateRoomForm = reduxForm({
//   form: 'creat-room'
// })(CreateRoom);

const mapStateToProps = state => {
  return {
    form: state.form
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addRoomThunk: () => dispatch(addRoomThunk())
  };
};

export default reduxForm({
  form: 'creat-room'
})(connect(mapStateToProps, mapDispatchToProps)(CreateRoom));
