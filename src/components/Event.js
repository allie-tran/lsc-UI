import React, {memo} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Thumbnail from "./Thumbnail"

const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6.5

const eventStyles = makeStyles(theme => ({
    group: {
        display: "flex",
        justifyContent: "center",
        width: 465 * window.innerWidth / 1920,
        height: IMAGE_HEIGHT / RESIZE_FACTOR + 40,
        alignItems: "center",
        padding: "30px 10px 20px 10px",
        flexShrink: 0,
        // borderBottom: "8px solid rgba(0,0,0,0.1)",
        backgroundColor: props => Math.floor(props.index / 3) % 2 === 0? 'rgba(0,0,0,0.1)' : null,
    }
}));

const areEqual = (prevProps, nextProps) => {
    var isEqual = require('lodash.isequal');
    return isEqual(prevProps.scene, nextProps.scene)
}

const Event = memo(({ index, group, openEvent, score}) => {
    const classes = eventStyles({index});
    return (
        <div className={classes.group}>
            <Thumbnail key={index+"before"} index={index} group={group.before} scale={0.7} position="before" openEvent={openEvent} />
            <Thumbnail key={index+"current"} index={index} group={group.current} scale={1} position="current" openEvent={openEvent}/>
            <Thumbnail key={index+"after"} index={index} group={group.after} scale={0.7} position="after" openEvent={openEvent}/>
            {/* <p>{score}</p> */}
        </div>
    );
}, areEqual)
Event.whyDidYouRender = true
export default Event;
