import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
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
    //add date to goals
    console.log(title);
    console.log(metric);
    console.log(minimum);
    console.log(duration);
    if (
      title === undefined ||
      metric === undefined ||
      minimum === undefined ||
      duration === undefined ||
      email === undefined ||
      title === "" ||
      metric === "" ||
      minimum === "" ||
      duration === "" ||
      email === ""
    ) {
      alert("Please fill all fields");
    } else {
      let rg = /\./g;
      let temp = email.replace(rg, ",");
      if (!emailTouid[temp]) {
        alert("The user does not exist");
      } else {
        alert("success");
        console.log(typeof selectedDate);

        var dt = selectedDate.toLocaleString("en-US", {
          timeZone: "America/Chicago",
        });
        console.log(selectedDate);
        var myJSON = JSON.stringify(dt);
        console.log(myJSON);
        var timeNow = myJSON.split('"')[1].split(",")[0];

        var myRef = db.child("goals").push();
        var key = myRef.key;

        console.log(typeof user.uid);

        var newData = {
          confirmed: false,
          key: key,
          title: title,
          startDate: timeNow,
          duration: duration,
          // endDate: "",
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
        db.child("users").child(user.uid).child("goals").push(key);

        //add goal to invitee
        db.child("users").child(emailTouid[temp]).child("invites").push(key);
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
            placeholder="What will you do every day to reach your goal (i.e. 10 pushups a day)"
          />
          <TextField
            margin="dense"
            label="Goal Metric"
            fullWidth
            onChange={(event) => setMetric(event.target.value)}
            placeholder="Unit(i.e. # of pushups)"
          />
          <TextField
            margin="dense"
            label="Daily Minimum"
            fullWidth
            onChange={(event) => setMinimum(event.target.value)}
            placeholder="Minimum for each day needed to complete your goal"
            type="number"
          />
          <TextField
            margin="dense"
            label="Goal Duration"
            fullWidth
            onChange={(event) => setDuration(event.target.value)}
            placeholder="how many weeks will you perform your goal(i.e. # of weeks)"
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
            label="Invite your friend"
            fullWidth
            onChange={(event) => setEmail(event.target.value)}
            placeholder="input the email of your friend"
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
