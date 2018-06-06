import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import SvgIcon from 'material-ui/SvgIcon';

import SearchResult from '../containers/searchResult'

function SearchIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
    </SvgIcon>
  );
}

class Admin extends Component {

  renderResults() {
    if(!this.props.searchResults || this.props.searchResults.length == 0) {
      return <div></div>
    }

    return this.props.searchResults.map((result) => {
      return (
        <SearchResult
          user={this.props.user}
          key={result.EmailAddress}
          result={result} />
      )
    })
  };

  render() {
    return (
      <Grid container justify="center" direction="row" spacing={0} style={{marginTop: '50px'}}>
        <Grid item  >
          <TextField required autoFocus={true} type='search' style={{ minWidth: '400px', marginRight: '12px'}} color="textSecondary" error={this.props.searchError} disabled={this.props.loading}
            id="search" placeholder="Search for email address" value={this.props.search}
            onChange={(event) => { this.props.handleChange(event, 'search'); }} margin="normal" onKeyDown={this.props.onSearchKeyDown} helperText={this.props.searchErrorMessage} />
          <Button variant="fab" color='primary' onClick={this.props.submitSearch} disabled={this.props.loading} style={{marginTop: '-3px'}} >
            <SearchIcon />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" direction="row" spacing={0} style={{marginTop: '50px'}}>
            <Grid item >
              {this.renderResults()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
}

export default Admin;
