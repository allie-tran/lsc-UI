import React, {memo} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Thumbnail from "../redux/Thumbnail-cnt"

const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6.5

const eventStyles = makeStyles(theme => ({
    group: {
        display: "flex",
        justifyContent: "center",
        width: 465,
        height: IMAGE_HEIGHT / RESIZE_FACTOR * 2,
        alignItems: "center",
        padding: 10,
    }
}));

const areEqual = (prevProps, nextProps) => {
    var isEqual = require('lodash.isequal');
    return isEqual(prevProps.scene, nextProps.scene)
}

const Event = memo(({ index, group, openEvent}) => {
    const classes = eventStyles();
    return (
        <div className={classes.group}>
            <Thumbnail key={index+"before"} index={index} group={group.before} scale={0.7} position="before" openEvent={openEvent} />
            <Thumbnail key={index+"current"} index={index} group={group.current} scale={1} position="current" openEvent={openEvent}/>
            <Thumbnail key={index+"after"} index={index} group={group.after} scale={0.7} position="after" openEvent={openEvent}/>
        </div>
    );
}, areEqual)
Event.whyDidYouRender = true


export default Event;
