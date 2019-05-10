import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {joinRoomThunk, listenForRoomDataThunk} from '../store';

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
    this.props.authenticate(this.props.form.joinRoom.values.joinRoom);
    this.props.history.push('/room');
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
  authenticate: code => dispatch(joinRoomThunk(code)),
  updateRoomStore: () => dispatch(listenForRoomDataThunk())
});

export default reduxForm({
  form: 'joinRoom'
})(connect(mapStateToProps, mapDispatchToProps)(JoinRoom));
