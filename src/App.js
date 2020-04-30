import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import Goal from './Card/Goal'
import Invite from './Card/Invite'
import AddGoal from './AddGoal';
import firebase from './shared/firebase'
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  gridcontainer:{
    marginTop: 50
  },
  griditem: {
    marginBottom: -60
  }
}));

const Welcome = ({ user }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
              Work2Gather
          </Typography>
          <Typography variant="h6" style={{float:"center", marginRight: 30}}>
            Welcome, {user.displayName ? user.displayName.split(' ')[0] : ""}
          </Typography>
          <Button style={{fontSize:21}} color="inherit" onClick={() => firebase.auth().signOut()}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};
const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Banner = ({ user, title }) => (
  <React.Fragment>
    {user ? <Welcome user={user} /> : <SignIn />}
  </React.Fragment>
);

const App = () => {
  const [goalsJSON, setGoals] = useState({});
  const [invites, setInvite] = useState({});
  const [user, setUser] = useState({});
  const [emailTouid, setEmailTouid] = useState({});
  const [open, setOpen] = useState(false);
  const apple = 0; 

  var goals = Object.values(goalsJSON);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    const handleData = snap => {
      console.log(user)
      if (user) {
        if (snap.val()) {
          let re = /\./gi;
          let email = user.email.replace(re, ',')
          db.child('emailTouid/' + email).set(user.uid);
          setEmailTouid(snap.val().emailTouid);
          if(!snap.val().users[user.uid]){
            db.child("users").child(user.uid).child("name").set(user.displayName);
          }
          if(snap.val().users[user.uid]&&snap.val().users[user.uid].goals){
            let goals_arr = snap.val().users[user.uid].goals;
            console.log(goals_arr);
            setGoals(Object.values(goals_arr).map(goal => snap.val().goals[goal]));
          }
          if (snap.val().users[user.uid] && snap.val().users[user.uid].invites) {
            let invites_arr = snap.val().users[user.uid].invites;
            console.log(invites_arr);
            setInvite(Object.values(invites_arr).map(goal => snap.val().goals[goal]));
          }
        }
      } else {
        setGoals({});
        setEmailTouid({});
      }
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, [user]);

  return (
    <div>
      <Banner user={user} title="Work2Gather">
      </Banner>
      {user ? <AddGoal open={open} user={user} setOpen={setOpen} emailTouid={emailTouid} /> : null}
      {user ? <Container maxWidth="xl">
        <GoalGrid goals={goals} invites={invites} user={user} />
      </Container> : null}
    </div>
  );
}


const GoalGrid = ({ goals, invites, user }) => {
  let classes = useStyles();
  const [unfinished, setUnfinished] = useState([]);
  const [pending, setPending] = useState([]);
  const [invitelist, setInvitelist] = useState([]);

  useEffect(() => {
    console.log( "grid invite" +  invitelist);
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


export default App;