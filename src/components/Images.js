import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import ReactLoading from 'react-loading';
import Typography from '@material-ui/core/Typography';
import Thumbnail from './Thumbnail';
import Button from '@material-ui/core/Button';
import { setMap, setQueryBound, setQueryInfo, getImages, setFinishedSearch } from '../redux/actions/search';
import { resetSelection } from '../redux/actions/select';
import { setSaved } from '../redux/actions/save';
import LazyLoad from 'react-lazy-load';

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
		flexDirection: 'column',
		// height: props => props.height,
		// flexGrow: 1,
		backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 50%, transparent 50%)',
		backgroundRepeat: 'repeat',
		backgroundSize: `148px ${2 * IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920 + 140}px`,
		backgroundAttachment: 'local',
        backgroundPosition: `0px 5px`,
		overflow: 'auto',
		position: 'relative'
	},
	text: {
		top: 50,
		paddingTop: 20,
		color: '#CCCCCC'
	},
	dategrid: {
		width: '96%',
		minHeight: IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920,
		overflow: 'auto',
		padding: '35px 10px 35px 10px',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		flexShrink: 0,
		position: 'relative'
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
		minWidth: ({ num }) => IMAGE_WIDTH / RESIZE_FACTOR * window.innerWidth / 1920 * num + 4 * (num - 1),
		minHeight: IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920 ,
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

const ImageGrid = ({ height, maxwidth, open, openEvent, submitQuery }) => {
	const classes = gridStyles({ open, height });
	const dispatch = useDispatch();
	const [ dates, setDates ] = useState([]);
	const { promiseInProgress } = usePromiseTracker();
	const finished = useSelector((state) => state.search.finishedSearch);
	const collection = useSelector((state) => state.search.collection);
	const saveResponse = useSelector((state) => state.save.saveResponse);

	useEffect(
		() => {
			if (collection) {
				trackPromise(
					collection.then((res) => {
						console.log('Got', res.data.size);
						const newDates = res.data.results;
						dispatch(setFinishedSearch(finished + res.data.size));
						var isEqual = require('lodash.isequal');
						if (!isEqual(dates, newDates)) {
							setDates(newDates);
							dispatch(setMap(newDates));
							// setQueryBound(null);
							dispatch(setQueryInfo(res.data.info));
						}
					})
				);
			}
		}, // eslint-disable-next-line
		[ collection ]
	);

	useEffect(
		() => {
			if (saveResponse) {
				trackPromise(
					saveResponse.then((res) => {
						if (res.data.saved) {
							dispatch(setSaved(res.data.saved.map((image) => [ image ])));
							const newDates = res.data.results;
							var isEqual = require('lodash.isequal');
							if (!isEqual(dates, newDates)) {
								dispatch(setDates(newDates));
								dispatch(setMap(newDates));
								dispatch(setQueryBound(res.data.gps_bounds));
								var query = res.data.query;
								if (query.info) {
									dispatch(setQueryInfo(query.info));
									document.getElementById('Before:').value = query.before;
									document.getElementById('Before:-when').value = query.beforewhen;
									document.getElementById('Find:').value = query.current;
									document.getElementById('After:').value = query.after;
									document.getElementById('After:-when').value = query.afterwhen;
								}
							}
						}
					})
				);
			}
		},
		[ saveResponse ]
	);

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
						<LazyLoad debounce={false} height={IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920 + 70} offset={500} key={'dategrid' + index}>
							<div className={classes.dategrid} id={'dategrid' + index}>
								{date.map(
									(scene, id) =>
										scene === null ? (
											<Hidden key={'midhidden' + index + '-' + id} num={1} />
										) : (
											<LazyLoad
												height={IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920}
												offset={500}
												key={scene.current[0]}
                                                debounce={false}
											>
												<Thumbnail
													key={scene.current[0]}
													index={index + '-' + id}
													group={scene.current}
													scale={1}
													position="current"
													openEvent={openEvent}
												/>
											</LazyLoad>
										)
								)}
								{/* <Hidden key={'endhidden'} num={8} /> */}
							</div>
						</LazyLoad>
					))}
					{finished && !(finished % 2000) && finished <= 8000 ? (
						<Button onClick={() => submitQuery(true, finished)}> MORE </Button>
					) : null}
				</div>
			</div>
		);
	}
};

export default ImageGrid;
