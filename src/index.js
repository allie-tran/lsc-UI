import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Page from './components/Page'
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux'
import configureStore from "./redux/configureStore";
import 'react-virtualized/styles.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'


const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: { main: "#6C63FF" },
        secondary: { main: "#CCCCCC" },
        error: { main: "#FF6584" },
        success: { main: "#212121" }
    },
    spacing: 4


});
const store = configureStore();


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Page />
        </Provider>
    </ThemeProvider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
