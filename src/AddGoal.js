import React,{useState} from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker,} from '@material-ui/pickers';
import firebase from './shared/firebase'

const db = firebase.database().ref();

const AddGoal = ({open, user, setOpen}) => {
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [duration, setDuration] = useState();
  
    const handleClose = () => {
      setOpen(false);
    }
  
    const handleSubmit = () => {
      //add date to goals
      console.log(typeof(selectedDate));

      var dt = selectedDate.toLocaleString('en-US', { timeZone: 'America/Chicago' })
      console.log(selectedDate);
      var myJSON = JSON.stringify(dt);
      console.log(myJSON);
      var timeNow = myJSON.split("\"")[1].split(",")[0]

      var myRef = db.child("goals").push();
      var key = myRef.key;
    
      var newData={
        confirmed: true,
        description: description,
        duration: duration,
        endDate: "",
        groupMembers:{
          creator: "123"
        },
        key: key,
        progress: {
          0: false
        },
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
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
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
      </DialogActions>
      </Dialog>
    )
}

export default AddGoal;