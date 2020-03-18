import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeStyles } from '@material-ui/styles'
import Typography from "@material-ui/core/Typography";
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6

const imageStyles = makeStyles(theme => ({
    image: {
        width: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
        height: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale,
        borderRadius: 2,
        flexShrink: 0,
        marginTop: 0,
        marginBottom: 10,
        position: "relative",
        borderRadius: 2,
        border: "1px solid #E6E6E6"
    },
    card: {
        width: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        marginTop: 10,
        marginBottom: 0
    },
    paper: {
        padding: theme.spacing(1),
        backgroundColor: "transparent"
    },
    grid: {
        overflow: "scroll"
    },
    saveButton: {
        position: "absolute",
        left: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
        top: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 50,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 3,
        "&:hover": {
            backgroundColor: "#FF6584",
        }
    },
    submitButton: {
        position: "absolute",
        left: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
        top: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 25,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 3,
        "&:hover": {
            backgroundColor: "#FF6584",
        }
    },
    info: {
        paddingLeft: 5
    }
}));

const Image = ({ image, scale, saveScene, info, onClick}) => {
    const classes = imageStyles({ scale });
    return (
        <div className={classes.card}>
            <img
                alt={image}
                src={"LSC_DATA/" + image}
                className={classes.image}
                onClick={onClick} />
            <BookmarkBorderRoundedIcon fontSize="small" className={classes.saveButton} onClick={() => saveScene([image])} />
            <CheckRoundedIcon fontSize="small" className={classes.submitButton} />
            {info? <Typography classname={classes.info}>{image}</Typography>: null}
        </div>
    );
};

export default Image;
