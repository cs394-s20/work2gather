import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Goal from './Card/Goal'
import AddGoal from './AddGoal';
import GoalGrid from './GoalGrid';
import firebase from './shared/firebase'

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
  title: {
    flexGrow: 1,
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

  var goals = Object.values(goalsJSON);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    const handleData = snap => {
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
            setGoals(Object.values(goals_arr).map(goal => snap.val().goals[goal]));
          }
          else{
            setGoals({});
          }
          if (snap.val().users[user.uid] && snap.val().users[user.uid].invites) {
            let invites_arr = snap.val().users[user.uid].invites;
            setInvite(Object.values(invites_arr).map(goal => snap.val().goals[goal]));
          }
          else{
            setInvite({});
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
      <br></br>
      {user ? <AddGoal open={open} user={user} setOpen={setOpen} emailTouid={emailTouid} /> : null}
      {user ? <Container maxWidth="xl">
        <GoalGrid goals={goals} invites={invites} user={user} />
      </Container> : null}
    </div>
  );
}

export default App;