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
    width: 600,
    overflow: "auto",
    margin: "100px",
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
    width: "100%",
    marginTop: "10px",
  },
  tableCont: {
    width: "300",
  },
  progressFilled1: {
    size: "small",
    backgroundColor: "aqua",
    border: "1px solid black",
    // width: "10%",
  },
  progressFilled2: {
    size: "small",
    backgroundColor: "lightgreen",
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
  });

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
          ></TableCell>
        );
        user2Cells.push(
          <TableCell
            className={
              goal["progress"]["user2"][i]
                ? classes.progressFilled2
                : classes.progressUnfilled
            }
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
          ></TableCell>
        );
      }
    }
    user1Rows.push(<TableRow>{user1Cells}</TableRow>);
    user2Rows.push(<TableRow>{user2Cells}</TableRow>);

    let table = [];
    for (let i = 0; i < user1Rows.length; i++) {
      table.push(
        <Table className={classes.table}>
          {" "}
          {user1Rows[i]} {user2Rows[i]}{" "}
        </Table>
      );
    }

    return (
      <Table className={classes.table} aria-label="simple table">
        {table}
      </Table>
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {goal["title"]}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {goal["description"]}
        </Typography>
        <Typography variant="body2" component="p">
          <TableContainer className={classes.tableCont} component={Paper}>
            <ProgressGrid />
          </TableContainer>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" disabled={checkedIn} onClick={makeProgress}>
          Check In
        </Button>
      </CardActions>
    </Card>
  );
};

export default Goal;
