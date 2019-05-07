import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Link} from 'react-router-dom'
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Container,
  Icon
} from 'semantic-ui-react'
/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div className="login-form">
    <Grid textAlign="center" style={{height: '100%'}} verticalAlign="middle">
          <Image src="/patty.jpeg" style={{textAlign: 'center', maxWidth: 350, maxHeight: 200}}/>{' '}
    </Grid>
    <Grid textAlign="center" style={{height: '100%'}} verticalAlign="middle" divided>
      <Grid.Column style={{maxWidth: 450}}>
        <Header as="h2" textAlign="center">
          {name === 'signup'
            ? 'Sign up for your account'
            : 'Log into your account'}
        </Header>
        <Form size="large" color="blue" onSubmit={handleSubmit} name={name}>
            <Segment stacked>
              {name === 'signup' ? (
                <div>
                  <Form.Field>
                    <label htmlFor="firstName">
                      <div>First Name</div>
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                    />
                  </Form.Field>

                  <Form.Field>
                    <label htmlFor="lastName">
                      <div>Last Name</div>
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                    />
                  </Form.Field>
                </div>
              ) : null}
              <br />
              <Form.Field>
                <label htmlFor="email">
                  <div>E-mail Address</div>
                </label>
                <input
                  name="email"
                  type="text"
                  placeholder="E-mail Address"
                />
              </Form.Field>

              <Form.Field>
                <label htmlFor="password">
                  <div>Password</div>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </Form.Field>
            </Segment>
            <br />

              <Button color="purple" size="large" type="submit">
                {displayName}
              </Button>


            {error && error.response && <div> {error.response.data} </div>}

          <br />
          <Button>
            <a href="/auth/google">
              <font size="2">
                {displayName} with {'                  '}
              </font>
              <Icon name="google" />
            </a>
          </Button>
          <br/>
          {name === 'signup' ? (
            <Message>
              Already have an account? <Link to="/login">Log In</Link>
            </Message>
          ) : (
            <Message>
            New to us? <Link to="/signup">Sign Up</Link>
            </Message>
          )}
        </Form>
      </Grid.Column>
    </Grid>
  </div>
)
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const firstName = evt.target.firstName.value
      const lastName = evt.target.lastName.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName, firstName, lastName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
