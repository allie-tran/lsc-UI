import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Thumbnail from "../redux/Thumbnail-cnt"

const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6

const eventStyles = makeStyles(theme => ({
    group: {
        display: "flex",
        justifyContent: "space-evenly",
        width: IMAGE_WIDTH / RESIZE_FACTOR * 2.5,
        height: IMAGE_HEIGHT / RESIZE_FACTOR * 1.1,
        alignItems: "center",
        margin: 0.
    }
}));

const Event = ({ index, scene }) => {
    const classes = eventStyles();
    return (
        <div className={classes.group}>
            <Thumbnail index={index} group={scene.before} scale={0.7} />
            <Thumbnail index={index} group={scene.current} scale={1} />
            <Thumbnail index={index} group={scene.after} scale={0.7} />
        </div>
    );
};

export default Event;
