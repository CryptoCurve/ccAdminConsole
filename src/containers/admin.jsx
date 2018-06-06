import React from 'react'
import AdminComponent from '../components/admin'
const createReactClass = require('create-react-class')
let emitter = require('../store/store.js').default.emitter
let dispatcher = require('../store/store.js').default.dispatcher

let Admin = createReactClass({
  getInitialState() {
    return {
      search: '',
      searchError: false,
      searchErrorMessage: null,
      searchResults: []
    };
  },

  componentWillMount() {
    emitter.on('search', this.searchReturned);
  },

  componentWillUnmount() {
    emitter.removeAllListeners('search');
  },

  render() {
    return (<AdminComponent
        handleChange={this.handleChange}
        submitSearch={this.submitSearch}
        onSearchKeyDown={this.onSearchKeyDown}
        search={this.state.search}
        searchError={this.state.searchError}
        searchErrorMessage={this.state.searchErrorMessage}
        searchResults={this.state.searchResults}
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

  onSearchKeyDown(event) {
    if (event.which == 13) {
      this.submitSearch();
    }
  },

  submitSearch() {
    this.setState({usernameError: false, passwordError: false})
    var error = false;

    if(this.state.search == '') {
      this.setState({searchError: true, searchErrorMessage: 'Invalid search string'});
      error = true;
    }

    if(!error) {
     this.setState({loading: true, error: null});
      var content = { email: this.state.search };
      dispatcher.dispatch({ type: 'search', content, token: this.props.user.token, tokenKey: this.props.user.key  })
    }
  },


  searchReturned(error, data) {
    if(error) {
      return this.setState({loading: false, error: error.toString()});
    }

    if(data.success) {
      var decodedData = data.decodedMessage;
      this.setState({searchResults: decodedData.searchResults, loading: false})
    } else if (data.errorMsg) {
      this.setState({error: data.errorMsg, loading: false});
    } else {
      this.setState({error: data.statusText, loading: false})
    }
  },
})

export default (Admin);
