import React, {memo} from "react";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Thumbnail from "./Thumbnail"

const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 5.5

const eventStyles = makeStyles((theme) => ({
    group: {
        display: "flex",
        justifyContent: "center",
        width:  (props) => "calc(100%/" + props.numDisplay + " - 20px)",
        height: "calc(100%/3 - 20px)",
        alignItems: "center",
        padding: 10,
        flexShrink: 0,
        borderBottom: "8px solid rgba(0,0,0,0.1)",
        backgroundColor: (props) =>
            Math.floor(props.index / props.numDisplay) % 2 === 0
                ? "rgba(0,0,0,0.1)"
                : null,
    },
    text: {
        position: 'absolute',
        bottom: 0
    }
}));

const areEqual = (prevProps, nextProps) => {
    var isEqual = require('lodash.isequal');
    return isEqual(prevProps.scene, nextProps.scene)
}

const Event = memo(({ index, group, openEvent, location, location_before, location_after}) => {
    const query = useSelector((state) =>
            state.search.query
        );
    const numDisplay = useSelector((state) => {
        var num = 0;
        if (state.search.query.before) {
            num += 1
        }
        if (state.search.query.after) {
            num += 1;
        }
        if (num === 2){
            return 3;
        }
        if (num === 1){
            return 4;
        }
        return 7;
    })

    const classes = eventStyles({ index, numDisplay });

    return (
        <div className={classes.group}>
            {query.before ? (
                <Thumbnail
                    key={index + "before"}
                    index={index}
                    group={group.before}
                    scale={0.7}
                    position="before"
                    openEvent={openEvent}
                    info={location_before}
                />
            ) : null}
            <Thumbnail
                key={index + "current"}
                index={index}
                group={group.current}
                scale={1}
                position="current"
                openEvent={openEvent}
                info={location}
            />
            {query.after ? (
                <Thumbnail
                    key={index + "after"}
                    index={index}
                    group={group.after}
                    scale={0.7}
                    position="after"
                    openEvent={openEvent}
                    info={location_after}
                />
            ) : null}
        </div>
    );
}, areEqual)
Event.whyDidYouRender = true
export default Event;
