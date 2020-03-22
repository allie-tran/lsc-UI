import { connect } from 'react-redux'
import { setScene, setQueryBound } from './actions/search'
import {resetSelection} from './actions/select'

import ImageGrid from '../components/Images'


function mapStateToProps(state) {
    return { collection: state.search.collection,
             markersSelected: state.select.markersSelected,
             currentMarker: state.select.currentMarker }
}

const mapDispatchToProps = {
    setScene, setQueryBound, resetSelection
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageGrid);
