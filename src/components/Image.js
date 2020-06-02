import React, {memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
// import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import IconButton from '@material-ui/core/IconButton';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const RESIZE_FACTOR = 6;

const imageStyles = makeStyles((theme) => ({
	image: {
		width: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
		height: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale,
		borderRadius: 2,
		flexShrink: 0,
		marginTop: 0,
		marginBottom: 10,
		position: 'relative',
		border: '1px solid #E6E6E6'
	},
	card: {
		width: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		marginTop: 10,
		marginBottom: 0,
        marginLeft: 4,
        marginRight: 4
	},
	grid: {
		overflow: 'scroll'
	},
	saveButton: {
		position: 'absolute',
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 50,
		color: '#fff',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: '#FF6584'
		},
		zIndex: (props) => (props.highlight ? 2 : 1),
		visibility: (props) => (props.hidden ? 'hidden' : 'visible'),
		padding: 0
	},
	submitButton: {
		position: 'absolute',
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 25,
		color: '#fff',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: '#FF6584'
		},
		zIndex: (props) => (props.highlight ? 2 : 1),
		visibility: (props) => (props.hidden ? 'hidden' : 'visible')
	},
	similarButton: {
		position: 'absolute',
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 25,
		color: '#fff',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: '#FF6584'
		},
		zIndex: (props) => (props.highlight ? 2 : 1),
		visibility: (props) => (props.hidden ? 'hidden' : 'visible'),
		padding: 0
	},
    timeButton: {
		position: 'absolute',
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 75,
		color: '#fff',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: '#FF6584'
		},
		zIndex: (props) => (props.highlight ? 2 : 1),
		visibility: (props) => (props.hidden ? 'hidden' : 'visible'),
		padding: 0
	},
	info: {
		paddingLeft: 5
	}
}));

var isEqual = require('lodash.isequal');
const areEqual = (prevProps, nextProps) => {
    return prevProps.image === nextProps.image && isEqual(prevProps.scene, nextProps.scene) && prevProps.scale === nextProps.scale && prevProps.similar === nextProps.similar
};

const Image = memo(({ image, scene, scale, saveScene, info, onClick, index, onButtonClick, openEvent, similar}) => {
	const classes = imageStyles({ scale });
	const ownOnClick = () => onClick === undefined? null:onClick(index)

	return (
		<div className={classes.card}>
			<img
				alt={image}
				src={'http://lifeseeker-sv.computing.dcu.ie/' + image}
				className={classes.image}
				onClick={ownOnClick}
			/>
            <IconButton onClick={() => saveScene([ image ])} className={classes.saveButton}>
					<BookmarkBorderRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={(e) => openEvent(e, true, [image], "current")} className={classes.similarButton}>
                <ImageSearchIcon fontSize="small" />
            </IconButton>
			{similar && <IconButton onClick={(e) => openEvent(e, false, [image], "current")} className={classes.timeButton}>
                <AccessTimeIcon fontSize="small" />
            </IconButton>}
            {/* <CheckRoundedIcon fontSize="small" className={classes.submitButton} /> */}
			{info && <Typography className={classes.info}>{image}</Typography>}
		</div>
	);
}, areEqual);

Image.whyDidYouRender = true;
export default Image;
