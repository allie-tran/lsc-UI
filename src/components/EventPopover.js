import React from "react";
import { makeStyles } from '@material-ui/styles'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Image from '../redux/Image-cnt'

const popStyle = makeStyles(theme => ({
    detailed: {
        width: "100%",
        height: 665,
        position: "relative",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#272727",
        flexDirection: "column"
    },
    grid: {
        overflow: "scroll",
        padding: 10
    }
}));


const EventPopover = ({ group, closeEvent }) => {
    const classes = popStyle()
    return (
        <Paper elevation={4} className={classes.detailed}>
            <Typography variant="overline" color="#F4CDD2">
                Event images
                </Typography>
            <Grid wrap="nowrap" container spacing={2} className={classes.grid}>
                {group.map(image => (
                    <Grid item>
                        <Image
                            className={classes.img}
                            image={image}
                            scale={6.0}
                            onEscapeKeyDown={closeEvent.bind(this)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>)
}

export default EventPopover;