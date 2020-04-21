import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
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
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  yaxis:{
  	padding:'10px',
  	textAlign: 'center'
  },
}));

const data = [
  {
    name: '1', uv: 4000, pv: 2400, 
  },
  {
    name: '2', uv: 3000, pv: 1398, 
  },
  {
    name: '3', uv: 2000, pv: 9800,
  },
  {
    name: '4', uv: 2780, pv: 3908, 
  },
  {
    name: '5', uv: 1890, pv: 4800, 
  },
  {
    name: '6', uv: 2390, pv: 3800, 
  },
  {
    name: '7', uv: 3490, pv: 4300, 
  },
];

export default function MaxWidthDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open max-width dialog
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Do Daily Pushups, Yay</DialogTitle>
        <DialogContent>
          <DialogContentText>
          	Do 10 pushups a day.
          </DialogContentText>
          <div>
           <div style={{float:'left'}}>
           	
           </div>
           <div style={{float: 'right'}}>
	       <LineChart
	        width={500}
	        height={300}
	        data={data}
	        margin={{
	          top: 5, right: 30, left: 30, bottom: 30,
	        }}
	        className={classes.form}
	      >
	        <CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name">
		   		<Label value="Days" offset={0} position="bottom" />
		  	</XAxis>  			
		  	<YAxis className={classes.yaxis} label={{ value: 'Pushups', angle: -90, position: 'left'}} />
	        <Tooltip />
  			<Legend verticalAlign="top" height={36}/>
	        <Line name="Suzy Q." type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
	       	<Line name="Jonny P." type="monotone" dataKey="pv" stroke="#82ca9d" />
	       	<ReferenceLine y={5000} label="Goal" stroke="green" strokeDasharray='5 5'  />
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
