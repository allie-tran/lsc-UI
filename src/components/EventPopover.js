import React, { useEffect, useState, Suspense, lazy, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
const Image = lazy(() => import('../redux/Image-cnt'));

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
        position: 'relative'
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

const EventPopover = ({
	group,
	closeEvent,
	getNextScenes,
	nextSceneRespone,
	getSimilar,
	similarResponse,
	position,
	similar,
    getGroups,
    groupResponse
}) => {
	const classes = popStyle();
	const [ nextScenes, setNextScenes ] = useState(null);
	const [ currentDisplay, setCurrentDisplay ] = useState(group);
    const [ date, setDate ] = useState(null)
    const [ groups, setGroups ] = useState(null)
	const [ highlight, setHighlight ] = useState(0);
    const [ highlightGroup, setHighlightGroup ] = useState(0);
    const [ changed, setChanged ] = useState(false)
	const pressed = useRef(0);
	const listener = (e) => {
		if (e.key === 'Escape') {
			closeEvent();
		}
	};
	useEffect(() => {
		window.addEventListener('keydown', listener);
		getNextScenes(currentDisplay, 'current', 'full');
        setDate(currentDisplay[0].split('/')[0])
        getGroups(currentDisplay[0].split('/')[0])
		return () => window.removeEventListener('keydown', listener);
	}, []);

	useEffect(
		() => {
			nextSceneRespone.then((res) => {
				console.log(res.data);
				const index = res.data.position;
				if (!isEqual(res.data.timeline, nextScenes)) {
					setNextScenes(res.data.timeline);
				}
				setHighlight(index);
				if (changed && res.data.timeline[index] !== undefined && !isEqual(res.data.timeline[index], currentDisplay)) {
					setCurrentDisplay(res.data.timeline[index]);
				}
                setHighlightGroup(res.data.group)
			});
		},
		[ nextSceneRespone ]
	);

    useEffect(
		() => {
			groupResponse.then((res) => {
				console.log(res.data);
				if (!isEqual(res.data.timeline, groups)) {
					setGroups(res.data.timeline);
				}
			});
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
							behavior: (highlight - pressed.current) * (el.scrollLeft - newPos) >= 0 ? 'smooth' : 'auto'
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
	)

	useEffect(
		() => {
			// console.log("Function changed")
		},
		[ closeEvent ]
	);

	useEffect(
		() => {
			if (similar) {
				getSimilar(group[0]);
			}
		}, // eslint-disable-next-line
		[ similar ]
	);

	const setDetailedImages = useCallback((images, index) => {
		setCurrentDisplay(images);
		getNextScenes(images, 'current', 'full');
		pressed.current = index;
        setChanged(true)
	}, []);

    const setDetailedGroups = useCallback((image, index) => {
		getNextScenes([image], 'current', 'full')
        setChanged(true)
	}, []);

	const ButtonPress = (type) => {
		getNextScenes(currentDisplay, type, highlight);
	};

	useEffect(
		() => {
			similarResponse.then((res) => {
				if (res.data.scenes !== undefined) {
					setNextScenes(res.data.scenes);
				}
			});
		},
		[ similarResponse ]
	);

    const revert = () => {
        setChanged(false);
        setCurrentDisplay(group)
        getNextScenes(group, 'current', 'full');
    }

	return (
		<Paper id="popover" elevation={4} className={classes.detailed}>
			<Typography variant="button" className={classes.text}>
				Event images
			</Typography>
			<Grid wrap="nowrap" container spacing={2} className={classes.grid}>
				{currentDisplay.map((image, index) => (
					<Grid key={image} item>
						<Suspense fallback={<div key={image} />}>
							<Image key={image} image={image} scale={3 * window.innerWidth / 1920} info />
						</Suspense>
					</Grid>
				))}
			</Grid>
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
			<Grid id="scenegrid" wrap="nowrap" alignItems="center" container spacing={2} className={classes.grid}>
				{nextScenes !== null ? (
					nextScenes.map((scene, index) => (
						<Grid key={index} item id={index}>
							<Image
								key={index}
								index={index}
								image={scene[0]}
								scene={scene}
								scale={index === highlight ? 1.2 : 1}
								onClick={setDetailedImages}
							/>
						</Grid>
					))
				) : null}
			</Grid>
            <Grid id="groupgrid" wrap="nowrap" alignItems="center" container spacing={2} className={classes.grid}>
				{groups !== null ? (
					groups.map((gr, index) => (
						<Grid key={index} item id={index}>
							<Image
								key={index}
								index={index}
                                scene={gr}
								image={gr}
								scale={index === highlightGroup ? 1 : 0.8}
								onClick={setDetailedGroups}
							/>
						</Grid>
					))
				) : null}
			</Grid>
		</Paper>
	);
};
EventPopover.whyDidYouRender = true;

export default EventPopover;
