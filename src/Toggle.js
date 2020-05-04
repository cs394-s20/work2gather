import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles((theme) => ({
    toggleContainer: {
        margin: theme.spacing(2, 0),
    },
}));

const ToggleButtons = ({ showGoals, setShowGoals }) => {
    const handleShowGoals = (event, newShowGoals) => {
        if (newShowGoals !== null) {
            setShowGoals(newShowGoals);
        }
    };

    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
                <div className={classes.toggleContainer}>
                    <ToggleButtonGroup
                        value={showGoals}
                        exclusive
                        onChange={handleShowGoals}
                        aria-label="text alignment"
                    >
                        <ToggleButton value="ALL" aria-label="centered">
                            Show All
                        </ToggleButton>
                        <ToggleButton value="TODO" aria-label="centered">
                            Show To-Do
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </Grid>
        </Grid>
    );
}

export default ToggleButtons