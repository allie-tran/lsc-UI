import { connect } from 'react-redux'
import { setScene } from './actions/search'
import ImageGrid from '../components/Images'


function mapStateToProps(state) {
    return { collection: state.search.collection,
             markersSelected: state.select.markersSelected }
}

const mapDispatchToProps = {
    setScene
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageGrid);
