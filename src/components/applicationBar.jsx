import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import Typography from 'material-ui/Typography';

function LogoutIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z" />
    </SvgIcon>
  );
}

class ApplicationBar extends Component {


  renderUser() {
    if(!this.props.user) {
      return <div></div>
    }

    return (
      <div>
        <Typography variant='subheading' style={{color: 'white', display: 'inline-block', marginRight: '24px'}}>
          {this.props.user.emailAddress}
        </Typography>
        <IconButton color="inherit" onClick={this.props.logOut} >
          <LogoutIcon />
        </IconButton>
      </div>
    )
  };

  render() {
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <div style={{ flex: 1}} ><img src="./cryptocurve-logo-white2.png" alt="CryptoCurve.io" heigth="43px" width="164px" /></div>
          {this.renderUser()}
        </Toolbar>
      </AppBar>
    );
  };
}

export default ApplicationBar;
