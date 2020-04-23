import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import Goal from './Goal'
import firebase from './shared/firebase'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AddGoal from './AddGoal';
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
            {/*<Button color="inherit" onClick={() => firebase.auth().signOut()}>Log out</Button>*/}
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
  const [user, setUser] = useState({'uid': 'HQrNozAtFVhlCqDDAkStjlhowtw2'});
  const [open, setOpen] = useState(false);

  var goals = Object.values(goalsJSON);

  useEffect(() => {
    // firebase.auth().onAuthStateChanged(setUser);
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
          setGoals(Object.values(goals_arr).map(goal => snap.val().goals[goal]));
        } 
      } else{
        setGoals({});
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
      <AddGoal open={open} user={user} setOpen={setOpen}/>
      {/*goals.map(goal => <Goal goal={goal} user={user} key={goal.key}/>)*/}
      {console.log(' goals: '+ goals)}
      {console.log(' goals[0]: '+ goals[0])}
      {/* {goals[0]? <Goal goal={goals[0]} user={user} key={goals[0].key}/> : <React.Fragment></React.Fragment>}
      {goals[1]? <Goal goal={goals[1]} user={user} key={goals[1].key}/> : <React.Fragment></React.Fragment>} */}
      <div float = "left" style={{float: "left"}}>
        <Container maxWidth = "lg">
          <GoalGrid goals = {goals} user = {user}/>
        </Container>
      </div>
    </div>
  );
}


const GoalGrid = ({goals, user}) => {
  const classes = useStyles();
  return (
    <div className={classes.gird} style={{width: "120%"}}>
      <Grid container spacing={5} justify = "center">
        {Object.values(goals).map(goals => 
          <Goal goal={goals} user={user} key={goals.key}/> 
        )}
      </Grid>
    </div>
  );
};


export default App;