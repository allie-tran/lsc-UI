import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
// import {InfiniteLoader, List, WindowScroller, AutoSizer} from 'react-virtualized';
import InfiniteLoader from 'react-window-infinite-loader';
// import { WindowScroller, AutoSizer } from "react-virtualized";
import MovieCard from '../containers/MovieCard';
import { makeStyles } from '@material-ui/styles';
const Event = lazy(() => import('./Event'));


const ITEM_WIDTH = 324;
const ITEM_HEIGHT = 313;

const styles = theme => ({
    grid: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        justifyContent: 'center',
    },
    gridItem: {
        width: ITEM_WIDTH,
        padding: 1.5 * theme.spacing.unit,
    },
    card: {
        height: '100%',
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    }
});

function generateIndexesForRow(rowIndex, maxItemsPerRow, itemsAmount) {
    const result = [];
    const startIndex = rowIndex * maxItemsPerRow;

    for (let i = startIndex; i < Math.min(startIndex + maxItemsPerRow, itemsAmount); i++) {
        result.push(i);
    }

    return result;
}

function getMaxItemsAmountPerRow(width) {
    return Math.max(Math.floor(width / ITEM_WIDTH), 1);
}

function getRowsAmount(width, itemsAmount, hasMore) {
    const maxItemsPerRow = getMaxItemsAmountPerRow(width);

    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
}

const RowItem = React.memo(function RowItem({ scene, classes }) {
    return (
        <Grid item className={classes.gridItem} key={movieId}>
            <Event scene={scene} />
        </Grid>
    );
});

const InfiniteEventList = ({ maxwidth, open, collection }) => {
    const classes = gridStyles({ open });
    const [scenes, setScenes] = useState([]);
    classes = styles()
    useEffect(() => {
        collection.then(res => {
            setScenes(res.data.results);
        });
    }, [collection]);
    const width = open ? maxwidth * 0.97 : maxwidth * 0.8;
    const maxItemsPerRow = Math.max(Math.floor(maxwidth / ITEM_WIDTH), 1);
    const Cell = ({ columnIndex, rowIndex, style }) => {
        return (
            <Event scene={scenes[rowIndex * maxItemsPerRow + columnIndex]} />
        )
    };

    return (
        <Grid
            columnCount={1000}
            columnWidth={100}
            height={150}
            rowCount={1000}
            rowHeight={35}
            width={300}
        >
            {Cell}
        </Grid>
    );

}






export default InfiniteEventList;
