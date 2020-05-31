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
		width: '99%',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#272727',
		flexDirection: 'column',
		padding: 10,
	},
	grid: {
        width: "98%",
		overflow: 'auto',
		padding: 10
	},
	text: {
		color: '#F4CDD2'
	},
    button : {
        marginRight: 10,
        marginLeft: 10
    },
    buttonline: {
        width: '100%',
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
	similar
}) => {
	const classes = popStyle();
	const [ nextScenes, setNextScenes ] = useState(null);
	const [ currentDisplay, setCurrentDisplay ] = useState(group);
	const [ highlight, setHighlight ] = useState(0);
	const pressed = useRef(0)
	const listener = (e) => {
		if (e.key === 'Escape') {
			closeEvent();
		}
	};
	useEffect(() => {
		window.addEventListener('keydown', listener);
		getNextScenes(currentDisplay, 'current', 'full');
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
			});
		},
		[ nextSceneRespone ]
	);

	useEffect(
		() => {
			if (highlight >= 0) {
				const column = Math.floor(highlight * (IMAGE_WIDTH / RESIZE_FACTOR + 8));
				var el = document.getElementById('scenegrid');
				var newPos = Math.max(0, column - window.innerWidth * 0.42);
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

	const setDetailedImages = useCallback(
		(images, index) => {
			setCurrentDisplay(images);
            getNextScenes(images, 'current', 'full')
            pressed.current = index;
		},
		[]
	);

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

	return (
		<Paper elevation={4} className={classes.detailed}>
			<Typography variant="button" className={classes.text}>
				Event images
			</Typography>
			<Grid wrap="nowrap" container spacing={2} className={classes.grid}>
				{currentDisplay.map((image, index) => (
					<Grid key={image} item>
						<Suspense fallback={<div key={image} />}>
							<Image key={image} image={image} scale={4 * window.innerWidth / 1920} info />
						</Suspense>
					</Grid>
				))}
			</Grid>
            <div className={classes.buttonline}>
                <Button className={classes.button} onClick={() => setDetailedImages(nextScenes[0], 0)}> Previous event </Button>
                <Button className={classes.button} onClick={() => setDetailedImages(nextScenes.slice(-1)[0], nextScenes.length - 1)}> Next event </Button>
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
		</Paper>
	);
};
EventPopover.whyDidYouRender = true;

export default EventPopover;
