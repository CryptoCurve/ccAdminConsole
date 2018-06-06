import React from 'react'
import SearchResultComponent from '../components/searchResult'
const createReactClass = require('create-react-class')
let emitter = require('../store/store.js').default.emitter
let dispatcher = require('../store/store.js').default.dispatcher

let SearchResult = createReactClass({
  getInitialState() {

    var hasWhitelisted = false
    if(this.props.result.State != null) {
      hasWhitelisted = this.props.result.State.currentScreen == "whitelistJoined"
    }

    return {
      cardMessage: '',
      cardError: '',
      error: false,
      loading: false,
      fixedEmailAddress: this.props.result.EmailAddress,
      emailAddress: this.props.result.EmailAddress,
      emailAddressError: false,
      emailAddressErrorMessage: '',
      ethereumAddress: this.props.result.EthereumAddress,
      ethereumAddressError: false,
      ethereumAddressErrorMessage: '',
      wanchainAddress: this.props.result.WanchainAddress,
      wanchainAddressError: false,
      wanchainAddressErrorMessage: '',
      allocation: this.props.result.Allocation,
      allocationError: false,
      allocationErrorMessage: '',

      hasWhitelisted: hasWhitelisted
    };
  },

  componentWillMount() {
    emitter.on('update_'+this.props.result.Uuid, this.updateReturned);
  },

  componentWillUnmount() {
    emitter.removeAllListeners('update_'+this.props.result.Uuid);
  },

  render() {
    return (<SearchResultComponent
        handleChange={this.handleChange}
        submitUpdate={this.submitUpdate}
        fixedEmailAddress={this.state.fixedEmailAddress}
        ethereumAddress={this.state.ethereumAddress}
        ethereumAddressError={this.state.ethereumAddressError}
        ethereumAddressErrorMessage={this.state.ethereumAddressErrorMessage}
        wanchainAddress={this.state.wanchainAddress}
        wanchainAddressError={this.state.wanchainAddressError}
        wanchainAddressErrorMessage={this.state.wanchainAddressErrorMessage}
        allocation={this.state.allocation}
        allocationError={this.state.allocationError}
        allocationErrorMessage={this.state.allocationErrorMessage}
        cardMessage={this.state.cardMessage}
        cardError={this.state.cardError}
        error={this.state.error}
        loading={this.state.loading}
        hasWhitelisted={this.state.hasWhitelisted}
      />)
  },

  handleChange (event, name) {
    if(event != null && event.target != null) {
      this.setState({
        [name]: event.target.value
      });
    }
  },

  submitUpdate() {
    this.setState({ cardMessage: '' })
    var error = false;

    if(this.state.ethereumAddress == null || this.state.ethereumAddress == '') {
      this.setState({ethereumAddressError: true, ethereumAddressErrorMessage: 'Invalid Ethereum Address'});
      error = true;
    }

    if(this.state.wanchainAddress == null || this.state.wanchainAddress == '') {
      this.setState({wanchainAddressError: true, wanchainAddressErrorMessage: 'Invalid Wanchain Address'});
      error = true;
    }

    if(this.state.allocation == null || this.state.allocation == '') {
      this.setState({allocationError: true, allocationErrorMessage: 'Invalid Allocation'});
      error = true;
    }

    if(!error) {
      this.setState({loading: true, error: null});
      var content = { uuid: this.props.result.Uuid, email: this.state.fixedEmailAddress, ethAddress: this.state.ethereumAddress, wanAddress: this.state.wanchainAddress, allocation: this.state.allocation };
      dispatcher.dispatch({ type: 'update', content, token: this.props.user.token, tokenKey: this.props.user.key })
    }
  },


  updateReturned(error, data) {
    if(error) {
      return this.setState({loading: false, cardError: error.toString()});
    }

    if(data.success) {
      var decodedData = data.decodedMessage;
      this.setState({loading: false, cardMessage: 'Presale applicant updated'});
    } else if (data.message) {
      this.setState({cardError: 'Oops, an error occurred', loading: false});
    } else {
      this.setState({cardError: data.statusText, loading: false})
    }
  },
})

export default (SearchResult);
