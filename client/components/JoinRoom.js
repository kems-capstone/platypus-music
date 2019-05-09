import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {authenticateKeyThunk} from '../store';

class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    event.preventDefault();
    this.props.authenticate(this.props.form.joinRoom.values.joinRoom);
  }
  render() {
    return (
      <div>
        <form
          className="form-popup"
          name="createRoomForm"
          onSubmit={this.handleSubmit}
        >
          <Field
            className="form-input"
            type="text"
            component="input"
            name="joinRoom"
            placeholder="Enter your rooms Unique Code"
          />
          <button type="submit">Join Room</button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  form: state.form
});
const mapDispatchToProps = dispatch => ({
  authenticate: code => dispatch(authenticateKeyThunk(code))
});

export default reduxForm({
  form: 'joinRoom'
})(connect(mapStateToProps, mapDispatchToProps)(JoinRoom));
