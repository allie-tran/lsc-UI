import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';

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

// const areEqual = (prevProps, nextProps) => {
// 	return (
// 		prevProps.currentQuery === nextProps.currentQuery &&
// 		prevProps.timerRunning === nextProps.timerRunning &&
// 		prevProps.finished[prevProps.currentQuery] === nextProps.finished[nextProps.currentQuery]
// 	);
// };

var timeLeft = [ ...Array(10).keys() ].map(() => 300);

const SubmitSection = ({
	finished,
	currentQuery,
	saved,
	timer,
	stopTimer,
	nextQuery,
	exportSaved,
	timerRunning,
	disable
}) => {
	const classes = useStyles();
	const [ seconds, setSeconds ] = useState(300);
	const [ isActive, setIsActive ] = useState(false);
	useEffect(() => {
		axios.post('http://localhost:7999/api/restart');
	}, []);

	useEffect(
		() => {
			let interval = null;
			if (isActive) {
				interval = setInterval(() => {
					setSeconds((seconds) => {
						if (seconds <= 0) {
							disable();
							setIsActive(false);
						}
						return seconds - 1;
					});
				}, 1000);
			}

			return () => clearInterval(interval);
		},
		[ seconds, isActive, disable ]
	);

	const getNextQuery = () => {
		timeLeft[currentQuery - 1] = seconds;
		nextQuery();
	};

	const toggle = () => {
		setIsActive(!isActive);
	};

	useEffect(
		() => {
			setSeconds(timeLeft[currentQuery - 1]);
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
		exportSaved();
		axios.post('http://localhost:7999/api/submit?time='+seconds+'&query_id='+currentQuery);
	};
	return (
		<div className={classes.section}>
			<Button onClick={getNextQuery} className={classes.button}>
				Next Query {currentQuery}
			</Button>
			<Button onClick={exportCSV} className={classes.button}>
				Export
			</Button>
			<Button disabled={finished} onClick={toggle} className={classes.timer}>
				{seconds}s
			</Button>
		</div>
	);
};

export default SubmitSection;
