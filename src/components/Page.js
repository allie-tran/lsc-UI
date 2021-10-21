import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Map from './Map';
import Bar from './AppBar';
import SaveSection from './Save';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import EventPopover from './EventPopover';
import ImageGrid from './Images';
import { getSimilar, getGroups, getNextScenes, setFinishedSearch} from '../redux/actions/search';
import {getImages} from '../redux/actions/search'
import {resetSelection} from '../redux/actions/select'
import {startTimer} from '../redux/actions/submit'

const popoverStyles = makeStyles((theme) => ({
	popover: {
		width: '75%',
		color: '#272727'
	}
}));



if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

const Page = () => {
    const WIDTH = window.innerWidth; // 1920, 1443
    const HEIGHT = window.innerHeight; // 1920; // 945, 700
	const classes = popoverStyles();
    const dispatch = useDispatch()
	const [ openPopover, setOpenPopover ] = useState(false);
	const [ similar, setSimilar ] = useState(false);
	const [ detailedScene, setDetailedScene ] = useState(null);

    const submitQuery = useCallback((ignoreInfo, starting_from) => {
        let query = {
            before: document.getElementById("Before:").value,
            beforewhen: document.getElementById("Before:-when").value,
            current: document.getElementById("Find:").value,
            after: document.getElementById("After:").value,
            afterwhen: document.getElementById("After:-when").value
        };
        console.log(query)
        window.scrollTo(0, 0);
        dispatch(resetSelection());
        dispatch(setFinishedSearch(starting_from))
        dispatch(getImages(query, ignoreInfo, starting_from));
        dispatch(startTimer())
    }, []);

	const openEvent = useCallback((event, newSimilar, newGroup, newPosition) => {
        setSimilar(newSimilar);
		if (newSimilar) {
			dispatch(getSimilar(newGroup[0]));
		}   
        else {
            dispatch(getGroups(newGroup[0].split('/')[0]));
            dispatch(getNextScenes(newGroup, 'full'));
        }
        setDetailedScene(newGroup);
		setOpenPopover(true); // eslint-disable-next-line
	}, []);

	const closeEvent = useCallback(() => {
		setOpenPopover(false)
		// eslint-disable-next-line
	}, []);

	return (
		<div style={{ height: HEIGHT, width: WIDTH, position: 'fixed' }}>
			{' '}
			{/*700 * 1443, 945 x 1920*/}
			<Bar open submitQuery={submitQuery} />
            <Map open />
			<SaveSection open openEvent={openEvent} />
			{/* <Submit /> */}
			<ImageGrid open height={HEIGHT} maxwidth={WIDTH} openEvent={openEvent} submitQuery={submitQuery}/>\
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
				{openPopover && <EventPopover
					openEvent={openEvent}
					detailedScene={detailedScene}
					similar={similar}
				/>}
			</Popover>
		</div>
	);
};
Page.whyDidYouRender = true

export default Page;
