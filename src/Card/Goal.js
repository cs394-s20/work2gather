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
import firebase from "../shared/firebase";
import Slider from "@material-ui/core/Slider";
import { TextField } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import MaxWidthDialog from "./SeeMore"
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import ClearIcon from '@material-ui/icons/Clear';


const db = firebase.database().ref();

  const useStyles = makeStyles({
  root: {
    // maxWidth: "65%",
    // minWidth: "35%",
    // marginLeft: "5%",
    // marginRight: "5%",
    // overflow: "auto",
    // marginTop: "50px",
    // display: "inline-block",
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
    marginTop: "0px",
    marginBottom: "10px",
  },
  marginless: {
    margin: 0,
  },
  tableCont: {
    width: "300",
  },
  progressFilled1: {
    size: "small",
    backgroundColor: "#14ECF5", //our own special blue
    border: "1px solid black",
    // width: "10%",
  },
  progressFilled2: {
    size: "small",
    backgroundColor: "#14F58E", //our own special green
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
  ourSpecialBlue: {
    backgroundColor: "#14ECF5", //our own special blue
    padding: "5px",
  },
  ourSpecialGreen: {
    backgroundColor: "#14F58E", //our own special red
    padding: "5px",
  },
  weekDays: {
    size: "small",
    // border: "1px solid black",
    borderBottom: "1px solid black",
    paddingBottom: "0px",
    paddingTop: "10px",
    textAlign: "center",
    width: "50px"
  },
   onDays: {
    size: "small",
    // border: "1px solid black",
    borderBottom: "1px solid black",
    paddingBottom: "0px",
    paddingTop: "10px",
    textAlign: "center",
    width: "50px",
    backgroundColor: "#14ECF5"
  },
  shape1: {
    backgroundColor: "#14ECF5",
    opacity: 0.5,

  },
  shape2: {
    backgroundColor: "#14F58E",
    opacity: 0.5,
  },
  shapeCircle: {
    borderRadius: '50%',
  },
  goalCircle: {
    backgroundColor: "white",
  },
  backCircle: {
    backgroundColor: "black", 
  },
});

const Goal = ({ goal, user }) => {
  const [progress, setProgress] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [circle1Ref, setCircle1Ref] = useState(React.createRef());
  const [circle2Ref, setCircle2Ref] = useState(React.createRef());
  const [circle1Left, setCircle1Left] = useState(0);
  const [circle1Top, setCircle1Top] = useState(0);
  const [circle1Radius, setCircle1Radius] = useState(0);
  
  const [circle2Left, setCircle2Left] = useState(0);
  const [circle2Top, setCircle2Top] = useState(0);
  const [circle2Radius, setCircle2Radius] = useState(0);
  
  const [goalCircleRef, setGoalCircleRef] = useState(React.createRef());
  const [goalCircleLeft, setGoalCircleLeft] = useState(0);
  const [goalCircleTop, setGoalCircleTop] = useState(0);
  const [goalCircleRadius, setGoalCircleRadius] = useState(0);

  const [backCircleRef, setBackCircleRef] = useState(React.createRef());
  const [backCircleLeft, setBackCircleLeft] = useState(0);
  const [backCircleTop, setBackCircleTop] = useState(0);
  const [backCircleRadius, setBackCircleRadius] = useState(0);

  const [fullCardRef, setFullCardRef] = useState(React.createRef());

  const [creatorName, setCreatorName] = useState("");
  const [inviteeName, setInviteeName] = useState("");

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  useEffect(() => {
    const setGoalUserNames = snap => {
      if(snap.val()){
    //     alert('yo')
    //     console.log(snap.val());
        setCreatorName(snap.val()[goal["groupMembers"]["creator"]]['name'].split(" ")[0]);
        setInviteeName(snap.val()[goal["groupMembers"]["invitee"]]['name'].split(" ")[0]);
      }
    };

    const dbUsers = firebase.database().ref("users");
    dbUsers.on('value', setGoalUserNames, error => alert(error));
    return () => { dbUsers.off('value', setGoalUserNames); };
    

    let users = Object.keys(goal["progress"]);
    for(let j = 0; j <= getDayOn(); j++){
      if(goal["progress"][users[0]][j] == undefined){
        db.child("goals")
          .child(goal["key"])
          .child("progress")
          .child(users[0])
          .child(j)
          .set(0);
          console.log("updating db for goal " + goal.key + " for user " + users[0])
      }
      if(goal["progress"][users[1]][j] == undefined){
        db.child("goals")
          .child(goal["key"])
          .child("progress")
          .child(users[1])
          .child(j)
          .set(0);
          console.log("updating db for goal " + goal.key + " for user " + users[1])

      }
    }
  }, []);

  useEffect(() => {
    // setCheckedIn(canCheckIn);
    setProgress(getProgress);
    // console.log("label uno: " +  circle1Ref.current.offsetWidth)
    // console.log("lebelo doso: " + circle2Ref.current.offsetWidth)
    // console.log("lebelo treso: " + fullCardRef.current.offsetWidth)
    const fullCardWidth = fullCardRef.current.offsetWidth;
    const fullCardHeight = fullCardRef.current.offsetHeight;
    const circle1Radius = (fullCardWidth*0.30) * (goal["progress"][goal["groupMembers"]["creator"]][getDayOn()] / goal["minimum"])
    console.log("lebelo cinco: " + goal["progress"][user.uid][getDayOn()])
    console.log("lebelo sixo: " + goal["progress"]['minimum'])
    const goalRadius =  fullCardWidth * 0.3;
    const backRadius = fullCardWidth * 0.31; 

    setBackCircleRadius(backRadius)
    setBackCircleTop(0) 
    setBackCircleLeft(fullCardWidth / 2 - backRadius / 2)

    setGoalCircleRadius(goalRadius);
    setGoalCircleTop(0 - goalRadius / 2 + backRadius / 2) 
    setGoalCircleLeft(fullCardWidth / 2 - goalRadius / 2)

    const circle2Radius = (fullCardWidth * 0.3) * (goal["progress"][goal["groupMembers"]["invitee"]][getDayOn()] / goal['minimum'])
    setCircle1Radius(circle1Radius);
    setCircle2Radius(circle2Radius);
    setCircle1Left(fullCardWidth / 2 - circle1Radius / 2);
    setCircle1Top(0 - circle1Radius / 2 + backRadius / 2);
    setCircle2Left(fullCardWidth / 2 - circle2Radius / 2);
    setCircle2Top(0 - circle2Radius / 2 + backRadius / 2);
  }, [goal]);

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

  const getProgress = () => {
    const onDayNum = getDayOn();
    const checkedIn = goal["progress"][user.uid][onDayNum];
    return checkedIn;
  };

  const saveProgress = (event, value) => {
    console.log(event.target.value);
    setProgress(event.target.value);
  };

  const updateProgress = (event, value) => {
    console.log(progress);
    console.log(typeof progress);
    const onDayNum = getDayOn();
    if (progress === "") {
      alert("Not a number");
    } else {
      db.child("goals")
        .child(goal["key"])
        .child("progress")
        .child(user.uid)
        .child(onDayNum)
        .set(parseInt(progress));
      setCheckedIn(true);
    }
  };

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
  };

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
            key={i}
          ></TableCell>
        );
        user2Cells.push(
          <TableCell
            className={
              goal["progress"]["user2"][i] >= goal["minimum"]
                ? classes.progressFilled2
                : classes.progressUnfilled
            }
            key={i}
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
            key={i}
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
            key={i}
          ></TableCell>
        );
      }
    }
    user1Rows.push(<TableRow>{user1Cells}</TableRow>);
    user2Rows.push(<TableRow>{user2Cells}</TableRow>);

    let table = [];
    let today = new Date();
    let dateNum = today.getUTCDay();

    let daysOfTheWeek = (
      <TableRow>
        <TableCell className={dateNum == 0 ? classes.onDays : classes.weekDays}>SUN</TableCell>
        <TableCell className={dateNum == 1 ? classes.onDays : classes.weekDays}>MON</TableCell>
        <TableCell className={dateNum == 2 ? classes.onDays : classes.weekDays}>TUE</TableCell>
        <TableCell className={dateNum == 3 ? classes.onDays : classes.weekDays}>WED</TableCell>
        <TableCell className={dateNum == 4 ? classes.onDays : classes.weekDays}>THU</TableCell>
        <TableCell className={dateNum == 5 ? classes.onDays : classes.weekDays}>FRI</TableCell>
        <TableCell className={dateNum == 6 ? classes.onDays : classes.weekDays}>SAT</TableCell>
      </TableRow>
    );
    for (let i = 0; i < user1Rows.length; i++) {
      table.push(
        <React.Fragment key={"tablefragment" + i}>
          <Typography className={classes.marginless} variant="body2">
            {"Week " + (i + 1)}
          </Typography>
          <Table className={classes.table}>
            <TableBody>
              {daysOfTheWeek}
              {user1Rows[i]}
              {user2Rows[i]}
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

  const deleteGoal = () => {
    db.child('users').child(goal.groupMembers.creator).child('goals').child(goal.key).set(null);
    db.child('users').child(goal.groupMembers.invitee).child('invites').child(goal.key).set(null);
    db.child('goals').child(goal.key).set(null);
  }

  return (
    <React.Fragment>
    <Badge 
      badgeContent={<ClearIcon onClick={deleteGoal}/>} 
      color="primary"
      anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    >
    <Card className={classes.root}>
      <CardContent>
        <div style={{ width: "70%", display: "inline-block" }}>
          <Typography variant="h5" component="h2">
            {goal["title"]}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {goal["description"]}
            <br></br>
            Started: {goal["startDate"]}
          </Typography>
        </div>
        <div style={{ width: "20%", display: "inline-block", float: "right" }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={classes.ourSpecialBlue}>
                  {" "}
                  {/*user.displayName.split(' ')[0]*/ creatorName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.ourSpecialGreen}>
                  {" "}
                  {inviteeName}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div ref={fullCardRef} style={{position: "relative", height: backCircleRadius * 1.05, width: '100%'}}>
            <div style={{overflow: "visible", position: "absolute", left: backCircleLeft, top:backCircleTop, width: backCircleRadius, height: backCircleRadius}} className={clsx(classes.backCircle, classes.shapeCircle)} />
            <div ref={goalCircleRef} style={{overflow: "visible", position: "absolute", left: goalCircleLeft, top:goalCircleTop, width: goalCircleRadius, height: goalCircleRadius}} className={clsx(classes.goalCircle, classes.shapeCircle)} />
            <div ref={circle1Ref} style={{overflow: "visible", position: "absolute", left: circle1Left, top:circle1Top, width: circle1Radius, height: circle1Radius}} className={clsx(classes.shape1, classes.shapeCircle)} />
            <div ref={circle2Ref} style={{overflow: "visible", position: "absolute", left: circle2Left, top:circle2Top, width: circle2Radius, height: circle2Radius}} className={clsx(classes.shape2, classes.shapeCircle)} />      
        </div>
        {/*<ProgressGrid />*/}

        <h4
          className={classes.marginless}
          style={{ marginTop: "10px" }}
          align="center"
        >
          Day {getDayOn()}
        </h4>

        <Typography id="discrete-slider" gutterBottom>
          {goal["metric"]}:{console.log("cheese: " + user.uid)}
        </Typography>
        <Container style={{ marginLeft: "auto", marginRight: "auto" }}>
          {/* {" "} */}
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            type="number"
            onChange={saveProgress}
            defaultValue={progress}
          />
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{ width: "70px", float: "right", marginTop: "30px"}}
            onClick={reminder}
          >
            Remind Friends
          </Button>
        </Container>

        {/* <Slider
          style={{ width: "95%", marginLeft: "2%", float: "center" }}
          defaultValue={5}
          getAriaValueText={(value) => value}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          onChange={handleSliderChange}
          marks
          min={0}
          max={15}
        /> */}

        <CardActions>
        <Button
            size="medium"
            variant="contained"
            color="primary"
            // style={{ marginLeft: "auto", marginRight: "auto" }}
            style={{ marginTop : "5px", marginLeft: "23.5px"}}
            onClick={updateProgress}
          >
            Update Progress
          </Button>          
        </CardActions>
        <MaxWidthDialog goal={goal}/>
      </CardContent>
    </Card>
    </Badge>
    </React.Fragment>
  );
};

export default Goal;
