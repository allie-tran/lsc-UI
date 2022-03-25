import React, { memo, useState} from 'react'
import { useSelector } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import SearchBar from "./SearchBar";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        width: "100%",
        height: 60,
        backgroundColor: "#212121",
        top: 0, left: 0,
        zIndex: 4
    },
    appBar2: {
        position: 'fixed',
        width: "100%",
        height: 30,
        backgroundColor: "#272727",
        top: 60, left: 0,
        zIndex: 3
    },
    realSpace: {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: "34%",
        height: 30,
        backgroundColor: "#272727",
        left: "32.6%",
        zIndex: 1,
    },
    icon: {
        padding: 10,
        marginRight: 10,
        backgroundColor: "#FF6584",
    },
    text: {
        color: "#888888",
        cursor: "default"
    }
}));

const ControlledCheckbox = ({ checked, handleChange}) => {
    return (
        <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
        />
    );
}

const Bar = memo(({ open, submitQuery }) => {
    const classes = useStyles({ open });
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    const [checked, setChecked] = useState(false);
    const visualisation = useSelector((state) => state.search.info? state.search.info.query_visualisation:null);
    return ([
        <AppBar key='1' className={classes.appBar}>
            <SearchBar type="Before:" submitQuery={submitQuery} />
            <SearchBar type="Find:" submitQuery={submitQuery} />
            <SearchBar type="After:" submitQuery={submitQuery} />
            <Tooltip title="Share Info" arrow>
                <ControlledCheckbox checked={checked} handleChange={handleChange}/>
            </Tooltip>
            <Tooltip title="Clear All" arrow>
                <IconButton size="small" className={classes.icon} onClick={() => {window.location.reload();return false}}>
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Search" arrow>
                <IconButton size="small" className={classes.icon} onClick={() => submitQuery(false, 0, checked)}>
                    <SearchIcon />
                </IconButton>
            </Tooltip>
        </AppBar>,
        <AppBar key='2' className={classes.appBar2}>
            <div className={classes.realSpace}>
                {visualisation? visualisation.map((text, index) =>{
                    return (
                        <Typography key={index.toString() + text[0]} variant="body1" className={classes.text}>
                            {(index > 0? ', ': '') + text[0] + ": " + text[1]}
                        </Typography>
                    )
                }
                ): null}
            </div>
        </AppBar>]
    )
}, () => true);

Bar.whyDidYouRender = true

export default Bar;
