import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Page from './components/Page';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const theme = createTheme({
    palette: {
        type: "dark",
    primary: { main: "#6c63ff" },
    secondary: { main: "#FF6584" },
    info: { main: "#e0e0e0" },
    dark: { main: "#272727" },
    success: { main: "#4caf50" },
    warning: { main: "#ff9800" },
    error: { main: "#f44336" },
    },
    spacing: 4,
});
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
	<ThemeProvider theme={theme}>
			<Page />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
