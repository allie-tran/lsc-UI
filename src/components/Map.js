import React, { useEffect, useState, useRef } from 'react';
// import KeyboardArrowLeftRoundedIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
// import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
// import IconButton from '@material-ui/core/IconButton';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-polylinedecorator';
import 'leaflet-area-select';
import { makeStyles } from '@material-ui/core/styles';

const PRECISION = 5;
const useStyles = makeStyles((theme) => ({
	map: {
		position: 'fixed',
		left: (props) => (props.open ? 'calc(80% + 5px)' : 'calc(97% + 5px)'),
		width: 'calc(20% - 5px)',
		height: '50%',
		borderRadius: 2,
		filter: (props) => (props.open ? 'none' : 'brightness(20%)'),
		zIndex: 3,
		top: '50%',
		margin: 0
	},
	icon: {
		padding: 0,
		backgroundColor: '#f7f7f7',
		left: (props) => (props.open ? `calc(80% - 25px)` : `calc(97% - 25px)`),
		top: '90%',
		zIndex: 4
	},
	insideIcon: {
		color: '#FF6584',
		fontSize: 50
	}
}));

var mainIcon = new L.Icon({
	iconUrl: 'mainicon_64.png',
	iconSize: [ 64, 64 ], // size of the icon
	iconAnchor: [ 32, 55 ], // point of the icon which will correspond to marker's location
	popupAnchor: [ 0, 0 ] // point from which the popup should open relative to the iconAnchor
});

var subIcon = L.Icon.extend({
	options: {
		iconUrl: 'pinkicon48.png',
		iconSize: [ 48, 48 ], // size of the icon
		iconAnchor: [ 24, 42 ], // point of the icon which will correspond to marker's location
		popupAnchor: [ 0, 0 ] // point from which the popup should open relative to the iconAnchor
	}
});

const Map = ({ open, submitRegion, dates, selected, changeStatus, setQueryBound, selectMarkers, gpsResponse }) => {
	const classes = useStyles({ open });
	const [ bounds, setBounds ] = useState(null);

	const map = useRef(null);
	const markerGroup = useRef(null);
	const clustersMain = useRef(null);
	const pathLine = useRef(null);
	const boundLine = useRef(null);
	const pane = useRef(null);

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') console.log('Enter');
	};

	useEffect(() => {
		map.current = L.map('map', { selectArea: true, maxZoom: 17 }).setView([ 53.384811, -6.26319 ], 13);
		markerGroup.current = L.layerGroup().addTo(map.current);

		map.current.on('areaselected', (e) => {
			map.current.fitBounds(e.bounds, { minZoom: map.current._zoom });
			setBounds(e.bounds.toBBoxString().split(','));
		});

		// var Stadia_AlidadeSmoothDark = L.tileLayer(
		// 	'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
		// 	{
		// 		attribution:
		// 			'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		// 		maxZoom: 18
		// 	}
		// ).addTo(map.current);

		L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
			maxZoom: 18,
			attribution:
				'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		}).addTo(map.current);

		// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		// 	attribution: '',
		// 	maxZoom: 18,
		// 	id: 'mapbox.streets',
		// 	accessToken: 'pk.eyJ1IjoiYWxsaWV0cmFuIiwiYSI6ImNrM2Jpa3hpZjBicmwzaHA4NjljMno1YzYifQ.WRazWdYG2T1hK6H5EnKnYw'
		// }).addTo(map.current);
		pane.current = map.current.createPane('pathPane');
		map.current.getPane('pathPane').style.zIndex = 625;
		map.current.getPane('pathPane').style.pointerEvents = 'none';
		pathLine.current = new L.LayerGroup([]);
	}, []);

	useEffect(
		() => {
			if (dates.length > 0) {
				let first_location = null;
				if (clustersMain.current !== null) {
					clustersMain.current.clearLayers();
				}
				clustersMain.current = new L.markerClusterGroup({
					spiderfyOnMaxZoom: false,
					maxClusterRadius: 80,
					polygonOptions: { weight: 1, opacity: 0.5 },
					animate: true,
					animateAddingMarkers: true,
					singleMarkerMode: true
				});
				dates.forEach((date, id) => {
					date.forEach((scene, index) => {
						if (scene !== null && scene.gps !== null) {
							if (first_location === null) {
								first_location = [
									scene.gps[1][0].lat.toPrecision(PRECISION),
									scene.gps[1][0].lon.toPrecision(PRECISION)
								];
							}
							var marker = L.marker(
								[
									scene.gps[1][0].lat.toPrecision(PRECISION),
									scene.gps[1][0].lon.toPrecision(PRECISION)
								],
								{
									icon: new subIcon({ index: index }),
									attribution: id + '-' + index
								}
							);
							marker.on('click', (e) => selectMarkers([ e.target.options.attribution ]));
							clustersMain.current.addLayer(marker);
						}
					});
				});
				map.current.addLayer(clustersMain.current);
				clustersMain.current.on('clusterclick', function(a) {
					selectMarkers(a.layer.getAllChildMarkers().map((marker) => marker.getAttribution()));
				});
				map.current.fitBounds(clustersMain.current.getBounds());
			}
			return () => markerGroup.current.clearLayers();
		}, // eslint-disable-next-line
		[ dates, selectMarkers ]
	);

	useEffect(
		() => {
			if (selected !== null) {
				var [ index, id ] = selected.split('-');
				const date_selected = dates[index][id];
				pathLine.current.clearLayers();
				const color = [ 'rgb(255, 101, 132)', 'rgb(108, 99, 255)', 'rgb(33, 33, 33)' ];
				let path = [];
				let fullPath = [];
				let i;
				let polyline;
				for (i = 0; i < 3; i++) {
					if (date_selected.gps[i] !== null && date_selected.gps[i].length > 0) {
						if (path.length > 0) {
							var gps = date_selected.gps[i][0];
							path.push([ gps.lat.toPrecision(PRECISION), gps.lon.toPrecision(PRECISION) ]);
							polyline = L.polyline(path, {
								color: color[i - 1],
								weight: 2,
								opacity: 0.5,
								pane: pane.current
							}).addTo(pathLine.current);
							polyline.on({ click: (e) => map.current.fitBounds(e.target.getBounds()) });
							path = [];
						}
						path.push(
							...date_selected.gps[i].map((gps) => [
								gps.lat.toPrecision(PRECISION),
								gps.lon.toPrecision(PRECISION)
							])
						);
					}
				}

				if (path.length > 0) {
					polyline = L.polyline(path, {
						color: color[i - 1],
						weight: 2,
						opacity: 0.5,
						pane: pane.current
					}).addTo(pathLine.current);
					polyline.on({ click: (e) => map.current.fitBounds(e.target.getBounds()) });
					path = [];
				}

				date_selected.gps_path.forEach((gps) => {
					fullPath.push([ gps.lat.toPrecision(PRECISION), gps.lon.toPrecision(PRECISION) ]);
				});

				var fullLine = L.polyline(fullPath, {
					weight: 2,
					pane: pane.current,
					opacity: 0
				}).addTo(pathLine.current);

				// eslint-disable-next-line
				// var arrowHead = L.polylineDecorator(polyline, {
				// 	patterns: [
				// 		{
				// 			offset: 0,
				// 			repeat: '99%',
				// 			symbol: L.Symbol.arrowHead({
				// 				pixelSize: 10,
				// 				polygon: false,
				// 				pathOptions: {
				// 					stroke: true,
				// 					weight: 3,
				// 					opacity: 1,
				// 					pane: pane.current,
				// 					interactive: false
				// 				}
				// 			})
				// 		}
				// 	]
				// }).addTo(pathLine.current);
				// eslint-disable-next-line
				var marker = L.marker(
					[
						date_selected.gps[1][0].lat.toPrecision(PRECISION),
						date_selected.gps[1][0].lon.toPrecision(PRECISION)
					],
					{
						icon: mainIcon,
						pane: pane.current,
						interactive: false
					}
				).addTo(pathLine.current);

				// Zooming
				map.current.fitBounds(fullLine.getBounds());
				// map.current.setView(marker.getLatLng());

				map.current.addLayer(pathLine.current);
			}
			return () => pathLine.current.clearLayers();
		}, // eslint-disable-next-line
		[ selected, dates ]
	);

	useEffect(
		() => {
			if (gpsResponse) {
				pathLine.current.clearLayers();
				gpsResponse.then((res) => {
					var gps = res.data.gps;
					if (gps !== null) {
						var marker = L.marker([ gps.lat.toPrecision(PRECISION), gps.lon.toPrecision(PRECISION) ], {
							icon: mainIcon,
							pane: pane.current,
							interactive: false
						}).addTo(pathLine.current);
						// Zooming
						map.current.setView(marker.getLatLng());
						// map.current.setView(marker.getLatLng());
						map.current.addLayer(pathLine.current);
					}
				});
			}

			return () => pathLine.current.clearLayers();
		}, // eslint-disable-next-line
		[ gpsResponse ]
	);

	useEffect(
		() => {
			// map.current.setView(center, zoom);
			if (bounds === null) {
				return;
			}
			setQueryBound(bounds);
			if (boundLine.current !== null) {
				map.current.removeLayer(boundLine.current);
			}
			boundLine.current = L.rectangle(
				[ [ parseFloat(bounds[3]), parseFloat(bounds[0]) ], [ parseFloat(bounds[1]), parseFloat(bounds[2]) ] ],
				{ color: '#ff7800', weight: 1, fill: false }
			).addTo(map.current);
			// eslint-disable-next-line
		},
		[ bounds, setQueryBound ]
	);
    return <div key="map" id="map" className={classes.map} onKeyPress={handleKeyPress} />
	// return [
	// 	<div key="map" id="map" className={classes.map} onKeyPress={handleKeyPress} />,
	// 	// <IconButton key="icon" size="small" className={classes.icon} onClick={changeStatus}>
	// 	// 	{open ? (
	// 	// 		<KeyboardArrowRightRoundedIcon className={classes.insideIcon} />
	// 	// 	) : (
	// 	// 		<KeyboardArrowLeftRoundedIcon className={classes.insideIcon} />
	// 	// 	)}
	// 	// </IconButton>
	// ];
};

export default Map;
