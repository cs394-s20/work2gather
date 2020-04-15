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
    const checkedIn = goal["progress"][user.uid][onDayNum];
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
  };

  const ProgressGrid = () => {
    let user1Rows = [];
    let user2Rows = [];
    let user1Cells = [];
    let user2Cells = [];

    for (var i = 0; i < goal["duration"] * 7; i++) {
      if (user1Cells.length < 7) {
        user1Cells.push(
          <TableCell
            className={
              goal["progress"][user.uid][i]
                ? classes.progressFilled1
                : classes.progressUnfilled
            }
            key = {i}
          ></TableCell>
        );
        user2Cells.push(
          <TableCell
            className={
              goal["progress"]["user2"][i]
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
              goal["progress"][user.uid][i]
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
              goal["progress"]["user2"][i]
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
          <React.Fragment key={i}>
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
            {goal["description"]}
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
          
      {canCheckIn() ? 
        <Typography align="center">You've checked in for today.  Great progress!</Typography> : 
        <CardActions><Button size="small" style={{marginLeft: 'auto', marginRight:'auto'}} disabled={checkedIn} onClick={makeProgress}>
            Check In
            </Button>
        </CardActions>
      }
        
      </CardContent>
    </Card>
  );
};

export default Goal;
