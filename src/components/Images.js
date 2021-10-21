import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import ReactLoading from 'react-loading';
import LinearProgress from '@material-ui/core/LinearProgress';
import Event from './Event';
import Button from '@material-ui/core/Button';
import { setMap, setQueryBound, setQueryInfo, setFinishedSearch, More } from '../redux/actions/search';
import { setSaved } from '../redux/actions/save';
import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip'

const IMAGE_HEIGHT = 768;
const IMAGE_WIDTH = 1024;
const RESIZE_FACTOR = 6;

const gridStyles = makeStyles((theme) => ({
	root: {
		width: (props) => (props.open ? '80%' : '97%'),
		height: `calc(100% - 90px)`,
		top: 90,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	grid: {
        width: "100%",
        height: `calc(100% - 90px)`,
        position: 'absolute',
        top: 90,
		display: 'flex',
		flexDirection: 'row',
        flexWrap: 'wrap',
		// height: props => props.height,
		// backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 50%, transparent 50%)',
		// backgroundRepeat: 'repeat',
		// backgroundSize: `148px ${2 * IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920 + 140}px`,
		// backgroundAttachment: 'local',
        // backgroundPosition: `0px 0px`,
		overflow: 'auto'
		// position: 'relative'
	},
	text: {
		top: 50,
		paddingTop: 20,
		color: '#CCCCCC'
	},
	popover: {
		width: '80%',
		color: '#272727'
	},
    button: {
        width: '75%',
        padding: 10,
        height: 32,
        flexShrink: 0
    }
}));

const LoadingIndicator = (props) => {
	const { promiseInProgress } = usePromiseTracker();

    return promiseInProgress && <LinearProgress style={{width: "75%"}}/>;
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
    const [ scores, setScores ] = useState([]);
	const { promiseInProgress } = usePromiseTracker();
    const [ more , setMore ] = useState(false);
	const finished = useSelector((state) => state.search.finishedSearch);
	const collection = useSelector((state) => state.search.collection);
	const saveResponse = useSelector((state) => state.save.saveResponse);
    const [loaded, setLoaded] = useState(0);

	useEffect(
		() => {
			if (collection) {
				trackPromise(
					collection.then((res) => {
                        if (res.data.more){
                            console.log("huh");
                            console.log(res.data.results)
                            const newDates = [...dates, ...res.data.results];
                            const newScores = [...scores, ...res.data.scores];
                            setDates(newDates);
                            setScores(newScores);
                            dispatch(setMap(newDates));
                            setLoaded(loaded + Math.min(30, newDates.length))
                            setMore(false)
                        }
                        else {
                            console.log('Got', res.data.size);
                            const newDates = res.data.results;
                            dispatch(setFinishedSearch(finished + res.data.size));
                            dispatch(setQueryInfo(res.data.info));
                            var isEqual = require('lodash.isequal');
                            if (!isEqual(dates, newDates)) {
                                setDates(newDates);
                                setScores(res.data.scores);
                                dispatch(setMap(newDates));
                                setLoaded(Math.min(30, newDates.length))
                            }
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
		[ saveResponse, dates, dispatch ]
	);

    const moreButton = () => {
        console.log(loaded, dates.length)
        if (loaded < dates.length){
            setLoaded(loaded + 30)
        }
        else {
            setMore(true)
            dispatch(More())
        }
    }

	if (promiseInProgress && !more) {
		return (
			<div className={classes.grid}>
				<LoadingIndicator />
			</div>
		);
	} else {
		return (
            <div id="grid" className={classes.grid}>
					{dates.map((scene, id) => (
                                id < loaded? scene === null ?
                                (
                                    <Hidden key={id} num={1} />
                                ) :
                                (
                                        <Event
                                            key={scene.current[0]}
                                            index={id}
                                            group={scene}
                                            openEvent={openEvent}
                                            score={scores? scores[id] : ""}
                                        />
                                ): null))}
                    <Button className={classes.button} onClick={moreButton}> MORE </Button>
			</div>
        );
	}
};

export default ImageGrid;
