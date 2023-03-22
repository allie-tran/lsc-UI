import React, {memo} from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Thumbnail from "./Thumbnail"
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Tooltip from "@material-ui/core/Tooltip";
import { setTextAnswers, answerForScene } from "../redux/actions/qa";

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
    // overflow : "auto",
    borderBottom: "8px solid rgba(0,0,0,0.1)",
    backgroundColor: (props) =>
      Math.floor(props.index / props.numDisplay) % 2 === 0
        ? "rgba(0,0,0,0.1)"
        : null,
  },
  subrow: {
    display: "flex",
    justifyContent: "center",
    width: (props) => "calc(100%/" + props.numDisplay + " - 20px)",
    height: "calc(100%/3 - 20px)",
    alignItems: "center",
    padding: 10,
    flexDirection: "column",
    flexShrink: 0,
    // overflow : "auto",
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
  score: {
    color: "#eee",
    margin: 5,
    fontSize: 12,
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
    marginTop: -10,
    marginBottom: 10,
    backgroundColor: "#FF6584",
  },
}));

const areEqual = (prevProps, nextProps) => {
    var isEqual = require('lodash.isequal');
    return isEqual(prevProps.scene, nextProps.scene) && prevProps.isQuestion === nextProps.isQuestion
}

const SubEvent = ({ group, name, openEvent, index, location, scale }) => {
  const dispatch = useDispatch();
  const numDisplay = useSelector((state) => {
    var num = 1;
    if (state.search.query.before) {
      num += 1;
    }
    if (state.search.query.after) {
      num += 1;
    }
    return num;
  });
  const classes = eventStyles({ index, numDisplay, scale });

  if (group){
    return (
      <div className={classes.subrow}>
        <Typography className={classes.info}>{location}</Typography>
        <div className={classes.event}>
          {group
            ? group.map((img, ind) => (
                <div>
                  <Thumbnail
                    key={index + name + ind.toString()}
                    index={index}
                    group={[img[0]]}
                    scale={scale}
                    position={name}
                    openEvent={openEvent}
                    relevance={img[2]}
                  />
                  {/* {img[0] != "" ? (
                    <p className={classes.score}>{img[1]}</p>
                  ) : null} */}
                </div>
              ))
            : null}
        </div>
      </div>
    );
  }
  else{
    return null;
  }
};

const Event = memo(({ index, group, openEvent, location, location_before, location_after, isQuestion}) => {
    const dispatch = useDispatch();
    const classes = eventStyles({ index, numDisplay : 1 });

    return (
      <div className={classes.row}>
        <div className={classes.event}>
          <SubEvent
            group={group.before}
            name="before"
            openEvent={openEvent}
            index={index}
            location={group.location_before}
            scale={0.7}
          ></SubEvent>
          {group.before ? (
            <Thumbnail key={"before"} scale={0.2} position="before" />
          ) : null}
          <SubEvent
            group={group.current}
            name="current"
            openEvent={openEvent}
            index={index}
            location={group.location}
            scale={1}
          ></SubEvent>
          {group.after ? (
            <Thumbnail key={"after"} scale={0.2} position="after" />
          ) : null}
          <SubEvent
            group={group.after}
            name="after"
            openEvent={openEvent}
            index={index}
            location={group.location_after}
            scale={0.7}
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
