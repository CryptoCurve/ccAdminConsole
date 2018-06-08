import React from 'react'
import AddPopupComponent from '../components/addPopup'
const createReactClass = require('create-react-class')
const email = require("email-validator");
let emitter = require('../store/store.js').default.emitter
let dispatcher = require('../store/store.js').default.dispatcher

let SearchResult = createReactClass({
  getInitialState() {
    return {
      cardMessage: '',
      cardError: '',
      error: false,
      loading: false,
      emailAddress: '',
      emailAddressError: false,
      emailAddressErrorMessage: '',
      allocation: '',
      allocationError: false,
      allocationErrorMessage: ''
    };
  },

  componentWillMount() {
    emitter.on('add', this.addReturned);
  },

  componentWillUnmount() {
    emitter.removeAllListeners('add');
  },

  render() {
    return (<AddPopupComponent
        handleChange={this.handleChange}
        onAddKeyDown={this.onAddKeyDown}
        closeModal={this.exit}
        submitAdd={this.submitAdd}
        open={this.props.open}
        emailAddress={this.state.emailAddress}
        emailAddressError={this.state.emailAddressError}
        emailAddressErrorMessage={this.state.emailAddressErrorMessage}
        allocation={this.state.allocation}
        allocationError={this.state.allocationError}
        allocationErrorMessage={this.state.allocationErrorMessage}
        cardMessage={this.state.cardMessage}
        cardError={this.state.cardError}
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

  onAddKeyDown(event) {
    if (event.which == 13) {
      this.submitAdd();
    }
  },

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  submitAdd() {
    this.setState({ cardMessage: '', emailAddressError: false, emailAddressErrorMessage: '', allocationError: false, allocationErrorMessage: '' })
    var error = false;

    if(this.state.emailAddress == null || this.state.emailAddress == '' || !email.validate(this.state.emailAddress)) {
      this.setState({emailAddressError: true, emailAddressErrorMessage: 'Invalid Email Address'});
      error = true;
    }

    if(this.state.allocation == null || this.state.allocation == '' || !this.isNumeric(this.state.allocation)) {
      this.setState({allocationError: true, allocationErrorMessage: 'Invalid Allocation'});
      error = true;
    }

    if(!error) {
      this.setState({loading: true, error: null});
      var content = { email: this.state.emailAddress, allocation: this.state.allocation };
      dispatcher.dispatch({ type: 'add', content, token: this.props.user.token, tokenKey: this.props.user.key })
    }
  },


  addReturned(error, data) {
    if(error) {
      return this.setState({loading: false, cardError: error.toString()});
    }

    if(data.success) {
      var decodedData = data.decodedMessage;
      this.setState({loading: false, cardMessage: 'Presale applicant added'});
      setTimeout(() => {
        this.exit()
      }, 500)
    } else if (data.message) {
      this.setState({cardError: 'Oops, an error occurred', loading: false});
    } else {
      this.setState({cardError: data.statusText, loading: false})
    }
  },

  exit() {
    this.setState({
      cardMessage: '',
      cardError: '',
      error: false,
      loading: false,
      emailAddress: '',
      emailAddressError: false,
      emailAddressErrorMessage: '',
      allocation: '',
      allocationError: false,
      allocationErrorMessage: ''
    })
    this.props.closeModal()
  }
})

export default (SearchResult);
