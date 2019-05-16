import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {auth} from '../store';
import {Link} from 'react-router-dom';
import history from '../history'
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
} from 'semantic-ui-react';
/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props;


  return (
    <div className="login-form">
      <Grid
        textAlign="center"


      >
        <Grid.Column style={{maxWidth: 450}}>
          <Form
            size="large"
            color="blue"
            onSubmit={handleSubmit}
            name={name}
            // method="get"
            // action="/auth/google"
          >
            <Segment stacked>
              {name === 'signup' ? (
                <div>
                  <Form.Field>
                    <label className='formLabel' htmlFor="firstName">
                      <div>First Name</div>
                    </label>
                    <input
                    id='signUpLoginInput'
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                    />
                  </Form.Field>

                  <Form.Field>
                    <label className='formLabel' htmlFor="lastName">
                      <div>Last Name</div>
                    </label>
                    <input
                    id='signUpLoginInput'
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                    />
                  </Form.Field>
                </div>
              ) : null}

              <Form.Field>
                <label className='formLabel' htmlFor="email">
                  <div>E-mail Address</div>
                </label>
                <input
                id='signUpLoginInput' name="email" type="text" placeholder="E-mail Address" />
              </Form.Field>

              <Form.Field>
                <label className='formLabel' htmlFor="password">
                  <div>Password</div>
                </label>
                <input
                id='signUpLoginInput' name="password" type="password" placeholder="Password" />
              </Form.Field>
            </Segment>


            <Button color='violet' size="large" type="submit">
              {displayName}
            </Button>


            {error && error.response && <div> {error.response.data} </div>}



            <Button as="a" href="/auth/google">
              <font size="2">
                {displayName} with {'                  '}
              </font>
              <Icon name="google" />
            </Button>


            {name === 'signup' ? (
              <Message id='message'>
                Already have an account? <Link to="/login">Log In</Link>
              </Message>
            ) : (
              <Message id='message'>
                New to us? <Link to="/signup">Sign Up</Link>
              </Message>
            )}
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
};

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
  };
};

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  };
};

const mapDispatchLogin = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value.toLowerCase();
      const password = evt.target.password.value.toLowerCase();
      dispatch(auth(email, password, formName));
    }
  };
};
const mapDispatchSignup = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value.toLowerCase();
      const firstName = evt.target.firstName.value.toLowerCase();
      const lastName = evt.target.lastName.value.toLowerCase();
      const password = evt.target.password.value.toLowerCase();
      dispatch(auth(email, password, formName, firstName, lastName));
    }
  };
};

export const Login = connect(mapLogin, mapDispatchLogin)(AuthForm);
export const Signup = connect(mapSignup, mapDispatchSignup)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
};
