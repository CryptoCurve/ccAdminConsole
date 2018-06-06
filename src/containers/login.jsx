import React from 'react'
import LoginComponent from '../components/login'
const createReactClass = require('create-react-class')
let emitter = require('../store/store.js').default.emitter
let dispatcher = require('../store/store.js').default.dispatcher

var sha256 = require('sha256');

let Login = createReactClass({
  getInitialState() {
    return {
      loading: false,
      error: null,

      emailAddress: '',
      emailAddressError: false,
      emailAddressErrorMessage: false,
      password: '',
      passwordError: false,
      passwordErrorMessage: false,
    };
  },

  componentWillMount() {
    emitter.on('login', this.loginReturned);
    emitter.on('Unauthorised', this.unauthorisedReturned);
  },

  componentWillUnmount() {
    emitter.removeAllListeners('login');
  },

  render() {
    return (<LoginComponent
        handleChange={this.handleChange}
        submitRegisterNavigate={this.submitRegisterNavigate}
        submitForgotPasswordNavigate={this.submitForgotPasswordNavigate}
        submitLogin={this.submitLogin}
        onLoginKeyDown={this.onLoginKeyDown}
        emailAddress={this.state.emailAddress}
        emailAddressError={this.state.emailAddressError}
        emailAddressErrorMessage={this.state.emailAddressErrorMessage}
        password={this.state.password}
        passwordError={this.state.passwordError}
        passwordErrorMessage={this.state.passwordError}
        error={this.state.error}
        loading={this.state.loading}
      />)
  },

  handleChange (event, name) {
    if(event != null && event.target != null) {
      this.setState({
        [name]: event.target.value
      });
    }
  },

  onLoginKeyDown(event) {
    if (event.which == 13) {
      this.submitLogin();
    }
  },

  submitLogin() {
    this.setState({emailAddressError: false, passwordError: false})
    var error = false;

    if(this.state.emailAddress == '') {
      this.setState({emailAddressError: true});
      error = true;
    }
    if(this.state.password == '') {
      this.setState({passwordError: true});
      error = true;
    }

    if(!error) {
      /*var user = {
        emailAddress: this.state.emailAddress
      }
      this.props.setUser(user);
      window.location.hash = 'admin';*/

      this.setState({loading: true, error: null});
      var content = { emailAddress: this.state.emailAddress, sha: sha256(this.state.emailAddress+':'+this.state.password).toUpperCase() };
      dispatcher.dispatch({ type: 'login' })
    }
  },

  loginReturned(error, data) {
    if(error) {
      this.setState({loading: false});
      return this.setState({error: error.toString()});
    }

    if(data.success) {
      var decodedData = data.decodedMessage;

      var user = {
        emailAddress: decodedData.email
      }

      user.token = decodedData.jwt.token;
      user.key = sha256(decodedData.email);
      this.props.setUser(user);

      window.location.hash = 'admin';
    } else if (data.errorMsg) {
      this.setState({error: data.errorMsg, loading: false});
    } else {
      this.setState({error: data.statusText, loading: false})
    }
  },

  unauthorisedReturned(error, data) {
    this.setState({loading: false, emailAddressError: true, emailAddressErrorMessage: "Invalid credentials"})
  },
})

export default (Login);
