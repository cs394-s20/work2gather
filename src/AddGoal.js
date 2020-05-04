import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import firebase from "./shared/firebase";

const db = firebase.database().ref();

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 5,
  },
}));

const AddGoal = ({ open, user, setOpen, emailTouid }) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [metric, setMetric] = useState();
  const [minimum, setMinimum] = useState();
  const [duration, setDuration] = useState();
  const [email, setEmail] = useState();
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle();
    setSelectedDate(new Date());
    setMetric();
    setMinimum();
    setDuration();
    setEmail();
  };

  const handleSubmit = () => {
    //console.log(title);
    //console.log(description);
    //console.log(metric);
    //console.log(minimum);
    //console.log(duration);
    if (
      title === undefined ||
      description === undefined ||
      metric === undefined ||
      minimum === undefined ||
      duration === undefined ||
      email === undefined ||
      title === "" ||
      description === "" ||
      metric === "" ||
      minimum === "" ||
      duration === "" ||
      email === ""
    ) {
      alert("Please fill in all fields.");
    } else {
      let rg = /\./g;
      let temp = email.replace(rg, ",");
      if (!emailTouid[temp]) {
        alert("The user does not exist. Please try again.");
      } else {
        alert("Success! New Goal Created!");
        var dt = selectedDate.toLocaleString("en-US", {
          timeZone: "America/Chicago",
        });
        var myJSON = JSON.stringify(dt);
        var timeNow = myJSON.split('"')[1].split(",")[0];
        var myRef = db.child("goals").push();
        var key = myRef.key;

        var newData = {
          deleted: false,
          rejected: false, 
          confirmed: false,
          archivedCreator: false, 
          archivedInvitee: false, 
          key: key,
          title: title,
          description: description,
          startDate: timeNow,
          duration: duration,
          groupMembers: {
            creator: user.uid,
            invitee: emailTouid[temp],
          },
          minimum: minimum,
          metric: metric,
          progress: {
            [user.uid]: {
              0: 0,
            },
            [emailTouid[temp]]: {
              0: 0,
            },
          },
          lastRemindCreator: -1,
          lastRemindInvitee: -1,
        };

        myRef.update(newData);

        //add goals to creator
        db.child("users").child(user.uid).child("goals").child(key).set(key);

        //add goal to invitee
        db.child("users").child(emailTouid[temp]).child("invites").child(key).set(key);
        
        handleClose();
      }
    }
  };

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
            startIcon={<AddCircleIcon fontSize="large" />}
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
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What's your goal focus? (e.g. Reading, Meditation, Daily Pushups)"
            inputProps={{maxLength: 15}}
          />
          {/* Goal Description Added to SeeMore? */}
          <TextField
            margin="dense"
            label="Goal Description"
            fullWidth
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What will you do every day to reach your goal? Set S.M.A.R.T goals!"
          />
          <TextField
            margin="dense"
            label="Goal Metric"
            fullWidth
            onChange={(event) => setMetric(event.target.value)}
            placeholder="What unit will you measure everyday? (e.g. pushups done, minutes spent)"
          />
          <TextField
            margin="dense"
            label="Daily Minimum"
            fullWidth
            onChange={(event) => setMinimum(event.target.value)}
            placeholder="How much do you need to do to complete your daily goal? (e.g. 10)"
            type="number"
          />
          <TextField
            margin="dense"
            label="Goal Duration"
            fullWidth
            onChange={(event) => setDuration(event.target.value)}
            placeholder="How many weeks will you work on your goal?(e.g. 2)"
            type="number"
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
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            margin="dense"
            label="Invite Your Friend"
            fullWidth
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Who do you want to work with? Please provide your friend's email address."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddGoal;