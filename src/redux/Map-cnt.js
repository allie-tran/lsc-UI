import { connect } from 'react-redux'
import {setQueryBound} from './actions/search'
import {selectMarkers} from './actions/select'
import Map from '../components/Map'


function mapStateToProps(state) {
    return {
        scenes: state.search.scenes,
        selected: state.select.selected
    }
}

const mapDispatchToProps = {
    setQueryBound,
    selectMarkers
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
