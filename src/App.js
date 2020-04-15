import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import Goal from './Goal'
import firebase from './shared/firebase'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

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
}));

const Welcome = ({ user }) => {
  const classes = useStyles();

  return (
  <React.Fragment>
  <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
              {//Welcome, {user.displayName.split(' ')[0]}
              }
              Welcome, Suzy Q
          </Typography>
          <Button color="inherit" onClick={() => firebase.auth().signOut()}>Log out</Button>
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
    { user ? <Welcome user={ user } /> : <SignIn /> }
  </React.Fragment>
);

const App = () =>  {
  const [goalsJSON, setGoals] = useState({});
  const [user, setUser] = useState(null);

  var goals = Object.values(goalsJSON);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    const handleData = snap => {
      console.log(user)
      if (user){
        console.log(user)
        if (snap.val()){
          let user_goals = [];
          console.log(user_goals)
          let goals_arr = snap.val().users[user.uid].goals;
          setGoals(goals_arr.map(goal => snap.val().goals[goal]));
        } 
      } else{
        setGoals({});
      }
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, [user]);




  return (
    <div>
      <Banner user={user} title="Work2Gather"></Banner>
      {goals.map(goal => <Goal goal={goal} user={user} key={goal.key}/>)}
    </div>
  );
}

export default App;