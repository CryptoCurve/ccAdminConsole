import React, { Component } from 'react'
import CssBaseline from 'material-ui/CssBaseline'
import Grid from 'material-ui/Grid'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'

import TheAppBar from './containers/applicationBar.jsx'
import Login from './containers/login.jsx'
import Admin from './containers/admin.jsx'

const theme = createMuiTheme({
  overrides: {
    MuiStepIcon: {
      root: {
        '&-active': {
          color: "#2ad4dc"
        }
      },
      active: {
        color: "#2ad4dc !important"
      },
      completed: {
        color: "#2ad4dc !important"
      }
    },
    MuiInput: {
      underline: {
        '&:before': { //underline color when textfield is inactive
          backgroundColor: 'black',
          height: '2px'
        },
        '&:hover:not($disabled):before': { //underline color when hovered
          backgroundColor: 'black',
          height: '2px'
        },
      }
    },
    MuiButton: {
      root: {
        transition: "1s ease",
        '&:hover:not($disabled)' : {
          backgroundColor: "#2ad4dc",
          color: 'black'
        }
      }
    }
  },
  typography: {
    // Use the system font over Roboto.
    fontFamily: 'Abel, sans-serif',
  },
  palette: {
    primary: {
      light: '#2c2c2c',
      main: '#000000',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#72ffff',
      main: '#2ad4dc',
      dark: '#00a2aa',
      contrastText: '#000000',
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props)


    var userString = sessionStorage.getItem('cc_admin_user')
    var user = null;
    if (userString != null) {
      user = JSON.parse(userString)
    }

    this.state = {
      user: user
    }

    this.locationHashChanged = this.locationHashChanged.bind(this)
    this.setUser = this.setUser.bind(this)
    this.logOut = this.logOut.bind(this)

    window.onhashchange = this.locationHashChanged
  };

  componentWillMount() {
    var user = null;
    var userString = sessionStorage.getItem('cc_admin_user');
    if(userString) {
      user = JSON.parse(userString);
      this.setUser(user);
    }

    var loader = document.getElementById("loader")
    document.body.removeChild(loader);

    var currentScreen = window.location.hash.substring(1);
    if(currentScreen != 'login') {
      if(user == null) {
        window.location.hash = 'login'
      }
    }

    this.locationHashChanged();
  };

  locationHashChanged() {
    var currentScreen = window.location.hash.substring(1);

    if(['', 'login'].includes(currentScreen)) {
      this.setState({ user: null });
    }

    if(!['', 'login'].includes(currentScreen)) {
      if(this.state.user == null) {
        return window.location.hash = 'login';
      }
    }

    this.setState({currentScreen});
  };

  renderAppBar() {
    return (<TheAppBar user={this.state.user} logOut={this.logOut} />)
  };

  setUser(user) {
    this.setState({ user })
    sessionStorage.setItem('cc_admin_user', JSON.stringify(user));
  };

  logOut() {
    sessionStorage.removeItem('cc_admin_user');
    this.setState({ user: null })
    window.location.hash = 'login'
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {this.renderAppBar()}
        <CssBaseline />
        <Grid container justify="space-around" alignItems="flex-start" direction="row" spacing={0} style={{minHeight: '564px', position: 'relative'}}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {this.renderScreen()}
          </Grid>
        </Grid>
      </MuiThemeProvider>
    )
  };

  renderScreen() {
    switch (this.state.currentScreen) {
      case 'login':
        return (<Login setUser={this.setUser} />)
      case 'admin':
        return (<Admin />)
      default:
        return (<Login setUser={this.setUser} />)
    }
  }
}

export default App
