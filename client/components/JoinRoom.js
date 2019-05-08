import React, {Component} from 'react';
import {Connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {authenticateKey} from '../store'

class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    event.preventDefault();
    console.log(this.props.form);
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
            name=""
            placeholder="Enter your rooms Unique Code"
          />
        </form>
        <button type="submit">Join Room</button>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  form: state.form
})
const mapDispatchToProps = dispatch => ({
  authenticate:  (code) => dispatch(authenticateKey(code))
})

export default reduxForm({form: 'joinRoom'})(
  Connect(mapStateToProps, mapDispatchToProps)(JoinRoom)
);
