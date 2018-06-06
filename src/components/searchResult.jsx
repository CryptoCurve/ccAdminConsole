import React, { Component } from 'react';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';

class SearchResult extends Component {

  render() {
    return (
      <Card style={{ maxWidth: '600px', marginBottom: '12px' }} key={this.props.fixedEmailAddress}>
        <CardContent>
          <Grid container justify="flex-end" direction="row" spacing={0} style={{position: 'relative'}}>
            <Grid item xs={12} >
              <Typography variant='headline'>
                {this.props.fixedEmailAddress}
              </Typography>
              <TextField required fullWidth={true} color="textSecondary" error={this.props.emailAddressError} disabled={this.props.loading}
                id="emailAddress" label="Email Address" value={this.props.emailAddress}
                onChange={(event) => { this.props.handleChange(event, 'emailAddress'); }} margin="normal" helperText={this.props.emailAddressErrorMessage}  />
              <TextField required fullWidth={true} color="textSecondary" error={this.props.ethereumAddressError} disabled={this.props.loading}
                id="ethereumAddress" label="Ethereum Address" value={this.props.ethereumAddress}
                onChange={(event) => { this.props.handleChange(event, 'ethereumAddress'); }} margin="normal" helperText={this.props.ethereumAddressErrorMessage}  />
              <TextField required fullWidth={true} color="textSecondary" error={this.props.wanchainAddressError} disabled={this.props.loading}
                id="wanchainAddress" label="Wanchain Address" value={this.props.wanchainAddress}
                onChange={(event) => { this.props.handleChange(event, 'wanchainAddress'); }} margin="normal" helperText={this.props.wanchainAddressErrorMessage}  />
              <TextField required fullWidth={true} color="textSecondary" error={this.props.allocationError} disabled={this.props.loading}
                id="allocation" label="Allocation" value={this.props.allocation}
                onChange={(event) => { this.props.handleChange(event, 'allocation'); }} margin="normal" helperText={this.props.allocationErrorMessage}  />
            </Grid>
            {this.props.loading && <CircularProgress size={36} style={{position: 'absolute',top: '50%',left: '50%',marginTop: -12,marginLeft: -12,}}/>}
            <Grid item style={{marginTop: '24px'}} >
              <Typography variant='subheading' style={{color: 'green', display: 'inline-block', marginRight: '24px'}}>
                {this.props.cardMessage}
              </Typography>
              <Typography variant='subheading' style={{color: 'red', display: 'inline-block', marginRight: '24px'}}>
                {this.props.cardError}
              </Typography>
              <Button variant="raised" size='small' color='primary' onClick={this.props.submitUpdate} disabled={this.props.loading}>
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
}

export default SearchResult;
