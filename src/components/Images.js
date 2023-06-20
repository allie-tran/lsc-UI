import React, { useEffect, useState, memo, lazy, Suspense, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
// import ReactLoading from 'react-loading';
import LinearProgress from "@material-ui/core/LinearProgress";
// import Event from './Event';
import Button from "@material-ui/core/Button";
import {
  setMap,
  setQueryBound,
  setQueryInfo,
  setFinishedSearch,
  sortBy,
  More,
} from "../redux/actions/search";
import { setSaved } from "../redux/actions/save";
import { setTextAnswers } from "../redux/actions/qa";

// SpeedDial for sorting
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SortIcon from "@mui/icons-material/Sort";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";

const Event = lazy(() => import("./Event"));

const IMAGE_HEIGHT = 768;
const IMAGE_WIDTH = 1024;
const RESIZE_FACTOR = 6;

const gridStyles = makeStyles((theme) => ({
  grid: {
    width: ({ isQuestion }) => (isQuestion ? "70%" : "calc(82.5% + 5px)"),
    left: ({ isQuestion }) => (isQuestion ? "12.5%" : "0"),
    height: `calc(100% - 90px)`,
    position: "absolute",
    top: 60 + 42,
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    overflowY: "auto",
    paddingRight: "20%",
  },
  loading: {
    width: ({ isQuestion }) => (isQuestion ? "70%" : "calc(82.5% + 5px)"),
    left: ({ isQuestion }) => (isQuestion ? "12.5%" : "0"),
    position: "absolute",
    top: 60,
    paddingRight: "20%",
  },
  text: {
    top: 50,
    paddingTop: 20,
    color: "#CCCCCC",
  },
  popover: {
    width: "80%",
    color: "#272727",
  },
  button: {
    color: ({ end }) => (end ? "#ff6584" : "#DDD"),
    width: "100%",
    padding: 16,
    height: 48,
    flexShrink: 0,
  },
}));

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress && <LinearProgress style={{ width: "100%" }} />;
};

const hiddenStyles = makeStyles((theme) => ({
  hidden: {
    minWidth: ({ num }) =>
      (((IMAGE_WIDTH / RESIZE_FACTOR) * window.innerWidth) / 1920) * num +
      4 * (num - 1),
    minHeight: ((IMAGE_HEIGHT / RESIZE_FACTOR) * window.innerWidth) / 1920,
    marginLeft: 4,
    marginRight: 4,
    position: "relative",
    flexShrink: 0,
    display: "block",
    visibility: "hidden",
  },
}));
const Hidden = ({ num }) => {
  const classes = hiddenStyles({ num });
  return <div className={classes.hidden}> Hidden </div>;
};

var isEqual = require("lodash.isequal");

const areEqual = (prevProps, nextProps) => {
  return (
    isEqual(prevProps.dates, nextProps.dates) &&
    prevProps.isQuestion === nextProps.isQuestion &&
    prevProps.more === nextProps.more
  );
};

const ImageGrid = memo(function ImageGrid({ openEvent, isQuestion }) {
  const dispatch = useDispatch();
  const [dates, setDates] = useState([]);
  const gridRef = useRef(null);
  const { promiseInProgress } = usePromiseTracker();
  const [more, setMore] = useState(false);
  const [moreText, setMoreText] = useState("");
  const finished = useSelector((state) => state.search.finishedSearch);
  const classes = gridStyles({
    isQuestion,
    end: moreText === "No More Results",
  });

  // const highlightRef = React.createRef([]);

  // const setRef = (index) => {
  //     if (highlightRef.current === null){
  //         highlightRef.current = []
  //     }
  //     highlightRef.current.push(index)
  // }
  const collection = useSelector((state) => state.search.collection);
  const saveResponse = useSelector((state) => state.save.saveResponse);
  const [loaded, setLoaded] = useState(0);

  useEffect(
    () => {
      if (collection) {
        trackPromise(
          collection.then((res) => {
            if (res.data.more) {
              console.log("Got", res.data.size);
              if (res.data.size > 0) {
                const newDates = [...dates, ...res.data.results];
                setDates(newDates);
                dispatch(setMap(newDates));
                setLoaded(loaded + Math.min(84, newDates.length));
                setMore(false);
              } else {
                setMoreText("No More Results");
              }
            } else {
              console.log("Got", res.data.size);
              
              const newDates = res.data.results;
              dispatch(setFinishedSearch(finished + res.data.size));
              dispatch(setQueryInfo(res.data.info));
              var isEqual = require("lodash.isequal");
              if (!isEqual(dates, newDates)) {
                var grid = gridRef.current;
                if (grid) {
                  grid.scrollTo({ top: 0, left: 0, behavior: "instant" });
                }
                setDates(newDates);
                dispatch(setMap(newDates));
                setLoaded(Math.min(84, newDates.length));
              }
              if (res.data.texts) {
                dispatch(setTextAnswers(res.data.texts));
                console.log(res.data.texts);
              }
              if (res.data.size === 0) {
                setMoreText("No Results");
              } else {
                setMoreText("Click for More Results");
              }
            }
          })
        );
      }
    }, // eslint-disable-next-line
    [collection]
  );

//   useEffect(() => {
//     var grid = gridRef.current;
//     if (!promiseInProgress && grid) {
//       grid.scrollTo({ top: 0, left: 0, behavior: "instant" });
//     }
//   }, [promiseInProgress, dates]);

  useEffect(() => {
    var grid = gridRef.current;
    if (!promiseInProgress && grid) {
      grid.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [promiseInProgress, dates]);

  useEffect(() => {
    if (saveResponse) {
      trackPromise(
        saveResponse.then((res) => {
          if (res.data.saved) {
            dispatch(setSaved(res.data.saved.map((image) => [image])));
            const newDates = res.data.results;
            var isEqual = require("lodash.isequal");
            if (!isEqual(dates, newDates)) {
              dispatch(setDates(newDates));
              dispatch(setMap(newDates));
              dispatch(setQueryBound(res.data.gps_bounds));
              var query = res.data.query;
              if (query.info) {
                dispatch(setQueryInfo(query.info));
                document.getElementById("Before:").value = query.before;
                document.getElementById("Before:-when").value =
                  query.beforewhen;
                document.getElementById("After:").value = query.after;
                document.getElementById("After:-when").value = query.afterwhen;
              }
            }
          }
        })
      );
    }
  }, [saveResponse, dates, dispatch]);

  const moreButton = () => {
    if (loaded < dates.length) {
      setLoaded(loaded + 84);
    } else {
      setMore(true);
      dispatch(More());
    }
  };

  if (promiseInProgress && !more) {
    return (
      <div className={classes.loading}>
        <LoadingIndicator />
      </div>
    );
  } else {
    return (
      <div id="grid" className={classes.grid} ref={gridRef}>
        {dates.map((scene, id) =>
          id < loaded ? (
            scene === null ? (
              <Hidden key={id.toString() + "_null"} num={1} />
            ) : (
              <Suspense key={id.toString() + scene.group} fallback={<div />}>
                <Event
                  key={scene.group}
                  index={id}
                  group={scene}
                  openEvent={openEvent}
                  location={scene.location}
                  location_before={scene.location_before}
                  location_after={scene.location_after}
                  isQuestion={isQuestion}
                />
              </Suspense>
            )
          ) : null
        )}
        <Button className={classes.button} onClick={moreButton}>
          {" "}
          {moreText}{" "}
        </Button>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{
            position: "fixed",
            bottom: 16,
            right: "calc(17.5% + 16px)",
            zIndex: 20000,
          }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            key={1}
            onClick={() => dispatch(sortBy("relevance"))}
            icon={<SortIcon />}
            tooltipTitle={"Sort by relevance (Default)"}
          />
          <SpeedDialAction
            key={2}
            onClick={() => dispatch(sortBy("time"))}
            icon={<AccessTimeIcon />}
            tooltipTitle={"Sort by time"}
          />
        </SpeedDial>
      </div>
    );
  }
}, areEqual);

ImageGrid.whyDidYouRender = true;
export default ImageGrid;
