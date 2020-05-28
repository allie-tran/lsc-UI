import React, { useEffect, useState, memo } from 'react';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Thumbnail from '../redux/Thumbnail-cnt';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles((theme) => ({
	section: {
		position: 'fixed',
		left: (props) => (props.open ? '80%' : '97%'),
		width: '20%',
		height: '100%',
		filter: (props) => (props.open ? 'none' : 'brightness(70%)'),
		zIndex: 3,
		top: 0,
		margin: 0,
		backgroundColor: '#272727',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	title: {
		padding: 18,
		color: '#CCCCCC'
	},
	divider: {
		color: '#CCCCCC'
	},
	icon: {
		position: 'relative',
		top: 6,
		marginLeft: 5,
		color: '#FF6584'
	},
	imageContainer: {
		width: '100%',
		maxHeight: '47%',
		overflow: 'auto'
	},
	list: {
		width: '80%',
		display: 'flex',
		flexWrap: 'wrap-reverse',
		flexDirection: 'row-reverse',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		alignContent: 'space-between',
		margin: 'auto'
	},
	hidden: {
		visibility: 'hidden'
	},
	textList: {
		width: '80%',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		alignContent: 'space-between',
		margin: 'auto',
		color: '#CCCCCC'
	},
	text: {
		color: '#CCCCCC',
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		flexDirection: 'row'
	},
	keyword: {
		top: 5,
		paddingRight: 10,
		position: 'relative'
	},
	adjustmentIcon: {
		position: 'relative',
		color: '#CCCCCC',
		padding: 5
	}
}));

const hiddenGroup = [ 'Hidden' ];
const Hidden = () => <Thumbnail key="saved: Hidden" hidden saved group={hiddenGroup} scale={0.7} />;
var isEqual = require('lodash.isequal');

const areEqual = (prevProps, nextProps) => {
	return isEqual(prevProps.keywords, nextProps.keywords) && isEqual(prevProps.info, nextProps.info);
};

const SaveSection = memo(({ open, saved, removeScene, info, keywords, setKeywords }) => {
	const classes = useStyles({ open });

	useEffect(
		() => {
			var isEqual = require('lodash.isequal');
			if (info !== null) {
				var newKeywords = Object.keys(info.expansion_score).map((keyword, index) => [
					keyword,
					info.expansion_score[keyword]
				]);
				newKeywords.sort(function(a, b) {
					return b[1] - a[1];
				});
				if (!isEqual(keywords, newKeywords)) {
					setKeywords(newKeywords);
				}
			}
		},
		[ info ]
	);

	const increase = (index) => {
		var newKeywords = keywords.map((a) => ({ ...a }));
		newKeywords[index][1] += 1;
		setKeywords(newKeywords);
	};

	const decrease = (index) => {
		var newKeywords = keywords.map((a) => ({ ...a }));
		newKeywords[index][1] -= 1;
		setKeywords(newKeywords);
	};

	const clear = (index) => {
		var newKeywords = [ ...keywords.slice(0, index), ...keywords.slice(index + 1) ];
		setKeywords(newKeywords);
	};

	const up = (index) => {
		var newKeywords = keywords.map((a) => ({ ...a }));
		var newKeywords = [
			[ newKeywords[index][0], newKeywords[0][1] ],
			...newKeywords.slice(0, index),
			...newKeywords.slice(index + 1)
		];
		setKeywords(newKeywords);
	};

	const handleChange = (e, index) => {
		console.log(e);
		if (e.key === 'Enter') {
			var element = document.getElementById('kw' + index);
			console.log('Changed ' + keywords[index][0] + ' to ' + element.value);
			var newKeywords = JSON.parse(JSON.stringify(keywords));
			newKeywords[index][1] = parseFloat(element.value);
			if (!isEqual(keywords, newKeywords)) {
				setKeywords(newKeywords);
			}
			element.blur();
		}
	};

	useEffect(
		() => {
			var section = document.getElementById('save-section');
			section.scrollTop = 0;
		},
		[ saved ]
	);

	keywords.forEach((keyword, index) => {
		var el = document.getElementById('kw' + index);
		if (el !== null) {
			el.value = null;
		}
	});

	if (keywords.length > 0) {
		return (
			<div id="save" className={classes.section}>
				<Typography variant="subtitle1" className={classes.title}>
					INFO
					<Badge badgeContent={saved.length} color="primary">
						<BookmarkRoundedIcon />
					</Badge>
				</Typography>
				<div className={classes.imageContainer} id="save-section">
					<div className={classes.textList}>
						{info.weekdays.length > 0 ? <Typography> Weekday: {info.weekdays}</Typography> : null}
						<Typography>
							Time: {info.start_time[0]}:{info.start_time[1]} - {info.end_time[0]}:{info.end_time[1]}
						</Typography>
						{info.dates.length > 0 ? <Typography> Dates: {info.dates}</Typography> : null}
						{info.region.length > 0 ? <Typography> Region: {info.region}</Typography> : null}
						{info.location.length > 0 ? <Typography> Location: {info.location}</Typography> : null}

						{keywords.map((keyword, index) => (
							<div className={classes.text}>
								<Typography className={classes.keyword}>{keyword[0]}:</Typography>
								<InputBase
									id={'kw' + index}
									placeholder={keyword[1].toPrecision(2)}
									onKeyDown={(e) => handleChange(e, index)}
								/>
								<IconButton className={classes.adjustmentIcon} onClick={() => increase(index)}>
									<PlusOneIcon />
								</IconButton>
								<IconButton className={classes.adjustmentIcon} onClick={() => decrease(index)}>
									<ExposureNeg1Icon />
								</IconButton>
								<IconButton className={classes.adjustmentIcon} onClick={() => clear(index)}>
									<ClearIcon />
								</IconButton>
								<IconButton className={classes.adjustmentIcon} onClick={() => up(index)}>
									<PublishIcon />
								</IconButton>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div id="save" className={classes.section}>
				<Typography variant="subtitle1" className={classes.title}>
					SAVED SCENES
					<Badge badgeContent={saved.length} color="primary">
						<BookmarkRoundedIcon />
					</Badge>
				</Typography>
				<div className={classes.imageContainer} id="save-section">
					<div className={classes.list}>
						{saved.length % 2 !== 0 ? <Hidden key="Hidden" /> : null}
						{saved.map((scene, index) => (
							<Thumbnail
								key={'saved:' + scene[0]}
								saved
								group={scene}
								scale={0.7}
								index={index}
								last={index === 0}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}
}, areEqual);

export default SaveSection;
