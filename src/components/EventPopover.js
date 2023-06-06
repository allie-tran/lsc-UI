import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  memo,
  lazy,
  forwardRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {
  getNextScenes,
  getGPS,
  clearNextEvents,
  getSimilar,
  getMoreScenes,
  getInfo,
} from "../redux/actions/search";
import { submitImage } from "../redux/actions/submit";
import { saveScene } from "../redux/actions/save";
import useSound from "use-sound";
import sfxSound from "../navigation_transition-right.wav";
import saveSound from "../navigation_forward-selection.wav";

// const Image = lazy(() => import("./Image"));
import Image from "./Image";
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const RESIZE_FACTOR = 5.5;

const popStyle = makeStyles((theme) => ({
  paper: {
    position: "fixed",
    display: "flex",
    backgroundColor: "#272727",
    flexDirection: "row",
    height: "85%",
    width: "79.5%",
    top: "11.5%",
    left: "1.5%",
    zIndex: 5,
  },
  vertical: {
    display: "flex",
    backgroundColor: "#272727",
    flexDirection: "column",
    height: "calc(100% - 10px)",
    width: "calc(72.5% - 10px)",
    marginRight: 10,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "start",
    overflowX: "visible",
    zIndex: 10,
  },
  horizontal: {
    display: "flex",
    backgroundColor: "#272727",
    flexDirection: "row",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
  },
  buttonline: {
    width: "98%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fixedbutton: {
    position: "fixed",
    left: "51%",
    top: "calc(15% - 16px)",
    padding: 10,
    height: 32,
    color: "#ff6584",
    zIndex: 100,
    fontSize: 14,
  },
}));

var isEqual = require("lodash.isequal");

const gridStyle = makeStyles((theme) => ({
  fixedpanel: {
    width: (props) => props.width,
    height: (props) => props.height,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    zIndex: (props) => props.zIndex,
    flexShrink: 0,
  },
  panel: {
    display: "flex",
    width: (props) => props.width,
    height: "calc(100%  - 20px)",
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: (props) => props.color,
    flexDirection: "column",
    overflowX: "visible",
    overflowY: "scroll",
    marginRight: 10,
  },
  grid: {
    position: "relative",
    overflowX: "visible",
    overflowY: "scroll",
    padding: 10,
    width: "98%",
    display: "flex",
    alignItems: (props) => (props.alignItems ? props.alignItems : "start"),
    justifyContent: (props) =>
      props.justifyContent ? props.justifyContent : "start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailedgrid: {
    position: "relative",
    overflowX: "scroll",
    overflowY: "visible",
    padding: 10,
    width: "98%",
    display: "flex",
    alignItems: (props) => (props.alignItems ? props.alignItems : "start"),
    justifyContent: (props) =>
      props.justifyContent ? props.justifyContent : "start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  normalgrid: {
    padding: 10,
    width: "88%",
    // borderRadius: '5px',
    borderLeft: (props) => "4px solid " + props.borderColor,
    display: "flex",
    justifyContent: "start",
    flexDirection: "row",
    flexWrap: "wrap",
    // backgroundColor: "#383749cf",
  },
  text: {
    paddingTop: 15,
    color: "#F4CDD2",
    width: "90%",
  },
  timeline: {
    display: "flex",
    // backgroundColor: "#272727",
    flexDirection: "row",
    width: "100%",
    alignItems: "start",
  },
  placetext: {
    paddingTop: 15,
    color: (props) => props.borderColor,
    width: "15%",
    paddingRight: 10,
    fontWeight: (props) => props.textBold,
    fontSize: (props) => (props.textBold ? null : 12),
    textAlign: "right",
    overflowWrap: "break-word",
    hyphens: "manual",
    whiteSpace: "pre-wrap",
  },
  info1: {
    marginBottom: 0,
  },
  info2: {
    color: "#c8c5ffa6",
    fontSize: 12,
    fontWeight: 400,
  },
  smalltext: {
    color: "#494949",
    fontSize: 14,
    marginTop: 0,
    width: "90%",
  },
  smalltext_light: {
    color: "#bebac6",
    fontSize: 14,
    marginTop: 0,
    width: "90%",
  },
  darktext: {
    paddingTop: 15,
    width: "90%",
    color: "#272727",
  },
  placeholder: {
    height: (props) =>
      ((IMAGE_HEIGHT / RESIZE_FACTOR) * props.scale * window.innerWidth) / 1920,
    width: (props) =>
      ((IMAGE_WIDTH / RESIZE_FACTOR) * props.scale * window.innerWidth) / 1920,
  },
  morebutton: {
    width: "100%",
    padding: 10,
    height: 32,
    flexShrink: 0,
  },
}));

const areSceneEqual = (prevProps, nextProps) => {
  return (
    isEqual(prevProps.scenes, nextProps.scenes) &&
    isEqual(prevProps.onClick, nextProps.onClick) &&
    prevProps.highlight === nextProps.highlight &&
    prevProps.name === nextProps.name
  );
};
const SceneGrid = memo(
  forwardRef(function SceneGrid(
    {
      name,
      explanation,
      scenes,
      height,
      width,
      scale,
      color,
      onClick,
      highlight,
      zIndex,
      handleScroll,
      moreTop,
      moreBottom,
      borderColor,
      textBold,
    },
    highlightRef
  ) {
    const classes = gridStyle({
      height,
      width,
      color,
      scale,
      borderColor,
      textBold,
    });
    const ownOnClick = useCallback(
      (image) => {
        scenes.forEach((group) => {
          group[2].forEach((scene) => {
            if (scene[1][0] === image) {
              onClick(scene[1], scene[0]);
            }
          });
        });
      },
      [scenes, onClick]
    );

    return (
      <div className={classes.fixedpanel}>
        <Typography variant="button" className={classes.text}>
          {name}
        </Typography>
        <p className={classes.smalltext_light}>
          The scenes below are from in the same day of the scene you clicked.
          Click on them to see all the images in that scene in the right panel.
        </p>
        <div id="scenegrid" className={classes.panel} onScroll={handleScroll}>
          <Button
            className={classes.morebutton}
            onClick={moreTop}
            color="primary"
            variant="text"
          >
            {" "}
            MORE{" "}
          </Button>
          {scenes
            ? scenes.map((group, id) => (
                <div key={id} className={classes.timeline}>
                  <div className={classes.placetext}>
                    <p key={group[1][0]} className={classes.info1}>
                      {group[1][0]}
                      <br />
                    </p>
                    <p key={group[1][1]} className={classes.info2}>
                      {group[1][1]}
                      <br />
                    </p>
                  </div>
                  <div className={classes.normalgrid} key={group[1]}>
                    {group[2]
                      ? group[2].map((scene, index) => (
                          <Image
                            key={scene[0]}
                            ref={highlight === scene[0] ? highlightRef : null}
                            info={scene[2].split("-")[0]}
                            image={scene[1][0]}
                            scale={scale}
                            highlight={highlight === scene[0]}
                            onClick={ownOnClick}
                            scene={true}
                          />
                        ))
                      : null}
                  </div>
                </div>
              ))
            : null}
          <Button
            className={classes.morebutton}
            onClick={moreBottom}
            color="primary"
            variant="text"
          >
            {" "}
            MORE{" "}
          </Button>
        </div>
      </div>
    );
  }),
  areSceneEqual
);

const SimilarGrid = memo(function SimilarGrid({
  name,
  explanation,
  scenes,
  height,
  width,
  scale,
  color,
  borderColor,
  onClick,
  zIndex,
  textBold,
}) {
  const classes = gridStyle({
    height,
    width,
    color,
    borderColor,
    scale,
    textBold,
    justifyContent: "center",
  });
  const ownOnClick = useCallback(
    (image) => {
      console.log(image);
      scenes.forEach((group) => {
        group[0].forEach((scene) => {
          if (scene === image) {
            onClick([scene]);
          }
        });
      });
    },
    [scenes, onClick]
  );
  return (
    <div className={classes.panel}>
      <Typography variant="button" className={classes.darktext}>
        {name}
      </Typography>
      <p className={classes.smalltext}>
        The scenes below are selected by looking at the visual similarity in the
        photo contents using colour and shape. If you find a potential scene,
        CLICK on it to see all scenes that day.
      </p>

      <div className={classes.panel}>
        {scenes
          ? scenes.map((group, id) => (
              <div key={id} className={classes.timeline}>
                <p className={classes.placetext}>{group[1]}</p>
                <div className={classes.normalgrid} key={group[1]}>
                  {group[0]
                    ? group[0].map((image, index) => (
                        <Image
                          dark
                          key={image}
                          // info={scene[1]}
                          image={image}
                          scale={scale}
                          onClick={ownOnClick}
                          scene={false}
                          zoomed
                        />
                      ))
                    : null}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
},
areSceneEqual);

const DetailGrid = memo(
  forwardRef(function DetailGrid(
    {
      name,
      explanation,
      scenes,
      height,
      width,
      scale,
      color,
      zIndex,
      onClick,
      initialImage,
    },
    ref
  ) {
    const classes = gridStyle({
      height,
      width,
      color,
      scale,
      justifyContent: "center",
    });
    return (
      <div className={classes.panel}>
        <Typography variant="button" className={classes.text}>
          {name}
        </Typography>
        <p className={classes.smalltext_light}>
          These images are grouped together based on their visual similarity.
        </p>
        <div id="detailedgrid" className={classes.detailedgrid}>
          {scenes
            ? scenes.map((image, index) => (
                <Image
                  ref={initialImage === image ? ref : null}
                  key={image}
                  image={image}
                  scale={scale}
                  zoomed
                  onClick={onClick}
                  scene={false}
                  info={image}
                  highlight={initialImage === image}
                />
              ))
            : null}
        </div>
      </div>
    );
  },
  areSceneEqual)
);

const areEqual = (prevProps, nextProps) => {
  return (
    isEqual(prevProps.scenes, nextProps.scenes) &&
    isEqual(prevProps.similarScenes, nextProps.similarScenes) &&
    isEqual(prevProps.detailed, nextProps.detailed) &&
    isEqual(prevProps.firstScene, nextProps.firstScene) &&
    prevProps.info === nextProps.info &&
    prevProps.initialImage === nextProps.initialImage &&
    prevProps.currentImage === nextProps.currentImage &&
    isEqual(prevProps.currentScene, nextProps.currentScene)
  );
};

const EventPopover = memo(function EventPopper({
  initialImage,
  openEvent,
  shiftHeld,
  commandHeld,
}) {
  const classes = popStyle();
  const [play] = useSound(sfxSound);
  const [playSave] = useSound(saveSound);

  const [currentScene, setCurrentScene] = useState(null);
  const [firstScene, setFirstScene] = useState(null);
  const [currentImage, setCurrentImage] = useState();
  const [info, setInfo] = useState("");
  const [detailed, setDetailed] = useState(null);
  const [similarScene, setSimilarScene] = useState(null);
  const [scenes, setScenes] = useState(null);

  const [line, setLine] = useState(-1);
  const [space, setSpace] = useState(0);
  const fetchedScenes = useRef(false);
  const fetchedMore = useRef(false);
  const moreScroll = useRef(null);
  const firstTime = useRef(true);

  const dispatch = useDispatch();
  const sceneResponse = useSelector((state) => state.search.sceneResponse);
  const moreSceneResponse = useSelector(
    (state) => state.search.moreSceneResponse
  );
  const similarResponse = useSelector((state) => state.search.similarResponse);
  const infoResponse = useSelector((state) => state.search.infoResponse);

  const moreTop = useCallback(() => {
    if (scenes) {
      dispatch(getMoreScenes(scenes[0][0], "top"));
      fetchedMore.current = false;
    }
  }, [scenes]);
  const moreBottom = useCallback(() => {
    if (scenes) {
      dispatch(getMoreScenes(scenes[scenes.length - 1][0], "bottom"));
      fetchedMore.current = false;
    }
  }, [scenes]);

  useEffect(() => {
    setLine(-1);
    setSpace(0);
    fetchedScenes.current = false;
    fetchedMore.current = false;
    firstTime.current = true;
    return () => {
      fetchedScenes.current = true;
      fetchedMore.current = true;
      setScenes(null);
      setSimilarScene(null);
      setDetailed(null);
      dispatch(clearNextEvents());
      firstTime.current = true;
    };
  }, []);

  useEffect(() => {
    if (sceneResponse) {
      sceneResponse.then((res) => {
        if (!fetchedScenes.current) {
          moreScroll.current = null;
          if (!isEqual(scenes, res.data.timeline)) {
            setScenes(res.data.timeline);
            var done = false;
            for (let i = 0; i < res.data.timeline.length; i++) {
              for (let j = 0; j < res.data.timeline[i][2].length; j++) {
                if (res.data.timeline[i][2][j][0] === res.data.scene_id) {
                  if (!isEqual(detailed, res.data.timeline[i][2][j][1])) {
                    setDetailed(res.data.timeline[i][2][j][1]);
                  }
                  if (!firstScene) {
                    setFirstScene(res.data.timeline[i][2][j][1]);
                  }
                  done = true;
                  break;
                }
              }
              if (done) {
                break;
              }
            }
            const imageHeight =
              ((IMAGE_HEIGHT / RESIZE_FACTOR) * window.innerWidth) / 1920 +
              45.5;

            const row = 10 + // first padding
                (res.data.line - 0.5) * imageHeight +
                (res.data.space + 1) * 20

            var el = document.getElementById("scenegrid");
            if (el) {
              console.log(
                res.data.line,
                res.data.space,
                imageHeight,
                row
              );

              el.scrollTo({
                top: Math.floor(row - el.clientHeight / 2),
                left: 0,
                behavior: "instant",
              });
            }
          }
          // console.log("scene", res.data)
          setLine(res.data.line);
          setSpace(res.data.space);
          setCurrentScene(res.data.scene_id);
          setCurrentImage(res.data.image);
        }
        fetchedScenes.current = true;
      });
    }
  }, [sceneResponse, scenes, firstScene, detailed]);

  useEffect(() => {
    if (infoResponse)
      infoResponse.then((res) => {
        if (res.data.info !== info) {
          setInfo(res.data.info);
        }
      });
  }, [infoResponse, info]);

  useEffect(() => {
    if (currentImage && typeof currentImage !== "undefined") {
      const controller = new AbortController();
      dispatch(getGPS(currentImage));
      dispatch(getInfo(currentImage));
      return () => {
        controller.abort();
      };
    }
  }, [currentImage]);

  useEffect(() => {
    if (moreSceneResponse) {
      if (!fetchedMore.current && fetchedScenes.current && scenes) {
        moreSceneResponse.then((res) => {
          console.log("more scene", res.data.direction);
          if (res.data.timeline.length > 0) {
            moreScroll.current = res.data.direction;
            if (res.data.direction === "bottom") {
              setScenes([...scenes, ...res.data.timeline]);
            } else if (res.data.direction === "top") {
              setScenes([...res.data.timeline, ...scenes]);
              const imageHeight =
                ((IMAGE_HEIGHT / RESIZE_FACTOR) * window.innerWidth) / 1920 +
                43.5;
              const row = Math.floor(
                10 + // first padding
                  res.data.line * imageHeight +
                  (res.data.space + 1) * 20
              );
              console.log(res.data.line, res.data.space, imageHeight, row);
              var el = document.getElementById("scenegrid");
              if (el) {
                el.scrollTo({
                  top: row,
                  left: 0,
                  behavior: "instant",
                });
              }
            }
          } else {
            alert("End of timeline!");
          }
        });
        fetchedMore.current = true;
      }
    }
  }, [moreSceneResponse, scenes]);

  useEffect(() => {
    if (similarResponse) {
      similarResponse.then((res) => {
        if (!isEqual(similarScene, res.data.scenes)) {
          setSimilarScene(res.data.scenes);
        }
      });
    }
  }, [similarResponse, similarScene]);

  useEffect(() => {
    var el = document.getElementById("scenegrid");
    var timer;
    if (fetchedMore.current && moreScroll.current) {
      if (moreScroll.current === "bottom") {
        timer = setTimeout(
          () =>
            el.scrollTo({
              top: el.scrollTop + 20,
              left: 0,
              behavior: "smooth",
            }),
          50
        );
      } else if (moreScroll.current === "top") {
        timer = setTimeout(
          () =>
            el.scrollTo({
              top: el.scrollTop - 40,
              left: 0,
              behavior: "smooth",
            }),
          50
        );
      }
      console.log(moreScroll.current);
      moreScroll.current = false;
      setLine(-1);
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [scenes, line, space]);

  const setDetailedImages = useCallback(
    (images, scene_id) => {
      if (shiftHeld.current) {
        play();
        dispatch(submitImage(images[0], false, false));
      } else if (commandHeld.current) {
        playSave();
        dispatch(saveScene(images));
      } else {
        dispatch(getSimilar(images[0]));
        if (!isEqual(detailed, images)) {
          setDetailed(images);
          setCurrentScene(scene_id);
          setCurrentImage(images[0]);
        }
      }
    },
    [play, playSave, detailed]
  );

  const setTime = useCallback(
    (images) => {
      var timer;
      if (shiftHeld.current) {
        play();
        dispatch(submitImage(images[0], false, false));
      } else {
        fetchedScenes.current = false;
        dispatch(getNextScenes(images, "full"));
        if (!isEqual(detailed, images)) {
          setDetailed(images);
        }
        timer = setTimeout(() => {
          if (highlightRef.current) {
            highlightRef.current.scrollIntoView({
              behavior: "smooth",
            });
            console.log("Scroll SetTime");
          }
        }, 100);
      }
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    },
    [play, detailed]
  );

  const findSimilar = useCallback(
    (image) => {
      if (image) {
        if (shiftHeld.current) {
          play();
          dispatch(submitImage(image, false, false));
        } else if (commandHeld.current) {
          playSave();
          dispatch(saveScene([image]));
        } else {
          dispatch(getSimilar(image));
          dispatch(getInfo(image));
        }
      }
    },
    [play, playSave]
  );

  const highlightRef = useRef();
  const highlightDetailedRef = useRef();
  // Scroll to highlighted SCENE
  useEffect(() => {
    var timer;
    if (currentImage && highlightRef.current) {
      timer = setTimeout(
        (highlightRef) => {
          if (highlightRef.current) {
            highlightRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        },
        firstTime.current ? 1000 : 50,
        highlightRef
      );
      firstTime.current = false;
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentImage]);

  // Scroll to highlighted IMAGE
  useEffect(() => {
    var timer;
    if (initialImage && highlightDetailedRef.current) {
        const imageHeight =
        ((IMAGE_HEIGHT / RESIZE_FACTOR) * window.innerWidth) * 2.25 / 1920 + 45.5;

        const row =
        10 + // first padding
        detailed.indexOf(initialImage) * imageHeight;

        var el = document.getElementById("detailedgrid");
        if (el) {
        el.scrollTo({
            top: Math.floor(row - el.clientHeight / 2),
            left: 0,
            behavior: "instant",
        });
        }

      timer = setTimeout(
        (highlightDetailedRef) => {
          highlightDetailedRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        },
        250,
        highlightDetailedRef
      );
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [initialImage, detailed]);

  const reset = useCallback(() => {
    fetchedScenes.current = false;
    dispatch(getNextScenes(firstScene, "full"));
    if (!isEqual(detailed, firstScene)) {
      if (firstScene) {
        setDetailed(firstScene);
      }
    }
    const timer1 = setTimeout(
      (highlightDetailedRef) => {
        if (highlightDetailedRef.current) {
          highlightDetailedRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      },
      500,
      highlightDetailedRef
    );
    const timer2 = setTimeout(
      (highlightRef) => {
        if (highlightRef.current) {
          highlightRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      },
      1000,
      highlightRef
    );
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [firstScene, detailed]);

  return (
    <Paper id="popover" elevation={4} className={classes.paper}>
      <Button className={classes.fixedbutton} onClick={reset}>
        {" "}
        Reset{" "}
      </Button>
      <div className={classes.horizontal}>
        <div className={classes.vertical}>
          <SceneGrid
            name={"ALL SCENES on " + info}
            scenes={scenes}
            scale={1.0}
            height="70%"
            width="100%"
            color={"#272727"}
            borderColor={"#6c63ff"}
            textBold={"bold"}
            onClick={setDetailedImages}
            highlight={currentScene}
            zIndex={1}
            ref={highlightRef}
            moreTop={moreTop}
            moreBottom={moreBottom}
          />
          <SimilarGrid
            name={"SIMILAR scenes"}
            scenes={similarScene}
            scale={1.0}
            borderColor={"#272727"}
            textBold={""}
            height="30%"
            width="99%"
            color={"#bebac6"}
            zIndex={2}
            onClick={setTime}
          />
        </div>
        <DetailGrid
          name={"IMAGES of the selected scene"}
          scenes={detailed}
          scale={2.25}
          zIndex={0}
          height="calc(100% - 10px)"
          width="calc(32.5% - 10px)"
          color={"rgb(56 55 72)"}
          onClick={findSimilar}
          ref={highlightDetailedRef}
          initialImage={initialImage}
        />
      </div>
    </Paper>
  );
},
areEqual);
SceneGrid.whyDidYouRender = true;
SimilarGrid.whyDidYouRender = true;
DetailGrid.whyDidYouRender = true;
EventPopover.whyDidYouRender = true;

export default EventPopover;
