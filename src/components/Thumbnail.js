import clsx from 'clsx';
import React, { memo, useState } from "react";
import configData from "../config.json";
import { makeStyles } from '@material-ui/core/styles';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import IconButton from '@material-ui/core/IconButton';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import {useDispatch} from 'react-redux'
import { saveScene, removeScene } from '../redux/actions/save'
// import { sendToMap } from '../redux/actions/select'
// import { getGPS } from '../redux/actions/search'
import { submitImage } from '../redux/actions/submit'
import LazyLoad from 'react-lazy-load';
import { LazyLoadComponent } from "react-lazy-load-image-component";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";


const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const RESIZE_FACTOR = 5.05;

const thumbnailStyles = makeStyles((theme) => ({
  image: {
    // width: (props) =>
    //   ((IMAGE_WIDTH / RESIZE_FACTOR) * props.scale * window.innerWidth) / 1920,
    height: (props) =>
      ((IMAGE_HEIGHT / RESIZE_FACTOR) * props.scale * window.innerWidth) / 1920,
    borderRadius: 8,
    flexShrink: 0,
    position: "relative",
    border: "1px solid rgba(0, 0, 0, 0)",
    visibility: (props) => (props.hidden ? "hidden" : "visible"),
    cursor: "pointer",
    "&$highlight": {
      border: "3px solid #FF6584",
      zIndex: 1,
      boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
    },
    "&:hover, &:focus": {
      borderRadius: 0,
      border: "1px solid #ccc",
    },
  },
  highlight: {},
  row: {
    display: "flex",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 2,
    marginRight: 2,
    transition: "all 100ms ease-in",
    transformOrigin: "top left",
    paddingBottom: 27,
    "&:hover, &:focus": {
      transform: (props) => (props.zoomed ? "scale(3.0)" : "scale(1.0)"),
      backgroundColor: (props) => (props.zoomed ? "#272727" : "transparent"),
      borderRadius: (props) => (props.zoomed ? 8 : 0),
      zIndex: 1000,
    },
  },
  zoomButton: {
    position: "absolute",
    left: 5,
    top: (props) =>
      ((IMAGE_HEIGHT / RESIZE_FACTOR) * props.scale * window.innerWidth) /
        1920 + 5,
    color: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    "&:hover": {
      backgroundColor: "#FF6584",
    },
    zIndex: (props) => (props.highlight ? 2 : 1),
    visibility: (props) => (props.hidden ? "hidden" : "visible"),
    padding: 0,
  },
  saveButton: {
    position: "absolute",
    right: 5,
    top: (props) =>
      ((IMAGE_HEIGHT / RESIZE_FACTOR) * props.scale * window.innerWidth) /
        1920 + 5,
    flexShrink: 0,
    color: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    "&:hover": {
      backgroundColor: "#FF6584",
    },
    zIndex: (props) => (props.highlight ? 2 : 1),
    visibility: (props) => (props.hidden ? "hidden" : "visible"),
    padding: 0,
  },
  submitButton: {
    position: "absolute",
    flexShrink: 0,
    left: 30,
    top: (props) =>
      ((IMAGE_HEIGHT / RESIZE_FACTOR) * props.scale * window.innerWidth) /
        1920 + 5,
    right: 30,
    color: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    "&:hover": {
      backgroundColor: "#FF6584",
    },
    zIndex: (props) => (props.highlight ? 2 : 1),
    visibility: (props) => (props.hidden ? "hidden" : "visible"),
    padding: 0,
  },
  info: {
    color: (props) => (props.scale > 1 ? "#eee" : props.dark ? "#444" : "#ccc"),
    fontSize: 13,
    paddingLeft: 5,
    paddingTop: 25,
    whiteSpace: "pre-wrap",
  },
}));



const ImageCard = ({
  saved,
  hidden,
  scale,
  highlight,
  img,
  openEvent,
  onButtonClick,
  info,
  relevance,
  isQuestion,
}) => {
  const [zoom, setZoom] = useState(false);
  const classes = thumbnailStyles({
    hidden,
    scale,
    saved,
    highlight,
    zoomed: zoom,
  });
  const dispatch = useDispatch();

  if (saved === undefined) {
    return (
      <div className={classes.card} onMouseLeave={() => setZoom(false)}>
        <LazyLoadComponent
          height={
            ((IMAGE_HEIGHT / RESIZE_FACTOR) * scale * window.innerWidth) /
              1920 +
            12
          }
          width={
            ((IMAGE_WIDTH / RESIZE_FACTOR) * scale * window.innerWidth) / 1920
          }
          offset={500}
        >
          <img
            loading="lazy"
            alt={img}
            src={configData.IMAGEHOST_URL + img}
            className={clsx(classes.image, {
              [classes.highlight]: highlight,
            })}
            onClick={openEvent}
          />
        </LazyLoadComponent>
        <IconButton
          onMouseEnter={() => setZoom(true)}
          className={classes.zoomButton}
        >
          <ImageSearchIcon fontSize="small" />
        </IconButton>

        <IconButton onClick={onButtonClick} className={classes.saveButton}>
          <BookmarkBorderRoundedIcon fontSize="small" />
        </IconButton>
        {isQuestion? 
        <IconButton
          onClick={(e) => dispatch(submitImage(img, false, false))}
          className={classes.submitButton}
        >
          <CheckRoundedIcon fontSize="small" />
        </IconButton>: null}
        {relevance
          ? info && <Typography className={classes.info}>{info}</Typography>
          : null}
      </div>
    );
  }
  return (
    <div className={classes.card}>
      <IconButton onClick={onButtonClick} className={classes.saveButton}>
        <DeleteOutlineRoundedIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={(e) => dispatch(submitImage(img))}
        className={classes.submitButton}
      >
        <CheckRoundedIcon fontSize="small" />
      </IconButton>
      {hidden ? (
        <img
          alt={img}
          className={classes.image}
          onClick={(e) => dispatch(submitImage(img))}
        />
      ) : (
        <img
          alt={img}
          src={configData.IMAGEHOST_URL + img.split(".")[0] + ".jpg"}
          className={classes.image}
          onClick={openEvent}
        />
      )}
    </div>
  );
};

const hiddenStyles = makeStyles((theme) => ({
  hidden: {
    flexBasis: ({ num, scale }) =>
      (((IMAGE_WIDTH / RESIZE_FACTOR) * scale * window.innerWidth) / 1920) *
        num +
      (num - 1) * 4,
    minWidth: ({ num, scale }) =>
      (((IMAGE_WIDTH / RESIZE_FACTOR) * scale * window.innerWidth) / 1920) *
        num +
      (num - 1) * 4,
    width: ({ num, scale }) =>
      (((IMAGE_WIDTH / RESIZE_FACTOR) * scale * window.innerWidth) / 1920) *
        num +
      (num - 1) * 4,
    minHeight: ({ scale }) =>
      ((IMAGE_HEIGHT / RESIZE_FACTOR) * scale * window.innerWidth) / 1920,
    height: ({ scale }) =>
      ((IMAGE_HEIGHT / RESIZE_FACTOR) * scale * window.innerWidth) / 1920,
    marginLeft: 4,
    marginRight: 4,
    position: "relative",
    flexShrink: 0,
    display: "block",
    visibility: "hidden",
  },
}));
const Hidden = ({ num, scale, relevance }) => {
	const classes = hiddenStyles({ num, scale, relevance });
	return (
			<div className={classes.hidden}> Hidden </div>
	);
};

var isEqual = require("lodash.isequal");

const areEqual = (prevProps, nextProps) => {
	return (
    prevProps.hidden === nextProps.hidden &&
    prevProps.highlight === nextProps.highlight &&
    isEqual(prevProps.group, nextProps.group) &&
    prevProps.scale === nextProps.scale &&
    prevProps.index === nextProps.index &&
    prevProps.saved === nextProps.saved &&
    prevProps.position === nextProps.position &&
    prevProps.isQuestion === nextProps.isQuestion
  );
};

const Thumbnail = ({
    hidden,
    highlight,
    group,
    scale,
    index,
    saved,
    position,
    openEvent,
    info,
    isQuestion,
    relevance
}) => {
    // const [rendered, setRendered] = useState(false)
    const Save = () => dispatch(saveScene(group));
    const Remove = () => dispatch(removeScene(index));
    const dispatch = useDispatch();
    const ownOpenEvent = (e) => {
        openEvent(group);
        // if (saved === undefined) {
        // 	dispatch(sendToMap(index));
        // } else {
        //     dispatch(getGPS(group[0]))
        // }
    };

    if (group && group.length > 0 && group[0] !== "") {
      return (
        <LazyLoad
          height={
            ((IMAGE_HEIGHT / RESIZE_FACTOR) *
              (relevance ? scale : scale * 0.8) *
              window.innerWidth) /
            1920
          }
          width={
            ((IMAGE_WIDTH / RESIZE_FACTOR) *
              (relevance ? scale : scale * 0.8) *
              window.innerWidth) /
              1920 +
            8
          }
          offset={500}
        >
          {/* <Tooltip title="Click to see Timeline" arrow> */}
          {/* <span> */}
          <ImageCard
            onButtonClick={saved === undefined ? Save : Remove}
            saved={saved}
            hidden={hidden}
            scale={relevance ? scale : scale * 0.8}
            img={group[0]}
            highlight={highlight}
            openEvent={ownOpenEvent}
            isQuestion={isQuestion}
            info={info}
            relevance={relevance}
          />
          {/* </span> */}
          {/* </Tooltip> */}
        </LazyLoad>
      );
    } else {
      return <Hidden num={1} scale={relevance ? scale : scale * 0.8} />;
    }
};
Thumbnail.whyDidYouRender = true
const MemoThumbnail = memo(Thumbnail, areEqual);
export default MemoThumbnail;
