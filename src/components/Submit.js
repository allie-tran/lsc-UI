import React, { useState, useEffect } from 'react';
import configData from "../config.json";

import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import axios from 'axios';
import { nextQuery, exportSaved, disable, setTimer } from '../redux/actions/submit';

// var FileSaver = require('file-saver');

const useStyles = makeStyles((theme) => ({
	section: {
		position: 'fixed',
		left: '80%',
		width: '20%',
		height: 50,
		zIndex: 5,
		bottom: '50%',
		margin: 0,
		backgroundColor: '#272727',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	button: {
		margin: 'auto'
	},
	timer: {
		margin: 'auto',
		color: '#FF6584'
	}
}));

var timeLeft = [ ...Array(10).keys() ].map(() => 300);

const SubmitSection = () => {
	const classes = useStyles();
	const [ isActive, setIsActive ] = useState(false);
	const dispatch = useDispatch();
	const time = useSelector((state) => state.save.time);
	const currentQuery = useSelector((state) => state.save.currentQuery);
	const timerRunning = useSelector((state) => state.save.timerRunning);

	useEffect(() => {
		axios.post(configData.BACKEND_URL + '/restart');
	}, []);

	useEffect(
		() => {
			let interval = null;
			if (isActive) {
				interval = setInterval(() => {
					dispatch(setTimer(time - 1));
					if (time <= 0) {
						setIsActive(false);
					}
				}, 1000);
			}

			return () => clearInterval(interval);
		},
		[ time, isActive ]
	);

	const getNextQuery = () => {
		timeLeft[currentQuery - 1] = time;
		dispatch(nextQuery());
	};

	const toggle = () => {
		setIsActive(!isActive);
	};

	useEffect(
		() => {
            // dispatch(setTimer(time - 1));
			// setSeconds(timeLeft[currentQuery - 1]);
			return () => setIsActive(false);
		},
		[ currentQuery ]
	);

	useEffect(
		() => {
			setIsActive(timerRunning);
		},
		[ timerRunning ]
	);

	const exportCSV = () => {
		// var blob = new Blob([ saved ], { type: 'text/plain;charset=utf-8' });
		// FileSaver.saveAs(blob, 'result' + currentQuery + '.csv');
		dispatch(exportSaved());
		axios.post('configData.BACKEND_URLsubmit?time=' + time + '&query_id=' + currentQuery);
	};
	return (
    <div className={classes.section}>
      <Button onClick={getNextQuery} className={classes.button}>
        Next Query {currentQuery}
      </Button>
      className={classes.answer}
      <Button onClick={exportCSV} className={classes.button}>
        Export
      </Button>
      <Button disabled={time < 0} onClick={toggle} className={classes.timer}>
        {time}s
      </Button>
    </div>
  );
};

export default SubmitSection;
