import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import Goal from './Goal'
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
  grid: {
    marginBottom: -60
  }
}));

const Welcome = ({ user }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Welcome, {user.displayName}
          </Typography>
          <Button color="inherit" onClick={() => firebase.auth().signOut()}>
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
  const [user, setUser] = useState({});
  const [emailTouid, setEmailTouid] = useState({});
  const [open, setOpen] = useState(false);

  var goals = Object.values(goalsJSON);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    const handleData = snap => {
      console.log(user)
      if (user) {
        if (snap.val()) {
          console.log(snap.val().users[user.uid]);

          db.child("users").child(user.uid).child("name").set(user.displayName);
          db.child("users").child(user.uid).child("goals").set("");
          db.child("users").child(user.uid).child("intives").set("");
          setEmailTouid(snap.val().emailTouid);
          let re = /\./gi;
          let email = user.email.replace(re, ',')
          db.child('emailTouid/' + email).set(user.uid);
          let goals_arr = snap.val().users[user.uid].goals;
          console.log(goals_arr);
          setGoals(Object.values(goals_arr).map(goal => snap.val().goals[goal]));
        }
      } else {
        setGoals({});
        setEmailTouid({});
      }
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, [user]);

  // const allGoal = Object.values(snap.val().users[user.uid].goals);

  return (
    <div>
      <Banner user={user} title="Work2Gather">
      </Banner>
      {user ? <AddGoal open={open} user={user} setOpen={setOpen} emailTouid={emailTouid} /> : null}
      {/*goals.map(goal => <Goal goal={goal} user={user} key={goal.key}/>)*/}
      {console.log(' goals: ' + goals)}
      {console.log(' goals[0]: ' + goals[0])}
      {/* {goals[0]? <Goal goal={goals[0]} user={user} key={goals[0].key}/> : <React.Fragment></React.Fragment>}
      {goals[1]? <Goal goal={goals[1]} user={user} key={goals[1].key}/> : <React.Fragment></React.Fragment>} */}
      {user ? <Container maxWidth="xl">
        <GoalGrid goals={goals} user={user} />
      </Container> : null}
    </div>
  );
}


const GoalGrid = ({ goals, user }) => {
  let classes = useStyles();
  let unfinished = [];
  let pending = [];
  Object.values(goals).map(goals => goals.confirmed ? unfinished.push(goals) : pending.push(goals))

  return (
    <React.Fragment>
      <Grid container spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.grid}><Typography variant="h4">Unfinished Goals</Typography></Grid>
        {unfinished.map(goals =>
          <Grid item xs={4}>
            <Goal goal={goals} user={user} key={goals.key} />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} className={classes.grid}><Typography variant="h4">Pending Goals</Typography></Grid>
        {pending.map(goals =>
          <Grid item xs={4}>
            <Goal goal={goals} user={user} key={goals.key} />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};


export default App;