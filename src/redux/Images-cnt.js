import { connect } from 'react-redux';
import { setMap, setQueryBound, setQueryInfo, clearNextEvents, getSimilar } from './actions/search';
import { resetSelection } from './actions/select';

import ImageGrid from '../components/Images';

function mapStateToProps(state) {
	return {
		collection: state.search.collection,
		markersSelected: state.select.markersSelected,
		currentMarker: state.select.currentMarker
	};
}

const mapDispatchToProps = {
	setMap,
	setQueryBound,
	resetSelection,
	setQueryInfo,
    clearNextEvents,
    getSimilar
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageGrid);
