import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Page} from './components/Page'
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import {ThemeProvider} from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {main: "#6C63FF"},
        secondary: {main: "#CCCCCC"},
        error: {main: "#FF6584"},
        success: {main: "#212121"}
    },
    spacing: 4


});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Page/>
    </ThemeProvider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
