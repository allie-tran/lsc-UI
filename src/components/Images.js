import React, {useState, useEffect} from 'react'
import {Grid, Typography, Popover, Button, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from "clsx";
import {Check} from "@material-ui/icons";

let images = [];
for (let i = 0; i < 100; i++) {
    images.push("./testImages/" + i.toString() + ".jpg")
}

let eventImages = [];
for (let i = 200; i < 250; i++) {
    eventImages.push("./testImages/" + i.toString() + ".jpg")
}

let timeImages = [];
for (let i = 250; i < 300; i++) {
    timeImages.push("./testImages/" + i.toString() + ".jpg")
}

const gridStyles = makeStyles(theme => ({
    root: {
        width: props => props.open ? "80%" : "97%",
        height: `calc(100% - 60px)`,
        zIndex: -1,
        top: 60,
        position: "fixed",
        overflow: "scroll",
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
    },
    grid: {
        flexGrow: 1,
        justifyContent: 'space-evenly',
        backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.15) 50%)`,
        backgroundPosition: `0px -20px`,
        backgroundRepeat: "repeat",
        backgroundSize: `770px 313px`
    },
    text: {
        top: 50,
        padding: 20,
        color: "#CCCCCC"
    }
}));

const imageStyles = makeStyles(theme => ({
    image: {
        width: props => 130 * props.scale,
        borderRadius: 2,
        border: "1px solid #E6E6E6",
    },
    popover: {
        pointerEvents: 'none',
    },
    button: {
        backgroundColor: "#212121", color: "#c7c7c7"
    }
}));

const eventStyles = makeStyles(theme => ({
    group: {
        display: "flex",
        justifyContent: 'space-evenly',
        width: 324,
        paddingBottom: 50
    },
    detailed: {
        width: "100%",
        height: 650,
        position: "relative",
        display: 'flex',
        alignItems: "center",
        backgroundColor: "#272727",
        flexDirection: 'column'
    },
    image: {
        width: props => 150 * props.scale,
        borderRadius: 2,
        border: "1px solid #E6E6E6",
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
        backgroundColor: "transparent"
    },
    grid: {
        overflow: "scroll"
    },
    stepper: {
        width: "100%", backgroundColor: "#272727"
    }
}));

const Image = (props) => {
    const classes = imageStyles(props);
    const [anchorElhover, setAnchorElhover] = React.useState(null);
    const handlePopoverOpen = event => {
        setAnchorElhover(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorElhover(null);
    };

    const handleOnClick = (event) => {
        if (props.onClick) {
            props.onClick(event);
        }
        setAnchorElhover(null);
    };

    const hover = Boolean(anchorElhover);
    return (
        <div>
            <img src={props.src} alt={props.src} className={classes.image}
                 onClick={handleOnClick}
                 onMouseEnter={handlePopoverOpen}
                 onMouseLeave={handlePopoverClose}
                 />
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={hover}
                anchorEl={anchorElhover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                onClose={handlePopoverClose}
                onEscapeKeyDown={props.onEscapeKeyDown}
                disableRestoreFocus
            >
                <Button size="small" variant="contained" className={classes.button}>
                    Submit
                </Button>
            </Popover>
            {props.showid? <Typography>{props.src}</Typography>:null}
        </div>
    )
};

const Event = (props) => {
    const classes = eventStyles(props);
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const openEvent = (event) => {
        console.log('Clicked')
        setOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const closeEvent = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    return (
        [<div className={classes.group} onClick={openEvent}>
            <Image src={props.src} scale={0.7}/>
            <Image src={props.src} scale={1}/>
            <Image src={props.src} scale={0.7}/>
        </div>,
            <Popover
                open={open}
                anchorReference="anchorPosition"
                anchorPosition={{top: 0, left: 0}}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onBackdropClick={closeEvent}
                onEscapeKeyDown={closeEvent}>
                <Paper elevation={4} className={classes.detailed}>
                    <Typography variant="overline" color="#F4CDD2">Event images</Typography>
                    <Grid wrap="nowrap" container justify="center" spacing={2} className={classes.grid}>
                        {images.map(value => (
                            <Grid item>
                                <Image showid src={value} scale={6.0} onEscapeKeyDown={closeEvent.bind(this)}/>
                            </Grid>))}
                    </Grid>
                </Paper>
            </Popover>]
    )
};

export const ImageGrid = (props) => {
    const classes = gridStyles(props);

    return (
        <div className={classes.root}>
            <Typography variant="subtitle1" className={classes.text}>
                Click an event thumbnail to view all images.
            </Typography>
            <Grid container justify="center" alignItems="stretch" spacing={1} className={classes.grid}>
                {images.map(value => (
                    <Grid key={value} item>
                        <Event src={value}/>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}