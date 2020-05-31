import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button"

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Image from '../redux/Image-cnt'

const popStyle = makeStyles(theme => ({
    detailed: {
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#272727",
        flexDirection: "column",
        padding: 10
    },
    grid: {
        overflow: "auto",
        padding: 10
    },
    text: {
        color: "#F4CDD2"
    }
}));

const EventPopover = ({ group, closeEvent, getNextScenes, nextSceneRespone, getSimilar, similarResponse, position, similar }) => {
    const classes = popStyle()
    const [nextScenes, setNextScenes] = useState([])
    const [currentDisplay, setCurrentDisplay] = useState(group)

    window.addEventListener("keydown", function(e){
        console.log(e.key)
        if (e.key==="Escape"){
            closeEvent()
        }
    });
    useEffect(()=>{
        nextSceneRespone.then(res => {
            setNextScenes(res.data.timeline);
        });
    }, [nextSceneRespone])

    useEffect(() => {
        // console.log("Function changed")
    }, [closeEvent])

    useEffect(()=>{
        if (similar){
            getSimilar(group[0])
        }
    }, [similar])

    useEffect(() => {
        similarResponse.then(res=>{
            if (res.data.scenes !== undefined){
                setNextScenes(res.data.scenes);
            }
        });
    }, [similarResponse])

    return (
        <Paper elevation={4} className={classes.detailed}>
            <Typography variant="button" className={classes.text}>
                Event images
                </Typography>
            <Grid wrap="nowrap" container spacing={2} className={classes.grid}>
                {currentDisplay.map((image, index) => (
                    <Grid key={image} item>
                        <Image
                            key={image}
                            image={image}
                            scale={4}
                            info
                        />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.buttonline}>
                <Button className={classes.text}>Previous</Button>
                {similar? null:
                position==="before"? <Button onClick={() => getNextScenes(group, "before")} className={classes.text}>Previous Events</Button> :
                position==="after"? <Button onClick={() => getNextScenes(group, "after")} className={classes.text}>Next Events</Button> :
                                    <Button onClick={() => getNextScenes(group, "current")} className={classes.text}>View Full Events</Button>}
                <Button className={classes.text}>Next</Button>
            </div>
            <Grid wrap="nowrap" container spacing={2} className={classes.grid}>
                {nextScenes.map((scene, index) => (
                    <Grid key={index} item>
                        <Image
                            key={index}
                            image={scene[0]}
                            scene={scene}
                            scale={1}
                            onClick={setCurrentDisplay}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>)
}

export default EventPopover;
