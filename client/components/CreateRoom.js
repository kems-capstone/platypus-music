import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'

class CreateRoom extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit() {
    event.preventDefault()
    console.log(this.props.form)
  }
  render() {
    return (
      <div>
        <h1>Create Room</h1>
        <form name="createRoomForm" onSubmit={this.handleSubmit}>
          <Field
            type="text"
            component="input"
            name="room-name"
            placeholder="room name"
          />
          <button type="submit">Create Room</button>
        </form>
      </div>
    )
  }
}

const CreateRoomForm = reduxForm({
  form: 'creat-room'
})(CreateRoom)

const mapStateToProps = state => {
  return {
    form: state.form
  }
}

export default connect(mapStateToProps, null)(CreateRoomForm)
