import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import IconButton from '@material-ui/core/IconButton';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import {useDispatch} from 'react-redux'
import LazyLoad from 'react-lazy-load';
import { saveScene, removeScene } from '../redux/actions/save'
import { sendToMap } from '../redux/actions/select'
import { getGPS } from '../redux/actions/search'
import { submitImage } from '../redux/actions/submit'

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const RESIZE_FACTOR = 6;

const thumbnailStyles = makeStyles((theme) => ({
	image: {
		width: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale * window.innerWidth / 1920 ,
		height: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale * window.innerWidth / 1920 ,
		borderRadius: 2,
		flexShrink: 0,
		position: 'relative',
		border: '1px solid #E6E6E6',
		visibility: (props) => (props.hidden ? 'hidden' : 'visible'),
		'&$highlight': {
			border: '3px solid #FF6584',
			zIndex: 1,
			boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.5)'
		},
		transition: 'all 150ms ease-in',
	},
	highlight: {},
	row: {
		display: 'flex'
	},
	card: {
		width: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale * window.innerWidth / 1920 ,
		height: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale * window.innerWidth / 1920 ,
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		marginBottom: (props) => (props.saved ? 40 : 0),
		marginLeft: 4,
		marginRight: 4
	},
	saveButton: {
		position: 'absolute',
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale * window.innerWidth / 1920  - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale * window.innerWidth / 1920  - 50,
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
		left: (props) => IMAGE_WIDTH / RESIZE_FACTOR * props.scale * window.innerWidth / 1920  - 25,
		top: (props) => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale * window.innerWidth / 1920  - 25,
		color: '#fff',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: '#FF6584'
		},
		zIndex: (props) => (props.highlight ? 2 : 1),
		visibility: (props) => (props.hidden ? 'hidden' : 'visible'),
        padding: 0
	}
}));


const ImageCard = ({ saved, hidden, scale, highlight, img, openEvent, onButtonClick }) => {
	const classes = thumbnailStyles({ hidden, scale, saved, highlight });
    const dispatch = useDispatch()

	if (saved === undefined) {
		return (
			<div className={classes.card}>
                <LazyLoad
					height={IMAGE_HEIGHT/ RESIZE_FACTOR * scale * window.innerWidth / 1920 }
                    width={IMAGE_WIDTH / RESIZE_FACTOR * scale * window.innerWidth / 1920 }
					offset={100}
                    debounce={false}
				>
				<img
					alt={img}
					src={'http://lifeseeker-sv.computing.dcu.ie//' + img}
					className={clsx(classes.image, { [classes.highlight]: highlight })}
					onClick={(e) => openEvent(e, false)}
				/>
                </LazyLoad>
                <IconButton onClick={onButtonClick} className={classes.saveButton}>
                    <BookmarkBorderRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={(e) => dispatch(submitImage(img))} className={classes.submitButton}>
                    <CheckRoundedIcon fontSize="small" />
                </IconButton>
			</div>
		);
	}
	return (
		<div className={classes.card}>
			{hidden ? (
				<img alt={img} className={classes.image} onClick={(e) => dispatch(submitImage(img))} />
			) : (
				<img
					alt={img}
					src={'http://lifeseeker-sv.computing.dcu.ie//' + img}
					className={classes.image}
					onClick={(e) => openEvent(e, false)}
				/>
			)}
			<IconButton onClick={onButtonClick} className={classes.saveButton}>
				<DeleteOutlineRoundedIcon fontSize="small" />
			</IconButton>
			<IconButton onClick={(e) => openEvent(e, true)} className={classes.submitButton}>
				<CheckRoundedIcon fontSize="small" />
			</IconButton>
		</div>
	);
};

const hiddenStyles = makeStyles((theme) => ({
	hidden: {
        flexBasis: ({num}) => (IMAGE_WIDTH / RESIZE_FACTOR * window.innerWidth / 1920 + 4) * num,
		minWidth: ({num}) => (IMAGE_WIDTH / RESIZE_FACTOR * window.innerWidth / 1920 + 4) * num,
        width: ({num}) => (IMAGE_WIDTH / RESIZE_FACTOR * window.innerWidth / 1920  + 4) * num,
		minHeight: IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920 ,
        height: IMAGE_HEIGHT / RESIZE_FACTOR * window.innerWidth / 1920 ,
        marginLeft: 6,
        marginRight: 6,
        position: 'relative',
        flexShrink: 0,
        display: 'block',
        visibility: 'hidden'
	}
}));
const Hidden = ({ num }) => {
	const classes = hiddenStyles({num});
	return (
			<div className={classes.hidden}> Hidden </div>
	);
};

const Thumbnail = ({
	hidden,
	highlight,
	group,
	scale,
	index,
	saved,
	position,
	openEvent
}) => {
    // const [rendered, setRendered] = useState(false)
	const Save = () => dispatch(saveScene(group));
	const Remove = () => dispatch(removeScene(index));
    const dispatch = useDispatch()
	const ownOpenEvent = (e, similar) => {
		openEvent(e, similar, group, position);
		if (saved === undefined) {
            console.log(index)
			dispatch(sendToMap(index));
		} else {
            dispatch(getGPS(group[0]))
        }
	};

	if (group.length > 0) {
		return (
			<ImageCard
				onButtonClick={saved === undefined ? Save : Remove}
				saved={saved}
				hidden={hidden}
				scale={scale}
				img={group[0].split('.')[0] + '.webp'}
				highlight={highlight}
				openEvent={ownOpenEvent}
			/>
		);
	} else {
		return <Hidden num={1}/>;
	}
};
Thumbnail.whyDidYouRender = true

export default Thumbnail;
