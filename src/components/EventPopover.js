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
// import Image from "./Image";
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

// const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const IMAGE_WIDTH = 1024;
const RESIZE_FACTOR = 6;

const popStyle = makeStyles((theme) => ({
    detailed: {
        position: "fixed",
        display: "flex",
        backgroundColor: "#272727",
        flexDirection: "row",
        height: "85%",
        width: "77.5%",
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
        fontSize: 14
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
        fontWeight: (props) => props.textBold,
        fontSize: (props) => (props.textBold ? null : 12),
        paddingRight: 10,
        textAlign: "right",
        overflowWrap: "break-word",
        hyphens: "manual",
        whiteSpace: "pre-wrap"
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
            ((IMAGE_HEIGHT / RESIZE_FACTOR) * props.scale * window.innerWidth) /
            1920,
        width: (props) =>
            ((IMAGE_WIDTH / RESIZE_FACTOR) * props.scale * window.innerWidth) /
            1920,
    },
    morebutton: {
        width: "100%",
        padding: 10,
        height: 32,
        flexShrink: 0,
    },
}));

/* cardBgColor: "#383749cf",
primary: "#6c63ff",
secondary: "#3d3a6e" */
const areSceneEqual = (prevProps, nextProps) => {
    return (
        isEqual(prevProps.scenes, nextProps.scenes) &&
        prevProps.onClick === nextProps.onClick &&
        prevProps.highlight === nextProps.highlight
    );
};
const SceneGrid = memo(
    forwardRef(
        function SceneGrid(
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
                textBold
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

            // const [highlightSceneIndex, setHighlightSceneIndex] = useState(0)
            // const [highlightGroupIndex, setHighlightGroupIndex] = useState(0);

            // useEffect(() => {
            //     if (scenes){
            //         scenes.forEach((group, id) => {
            //             if (group[2]) {
            //             group[2].forEach((scene, index) => {
            //                 if (highlight === scene[0]) {
            //                 setHighlightSceneIndex(index);
            //                 setHighlightGroupIndex(id);
            //                 }
            //             });
            //             } 
            //         })
            //     }
            // }, [scenes, highlight])

            return (
              <div className={classes.fixedpanel}>
                <Typography variant="button" className={classes.text}>
                  {name}
                </Typography>
                <p className={classes.smalltext_light}>
                  The scenes below are from in the same day of the scene you
                  clicked. Click on them to see all the images in that scene in
                  the right panel.
                </p>
                <div
                  id="scenegrid"
                  className={classes.panel}
                  onScroll={handleScroll}
                >
                  <Button className={classes.morebutton} onClick={moreTop}>
                    {" "}
                    MORE{" "}
                  </Button>
                  {scenes
                    ? scenes.map((group, id) => (
                        <div key={id} className={classes.timeline}>
                          <p className={classes.placetext}>
                            {group[1] ? group[1] : "NONE"}
                          </p>
                          <div className={classes.normalgrid} key={group[1]}>
                            {group[2]
                              ? group[2].map((scene, index) => (
                                  <Image
                                    ref={
                                      highlight === scene[0]
                                        ? highlightRef
                                        : null
                                    }
                                    // disableLazyLoad={
                                    //   id < highlightGroupIndex ||
                                    //   (id === highlightGroupIndex &&
                                    //     index < highlightSceneIndex)
                                    // }
                                    info={scene[2].split("-")[0]}
                                    key={scene[0]}
                                    index={index}
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
                  <Button className={classes.morebutton} onClick={moreBottom}>
                    {" "}
                    MORE{" "}
                  </Button>
                </div>
              </div>
            );
        }
    ),
    areSceneEqual
);

const SimilarGrid = memo(
    function SimilarGrid ({
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
                    })
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
                    The scenes below are selected by looking at the visual
                    similarity in the photo contents using colour and shape. If
                    you find a potential scene, CLICK on it to see all scenes
                    that day.
                </p>

                <div className={classes.panel}>
                    {scenes
                        ? scenes.map((group, id) => (
                              <div key={id} className={classes.timeline}>
                                  <p className={classes.placetext}>
                                      {group[1]}
                                  </p>
                                  <div
                                      className={classes.normalgrid}
                                      key={group[1]}
                                  >
                                      {group[0]
                                          ? group[0].map((image, index) => (
                                                    <Image
                                                        dark
                                                        key={image}
                                                        // info={scene[1]}
                                                        index={index}
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

                {/* <div className={classes.grid}>
                    {scenes
                        ? scenes.map((scene, index) => (
                              <Suspense
                                  key={scene[0][0]}
                                  fallback={
                                      <div className={classes.placeholder} />
                                  }
                              >
                                  <Image
                                      dark
                                      key={scene[0][0]}
                                      info={scene[1]}
                                      index={index}
                                      image={scene[0][0]}
                                      scale={scale}
                                      onClick={ownOnClick}
                                      scene={false}
                                      zoomed
                                  />
                              </Suspense>
                          ))
                        : null}
                </div> */}
            </div>
        );
    },
    areSceneEqual
);

const DetailGrid = memo(
    forwardRef(
        function DetailGrid(
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
            initialImage
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
              These images are grouped together based on their visual
              similarity.
            </p>
            <div id="detailedgrid" className={classes.detailedgrid}>
              {scenes
                ? scenes.map((image, index) => (
                    <Image
                      ref={initialImage === image ? ref : null}
                      key={image}
                      index={index}
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
areSceneEqual));

const areEqual = (prevProps, nextProps) => {
    return (
      isEqual(prevProps.scenes, nextProps.scenes) &&
      isEqual(prevProps.similarScenes, nextProps.similarScenes) &&
      isEqual(prevProps.detailed, nextProps.detailed) &&
      prevProps.info === nextProps.info &&
      prevProps.initialImage === nextProps.initialImage &&
      prevProps.currentImage === nextProps.currentImage &&
      isEqual(prevProps.currentScene, nextProps.currentScene)
    );
};

const EventPopover = memo(function EventPopper({ initialImage, openEvent, detailedScene, shiftHeld, commandHeld }) {
    const classes = popStyle();
    const [play] = useSound(sfxSound);
    const [playSave] = useSound(saveSound);

    const [currentScene, setCurrentScene] = useState(null);
    const [firstScene, setFirstScene] = useState(null);
    const [currentImage, setCurrentImage] = useState();
    const [info, setInfo] = useState("");
    const [detailed, setDetailed] = useState(detailedScene);
    const [similarScene, setSimilarScene] = useState(null);
    const [scenes, setScenes] = useState(null);

    const [line, setLine] = useState(-1);
    const [space, setSpace] = useState(0);
    // const [ highlight, setHighlight ] = useState(0);
    const fetchedScenes = useRef(false);
    const fetchedMore = useRef(false);
    const fetchedInfos = useRef(false);
    const moreScroll = useRef(null);
    const firstTime = useRef(true);

    const behavior = useRef("smooth");

    const dispatch = useDispatch();
    const sceneResponse = useSelector((state) => state.search.sceneResponse);
    const moreSceneResponse = useSelector(
        (state) => state.search.moreSceneResponse
    );
    const similarResponse = useSelector(
        (state) => state.search.similarResponse
    );
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
        fetchedInfos.current = false;
        firstTime.current = true;
        return () => {
            fetchedScenes.current = true;
            fetchedMore.current = true;
            fetchedInfos.current = true;
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
                    setDetailed(res.data.timeline[i][2][j][1]);
                    done = true;
                    break;
                  }
                }
                if (done){
                    break;
                }
              }
            }
            // console.log("scene", res.data)
            setLine(res.data.line);
            setSpace(res.data.space);
            setCurrentScene(res.data.scene_id);
            if (!firstScene) {
              setFirstScene(res.data.scene_id);
            }
            setCurrentImage(res.data.image);
          }
          fetchedScenes.current = true;
        });
      }
    }, [sceneResponse, scenes, firstScene]);

    useEffect(() => {
        if (infoResponse && !fetchedInfos.current)
            infoResponse.then((res) => {
                setInfo(res.data.info);
                // console.log(res.data)
            });
        fetchedInfos.current = true;
    }, [infoResponse]);

    useEffect(() => {
        if (currentImage && typeof currentImage !== "undefined") {
            const controller = new AbortController();
            dispatch(getGPS(currentImage));
            dispatch(getInfo(currentImage));
            fetchedInfos.current = false;
            return () => {
                controller.abort();
            };
        }
    }, [currentImage]);

    useEffect(() => {
        if (moreSceneResponse) {
            if (
                !fetchedMore.current &&
                fetchedScenes.current &&
                scenes
            ) {
                moreSceneResponse.then((res) => {
                    console.log("more scene", res.data.direction);
                    if (res.data.timeline.length > 0) {
                        moreScroll.current = res.data.direction;
                        if (res.data.direction === "bottom") {
                            setScenes([...scenes, ...res.data.timeline]);
                        } else if (res.data.direction === "top") {
                            setScenes([...res.data.timeline, ...scenes]);
                            var el = document.getElementById("scenegrid");
                            const row = Math.floor(
                                res.data.line *
                                    (((IMAGE_HEIGHT / RESIZE_FACTOR) *
                                        window.innerWidth) /
                                        1920) +
                                    (res.data.line - res.data.space) * 26 +
                                    (res.data.space + 1) * 20
                            );
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
                            top: el.scrollTop - 20,
                            left: 0,
                            behavior: "smooth",
                        }),
                    50
                );
            }
            console.log(moreScroll.current)
            setLine(-1);
            return () => {if (timer) {clearTimeout(timer)}};
        }
    }, [scenes, line, space]);

    const setDetailedImages = useCallback(
        (images, scene_id) => {
            if (shiftHeld.current) {
                play();
                dispatch(submitImage(images[0], true));
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
                behavior.current = "auto";
            }
        },
        [play, playSave, detailed]
    );

    const setTime = useCallback(
        (images) => {
            var timer;
            if (shiftHeld.current) {
                play();
                dispatch(submitImage(images[0], false));
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
                    },
                    100
                );
                
                behavior.current = "smooth";
            }
            return () => {if (timer) {
              clearTimeout(timer);
            }}
        },
        [play, detailed]
    );

    const findSimilar = useCallback(
        (image) => {
            if (image) {
                if (shiftHeld.current) {
                    play();
                    dispatch(submitImage(image, false));
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
    useEffect(() => {
        var timer;
        if (firstTime.current && currentImage && highlightRef.current) {
            // console.log("Scrolling to", highlightRef.current);
            timer = setTimeout(() => {
                if (highlightRef.current){
                    highlightRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                }
            }, 1000)
            firstTime.current = false;
        }
        return () => {firstTime.current = true; if (timer) {
          clearTimeout(timer);
        }};
    }, [currentImage]);

    useEffect(() => {
      var timer;
      if (initialImage && highlightDetailedRef.current) {
        // console.log("Scrolling to", highlightRef.current);
        timer = setTimeout(() => {
          if (highlightDetailedRef.current) {
            highlightDetailedRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 2000);
      }
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [initialImage, detailedScene]);

    const reset = useCallback(() => {
        fetchedScenes.current = false;
        dispatch(getNextScenes(detailedScene, "full"));
        if (!isEqual(detailed, detailedScene)) {
            setDetailed(detailedScene);
        }
        const timer = setTimeout(() => {
            if (highlightRef.current) {
                highlightRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
            }
            if (highlightDetailedRef.current) {
              highlightDetailedRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
        }, 250);
        behavior.current = "smooth";
        return () => clearTimeout(timer);
    }, [detailedScene, detailed]);

    return (
      <Paper id="popover" elevation={4} className={classes.detailed}>
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
              height="65%"
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
            scale={2.5}
            zIndex={0}
            height="calc(100% - 10px)"
            width="calc(32.5% - 20px)"
            color={"rgb(56 55 72)"}
            onClick={findSimilar}
            ref={highlightDetailedRef}
            initialImage={initialImage}
          />
        </div>
      </Paper>
    );
}, areEqual);
SceneGrid.whyDidYouRender = true;
SimilarGrid.whyDidYouRender = true;
DetailGrid.whyDidYouRender = true;
EventPopover.whyDidYouRender = true;

export default EventPopover;
