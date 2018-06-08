import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

class AddPopup extends Component {

  render() {

    return (
      <Dialog open={this.props.open} title="Disclaimer" onClose={this.props.closeModal} >
        <DialogTitle id="alert-dialog-title">
          <Typography variant='title' align='center'>
            Add Whitelist Participant
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container justify="space-between" direction="row" spacing={0} style={{position: 'relative'}}>
            <Grid item xs={12} >
              <TextField required fullWidth={true} color="textSecondary" error={this.props.emailAddressError} disabled={this.props.loading}
                id="emailAddress" placeholder="Email Address" value={this.props.emailAddress} onKeyDown={this.props.onAddKeyDown}
                onChange={(event) => { this.props.handleChange(event, 'emailAddress'); }} margin="normal" helperText={this.props.emailAddressErrorMessage}  />
              <TextField required fullWidth={true} color="textSecondary" error={this.props.allocationError} disabled={this.props.loading}
                id="allocation" placeholder="Allocation" value={this.props.allocation} onKeyDown={this.props.onAddKeyDown}
                onChange={(event) => { this.props.handleChange(event, 'allocation'); }} margin="normal" helperText={this.props.allocationErrorMessage}  />
            </Grid>
            {this.props.loading && <CircularProgress size={36} style={{position: 'absolute',top: '50%',left: '50%',marginTop: -12,marginLeft: -12,}}/>}
            <Grid item style={{marginTop: '24px'}} >
              <Button variant="flat" size='small' color='primary' onClick={this.props.closeModal} disabled={this.props.loading}>
                Back
              </Button>
            </Grid>
            <Grid item style={{marginTop: '24px'}} >
              <Typography variant='subheading' style={{color: 'green', display: 'inline-block', marginRight: '24px'}}>
                {this.props.cardMessage}
              </Typography>
              <Typography variant='subheading' style={{color: 'red', display: 'inline-block', marginRight: '24px'}}>
                {this.props.cardError}
              </Typography>
              <Button variant="raised" size='small' color='primary' onClick={this.props.submitAdd} disabled={this.props.loading}>
                Add
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };
}

export default AddPopup;
