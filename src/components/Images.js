import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import ReactLoading from 'react-loading';
import Typography from '@material-ui/core/Typography';
import Thumbnail from '../redux/Thumbnail-cnt';

const IMAGE_HEIGHT = 768;
const IMAGE_WIDTH = 1024;
const RESIZE_FACTOR = 6;

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
	},
	dategrid: {
		width: '96%',
		overflow: 'auto',
		padding: 10,
		marginTop: 50,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row'
	},
	popover: {
		width: '80%',
		color: '#272727'
	}
}));

const LoadingIndicator = (props) => {
	const { promiseInProgress } = usePromiseTracker();

	return promiseInProgress && <ReactLoading type={'bubbles'} color={'white'} />;
};

const hiddenStyles = makeStyles((theme) => ({
	hidden: {
		minWidth: ({ num }) => IMAGE_WIDTH / RESIZE_FACTOR * num + 4 * (num - 1),
		minHeight: IMAGE_HEIGHT / RESIZE_FACTOR,
		marginLeft: 4,
		marginRight: 4,
		position: 'relative',
		flexShrink: 0,
		display: 'block',
		visibility: 'hidden'
	}
}));
const Hidden = ({ num }) => {
	const classes = hiddenStyles({ num });
	return <div className={classes.hidden}> Hidden </div>;
};

const ImageGrid = ({
	height,
	maxwidth,
	open,
	collection,
	setMap,
	markersSelected,
	currentMarker,
	setQueryBound,
	resetSelection,
	setQueryInfo,
	openEvent
}) => {
	const classes = gridStyles({ open, height });
	const [ dates, setDates ] = useState([]);
	const { promiseInProgress } = usePromiseTracker();
	const highlightRef = React.useRef([]);
	const [ maxItemsPerRow, setMaxItemsPerRow ] = useState(open ? 3 : 4);
	const [ rendered, setRendered ] = useState(0);

	const setRef = useCallback((index) => {
		if (index !== null) {
			highlightRef.current.push(index);
		} // eslint-disable-next-line
	}, []);

	useEffect(
		() => {
			const newMaxItems = open ? 3 : 4;
			if (newMaxItems !== maxItemsPerRow) {
				setMaxItemsPerRow(newMaxItems);
			}
		}, // eslint-disable-next-line
		[ open ]
	);

	useEffect(
		() => {
			if (markersSelected[currentMarker] !== undefined) {
				var [ newIndex, newId ] = markersSelected[currentMarker].split('-');
			} else {
				newIndex = -1;
			}
			if (rendered < dates.length) {
				if (rendered < newIndex) {
					setRendered(newIndex + 4);
				} else {
					setTimeout(() => setRendered(Math.max(rendered + 4, dates.length), 500));
				}
			}
		}, // eslint-disable-next-line
		[ rendered, currentMarker ]
	);

	// useEffect(() => {
	// 	dates.forEach((date, index) => {
	// 		const column = Math.floor((date[1] + 4 / 3) * (IMAGE_WIDTH / RESIZE_FACTOR + 8));
	// 		var el = document.getElementById('dategrid' + index);

	// 		var newPos = Math.max(0, column);
	// 		if (el) {
	// 			setTimeout(
	// 				() =>
	// 					el.scrollTo({
	// 						top: 0,
	// 						left: newPos
	// 					}),
	// 				100
	// 			);
	// 		}
	// 	});
	// });

	useEffect(
		() => {
			if (collection) {
				trackPromise(
					collection.then((res) => {
						const newDates = res.data.results;
						var isEqual = require('lodash.isequal');
						if (!isEqual(dates, newDates)) {
							setDates(newDates);
							setMap(newDates);
							setRendered(1);
							setQueryBound(null);
							setQueryInfo(res.data.info);
							// highlightRef.current = []
						}
					})
				);
			}
		}, // eslint-disable-next-line
		[ collection ]
	);

	useEffect(
		() => {
			if (currentMarker >= 0 && markersSelected.length > 0) {
				var [ newIndex, newId ] = markersSelected[currentMarker].split('-');
				const imageRowX = newIndex * (IMAGE_HEIGHT / RESIZE_FACTOR + 4 + 20);
				var el = document.getElementById('grid');
				if (el) {
					el.scrollTo({
						top: imageRowX,
						left: 0,
						behavior: 'smooth'
					});
				}
				document.getElementById('grid');

				const column = newId * (IMAGE_WIDTH / RESIZE_FACTOR + 8);
				el = document.getElementById('dategrid' + newIndex);
				var newPos = Math.max(0, column);
				if (el) {
					el.scrollTo({
						top: 0,
						left: newPos,
						behavior: 'smooth'
					});
				}

				window.addEventListener('mousedown', clickOutside);
				window.addEventListener('touchstart', clickOutside);
			}
			return () => {
				window.removeEventListener('mousedown', clickOutside);
				window.removeEventListener('touchstart', clickOutside);
			};
		}, // eslint-disable-next-line
		[ markersSelected, currentMarker ]
	);

	const clickOutside = (event) => {
		if (highlightRef.current.includes(event.target) || document.getElementById('map').contains(event.target)) {
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
					{dates.slice(0, rendered).map((date, index) => (
						<div className={classes.dategrid} id={'dategrid' + index} key={'dategrid' + index}>
							{date.map(
								(scene, id) =>
									scene === null ? (
										<Hidden key={'midhidden' + index + '-' + id} num={1} />
									) : (
										<Thumbnail
											key={scene.current[0]}
											setRef={setRef}
											index={index + '-' + id}
											group={scene.current}
											scale={1}
											position="current"
											openEvent={openEvent}
											highlight={markersSelected.includes(index + '-' + id)}
										/>
									)
							)}
							<Hidden key={'endhidden'} num={8} />
						</div>
					))}
				</div>
			</div>
		);
	}
};

export default ImageGrid;
