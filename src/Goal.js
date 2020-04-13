import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
    table: {
        border: '1px solid black'
    },
    progressFilled:{
      backgroundColor: 'blue',
      borderBottom: 'none',
      width: 7
    },
    progressUnfilled:{
      borderBottom: 'none',
      width: 7
    },
    pos: {
      marginBottom: 12,
    },
  });

const Goal = ({goal}) => {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const ProgressGrid = () => {
        let rowsArray = [];
        let cellsArray = [];

        for (var i = 0; i < goal['duration'] * 7; i++){
            if(cellsArray.length < 7){
                cellsArray.push(
                    <TableCell className={goal['progress']['user1'][i] ?
                    classes.progressFilled : classes.progressUnfilled}>
                    </TableCell>
                );
            } else {
                rowsArray.push(<TableRow>{cellsArray}</TableRow>);
                cellsArray = [];
                cellsArray.push(
                    <TableCell className={goal['progress']['user1'][i] ?
                    classes.progressFilled : classes.progressUnfilled}>
                    </TableCell>
                );
            }
        }
        rowsArray.push(<TableRow>{cellsArray}</TableRow>);
        return (<Table className={classes.table} aria-label="simple table">{rowsArray}</Table>);
    }

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
          <TableContainer component={Paper}>
      <ProgressGrid/>
    </TableContainer>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Check In</Button>
        </CardActions>
    </Card>);
}

export default Goal;