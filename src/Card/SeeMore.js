import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  LineChart, Label, ReferenceLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
    align: 'right',
  },
  yaxis:{
  	padding:'10px',
  	textAlign: 'center'
  },
}));

export default function SeeMore({ goal }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [goalData, setGoalData] = useState([]);

  const getDayOn = () => {
    var startdate = new Date(goal["startDate"]);
    var currentdate = new Date();
    let deltatime = currentdate.getTime() - startdate.getTime();
    let deltadays = Math.floor(deltatime / (1000 * 3600 * 24));
    return deltadays;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let tempData = []; 
    let users = Object.keys(goal["progress"]);
    for(let j = 0; j < goal["progress"][users[0]].length; j++){
      let entry = {
        name: j.toString(), 
        uv: goal["progress"][users[0]][j],
        pv: goal["progress"][users[1]][j],
      }
      tempData.push(entry); 
    }
    setGoalData(tempData);
  }, [goal]);

  return (
    <React.Fragment>
      <div>
        <div>
          <Button  size="small" variant="outlined" color="primary" onClick={handleClickOpen}>
            See More
          </Button>
        </div>
        <div>
        </div>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        style={{overflow:"scrollbar"}}
      >
        <DialogTitle id="max-width-dialog-title">{goal.title}</DialogTitle>
        <DialogContent>
          <div>
            <div style={{float:'left'}}>
              <DialogContentText>
                {goal.description}
                <br></br>
                Started: {goal.startDate}
                <br></br>
                Days Left: {goal.duration * 7 - getDayOn()}
                <br></br>
              </DialogContentText>
            </div>
            <div style={{float: 'right'}}>
              <LineChart
                width={500}
                height={300}
                data={goalData}
                margin={{
                  top: 5, right: 30, left: 30, bottom: 30,
                }}
                className={classes.form}
              >
                <CartesianGrid strokeDasharray="3 3" />
        		    <XAxis dataKey="name">
        	   		  <Label value="Days" offset={0} position="bottom" />
        	  	  </XAxis>  			
        	  	  <YAxis className={classes.yaxis} label={{ value: goal.metric, angle: -90, position: 'left'}} />
                <Tooltip />
        			  <Legend verticalAlign="top" height={36}/>
                <Line name="Suzy Q." type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
               	<Line name="Jonny P." type="monotone" dataKey="pv" stroke="#82ca9d" />
               	<ReferenceLine y={goal["minimum"]} label="Goal" stroke="green" strokeDasharray='5 5'  />
              </LineChart>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
