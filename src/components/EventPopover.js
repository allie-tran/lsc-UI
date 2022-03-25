import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Chrono } from "react-chrono";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Image from './Image';
import { getNextScenes, getGPS, getInfo, clearNextEvents, getSimilar} from '../redux/actions/search'
import clsx from 'clsx';


const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const RESIZE_FACTOR = 6;

const popStyle = makeStyles((theme) => ({
	detailed: {
		position: 'fixed',
		display: 'flex',
		backgroundColor: '#272727',
		flexDirection: 'row',
        height: '85%',
        width: '77.5%',
        top: '11.5%',
        left: '1.5%',
	},
    vertical: {
		display: 'flex',
		backgroundColor: '#272727',
		flexDirection: 'column',
        height: 'calc(100% - 10px)',
        width: 'calc(72.5% - 10px)',
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'start',
        overflowX: 'scroll'
	},
    horizontal: {
		display: 'flex',
		backgroundColor: '#272727',
		flexDirection: 'row',
        height: '100%',
        width: '100%',
        alignItems: 'center'
	},
	button: {
		marginRight: 10,
		marginLeft: 10,
        marginTop: 0,
        marginBottom: 0,
        padding: 0
	},
	buttonline: {
		width: '98%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
}));

var isEqual = require('lodash.isequal');
const areEqual = (prevProps, nextProps) => {
	return (
		isEqual(prevProps.group, nextProps.group) &&
		prevProps.similar === nextProps.similar &&
		isEqual(prevProps.scenes, nextProps.scenes) &&
		prevProps.highlight === nextProps.highlight &&
		isEqual(prevProps.sceneResponse, nextProps.sceneResponse)
	);
};

const gridStyle = makeStyles((theme) => ({
    fixedpanel: {
        width: props => props.width,
        height: props => props.height,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
        zIndex: props => props.zIndex,
	},
    panel: {
		display: 'flex',
        width: props => props.width,
        height: "calc(100%  - 20px)",
        borderRadius: 5,
		alignItems: 'center',
		backgroundColor: props => props.color,
		flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'scroll',
        marginRight: 10,
	},
    grid: {
        position: 'relative',
		overflowX: 'hidden',
        overflowY: 'scroll',
		padding: 10,
		width: '98%',
		display: 'flex',
		alignItems: props => props.alignItems? props.alignItems: 'start',
        justifyContent: props => props.justifyContent? props.justifyContent: 'start',
		flexDirection: 'row',
        flexWrap: 'wrap',
	},
    normalgrid: {
		padding: 10,
		width: '88%',
        // borderRadius: '5px',
        borderLeft: "4px solid #6c63ff",
		display: 'flex',
        justifyContent: 'start',
		flexDirection: 'row',
        flexWrap: 'wrap',
        // backgroundColor: "#383749cf",
	},
	text: {
        paddingTop: 15,
		color: '#F4CDD2',
        width: '90%'
	},
    timeline: {
        display: 'flex',
        backgroundColor: '#272727',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'start',
    },
    placetext: {
        paddingTop: 15,
        color: '#6c63ff',
        width: '12%',
        fontWeight: "bold",
        paddingRight: 10,
        textAlign: 'right',
        overflowWrap: "break-word",
        hyphens: "manual"
    },
    smalltext: {
        color:'#494949',
        fontSize: 14,
        marginTop: 0,
        width: '90%'
    },
    smalltext_light: {
        color:'#bebac6',
        fontSize: 14,
        marginTop: 0,
        width: '90%'
    },
    darktext: {
        paddingTop: 15,
        width: '90%',
        color:'#272727'
    }
}));

/* cardBgColor: "#383749cf",
primary: "#6c63ff",
secondary: "#3d3a6e" */
var isEqual = require('lodash.isequal');
const areSceneEqual = (prevProps, nextProps) => {
	return (
		isEqual(prevProps.scenes, nextProps.scenes) &&
		prevProps.onClick === nextProps.onClick &&
        prevProps.highlight === nextProps.highlight
	);
};
const SceneGrid = memo(({ref, name, explanation, scenes, height, width, scale, color, onClick, highlight, zIndex}) => {
    const classes = gridStyle({height, width, color});
    const ownOnClick = useCallback(
        (image) => {
            scenes.forEach(group => {
                group[2].forEach(scene =>{
                    if (scene[1][0] === image) {
                        onClick(scene[1]);
                    }
                })
            });
        }, [scenes]
    )
    return (<div className={classes.fixedpanel}>
                <Typography variant="button" className={classes.text}>
                    {name}
                </Typography>
                <p className={classes.smalltext_light}>
                    The scenes below are from in the same day of the scene you clicked.
                    Click on them to see all the images in that scene in the right panel.
                </p>
                <div id="scenegrid" className={classes.panel} ref={ref}>
                    {scenes ? scenes.map((group, id) => (
                        <div key={id} className={classes.timeline}>
                            <p className={classes.placetext}>
                                {group[1] ? group[1] : "NONE"}
                            </p>
                            <div className={classes.normalgrid} key={group[1]}>
                                {group[2] ? (
                                    group[2].map((scene, index) => (
                                        <Image
                                            info={scene[2].split('-')[0]}
                                            key={scene[0]}
                                            index={index}
                                            image={scene[1][0]}
                                            scale={scale}
                                            highlight={highlight===scene[0]}
                                            onClick={ownOnClick}
                                        />
                                    ))
                                ) : null}
                            </div>
                        </div>
                    )): null
                    }
                </div>
            </div>)
}, areSceneEqual);

const SimilarGrid = memo(({name, explanation, scenes, height, width, scale, color, onClick, zIndex}) => {
    const classes = gridStyle({height, width, color, justifyContent: 'center'});
    const ownOnClick = useCallback(
        (image) => {
            scenes.forEach(scene => {
                if (scene[0][0] === image){
                    onClick(scene[0]);
                }
            });
        }, [scenes]
    )
    return (<div className={classes.panel}>
                    <Typography variant="button" className={classes.darktext}>
                        {name}
                    </Typography>
                    <p className={classes.smalltext}>
                    The scenes below are selected by looking at the visual similarity in the photo contents using colour and shape.
                    If you find a potential scene, CLICK on it to see all scenes that day.
                    </p>
                    <div id="scenegrid" className={classes.grid}>
                        {scenes ? (
                            scenes.map((scene, index) => (
                                <Image
                                    dark
                                    info={scene[1]}
                                    key={scene[1]}
                                    index={index}
                                    image={scene[0][0]}
                                    scale={scale}
                                    onClick={ownOnClick}
                                    zoomed
                                />
                            ))
                        ) : null}
                    </div>
                </div>)
}, areSceneEqual);


const DetailGrid = memo(({name, explanation, scenes, height, width, scale, color, zIndex, onClick}) => {
    const classes = gridStyle({height, width, color, justifyContent: 'center'});
    return (<div className={classes.panel}>
                    <Typography variant="button" className={classes.text}>
                        {name}
                    </Typography>
                    <p className={classes.smalltext_light}>
                    These images are grouped together based on their visual similarity.
                    </p>
                    <div id="scenegrid" className={classes.grid}>
                        {scenes ? (
                            scenes.map((scene, index) => (
                                <Image
                                    key={index}
                                    index={index}
                                    image={scene}
                                    scale={scale}
                                    zoomed
                                    onClick={onClick}
                                />
                            ))
                        ) : null}
                    </div>
                </div>)
}, areSceneEqual);

const EventPopover = ({
		detailedScene,
		openEvent,
		similar
	}) => {
		const classes = popStyle();
		const [ currentScene, setCurrentScene ] = useState(null);
        const [ detailed, setDetailed ] = useState(detailedScene);
        const [ similarScene, setSimilarScene ] = useState(null);
        const [ currentInfo, setCurrentInfo] = useState(null);
        const [ scenes, setScenes ] = useState(null);
        const [ date, setDate ] = useState(null);
        const [ line, setLine ] = useState(0);
		const [ space, setSpace ] = useState(0);
		const [ highlight, setHighlight ] = useState(0);
		const changed = useRef(false);
		const fetchedScenes = useRef(false);
        const fetchedInfos = useRef(false);
        const behavior = useRef("smooth");

        const dispatch = useDispatch();
        const sceneResponse = useSelector(state => state.search.nextSceneResponse);
        const similarResponse = useSelector(state => state.search.similarResponse);
        const groupResponse = useSelector(state => state.search.groupResponse);
        const infoResponse = useSelector(state => state.search.infoResponse);
		const detailedContainer = useRef(null);
		const sceneContainer = useRef(null);
        const groupContainer = useRef(null);

		useEffect(() => {
			return () => dispatch(clearNextEvents());
		});

        useEffect(
			() => {
                setLine(0);
                setSpace(0);
				console.log('rerendering', similar);
				if (!similar) {
					fetchedScenes.current = false;
                    fetchedInfos.current = false;
				} else {
					fetchedScenes.current = false;
                    fetchedInfos.current = false;
				}
				return () => {
					fetchedScenes.current = true;
                    fetchedInfos.current = true;
					setScenes(null);
                    setCurrentInfo(null);
					dispatch(clearNextEvents());
				};
			},
			[ similar, detailedScene ]
		);

		useEffect(
			() => {
				if (sceneResponse) {
					sceneResponse.then((res) => {
						if (!fetchedScenes.current) {
                            setHighlight(res.data.position);
							console.log('next scene');
                            console.log(res.data)
							const index = res.data.position;
                            // setScenes([])
                            setScenes(res.data.timeline);
                            setLine(res.data.line);
                            setSpace(res.data.space);
                            setCurrentScene(res.data.scene_id)
                            if (
                                changed &&
                                res.data.timeline[index] !== undefined
                            ) {
                                dispatch(getGPS(res.data.timeline[index][0][0]));
                            }
						}
						fetchedScenes.current = true;
					});
				}
			},
			[ sceneResponse, currentScene, similar, scenes]
		);

        useEffect(
			() => {
				if (similarResponse) {
					similarResponse.then((res) => {
                        setSimilarScene(res.data.scenes);
					});
				}
			},
			[ similarResponse ]
		);

		useEffect(
			() => {
                if (line >= 0) {
                    const row = Math.floor(line * (IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920 + 26)  + space * 20);
					var el = document.getElementById('scenegrid');
                    var newPos = Math.max(0, row - el.offsetHeight * 0.5);
					setTimeout(
						() =>
							el.scrollTo({
                                top: newPos,
								left: 0,
								behavior: behavior.current
							}),
						100
					);
				}
			},
			[ scenes, line, space ]
		);

		const setDetailedImages = useCallback(
			(images) => {
                    dispatch(getSimilar(images[0]))
                    dispatch(getNextScenes(images, 'full'));
                    setDetailed(images);
                    fetchedScenes.current = false;
                    behavior.current = "auto";
			},
			[]
		);

        const setTime = useCallback(
            (images) => {
                dispatch(getNextScenes(images, 'full'));
                setDetailed(images);
                fetchedScenes.current = false;
                behavior.current = "smooth";
            },
            []
        );

        const findSimilar = useCallback(
            (image) => {
                dispatch(getSimilar(image))
            },
            []
        );
		return (
			<Paper id="popover" elevation={4} className={classes.detailed}>
                <div className={classes.horizontal}>
                    <div className={classes.vertical}>
                        <SceneGrid name={"ALL SCENES on " + (currentScene !== null? currentScene.split('_')[0]: "")}
                                scenes={scenes}
                                scale={1.0}
                                height="65%" width="100%"
                                color={"#272727"}
                                onClick={setDetailedImages}
                                highlight={currentScene}
                                zIndex={1}
                                ref={sceneContainer}/>
                        <SimilarGrid name={"SIMILAR scenes"}
                                scenes={similarScene}
                                scale={1.0}
                                height="30%" width="99%"
                                color={"#bebac6"}
                                zIndex={2}
                                onClick={setTime}/>
                    </div>
                    <DetailGrid name={"IMAGES of the selected scene"}
                            scenes={detailed}
                            scale={2.5}
                            zIndex={0}
                            height="calc(100% - 10px)" width="calc(32.5% - 20px)"
                            color={"rgb(56 55 72)"}
                            onClick={findSimilar}/>
                </div>
			</Paper>
		);
	}
EventPopover.whyDidYouRender = true;

export default EventPopover;
