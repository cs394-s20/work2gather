import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Goal from './Goal'
import firebase from './shared/firebase'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <AppBar position="static">
    <Toolbar>
      {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>*/}
      <Typography variant="h6">
        Welcome, {user.displayName}
      </Typography>
      <Typography variant="h6" align="center">
        Work2Gather
      </Typography>
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Toolbar>
  </AppBar>
);

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
  const [user, setUser] = useState({});
  var goals = Object.values(goalsJSON);
  useEffect(() => {
    const fetchGoals = async () => {
      const response = await fetch('./data.json');
      const json = await response.json();
      setGoals(json.goals);
      
    };
    fetchGoals();
    const fetchUsers = async () => {
      const response = await fetch('./data.json');
      const json = await response.json();
      // setUser(json.users);
      
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);


  return (
    <div>
      <Banner user={user} title="Work2Gather"></Banner>
      {goals.map(goal => <Goal goal={goal}/>)}
    </div>
  );
}

export default App;