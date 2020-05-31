import React, { useEffect, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
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
		marginBottom: 0
	},
	grid: {
		overflow: 'scroll'
	},
	saveButton: {
		position: 'absolute',
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 75,
		color: '#fff',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: '#FF6584'
		}
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
		}
	},
	similarButton: {
		position: 'absolute',
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 50,
		color: '#fff',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: '#FF6584'
		}
	},
	info: {
		paddingLeft: 5
	}
}));

var isEqual = require('lodash.isequal');
const areEqual = (prevProps, nextProps) => {
	return prevProps.image === nextProps.image && isEqual(prevProps.scene, nextProps.scene)
};

const Image = memo(({ image, scene, scale, saveScene, info, onClick }) => {
	const classes = imageStyles({ scale });
	const bookmarkClick = () => saveScene([ image ]);
	const Bookmark = () => (
		<BookmarkBorderRoundedIcon fontSize="small" className={classes.saveButton} onClick={bookmarkClick} />
	);

	useEffect(
		() => {
			// Do nothing LOL
		},
		[ onClick ]
	);

	return (
		<div className={classes.card}>
			<img
				alt={image}
				src={'http://lifeseeker-sv.computing.dcu.ie/' + image}
				className={classes.image}
				onClick={() => onClick === undefined? null:onClick(scene)}
			/>
			<Bookmark />
			<ImageSearchIcon fontSize="small" className={classes.similarButton} />
			<CheckRoundedIcon fontSize="small" className={classes.submitButton} />
			{info && <Typography className={classes.info}>{image}</Typography>}
		</div>
	);
}, areEqual);

export default Image;
