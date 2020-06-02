import { connect } from 'react-redux'
import { getNextScenes, getSimilar, getGroups, getGPS } from './actions/search'
import EventPopover from '../components/EventPopover'


function mapStateToProps(state) {
    return { nextSceneRespone: state.search.nextSceneRespone,
             similarResponse: state.search.similarResponse,
             groupResponse: state.search.groupResponse }
}

const mapDispatchToProps = {
    getNextScenes,
    getSimilar,
    getGroups,
    getGPS
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPopover);
