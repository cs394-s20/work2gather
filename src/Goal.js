import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import firebase from "./shared/firebase";
import Slider from '@material-ui/core/Slider';

const db = firebase.database().ref();

const useStyles = makeStyles({
  root: {
    width: '35%',
    marginLeft: '10%',
    overflow: "auto",
    marginTop: "50px",
    display: "inline-block",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  table: {
    tableLayout: "auto",
    width: "99.9%",
    marginTop: '0px',
    marginBottom: "10px",
  },
  marginless: {
    margin: 0
  },
  tableCont: {
    width: "300",
  },
  progressFilled1: {
    size: "small",
    backgroundColor: '#14ECF5', //our own special blue
    border: "1px solid black",
    // width: "10%",
  },
  progressFilled2: {
    size: "small",
    backgroundColor: '#14F58E', //our own special red
    border: "1px solid black",
    // width: "10%",
  },
  progressUnfilled: {
    size: "small",
    border: "1px solid black",
    // width: "10px",
  },
  pos: {
    marginBottom: 12,
  },
  ourSpecialBlue:{
    backgroundColor: '#14ECF5', //our own special blue
    padding: "5px"
  },
  ourSpecialGreen:{
    backgroundColor: '#14F58E', //our own special red
    padding: "5px"
  }
});

const Goal = ({ goal, user }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const getDayOn = () => {
    var startdate = new Date(goal["startDate"]);
    var currentdate = new Date();
    let deltatime = currentdate.getTime() - startdate.getTime();
    let deltadays = Math.floor(deltatime / (1000 * 3600 * 24));
    return deltadays;
  };

  const canCheckIn = () => {
    const onDayNum = getDayOn();
    console.log(onDayNum);
    console.log(user.uid);
    const checkedIn = goal["progress"][user.uid][onDayNum] >= goal["minimum"];
    return checkedIn;
  };
  
  useEffect(() => {
    setCheckedIn(canCheckIn);
  }, []);

  const makeProgress = () => {
    const onDayNum = getDayOn();
    db.child("goals")
      .child(goal["key"])
      .child("progress")
      .child(user.uid)
      .child(onDayNum)
      .set(true);
    setCheckedIn(true);
  };

  const handleSliderChange = (e, newValue) => {
    const onDayNum = getDayOn();
    db.child("goals")
      .child(goal["key"])
      .child("progress")
      .child(user.uid)
      .child(onDayNum)
      .set(newValue);
    // setCheckedIn(true);
  };

  const reminder = () => {
    alert("you have reminded your friend");

  }

  const ProgressGrid = () => {
    let user1Rows = [];
    let user2Rows = [];
    let user1Cells = [];
    let user2Cells = [];
    console.log('goal["progress"]');

    console.log(goal["progress"]);


    for (var i = 0; i < goal["duration"] * 7; i++) {
      
      if (user1Cells.length < 7) {
        user1Cells.push(
          <TableCell
            className={
              goal["progress"][user.uid][i] >= goal["minimum"]
                ? classes.progressFilled1
                : classes.progressUnfilled
            }
            key = {i}
          ></TableCell>
        );
        user2Cells.push(
          <TableCell
            className={
              goal["progress"]["user2"][i] >= goal["minimum"]
                ? classes.progressFilled2
                : classes.progressUnfilled
            }
            key = {i}
          ></TableCell>
        );
      } else {
        user1Rows.push(<TableRow>{user1Cells}</TableRow>);
        user1Cells = [];
        user1Cells.push(
          <TableCell
            className={
              goal["progress"][user.uid][i] >= goal["minimum"]
                ? classes.progressFilled1
                : classes.progressUnfilled
            }
            key = {i}
          ></TableCell>
        );
        user2Rows.push(<TableRow>{user2Cells}</TableRow>);
        user2Cells = [];
        user2Cells.push(
          <TableCell
            className={
              goal["progress"]["user2"][i] >= goal["minimum"]
                ? classes.progressFilled2
                : classes.progressUnfilled
            }
            key = {i}
          ></TableCell>
        );
      }
    }
    user1Rows.push(<TableRow>{user1Cells}</TableRow>);
    user2Rows.push(<TableRow>{user2Cells}</TableRow>);

    let table = [];
    for (let i = 0; i < user1Rows.length; i++) {
      table.push(
          <React.Fragment key={'tablefragment' + i}>
            <Typography className={classes.marginless} variant="body2" >{"Week " + (i + 1)}</Typography>
            <Table className={classes.table}>
            <TableBody>
            {user1Rows[i]}{user2Rows[i]}
            </TableBody>
            </Table>
        </React.Fragment>
      );
    }

    return (
      <TableContainer className={classes.table} aria-label="simple table">
        {table}
      </TableContainer>
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <div style={{ width: '70%', display: 'inline-block'}}>
            <Typography variant="h5" component="h2">
            {goal["title"]}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
            {goal["description"]}<br></br>
            Started: {goal["startDate"]}
            </Typography>
        </div>
        <div style={{width: '20%',  display: 'inline-block', float: 'right'}}>
            <Table>
                <TableBody>
                <TableRow ><TableCell className={classes.ourSpecialBlue}> {/*user.displayName.split(' ')[0]*/'Suzy Q'}</TableCell></TableRow>
                <TableRow ><TableCell className={classes.ourSpecialGreen}> {'Johnny P'}</TableCell></TableRow>
                </TableBody>
            </Table>
        </div>
        <ProgressGrid />


  <h4 className={classes.marginless} style={{marginTop:'10px'}} align="center">Day {getDayOn()}</h4>
          
  <Typography id="discrete-slider" gutterBottom>
        {goal['metric']}:
        {console.log('cheese: ' + user.uid)}
      </Typography>
      <Slider
        style={{width:"95%", marginLeft:"2%", float: "center"}}
        defaultValue={5}
        getAriaValueText={(value) => (value)}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        onChange={handleSliderChange}
        marks
        min={0}
        max={15}
      />

        <CardActions>
          <Button size="small" variant="contained" color='primary' style={{marginLeft: 'auto', marginRight:'auto'}} onClick={reminder}>
            Remind Friends
          </Button>
        </CardActions>
        
      </CardContent>
    </Card>
  );
};

export default Goal;
