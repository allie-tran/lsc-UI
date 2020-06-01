import clsx from 'clsx';
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import IconButton from '@material-ui/core/IconButton';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6


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
            zIndex: 1,
            boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)"},
        transition: "all 150ms ease-in"
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
        top: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale * (props.highlight? 1.15: 1) - 75,
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
    },
    similarButton: {
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

}));

const ImageCard = ({saved, hidden, scale, highlight, img, openEvent, onButtonClick}) => {
    const classes = thumbnailStyles({hidden, scale, saved, highlight});
    if (saved === undefined) {
        return (<div className={classes.card}>
                    <img alt={img}
                         src={"http://lifeseeker-sv.computing.dcu.ie//" + img}
                         className={clsx(classes.image, {[classes.highlight]: highlight})}
                         onClick={(e) => openEvent(e, false)} />
                    <IconButton onClick={onButtonClick} className={classes.saveButton}>
                        <BookmarkBorderRoundedIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={(e) => openEvent(e, true)} className={classes.similarButton}>
                        <ImageSearchIcon fontSize="small"/>
                    </IconButton>
                    <CheckRoundedIcon fontSize="small" className={classes.submitButton} />
                </div>)
    }
    return (
        <div className={classes.card}>
            {hidden? <img alt={img}
                 className={classes.image}
                 onClick={(e) => openEvent(e, false)} /> : <img alt={img}
                 src={"http://lifeseeker-sv.computing.dcu.ie//" + img}
                 className={classes.image}
                 onClick={(e) => openEvent(e, false)} />}
            <IconButton onClick={onButtonClick} className={classes.saveButton}>
                <DeleteOutlineRoundedIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={(e) => openEvent(e, true)} className={classes.similarButton}>
                <ImageSearchIcon fontSize="small"/>
            </IconButton>
            <CheckRoundedIcon fontSize="small" className={classes.submitButton} />
        </div>)
}

const Thumbnail = ({ hidden, highlight, group, scale, saveScene, removeScene, index, saved, sendToMap,
                     position, markersSelected, last,
                     setRef, openEvent}) => {
    const classes = thumbnailStyles({hidden, scale, last, saved});



    const Save = () => saveScene(group)
    const Remove = () => removeScene(index)
    const ownOpenEvent = (e, similar) => {
        openEvent(e, similar, group, position)
        if (saved === undefined){
            sendToMap(index)
        }
    }
    if (group.length > 0) {
        return (
                <ImageCard onButtonClick={saved===undefined? Save: Remove}
                            saved={saved}
                            hidden={hidden}
                            scale={scale}
                            img={group[0]}
                            highlight={highlight}
                            openEvent={ownOpenEvent}
                            ref={highlight? setRef: null}/>
             )
    }
    else {
        return <div className={classes.card} />;
    }
};
Thumbnail.whyDidYouRender = true

export default Thumbnail;
