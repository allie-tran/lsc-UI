import React, { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import ReactLoading from 'react-loading';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const Thumbnail = lazy(() => import('../redux/Thumbnail-cnt'));
const FallBack = () => <div>Loading...</div>;
const EventPopover = lazy(() => import('../redux/EventPopover-cnt'));

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
		marginTop: 50
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

const hiddenGroup = [ 'Hidden' ];
const Hidden = ({ position }) =>
	[ ...Array(5).keys() ].map((index) => (
		<Grid item key={position + 'hidden' + index}>
			<Thumbnail key="Hidden" hidden group={hiddenGroup} scale={1} />
		</Grid>
	));

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
	clearNextEvents
}) => {
	const classes = gridStyles({ open, height });
	const [ dates, setDates ] = useState([]);
	const { promiseInProgress } = usePromiseTracker();
	const highlightRef = React.useRef([]);
	const [ maxItemsPerRow, setMaxItemsPerRow ] = useState(open ? 3 : 4);
	const [ rendered, setRendered ] = useState(0);
	const [ openPopover, setOpenPopover ] = useState(false);
	const [ similar, setSimilar ] = useState(false);
	const [ group, setGroup ] = useState([]);
	const [ position, setPosition ] = useState(false);

	const openEvent = useCallback((event, similar, group, position) => {
		setSimilar(similar);
		setGroup(group);
		setPosition(position);
		setOpenPopover(true); // eslint-disable-next-line
	}, []);

	const closeEvent = useCallback(() => {
		setOpenPopover(false);
		clearNextEvents();
		setSimilar(false); // eslint-disable-next-line
	}, []);

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
            if ( markersSelected[currentMarker] !== undefined){
                var [ newIndex, newId ] = markersSelected[currentMarker].split('-');
            }
            else {
                newIndex = -1
            }

			if (rendered < dates.length) {
				if (rendered < newIndex) {
					setRendered(newIndex + 4);
				} else {
					setTimeout(() => setRendered(rendered + 4, 500));
				}
			}
		}, // eslint-disable-next-line
		[ rendered, currentMarker ]
	);

	useEffect(() => {
		dates.forEach((date, index) => {
			const column = Math.floor((date[1] + 4 / 3) * (IMAGE_WIDTH / RESIZE_FACTOR + 8));
			var el = document.getElementById('dategrid' + index);

			var newPos = Math.max(0, column);
			if (el) {
				setTimeout(
					() =>
						el.scrollTo({
							top: 0,
							left: newPos
						}),
					100
				);
			}
		});
	});

	useEffect(
		() => {
			trackPromise(
				collection.then((res) => {
					const newDates = res.data.results;
					var isEqual = require('lodash.isequal');
					if (!isEqual(dates, newDates)) {
						setDates(newDates);
						setMap(newDates);
						setRendered(10);
						setQueryBound(null);
						setQueryInfo(res.data.info);
						// highlightRef.current = []
					}
				})
			);
		}, // eslint-disable-next-line
		[ collection ]
	);

	useEffect(
		() => {
			if (currentMarker >= 0 && markersSelected.length > 0) {
                console.log(markersSelected[currentMarker])
				var [ newIndex, newId ] = markersSelected[currentMarker].split('-');
				const imageRowX = newIndex * (IMAGE_HEIGHT / RESIZE_FACTOR + 4 + 20);
				var el = document.getElementById('grid');
				if (el) {
							el.scrollTo({
								top: imageRowX,
								left: 0,
								behavior: 'smooth'
							})
				}
				document.getElementById('grid');

				const column = Math.floor((newId + 4 / 3) * (IMAGE_WIDTH / RESIZE_FACTOR + 8));
				el = document.getElementById('dategrid' + newIndex);
				var newPos = Math.max(0, column);
				if (el) {
							el.scrollTo({
								top: 0,
								left: newPos,
                                behavior: 'smooth'
							})
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
					{dates.map((date, index) => (
						<Grid
							className={classes.dategrid}
							id={'dategrid' + index}
							key={'dategrid' + index}
							wrap="nowrap"
							alignItems="center"
							container
							spacing={1}
						>
							<Hidden position="start" />
							{date[0].map((scene, id) => (
								<Grid key={index + '-' + id} item>
									<Suspense
										key={scene.current[0]}
										fallback={<div key={scene.current[0]} className={classes.gridCell} />}
									>
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
										{/* <Event
											key={scene.current[0]}
											setRef={setRef}
											index={index + '-' + id}
											scene={scene}
											openEvent={openEvent}
										/> */}
									</Suspense>
								</Grid>
							))}
							<Hidden position="end" />
						</Grid>
					))}
				</div>
				<Popover
					open={openPopover}
					anchorReference="anchorPosition"
					anchorPosition={{ top: 0, left: 0 }}
					anchorOrigin={{
						vertical: 'center',
						horizontal: 'center'
					}}
					transformOrigin={{
						vertical: 'center',
						horizontal: 'center'
					}}
					onBackdropClick={closeEvent}
					onEscapeKeyDown={closeEvent}
					className={classes.popover}
				>
					<Suspense fallback={<FallBack />}>
						{openPopover && (
							<EventPopover closeEvent={closeEvent} group={group} position={position} similar={similar} />
						)}
					</Suspense>
				</Popover>
			</div>
		);
	}
};

export default ImageGrid;
