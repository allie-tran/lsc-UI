import clsx from 'clsx';
import React, { useState, Suspense, lazy } from "react";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import Fade from '@material-ui/core/Fade';

const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6

const EventPopover = lazy(() => import('../redux/EventPopover-cnt'));

const thumbnailStyles = makeStyles(theme => ({
    image: {
        width: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
        height: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale,
        borderRadius: 2,
        flexShrink: 0,
        marginTop: 0,
        marginBottom: 10,
        position: "relative",
        border: "1px solid #E6E6E6",
        visibility: props=> props.hidden? "hidden": "visible",
        '&$highlight': {
            border: "3px solid #FF6584",
            transform: "scale(1.3)",
            zIndex: 1,
            boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
        }
    },
    highlight: {},
    row: {
        display: "flex",
    },
    card: {
        width: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
        height: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        marginTop: 10,
        marginBottom: props => props.last? 40: 40,
        marginLeft: 2,
        marginRight: 2,
    },
    saveButton: {
        position: "absolute",
        left: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale * (props.highlight? 1.15: 1) - 25,
        top: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale * (props.highlight? 1.15: 1) - 50,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 3,
        "&:hover": {
            backgroundColor: "#FF6584",
        },
        zIndex: props => props.highlight? 2: "none",
        visibility: props=> props.hidden? "hidden": "visible"
    },
    submitButton: {
        position: "absolute",
        left: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale * (props.highlight? 1.15: 1) - 25,
        top: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale * (props.highlight? 1.15: 1) - 25,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 3,
        "&:hover": {
            backgroundColor: "#FF6584",
        },
        zIndex: props => props.highlight? 2: "none",
        visibility: props=> props.hidden? "hidden": "visible"
    }
}));

const Thumbnail = ({ hidden, group, scale, saveScene, removeScene, index, saved, sendToMap, open, clearNextEvents, position, markersSelected, last }) => {
    const highlight = markersSelected.includes(index) && saved === undefined && position === "current"
    const classes = thumbnailStyles({hidden, scale, open, last, saved});
    const [openPopover, setOpenPopover] = useState(false);
    const [inProp, setInProp] = useState(true)

    const openEvent = event => {
        console.log("Clicked");
        setOpenPopover(true);
        if (saved === undefined){
            sendToMap(index)
        }
    };

    const closeEvent = () => {
        setOpenPopover(false);
        clearNextEvents()
    };

    const AddRemove = () => {
        if (saved === undefined) {
            return [<BookmarkBorderRoundedIcon fontSize="small" className={classes.saveButton} onClick={() => saveScene(group)} />,
            <CheckRoundedIcon fontSize="small" className={classes.submitButton} />]
        }
        return (
            [<DeleteOutlineRoundedIcon fontSize="small" className={classes.saveButton} onClick={() => {setInProp(false); removeScene(index)}} />,
            <CheckRoundedIcon fontSize="small" className={classes.submitButton} />])
    }


    const ImageCard = () => {
        if (saved === undefined) {
            return (<div className={classes.card}>
                        <img
                            alt={group[0]}
                            src={"LSC_DATA/" + group[0]}
                            className={clsx(classes.image, {[classes.highlight]: highlight})}
                            onClick={openEvent} />
                        <AddRemove />
                    </div>)
        }
        return (
            <Fade direction="down" in={inProp} timeout={500} mountOnEnter unmountOnExit>
                <div className={classes.card}>
                    <img
                        alt={group[0]}
                        src={"LSC_DATA/" + group[0]}
                        className={classes.image}
                        onClick={openEvent} />
                    <AddRemove />
                </div>
            </Fade>)
    }

    if (group.length > 0) {
        return ([<ImageCard/>,
            <Popover
                open={openPopover}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 0, left: 0 }}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center"
                }}
                onBackdropClick={closeEvent}
                onEscapeKeyDown={closeEvent}
                className={classes.popover}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <EventPopover closeEvent={closeEvent} group={group} position={position} />
                </Suspense>
            </Popover>])
    }
    else {
        return <div className={classes.card} />;
    }
};

export default Thumbnail;
