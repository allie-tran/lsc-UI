import { connect } from 'react-redux'
import { setScene, setQueryBound } from './actions/search'
import ImageGrid from '../components/Images'


function mapStateToProps(state) {
    return { collection: state.search.collection,
             markersSelected: state.select.markersSelected,
             currentMarker: state.select.currentMarker }
}

const mapDispatchToProps = {
    setScene, setQueryBound
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageGrid);
