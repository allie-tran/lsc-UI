import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Page from './components/Page';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const theme = createTheme({
    palette: {
        type: "dark",
        primary: { main: "#6C63FF" },
        secondary: { main: "#CCCCCC" },
        error: { main: "rgb(211, 47, 47)" },
        success: { main: "rgb(56, 142, 60)" },
        warning: { main: "rgb(245, 124, 0)" },
        info: { main: "rgb(2, 136, 209)" },
    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                whiteSpace: "pre-wrap",
                fontSize: 12,
            },
        },
        MuiTypography: {
            button: {
                fontSize: 16,
            },
        },
    },
    spacing: 4,
});
const store = configureStore();

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<Provider store={store}>
			<Page />
		</Provider>
	</ThemeProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
