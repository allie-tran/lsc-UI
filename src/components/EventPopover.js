import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Image from './Image';
import { getNextScenes, getGPS, getInfo, clearNextEvents, getSimilar} from '../redux/actions/search'


const IMAGE_WIDTH = 1024;
const RESIZE_FACTOR = 6;

const popStyle = makeStyles((theme) => ({
	detailed: {
		width: '100%',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#272727',
		flexDirection: 'column',
		padding: 10
	},
	grid: {
		overflowX: 'scroll',
        overflowY: 'hidden',
		padding: 10,
		width: `calc(100% - 32px)`,
		left: -16,
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row'
	},
	text: {
		color: '#F4CDD2'
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
		isEqual(prevProps.currentDisplay, nextProps.currentDisplay) &&
		prevProps.highlight === nextProps.highlight &&
		prevProps.highlightGroup === nextProps.highlightGroup &&
		isEqual(prevProps.groups, nextProps.groups) &&
		isEqual(prevProps.sceneResponse, nextProps.sceneResponse)
	);
};

const EventPopover = ({
		detailedScene,
		openEvent,
		similar
	}) => {
		const classes = popStyle();
		const [ currentDisplay, setCurrentDisplay ] = useState(null);
        const [ currentInfo, setCurrentInfo] = useState(null);
        const [ scenes, setScenes ] = useState(null);
		const [ groups, setGroups ] = useState(null);
		const [ highlight, setHighlight ] = useState(0);
		const [ highlightGroup, setHighlightGroup ] = useState(0);
		const changed = useRef(false);
		const fetchedScenes = useRef(false);
        const fetchedGroups = useRef(false);
        const fetchedInfos = useRef(false);
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
				console.log('rerendering', similar);
				if (!similar) {
					fetchedScenes.current = false;
					fetchedGroups.current = false;
                    fetchedInfos.current = false;
				} else {
					fetchedScenes.current = false;
					fetchedGroups.current = true;
                    fetchedInfos.current = false;
				}
				if (!isEqual(currentDisplay, detailedScene)) {
					setCurrentDisplay(detailedScene);
				}
				return () => {
					fetchedScenes.current = true;
					fetchedGroups.current = true;
                    fetchedInfos.current = true;
					setGroups(null);
					setScenes(null);
                    setCurrentInfo(null);
                    setCurrentDisplay(null);
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
                            setHighlightGroup(res.data.group);
							console.log('next scene');
							const index = res.data.position;
							if (!similar && !isEqual(res.data.timeline, scenes)) {
                                // setScenes([])
								setScenes(res.data.timeline);
								if (
									changed &&
									res.data.timeline[index] !== undefined
								) {
                                    dispatch(getGPS(res.data.timeline[index][0][0]));
                                    if (
                                        currentDisplay === null || !res.data.timeline[index][0].includes(currentDisplay[0])
                                    ){
                                        // console.log('set current display', res.data.timeline[index] )
                                        setCurrentDisplay(res.data.timeline[index][0]);
                                    }
								}
							}
						}
						fetchedScenes.current = true;
					});
				}
			},
			[ sceneResponse, currentDisplay, similar, scenes]
		);

        useEffect(
            () => {
                console.log('Requesting Info')
                fetchedInfos.current = false;
                if (currentDisplay){
                    dispatch(getInfo(currentDisplay));
                }
            },
            [currentDisplay]
        )

        useEffect(
            () => {
                if (infoResponse) {
                    console.log('Received Info')
                    infoResponse.then((res) => {
                        if (!fetchedInfos.current) {
                            if (!isEqual(res.data.info, currentInfo) && res.data.info) {
                                setCurrentInfo(res.data.info);
                            }
                        }
                        fetchedInfos.current = true;
                    });
                }
            },
            [infoResponse, currentInfo]
        )

        useEffect(
			() => {
				if (similarResponse) {
					similarResponse.then((res) => {
						console.log('similar');
						if (similar && !fetchedScenes.current && res.data.scenes !== undefined) {
							if (!isEqual(res.data.scenes, scenes)) {
                                // setScenes(null);
								setScenes(res.data.scenes);
							}
							if (currentDisplay && !currentDisplay.includes(res.data.scenes[0][0][0])) {
								setCurrentDisplay(res.data.scenes[0][0]);
							}
							setHighlight(0);
						}
						fetchedScenes.current = true;
					});
				}
			},
			[ similarResponse, similar, scenes, currentDisplay ]
		);

        useEffect(
			() => {
				if (groupResponse) {
					groupResponse.then((res) => {
						if (!fetchedGroups.current) {
							console.log('group');
							if (!isEqual(res.data.timeline, groups) && res.data.timeline) {
								setGroups(res.data.timeline);
							}
						}
						fetchedGroups.current = true;
					});
				}
			},
			[ groupResponse, groups]
		);

		useEffect(
			() => {
				if (highlight >= 0) {
					const column = Math.floor((highlight + 0.6) * (IMAGE_WIDTH / RESIZE_FACTOR * window.innerWidth / 1920 + 8));
					var el = document.getElementById('scenegrid');
					var newPos = Math.max(0, column - el.offsetWidth * 0.5);
					setTimeout(
						() =>
							el.scrollTo({
								top: 0,
								left: newPos,
								behavior: 'auto'
							}),
						100
					);
				}
			},
			[ scenes, highlight ]
		);

        useEffect(
			() => {
				if (highlightGroup >= 0) {
					const column = Math.floor((highlightGroup + 0.6) * (IMAGE_WIDTH / RESIZE_FACTOR * window.innerWidth / 1920 * 0.8 + 8));
					var el = document.getElementById('groupgrid');
					var newPos = Math.max(0, column - el.offsetWidth * 0.5);
					setTimeout(
						() =>
							el.scrollTo({
								top: 0,
								left: newPos,
								behavior: 'smooth'
							}),
						100
					);
				}
			},
			[ highlightGroup ]
		);

		const setDetailedImages = useCallback(
			(image) => {
				scenes.forEach((scene, index) => {
					if (scene[0][0] === image) {
                        if (index !== highlight){
                            setCurrentDisplay(scene[0]);
                            if (!similar) {
                                dispatch(getNextScenes(scene[0], 'full'));
                                changed.current = true;
                                fetchedScenes.current = false;
                            }
                            else {
                                setHighlight(index);
                            }
                        }
					}
				});
			},
			[ similar, scenes, highlight ]
		);

        const setDetailedGroups = useCallback(
			(image) => {
                if (groups){
                    groups.forEach((group, index) => {
                        if (group[0] === image){
                            dispatch(getNextScenes([ image ], 'full'));
                            fetchedScenes.current = false;
                            changed.current = true;
                        }
                    })
                }
			},
			[groups]
		);

		const revert = () => {
			changed.current = false;
			setCurrentDisplay(detailedScene);
            if (!similar){
                dispatch(getNextScenes(detailedScene, 'full'));
            }
            else{
                dispatch(getSimilar(detailedScene[0]))
            }
			fetchedScenes.current = false;
		};

		return (
			<Paper id="popover" elevation={4} className={classes.detailed}>
				<Typography variant="button" className={classes.text}>
					Event images
				</Typography>
				<div id="detailedgrid" wrap="nowrap" className={classes.grid} ref={detailedContainer}>
                    {currentDisplay && currentInfo ? (
						currentDisplay.map((image, index) => (
							<Image
								key={'detailed' + image}
								image={image}
								scale={3}
                                info={currentInfo[index]}
								openEvent={openEvent}
								similar={similar}
							/>
						))
					) : null}
				</div>
					<Button className={classes.button} onClick={revert}>
						Show original
					</Button>

				<div id="scenegrid" className={classes.grid} ref={sceneContainer}>
					{scenes ? (
						scenes.map((scene, index) => (
							<Image
                                info={scene[1]}
								key={scene[0][0]}
								index={index}
								image={scene[0][0]}
								scale={index === highlight ? 1.15 : 0.95}
								onClick={setDetailedImages}
								openEvent={openEvent}
								similar={similar}
							/>
						))
					) : null}
				</div>
                <div id="groupgrid" className={classes.grid} ref={groupContainer}>
					{groups ? (
						groups.map((gr, index) => (
							<Image
                                info={gr[1]}
								key={'group' + gr[0]}
                                index={index}
								image={gr[0]}
                                scale={index === highlightGroup ? 0.95 : 0.75}
								onClick={setDetailedGroups}
								openEvent={openEvent}
								similar={similar}
							/>
						))
					) : null}
				</div>
			</Paper>
		);
	}
EventPopover.whyDidYouRender = true;

export default EventPopover;
