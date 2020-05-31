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
    }
}));

const areEqual = (prevProps, nextProps) => {
    var isEqual = require('lodash.isequal');
    return isEqual(prevProps.scene, nextProps.scene)
}

const Event = memo(({ index, scene, setRef, openEvent}) => {
    const classes = eventStyles();
    return (
        <div className={classes.group}>
            <Thumbnail key={index+"before"} index={index} group={scene.before} scale={0.7} position="before" openEvent={openEvent} />
            <Thumbnail key={index+"current"} setRef={setRef} index={index} group={scene.current} scale={1} position="current" openEvent={openEvent}/>
            <Thumbnail key={index+"after"} index={index} group={scene.after} scale={0.7} position="after" openEvent={openEvent}/>
        </div>
    );
}, areEqual)
Event.whyDidYouRender = true


export default Event;
