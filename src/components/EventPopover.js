import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Image from '../redux/Image-cnt';
import LazyLoad from 'react-lazy-load';
import { getNextScenes, getGPS, clearNextEvents, getSimilar} from '../redux/actions/search'

const IMAGE_HEIGHT = 768;

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
		prevProps.position === nextProps.position &&
		prevProps.similar === nextProps.similar &&
		isEqual(prevProps.nextScenes, nextProps.nextScenes) &&
		isEqual(prevProps.currentDisplay, nextProps.currentDisplay) &&
		prevProps.highlight === nextProps.highlight &&
		prevProps.highlightGroup === nextProps.highlightGroup &&
		isEqual(prevProps.groups, nextProps.groups) &&
		isEqual(prevProps.nextSceneRespone, nextProps.nextSceneRespone)
	);
};

const EventPopover = ({
		group,
		openEvent,
		closeEvent,
		position,
		similar
	}) => {
		const classes = popStyle();
		const [ nextScenes, setNextScenes ] = useState(null);
		const [ currentDisplay, setCurrentDisplay ] = useState(group);
		const [ groups, setGroups ] = useState(null);
		const [ highlight, setHighlight ] = useState(0);
		const [ highlightGroup, setHighlightGroup ] = useState(0);
		const changed = useRef(false);
		const pressed = useRef(0);
		const date = useRef(null);
		const fetchedScenes = useRef(false);
		const fetchedGroups = useRef(false);
        const dispatch = useDispatch()
        const nextSceneRespone = useSelector(state => state.search.nextSceneRespone)
        const similarResponse = useSelector(state => state.search.similarResponse)
        const groupResponse = useSelector(state => state.search.groupResponse)

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
					date.current = group[0].split('/')[0];
					fetchedScenes.current = false;
					fetchedGroups.current = false;
				} else {
					fetchedScenes.current = false;
					fetchedGroups.current = true;
					if (groups) {
						setGroups(null);
					}
				}
				if (!isEqual(currentDisplay, group)) {
					setCurrentDisplay(group);
				}
				return () => {
					fetchedScenes.current = true;
					fetchedGroups.current = true;
					setGroups(null);
					// console.log('set current display to null', res.data.timeline[index] )
					// setCurrentDisplay(null)
					setNextScenes(null);
					clearNextEvents();
				};
			},
			[ similar, group ]
		);

		useEffect(
			() => {
				if (nextSceneRespone) {
					nextSceneRespone.then((res) => {
						setHighlight(res.data.position);
						setHighlightGroup(res.data.group);
						if (!fetchedScenes.current) {
							console.log('next scene');
							const index = res.data.position;
							if (!similar && !isEqual(res.data.timeline, nextScenes)) {
								setNextScenes(res.data.timeline);
								if (
									changed &&
									res.data.timeline[index] !== undefined &&
									!res.data.timeline[index].includes(currentDisplay[0])
								) {
									// console.log('set current display', res.data.timeline[index] )
									setCurrentDisplay(res.data.timeline[index]);
									dispatch(getGPS(res.data.timeline[index][0]));
								}
							}
						}
						fetchedScenes.current = true;
					});
				}
			},
			[ nextSceneRespone ]
		);

		useEffect(
			() => {
				if (similarResponse) {
					similarResponse.then((res) => {
						console.log('similar');
						if (similar && !fetchedScenes.current && res.data.scenes !== undefined) {
							if (!isEqual(res.data.scenes, nextScenes)) {
								setNextScenes(res.data.scenes);
							}
							if (currentDisplay && !currentDisplay.includes(res.data.scenes[0][0])) {
								setCurrentDisplay(res.data.scenes[0]);
							}
							setHighlight(0);
						}
						fetchedScenes.current = true;
					});
				}
			},
			[ similarResponse ]
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
			[ groupResponse ]
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
			[ nextScenes, highlight ]
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
				nextScenes.forEach((scene, index) => {
					if (scene[0] === image) {
                        if (index !== highlight){
                            setCurrentDisplay(scene);
						if (!similar) {
							dispatch(getNextScenes(scene, 'current', 'full'));
							pressed.current = index;
							changed.current = true;
							fetchedScenes.current = false;
						}
                        else {
                            setHighlight(index)
                        }
                        }
					}
				});
			},
			[ similar, nextScenes ]
		);

		const setDetailedGroups = useCallback(
			(image) => {
				dispatch(getNextScenes([ image ], 'current', 'full'));
				fetchedScenes.current = false;
				changed.current = true;
			},
			[ similar, groups ]
		);

		const revert = () => {
			changed.current = false;
			setCurrentDisplay(group);
            if (!similar){
                dispatch(getNextScenes(group, 'current', 'full'));
            }
            else {
                dispatch(getSimilar(group[0]))
            }

			fetchedScenes.current = false;
		};

		return (
			<Paper id="popover" elevation={4} className={classes.detailed}>
				<Typography variant="button" className={classes.text}>
					Event images
				</Typography>
				<div wrap="nowrap" className={classes.grid} ref={detailedContainer}>
					{currentDisplay ? (
						currentDisplay.map((image, index) => (
							<Image
								key={'detailed' + image}
								image={image}
								scale={3}
								info
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
					{nextScenes ? (
						nextScenes.map((scene, index) => (
							<Image
								key={scene[0]}
								index={index}
								image={scene[0]}
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
								key={'group' + gr}
								image={gr}
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
