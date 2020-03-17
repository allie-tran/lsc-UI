import { connect } from 'react-redux'
import Map from '../components/Map'


function mapStateToProps(state) {
    return {
        scenes: state.search.scenes,
        selected: state.select.selected
    }
}

export default connect(
    mapStateToProps,
    null
)(Map);
