import React from 'react'
import SearchResultComponent from '../components/searchResult'
const createReactClass = require('create-react-class')
let emitter = require('../store/store.js').default.emitter
let dispatcher = require('../store/store.js').default.dispatcher

let SearchResult = createReactClass({
  getInitialState() {
    return {
      cardMessage: '',
      error: false,
      loading: false,
      fixedEmailAddress: this.props.result.emailAddress,
      emailAddress: this.props.result.emailAddress,
      emailAddressError: false,
      emailAddressErrorMessage: '',
      ethereumAddress: this.props.result.ethereumAddress,
      ethereumAddressError: false,
      ethereumAddressErrorMessage: '',
      wanchainAddress: this.props.result.wanchainAddress,
      wanchainAddressError: false,
      wanchainAddressErrorMessage: '',
      allocation: this.props.result.allocation,
      allocationError: false,
      allocationErrorMessage: ''
    };
  },

  componentWillMount() {
    emitter.on('update', this.updateReturned);
  },

  componentWillUnmount() {
    emitter.removeAllListeners('update');
  },

  render() {
    return (<SearchResultComponent
        handleChange={this.handleChange}
        submitUpdate={this.submitUpdate}
        fixedEmailAddress={this.state.fixedEmailAddress}
        emailAddress={this.state.emailAddress}
        emailAddressError={this.state.emailAddressError}
        emailAddressErrorMessage={this.state.emailAddressErrorMessage}
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

  submitUpdate() {
    this.setState({ cardMessage: '' })
    var error = false;

    if(this.state.emailAddress == '') {
      this.setState({emailAddressError: true, emailAddressErrorMessage: 'Invalid Allocation'});
      error = true;
    }

    if(this.state.ethereumAddress == '') {
      this.setState({ethereumAddressError: true, ethereumAddressErrorMessage: 'Invalid Ethereum Address'});
      error = true;
    }

    if(this.state.wanchainAddress == '') {
      this.setState({wanchainAddressError: true, wanchainAddressErrorMessage: 'Invalid Wanchain Address'});
      error = true;
    }

    if(this.state.allocation == '') {
      this.setState({allocationError: true, allocationErrorMessage: 'Invalid Allocation'});
      error = true;
    }

    if(!error) {
      this.setState({loading: true, error: null});
      var content = { uuid: this.props.result.uuid, email: this.state.emailAddress, ethAddress: this.state.ethereumAddress, wanAddress: this.state.wanchainAddress, allocation: this.state.allocation };
      dispatcher.dispatch({ type: 'update', content })

      /*setTimeout(() => {

        return this.setState({loading: false, cardMessage: 'Presale applicant updated'});
      }, 300)*/
    }
  },


  updateReturned(error, data) {
    if(error) {
      return this.setState({loading: false, error: error.toString()});
    }

    if(data.success) {
      var decodedData = data.decodedMessage;
      return this.setState({loading: false, cardMessage: 'Presale applicant updated'});
      //done
    } else if (data.errorMsg) {
      this.setState({error: data.errorMsg, loading: false});
    } else {
      this.setState({error: data.statusText, loading: false})
    }
  },
})

export default (SearchResult);
