import React, {memo} from "react";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Thumbnail from "./Thumbnail"
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Tooltip from "@material-ui/core/Tooltip";

const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 5.5

const eventStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    justifyContent: "center",
    width: (props) => "calc(100%/" + props.numDisplay + " - 20px)",
    height: "calc(100%/3 - 20px)",
    alignItems: "center",
    padding: 10,
    flexDirection: "column",
    flexShrink: 0,
    borderBottom: "8px solid rgba(0,0,0,0.1)",
    backgroundColor: (props) =>
      Math.floor(props.index / props.numDisplay) % 2 === 0
        ? "rgba(0,0,0,0.1)"
        : null,
  },
  event: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // overflowX: "auto",
    padding: 10,
    flexShrink: 0,
  },
  text: {
    position: "absolute",
    bottom: 0,
  },
  info: {
    color: "#eee",
    fontSize: 16,
    paddingLeft: 5,
    paddingTop: 2,
    whiteSpace: "pre-wrap",
  },
  morebutton: {
    width: "100%",
    padding: 10,
    height: 32,
    flexShrink: 0,
  },
  icon: {
    padding: 10,
    marginTop: 5,
    backgroundColor: "#FF6584",
  },
}));

const areEqual = (prevProps, nextProps) => {
    var isEqual = require('lodash.isequal');
    return isEqual(prevProps.scene, nextProps.scene)
}

const Event = memo(({ index, group, openEvent, location, location_before, location_after, isQuestion}) => {
    const query = useSelector((state) =>
            state.search.query
        );
    const numDisplay = useSelector((state) => {
        var num = 1;
        // if (state.search.query.before) {
        //     num += 1
        // }
        // if (state.search.query.after) {
        //     num += 1;
        // }
        // if (num === 2){
        //     return 3;
        // }
        // if (num === 1){
        //     return 4;
        // }
        // return 7;
    })

    const classes = eventStyles({ index, numDisplay });

    return (
      <div className={classes.row}>
        <Typography className={classes.info}>{location}</Typography>
        <div className={classes.event}>
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

          {group.current
            ? group.current.map((img, ind) => (
                <Thumbnail
                  key={index + "current" + ind.toString()}
                  index={index}
                  group={[img[0]]}
                  scale={1}
                  position="current"
                  openEvent={openEvent}
                  relevance={img[1]}
                />
              ))
            : null}
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
        {isQuestion?
        <Tooltip title="Answer Question" arrow>
          <span>
            <IconButton
              size="small"
              className={classes.icon}
              //   onClick={() => {
              // dispatch(login());
              //   }}
            >
              <QuestionAnswerIcon />
            </IconButton>
          </span>
        </Tooltip>:null}
      </div>
    );
}, areEqual)
Event.whyDidYouRender = true
export default Event;
