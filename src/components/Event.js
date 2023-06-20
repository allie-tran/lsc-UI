import React, {memo} from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Thumbnail from "./Thumbnail"
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Tooltip from "@material-ui/core/Tooltip";
import { answerForScene } from "../redux/actions/qa";

const eventStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    justifyContent: "center",
    width: (props) => "calc(100%/" + props.numDisplay + " - 20px)",
    // height: "calc(100%/3 - 20px)",
    alignItems: "center",
    padding: 10,
    flexDirection: "column",
    flexShrink: 0,
    // overflow : "auto",
    // borderBottom: "8px solid rgba(0,0,0,0.1)",
    backgroundColor: (props) =>
      Math.floor(props.index / props.numDisplay) % 2 === 0
        ? "rgba(0,0,0,0.1)"
        : null,
  },
  subrow: {
    display: "flex",
    justifyContent: "center",
    // width: (props) => "calc(100%/" + props.numDisplay + " - 20px)",
    height: "calc(100%/3 - 20px)",
    alignItems: "center",
    flexDirection: "column",
    flexShrink: 0,
    // overflow : "auto",
  },
  event: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // overflowX: "auto",
    flexShrink: 0,
  },
  text: {
    position: "absolute",
    bottom: 0,
  },
  score: {
    color: "#bbb",
    margin: 5,
    paddingTop: 25,
    fontSize: 12,
  },
  info0: {
    color: "#90cccb",
    fontSize: 16,
    whiteSpace: "pre-wrap",
    textAlign: "center",
    fontWeight: 450,
  },
  info1: {
    color: "#eee",
    fontSize: 14,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  info2: {
    color: "#bbb",
    fontSize: 12,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  morebutton: {
    width: "100%",
    padding: 10,
    height: 32,
    flexShrink: 0,
  },
  icon: {
    padding: 10,
    margin: 5,
    backgroundColor: "#FF6584",
  },
}));

const areEqual = (prevProps, nextProps) => {
    var isEqual = require('lodash.isequal');
    return (
      isEqual(prevProps.scene, nextProps.scene) &&
      prevProps.isQuestion === nextProps.isQuestion &&
      isEqual(prevProps.before, nextProps.before) &&
      isEqual(prevProps.after, nextProps.after) &&
      isEqual(prevProps.current, nextProps.current)
    );
}

const SubEvent = ({
  group,
  name,
  openEvent,
  index,
  location,
  scale,
  numDisplay,
  isQuestion
}) => {
  const classes = eventStyles({ index, numDisplay, scale });

  if (group) {
    return (
      <div className={classes.subrow}>
        {location
          ? location.map((loc, ind) => (
              <Typography
                key={ind.toString() + "_" + loc}
                className={classes["info" + ind.toString()]}
              >
                {loc}
              </Typography>
            ))
          : null}
        {/* <Typography className={classes.info}>{location}</Typography> */}
        <div className={classes.event}>
          {group
            ? group.map((img, ind) => (
                <div key={index.toString() + "_" + name + "_" + ind.toString()}>
                  <Thumbnail
                    index={index}
                    group={[img[0]]}
                    scale={scale}
                    isQuestion={isQuestion}
                    position={name}
                    openEvent={openEvent}
                    relevance={img[2]}
                  />
                  {img[0] != "" ? (
                    <p className={classes.score}>{img[1]}</p>
                  ) : null}
                </div>
              ))
            : null}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const Event = memo(function Event({ index, group, openEvent, location, location_before, location_after, isQuestion}) {
    const dispatch = useDispatch();
    const classes = eventStyles({ index, numDisplay : 1 });


    return (
      <div className={classes.row}>
        <div className={classes.event}>
          <SubEvent
            key={index + "before"}
            group={group.before}
            name="before"
            openEvent={openEvent}
            index={index}
            location={group.location_before}
            isQuestion={isQuestion}
            scale={(isQuestion ? 70 / 82.5 : 1) * (group.after ? 0.6 : 0.8)}
            numDisplay={group.after ? 3 : 2}
          ></SubEvent>
          {group.before ? (
            <Thumbnail key={"before"} scale={0.05} position="before" />
          ) : null}
          <SubEvent
            key={index + "current"}
            group={group.current}
            name="current"
            openEvent={openEvent}
            index={index}
            isQuestion={isQuestion}
            location={group.location}
            scale={
              (isQuestion ? 70 / 82.5 : 1) *
              (group.before && group.after ? 0.85 : 1)
            }
            numDisplay={
              group.before && group.after
                ? 3
                : group.before || group.after
                ? 2
                : 1
            }
          ></SubEvent>
          {group.after ? (
            <Thumbnail key={"after"} scale={0.05} position="after" />
          ) : null}
          <SubEvent
            key={index + "after"}
            group={group.after}
            name="after"
            openEvent={openEvent}
            isQuestion={isQuestion}
            index={index}
            location={group.location_after}
            scale={(isQuestion ? 70 / 82.5 : 1) * (group.before ? 0.6 : 0.8)}
            numDisplay={group.before ? 3 : 2}
          ></SubEvent>
        </div>
        {isQuestion ? (
          <Tooltip title="Answer Question" arrow>
            <span>
              <IconButton
                size="small"
                className={classes.icon}
                onClick={() => {
                  dispatch(
                    answerForScene(
                      document.getElementById("Find:").value,
                      group.current
                    )
                  );
                }}
              >
                <QuestionAnswerIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
      </div>
    );
}, areEqual)
Event.whyDidYouRender = true
export default Event;
