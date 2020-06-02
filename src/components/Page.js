import React, { useState, useCallback } from 'react';
import Map from '../redux/Map-cnt';
import Bar from '../redux/AppBar-cnt';
import SaveSection from '../redux/Save-cnt';
import Submit from '../redux/Submit-cnt';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

import EventPopover from '../redux/EventPopover-cnt';
import ImageGrid from '../redux/Images-cnt';


const popoverStyles = makeStyles((theme) => ({
	popover: {
		width: '80%',
		color: '#272727'
	}
}));

var isEqual = require('lodash.isequal');

const Page = ({ getSimilar }) => {
	const WIDTH = 1920; // 1920, 1443
	const HEIGHT = 945; // 945, 700
	const classes = popoverStyles();
	// const [ open, setOpen ] = useState(true); // closed, open
	const [ openPopover, setOpenPopover ] = useState(false);
	const [ similar, setSimilar ] = useState(false);
	const [ group, setGroup ] = useState([]);
	const [ position, setPosition ] = useState(false);

	const openEvent = useCallback((event, newSimilar, newGroup, newPosition) => {
		if (newSimilar !== similar) {
			setSimilar(newSimilar);
		}
		if (newSimilar) {
			getSimilar(newGroup[0]);
		}
		if (!isEqual(newGroup, group)) {
			setGroup(newGroup);
		}
		setPosition(newPosition);
		setOpenPopover(true); // eslint-disable-next-line
	}, []);

	const closeEvent = useCallback(() => {
		setOpenPopover(false);
		// eslint-disable-next-line
	}, []);

	// const changeStatus = useCallback((stt) => setOpen(!open), [open]);

	return (
		<div style={{ height: HEIGHT, width: WIDTH, position: 'fixed' }}>
			{' '}
			{/*700 * 1443, 945 x 1920*/}
			<Bar open />
			<SaveSection open openEvent={openEvent} />
			<Map open />
			<Submit />
			<ImageGrid open height={HEIGHT} maxwidth={WIDTH} openEvent={openEvent} />\
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
				<EventPopover
					openEvent={openEvent}
					closeEvent={closeEvent}
					group={group}
					position={position}
					similar={similar}
				/>
			</Popover>
		</div>
	);
};

export default Page;
