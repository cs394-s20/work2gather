import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Goal from './Card/Goal'
import Invite from './Card/Invite'

const useStyles = makeStyles((theme) => ({
  gridcontainer:{
    // marginTop: 50
  },
  griditem: {
    // marginBottom: -60
  }
}));

const GoalGrid = ({ goals, invites, user }) => {
  let classes = useStyles();
  const [unfinished, setUnfinished] = useState([]);
  const [pending, setPending] = useState([]);
  const [invitelist, setInvitelist] = useState([]);

  useEffect(() => {
    let unfinished_temp = [];
    let pending_temp = [];
    let invitelist_temp = [];

    Object.values(goals).map(goal => goal.confirmed ? unfinished_temp.push(goal) : pending_temp.push(goal));
    Object.values(invites).map(goal => goal.confirmed ?  unfinished_temp.push(goal) : invitelist_temp.push(goal));

    setUnfinished(unfinished_temp);
    setPending(pending_temp);
    setInvitelist(invitelist_temp);
  }, [goals]);
  
  return (
    <React.Fragment>
      <Grid container spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.griditem}><Typography variant="h4">Unfinished Goals</Typography></Grid>
        {unfinished.map(goals =>
          <Grid item xs={4}>
            <Goal goal={goals} user={user} key={goals.key} />
          </Grid>
        )}
      </Grid>
      <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.griditem}><Typography variant="h4">Pending Goals</Typography></Grid>
        {pending.map(goals =>
          <Grid item xs={4}>
            <Goal goal={goals} user={user} key={goals.key} />
          </Grid>
        )}
      </Grid>
      <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.griditem}><Typography variant="h4">New Invitation</Typography></Grid>
        {invitelist.map(goals =>
          <Grid item xs={4}>
            <Invite goal={goals} user={user} key={goals.key} />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default GoalGrid;