import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {joinRoomThunk, listenForRoomDataThunk, getRoomThunk} from '../store';

class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    // this.props.updateRoomStore();
  }
  async handleSubmit() {
    event.preventDefault();
    let key = this.props.form.joinRoom.values.joinRoom;

    key = key.toUpperCase();

    await this.props.authenticate(key);
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
