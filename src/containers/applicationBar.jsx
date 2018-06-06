import React from 'react'
import ApplicationBarComponent from '../components/applicationBar'
const createReactClass = require('create-react-class')

let ApplicationBar = createReactClass({
  getInitialState() {
    return { }
  },
  render() {
    return (
      <ApplicationBarComponent user={this.props.user} logOut={this.props.logOut} />
    )
  },

})

export default (ApplicationBar);
