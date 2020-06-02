import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Image from '../redux/Image-cnt';

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
		overflow: 'auto',
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
		marginLeft: 10
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
	return isEqual(prevProps, nextProps);
};

const EventPopover = memo(
	({
		group,
		openEvent,
		closeEvent,
		getNextScenes,
		nextSceneRespone,
		getSimilar,
		similarResponse,
		position,
		similar,
		getGroups,
		groupResponse,
		getGPS
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
		const listener = (e) => {
			if (e.key === 'Escape') {
				closeEvent();
			}
		};
		useEffect(
			() => {
				console.log('rerendering', similar);
				window.addEventListener('keydown', listener);
				if (!similar) {
					date.current = currentDisplay[0].split('/')[0];
					getGroups(date.current);
					getNextScenes(currentDisplay, 'current', 'full');
					fetchedScenes.current = false;
					fetchedGroups.current = false;
				} else {
					fetchedScenes.current = false;
				}
				return () => {
					window.removeEventListener('keydown', listener);
				};
			},
			[ similar ]
		);

		useEffect(
			() => {
				if (nextSceneRespone) {
					nextSceneRespone.then((res) => {
						setHighlight(res.data.position);
						setHighlightGroup(res.data.group);
						if (!fetchedScenes.current) {
							console.log(res.data);
							const index = res.data.position;
							if (!isEqual(res.data.timeline, nextScenes)) {
								setNextScenes(res.data.timeline);
								if (
									changed &&
									res.data.timeline[index] !== undefined &&
									!isEqual(res.data.timeline[index], currentDisplay)
								) {
									setCurrentDisplay(res.data.timeline[index]);
									getGPS(currentDisplay[0]);
								}
								fetchedScenes.current = true;
							}
						}
					});
				}
			},
			[ nextSceneRespone ]
		);

		useEffect(
			() => {
				if (groupResponse) {
					groupResponse.then((res) => {
						if (!fetchedGroups.current) {
							console.log(res.data);
							if (!isEqual(res.data.timeline, groups) && res.data.timeline) {
								setGroups(res.data.timeline);
								fetchedGroups.current = true;
							}
						}
					});
				}
			},
			[ groupResponse ]
		);

		useEffect(
			() => {
				if (highlight >= 0) {
					const column = Math.floor((highlight + 0.6) * (IMAGE_WIDTH / RESIZE_FACTOR + 8));
					var el = document.getElementById('scenegrid');
					var newPos = Math.max(0, column - 1524 * 0.5);
					setTimeout(
						() =>
							el.scrollTo({
								top: 0,
								left: newPos,
								behavior:
									'auto'
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
					const column = Math.floor((highlightGroup + 0.6) * (IMAGE_WIDTH / RESIZE_FACTOR * 0.8 + 8));
					var el = document.getElementById('groupgrid');
					var newPos = Math.max(0, column - 1524 * 0.5);
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
			(index) => {
				setCurrentDisplay(nextScenes[index]);
				if (!similar) {
					getNextScenes(nextScenes[index], 'current', 'full');
					pressed.current = index;
					changed.current = true;
					fetchedScenes.current = false;
				}
			},
			[ similar, nextScenes ]
		);

		const setDetailedGroups = useCallback((index) => {
			getNextScenes([groups[index]], 'current', 'full');
			fetchedScenes.current = false;
			changed.current = true;
		}, [similar, groups]);

		const ButtonPress = (type) => {
			getNextScenes(currentDisplay, type, highlight);
			fetchedScenes.current = false;
		};

		useEffect(
			() => {
				if (similarResponse) {
					similarResponse.then((res) => {
						if (!fetchedScenes.current && res.data.scenes !== undefined) {
							if (!isEqual(res.data.scenes, nextScenes)) {
								setNextScenes(res.data.scenes);
								fetchedScenes.current = false;
							}
							if (!currentDisplay.includes(res.data.scenes[0][0])) {
								setCurrentDisplay(res.data.scenes[0]);
							}
							setHighlight(0);
							fetchedScenes.current = true;
						}
					});
				}
			},
			[ similarResponse ]
		);

		const revert = () => {
			changed.current = false;
			setCurrentDisplay(group);
			getNextScenes(group, 'current', 'full');
			fetchedScenes.current = false;
		};

		return (
			<Paper id="popover" elevation={4} className={classes.detailed}>
				<Typography variant="button" className={classes.text}>
					Event images
				</Typography>
				<div wrap="nowrap" className={classes.grid}>
					{currentDisplay.map((image, index) => (
						<Image
							key={'detailed' + image}
							image={image}
							scale={3 * window.innerWidth / 1920}
							info
							openEvent={openEvent}
							similar={similar}
						/>
					))}
				</div>
				<div className={classes.buttonline}>
					<Button className={classes.button} onClick={() => ButtonPress('before')}>
						Previous event
					</Button>
					<Button className={classes.button} onClick={revert}>
						Show original
					</Button>
					<Button className={classes.button} onClick={() => ButtonPress('after')}>
						Next event
					</Button>
				</div>
				<div id="scenegrid" className={classes.grid}>
					{nextScenes !== null ? (
						nextScenes.map((scene, index) => (
							<Image
								key={'scene' + scene[0]}
								index={index}
								image={scene[0]}
								scale={index === highlight ? 1.2 : 1}
								onClick={setDetailedImages}
								openEvent={openEvent}
								similar={similar}
							/>
						))
					) : null}
				</div>
				<div id="groupgrid" className={classes.grid}>
					{groups !== null ? (
						groups.map((gr, index) => (
							<Image
								key={'group' + gr}
								index={index}
								image={gr}
								scale={index === highlightGroup ? 1 : 0.8}
								onClick={setDetailedGroups}
								openEvent={openEvent}
								similar={similar}
							/>
						))
					) : null}
				</div>
			</Paper>
		);
	},
	areEqual
);
EventPopover.whyDidYouRender = true;

export default EventPopover;
