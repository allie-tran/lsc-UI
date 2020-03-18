import { connect } from 'react-redux'
import {setQueryBound} from './actions/search'
import Map from '../components/Map'


function mapStateToProps(state) {
    return {
        scenes: state.search.scenes,
        selected: state.select.selected
    }
}

const mapDispatchToProps = {
    setQueryBound
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
