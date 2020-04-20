import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import Goal from './Goal'
import firebase from './shared/firebase'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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

const AddGoal = ({open,setOpen}) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [duration, setDuration] = useState();

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = () => {
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Create a new goal</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Goal Title"
        fullWidth
        onChange={event=>setTitle(event.target.value)}
      />
      <TextField
        margin="dense"
        label="Goal Description"
        fullWidth
        onChange={event=>setDescription(event.target.value)}
      />
      <TextField
        margin="dense"
        label="Goal Duration"
        fullWidth
        onChange={event=>setDuration(event.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        Submit
      </Button>
      {console.log(title)}
      {console.log(description)}
      {console.log(duration)}
    </DialogActions>
    </Dialog>
  )
  
}

const App = () =>  {
  const [goalsJSON, setGoals] = useState({});
  const [user, setUser] = useState({'uid': 'HQrNozAtFVhlCqDDAkStjlhowtw2'});
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  }

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
      <Grid container direction="row" justify="flex-end">
      <Grid item>
      <IconButton color="primary" onClick={handleOpen}>
        <AddCircleIcon fontSize="large"/>
      </IconButton>
      </Grid>
      </Grid>
      <AddGoal open={open} setOpen={setOpen}/>
      {/*goals.map(goal => <Goal goal={goal} user={user} key={goal.key}/>)*/}
      {console.log(' goals: '+ goals)}
      {console.log(' goals[0]: '+ goals[0])}
      {goals[0]? <Goal goal={goals[0]} user={user} key={goals[0].key}/> : <React.Fragment></React.Fragment>}
      {goals[1]? <Goal goal={goals[1]} user={user} key={goals[1].key}/> : <React.Fragment></React.Fragment>}
    </div>
  );
}

export default App;