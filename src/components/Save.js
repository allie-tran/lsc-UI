import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Thumbnail from '../redux/Thumbnail-cnt';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import PublishIcon from '@material-ui/icons/Publish';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import {setKeywords, setMustNot, removeMustNot} from '../redux/actions/search'

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
		maxHeight: '38%',
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	list: {
		paddingTop: 10,
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
		paddingTop: 10,
		width: '80%',
		display: 'flex',
		alignItems: 'center',
		alignContent: 'space-between',
		margin: 'auto',
		color: '#CCCCCC',
        flexDirection: 'column',
        height: "40%",
        overflow: "scroll"
	},
	text: {
		color: '#CCCCCC',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
        justifyContent: 'flex-end',
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

const StyledTabs = withStyles({
	indicator: {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		'& > span': {
			maxWidth: 40,
			width: '100%',
			backgroundColor: '#635ee7'
		}
	}
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
	root: {
		textTransform: 'none',
		color: '#fff',
		fontWeight: theme.typography.fontWeightRegular,
		fontSize: theme.typography.pxToRem(15),
		marginRight: theme.spacing(1),
		'&:focus': {
			opacity: 1
		}
	}
}))((props) => <Tab disableRipple {...props} />);

const hiddenGroup = [ 'Hidden' ];
const Hidden = () => <Thumbnail key="saved: Hidden" hidden saved group={hiddenGroup} scale={0.7} />;
var isEqual = require('lodash.isequal');

const areEqual = (prev, next) => {
    return isEqual(prev.saved, next.saved) && isEqual(prev.info, next.info) && isEqual(prev.keywords, next.keywords) && prev.tabValue === next.tabValue
}

const SaveSection = memo(({ open, openEvent }) => {
	const classes = useStyles({ open });
	const [ tabValue, setTabValue ] = useState(1);
    const dispatch = useDispatch();
    const saved = useSelector(state => state.save.saved, isEqual)
    const info = useSelector(state => state.search.info, isEqual)
    const keywords = useSelector(state => state.search.keywords, isEqual)
    const stats = useSelector(state => state.search.stats, isEqual)

	useEffect(
		() => {
			if (info && info.expansion_score) {
				var newKeywords = Object.keys(info.expansion_score).map((keyword, index) => [
					keyword,
					info.expansion_score[keyword]
				]);
				newKeywords.sort(function(a, b) {
					return b[1] - a[1];
				});
                dispatch(setKeywords(newKeywords))
			}
		},
		[ info ]
	);

	const increase = (index) => {
		var newKeywords = keywords.map((a) => ({ ...a }));
		newKeywords[index][1] += 1;
        dispatch(setKeywords(newKeywords))
	};

	const decrease = (index) => {
		var newKeywords = keywords.map((a) => ({ ...a }));
		newKeywords[index][1] -= 1;
		dispatch(setKeywords(newKeywords))
	};

	const clear = (index) => {
		var newKeywords = [ ...keywords.slice(0, index), ...keywords.slice(index + 1) ];
		dispatch(setMustNot(keywords[index][0]))
        dispatch(setKeywords(newKeywords))
	};

	const up = (index) => {
		var newKeywords = keywords.map((a) => ({ ...a }));
		newKeywords = [
			[ newKeywords[index][0], newKeywords[0][1] ],
			...newKeywords.slice(0, index),
			...newKeywords.slice(index + 1)
		];
		dispatch(setKeywords(newKeywords));
	};

	const handleChange = (e, index) => {
		if (e.key === 'Enter') {
			var element = document.getElementById('kw' + index);
			var newKeywords = JSON.parse(JSON.stringify(keywords));
			newKeywords[index][1] = parseFloat(element.value);
			if (!isEqual(keywords, newKeywords)) {
				dispatch(setKeywords(newKeywords))
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

	if (keywords) {
        keywords.forEach((keyword, index) => {
		var el = document.getElementById('kw' + keyword[0]);
		if (el !== null) {
			el.value = null;
		}
	});
    }

	const changeTab = (e, newValue) => {
		setTabValue(newValue);
	};

	return (
		<div id="save" className={classes.section}>
			<StyledTabs value={tabValue} onChange={changeTab}>
				<StyledTab icon={<EditRoundedIcon />} label="Word list" />
				<StyledTab icon={<BookmarkRoundedIcon />} label="Saved scenes" />
			</StyledTabs>
			<div className={classes.imageContainer} id="save-section">
				{tabValue === 0 && info ? (
                    <>
					<div className={classes.textList}>
						{info.weekdays.length > 0 ? <Typography> Weekday: {info.weekdays}</Typography> : null}
						<Typography>
							Time: {info.start_time[0]}:{info.start_time[1]} - {info.end_time[0]}:{info.end_time[1]}
						</Typography>
						{info.dates.length > 0 ? <Typography> Dates: {info.dates}</Typography> : null}
						{info.region.length > 0 ? <Typography> Region: {info.region}</Typography> : null}
						{info.location.length > 0 ? <Typography> Location: {info.location}</Typography> : null}

						{keywords.map((keyword, index) => (
							<div key={keyword[0]} className={classes.text}>
								<Typography className={classes.keyword}>{keyword[0]}:</Typography>
								<InputBase
									id={'kw' + index}
									placeholder={keyword[1].toPrecision(2)}
									onKeyDown={(e) => handleChange(e, index)}
								/>
								<IconButton className={classes.adjustmentIcon} onClick={() => clear(index)}>
									<ClearIcon />
								</IconButton>
								<IconButton className={classes.adjustmentIcon} onClick={() => up(index)}>
									<PublishIcon />
								</IconButton>
							</div>
						))}
					</div>
                    <div className={classes.textList}>
                    {Object.keys(info.stats).map((keyword) => (
							stats.includes(keyword)? (
                            <div key={keyword} className={classes.text}>
								<Typography className={classes.keyword}><del>{keyword}:</del></Typography>
                                <Typography className={classes.keyword}><del>{info.stats[keyword]}</del></Typography>
								<IconButton className={classes.adjustmentIcon} onClick={() => dispatch(removeMustNot(keyword))}>
									<ClearIcon />
								</IconButton>
							</div>) :
                            (<div key={keyword} className={classes.text}>
								<Typography className={classes.keyword}>{keyword}:</Typography>
                                <Typography className={classes.keyword}>{info.stats[keyword]}</Typography>
								<IconButton className={classes.adjustmentIcon} onClick={() => dispatch(setMustNot(keyword))}>
									<ClearIcon />
								</IconButton>
							</div>)
						))}
                    </div>
                    </>
				) : tabValue === 1 ? (
					<div className={classes.list}>
						{saved.length % 2 !== 0 ? <Hidden key="Hidden" /> : null}
						{saved.map((scene, index) => (
							<Thumbnail
								key={'saved:' + scene[0] + index}
								saved
								group={scene}
								scale={0.7}
								index={index}
								last={index === 0}
                                openEvent={openEvent}
							/>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
	// 	);
	// } else {
	// 	return (
	// 		<div id="save" className={classes.section}>
	// 			<Typography variant="subtitle1" className={classes.title}>
	// 				SAVED SCENES
	// 				<Badge badgeContent={saved.length} color="primary">
	// 					<BookmarkRoundedIcon />
	// 				</Badge>
	// 			</Typography>

	// 		</div>
	// 	);
	// }
}, areEqual);

SaveSection.whyDidYouRender=true

export default SaveSection;
