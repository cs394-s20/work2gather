import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Goal from './Card/Goal'
import Invite from './Card/Invite'

const useStyles = makeStyles((theme) => ({
  gridcontainer:{
    marginTop: "5px"
  },
  griditem: {
    marginTop: "5px",
    marginBottom:"5px"
  },
  carditem:{
    marginLeft: "25px", 
    marginRight:"25px"
  },
  inviteitem:{
    maxWidth:"50%"
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
      <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.griditem}><Typography variant="h4">To-Do Goals</Typography></Grid>
        {unfinished.map(goals =>
          <Grid item className={classes.carditem}>
            <Goal goal={goals} user={user} key={goals.key} />
          </Grid>
        )}
      </Grid>
      <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.griditem}><Typography variant="h4">Pending Invites</Typography></Grid>
        {pending.map(goals =>
          <Grid item className={classes.carditem}>
            <Goal goal={goals} user={user} key={goals.key} />
          </Grid>
        )}
      </Grid>
      <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.griditem}><Typography variant="h4">New Invites</Typography></Grid>
        {invitelist.map(goals =>
          <Grid item className={classes.inviteitem}>
            <Invite goal={goals} user={user} key={goals.key}/>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default GoalGrid;