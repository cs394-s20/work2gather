import React,{useState} from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker,} from '@material-ui/pickers';
import firebase from './shared/firebase'

const db = firebase.database().ref();

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 5,
  }
}));

const AddGoal = ({open, user, setOpen}) => {
    const [title, setTitle] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [duration, setDuration] = useState();
    const [metric, setMetric] = useState("Metric");
    const classes = useStyles();

    const handleOpen = () => {
      setOpen(true);
    }

    const handleClose = () => {
      setOpen(false);
    }
  
    const handleSubmit = () => {
      //add date to goals
      if(title===undefined||duration===undefined||metric===undefined)
      {
        alert("Please fill all fields");
      }
      else{
        console.log(typeof(selectedDate));

        var dt = selectedDate.toLocaleString('en-US', { timeZone: 'America/Chicago' })
        console.log(selectedDate);
        var myJSON = JSON.stringify(dt);
        console.log(myJSON);
        var timeNow = myJSON.split("\"")[1].split(",")[0]
  
        var myRef = db.child("goals").push();
        var key = myRef.key;
  
        console.log(typeof(user.uid))
      
        var newData={
          confirmed: true,
          duration: duration,
          endDate: "",
          groupMembers:{
            creator: "123"
          },
          key: key,
          metric: metric,
          progress: {
            [user.uid]:{
              0: 1
            },
            user2: {
              0: 1
            }
          },
          minimum: 10,
          startDate: timeNow,
          title: title
        }
      
        myRef.update(newData);
  
        //add date to goals
        db.child("users")
          .child(user.uid)
          .child("goals")
          .push(key);
  
        handleClose();
      }
    }
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    return (
      <React.Fragment>
      <Grid container direction="row" justify="center">
      <Grid item>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon fontSize="large"/>}
          size="large"
          onClick={handleOpen}
        >
          Add a new goal
        </Button>
      </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a new goal</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Goal Title"
          fullWidth
          onChange={event=>setTitle(event.target.value)}
          placeholder="What will you do every day to reach your goal (i.e. 10 pushups a day)"
        />
        <TextField
          margin="dense"
          label="Goal Metric"
          fullWidth
          onChange={event=>setMetric(event.target.value)}
          placeholder="Unit(i.e. # of pushups)"
        />
        <TextField
          margin="dense"
          label="Goal Duration"
          fullWidth
          onChange={event=>setDuration(event.target.value)}
          placeholder="how many weeks will you perform the goal(i.e. # of weeks)"
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
  
            format="MM/dd/yyyy"
            margin="normal"
            label="Goal Start Date"
            value={selectedDate}
            onChange={handleDateChange}
            fullWidth
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button disabled={true}>
          Invite your friends
        </Button>
      </DialogActions>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
      </Dialog>
      </React.Fragment>
    )
}

export default AddGoal;