import React, { useEffect, useState, Suspense, lazy, memo, PureComponent, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FixedSizeGrid as Grid, shouldComponentUpdate } from 'react-window';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import ReactLoading from 'react-loading';
import Typography from '@material-ui/core/Typography';
const Event = lazy(() => import('./Event'));

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const RESIZE_FACTOR = 6.5;

const gridStyles = makeStyles((theme) => ({
	root: {
		width: (props) => (props.open ? '80%' : '97%'),
		height: `calc(100% - 60px)`,
		zIndex: -1,
		top: 60,
		position: 'fixed',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	grid: {
		width: '100%',
		display: 'flex',
		flexWrap: 'wrap',
		// height: props => props.height,
		// flexGrow: 1,
		justifyContent: 'center',
		backgroundImage: 'linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.15) 50%)',
		backgroundRepeat: 'repeat',
		backgroundSize: `100px ${IMAGE_HEIGHT / RESIZE_FACTOR * 4}px`,
		backgroundAttachment: 'local',
		overflow: 'auto'
	},
	text: {
		top: 50,
		paddingTop: 20,
		color: '#CCCCCC'
	}
}));

const LoadingIndicator = (props) => {
	const { promiseInProgress } = usePromiseTracker();

	return promiseInProgress && <ReactLoading type={'bubbles'} color={'white'} />;
};

const ImageGrid = ({
	height,
	maxwidth,
	open,
	collection,
	setScene,
	markersSelected,
	currentMarker,
	setQueryBound,
	resetSelection,
	setQueryInfo
}) => {
	const classes = gridStyles({ open, height });
	const [ scenes, setScenes ] = useState([]);
	const [ bottom, setBottom ] = useState(false);
	const { promiseInProgress } = usePromiseTracker();
	const highlightRef = React.useRef([]);
	const [ maxItemsPerRow, setMaxItemsPerRow ] = useState(open ? 3 : 4);
	const [ rendered, setRendered ] = useState(0);

	const setRef = useCallback((index) => {
		if (index !== null) {
			highlightRef.current.push(index);
		}
	}, []);

	useEffect(
		() => {
			const newMaxItems = open ? 3 : 4;
			if (newMaxItems !== maxItemsPerRow) {
				setMaxItemsPerRow(newMaxItems);
			}
		},
		[ open ]
	);

	useEffect(
		() => {
			if (rendered < scenes.length) {
				if (rendered < currentMarker) {
					setRendered(currentMarker + 12);
				} else {
					setTimeout(() => setRendered(rendered + 2 * maxItemsPerRow, 500));
				}
			}
		},
		[ rendered, currentMarker ]
	);

	useEffect(
		() => {
			trackPromise(
				collection.then((res) => {
					console.log('enter promise');
					const newScenes = res.data.results;
					var isEqual = require('lodash.isequal');
					if (!isEqual(scenes, newScenes)) {
						setScenes(newScenes);
						setScene(newScenes);
						setRendered(10);
						setBottom(newScenes.length / maxItemsPerRow < 4);
						setQueryBound(null);
						setQueryInfo(res.data.info);
						// highlightRef.current = []
					}
				})
			);
			// eslint-disable-next-line
		},
		[ collection ]
	);

	useEffect(
		() => {
			if (currentMarker >= 0 && markersSelected.length > 0) {
				const newIndex = markersSelected[currentMarker];
				const newRow = Math.floor(newIndex / maxItemsPerRow);
				const imageRowX = newRow * (IMAGE_HEIGHT / RESIZE_FACTOR * 2) + IMAGE_HEIGHT / RESIZE_FACTOR * 2 / 2;
				document.getElementById('grid').scrollTo({
					top: Math.max(0, imageRowX - height / 2 + 1 + IMAGE_HEIGHT / RESIZE_FACTOR * 2 * 1.5),
					left: 0,
					behavior: 'smooth'
				});
                window.addEventListener('mousedown', clickOutside);
		        window.addEventListener('touchstart', clickOutside);
			}
            return () => {
                window.removeEventListener('mousedown', clickOutside);
                window.removeEventListener('touchstart', clickOutside);
            }
			// eslint-disable-next-line
		},
		[ markersSelected, currentMarker ]
	);

	const clickOutside = (event) => {
        if (
            highlightRef.current.includes(event.target) ||
            document.getElementById('map').contains(event.target)
        ) {
            return;
        }
		resetSelection();
		highlightRef.current = [];
        window.removeEventListener('mousedown', clickOutside);
		window.removeEventListener('touchstart', clickOutside);
	};

	if (promiseInProgress) {
		return (
			<div className={classes.root}>
				<LoadingIndicator />
			</div>
		);
	} else {
		return (
			<div className={classes.root}>
				<Typography variant="subtitle1" className={classes.text}>
					Click an event thumbnail to view all images.
				</Typography>
				<div id="grid" className={classes.grid}>
					{scenes.map((scene, index) => (
						<Suspense
							key={scene.current[0]}
							fallback={<div key={scene.current[0]} className={classes.gridCell} />}
						>
							{index < rendered && (
								<Event key={scene.current[0]} setRef={setRef} index={index} scene={scene} />
							)}
						</Suspense>
					))}
				</div>
			</div>
		);
	}
};

export default ImageGrid;
