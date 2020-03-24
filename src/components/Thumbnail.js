import clsx from 'clsx';
import React, { useState, Suspense, lazy, useEffect } from "react";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import IconButton from '@material-ui/core/IconButton';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

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
        position: "relative",
        border: "1px solid #E6E6E6",
        visibility: props=> props.hidden? "hidden": "visible",
        '&$highlight': {
            border: "3px solid #FF6584",
            transform: "scale(1.3)",
            zIndex: 1,
            boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)"},
        transition: "all 300ms ease-in"
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
        marginBottom: props => props.saved? 40: 0,
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
        zIndex: props => props.highlight? 2: 1,
        visibility: props=> props.hidden? "hidden": "visible",
        padding: 0
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
        zIndex: props => props.highlight? 2: 1,
        visibility: props=> props.hidden? "hidden": "visible"
    }
}));

const FallBack = () => <div>Loading...</div>

const ImageCard = ({saved, hidden, scale, highlight, img, openEvent, onButtonClick}) => {
    const classes = thumbnailStyles({hidden, scale, saved, highlight});
    if (saved === undefined) {
        return (<div className={classes.card}>
                    <img alt={img}
                         src={"Thumbnail/" + img}
                         className={clsx(classes.image, {[classes.highlight]: highlight})}
                         onClick={openEvent} />
                    <IconButton onClick={onButtonClick} className={classes.saveButton}>
                        <BookmarkBorderRoundedIcon fontSize="small"/>
                    </IconButton>
                        <CheckRoundedIcon fontSize="small" className={classes.submitButton} />
                </div>)
    }
    return (
        <div className={classes.card}>
            <img alt={img}
                 src={"Thumbnail/" + img}
                 className={classes.image}
                 onClick={openEvent} />
            <IconButton onClick={onButtonClick} className={classes.saveButton}>
                <DeleteOutlineRoundedIcon fontSize="small"/>
            </IconButton>
            <CheckRoundedIcon fontSize="small" className={classes.submitButton} />
        </div>)
}

const Thumbnail = ({ hidden, group, scale, saveScene, removeScene, index, saved, sendToMap,
                     clearNextEvents, position, markersSelected, last,
                     setRef, selectMarkers}) => {
    const [groupState, setGroupState] = useState(group)
    const [highlight, setHighlight] = useState(false)
    const classes = thumbnailStyles({hidden, scale, last, saved});
    const [openPopover, setOpenPopover] = useState(false);

    useEffect(()=>{
        // var isEqual = require('lodash.isequal');
    },[group])

    const openEvent = event => {
        setOpenPopover(true);
        if (saved === undefined){
            sendToMap(index)
        }
    };
    useEffect(()=>{
        var newHighlight = markersSelected.includes(index) && saved === undefined && position === "current"
        if (newHighlight !== highlight){
            setHighlight(newHighlight)
        }
    }, [markersSelected])


    const closeEvent = () => {
        setOpenPopover(false);
        clearNextEvents()
    };

    const Save = () => saveScene(group)
    const Remove = () => removeScene(index)

    if (groupState.length > 0) {
        return (
            <>
                <ImageCard onButtonClick={saved===undefined? Save: Remove}
                            saved={saved}
                            hidden={hidden}
                            scale={scale}
                            img={groupState[0]}
                            highlight={highlight}
                            openEvent={openEvent}
                            ref={highlight? setRef: null}/>
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
                        <Suspense fallback={<FallBack/>}>
                            <EventPopover closeEvent={closeEvent} group={groupState} position={position} />
                        </Suspense>
                </Popover>
            </>)
    }
    else {
        return <div className={classes.card} />;
    }
};
Thumbnail.whyDidYouRender = true

export default Thumbnail;
