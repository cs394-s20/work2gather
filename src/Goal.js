import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      width: 500,
      overflow: "auto",
      margin: '100px',
      display: 'inline-block'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

const Goal = ({goal}) => {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
    <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
          {goal['title']}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
          {goal['description']}
          </Typography>
          <Typography variant="body2" component="p">
            {goal['title'] == "Read 20 Minutes Daily, Yippee"? (
                <React.Fragment>
            <p>pretend this is the grid?pretend this is the grid?pretend this is the grid?pretend this is the grid?pretend this is the grid?pretend this is the grid?pretend this is the grid?</p>
            <p>pretend this is the grid?</p>
            <p>pretend this is the grid?</p>
            <p>pretend this is the grid?</p>
            <p>pretend this is the grid?</p>
            <p>pretend this is the grid?</p></React.Fragment>) : <p>cheeseburgers</p>}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Check In</Button>
        </CardActions>
    </Card>);
}

export default Goal;