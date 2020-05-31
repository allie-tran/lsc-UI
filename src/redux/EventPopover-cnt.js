import { connect } from 'react-redux'
import { getNextScenes, getSimilar } from './actions/search'
import EventPopover from '../components/EventPopover'


function mapStateToProps(state) {
    return { nextSceneRespone: state.search.nextSceneRespone,
             similarResponse: state.search.similarResponse }
}

const mapDispatchToProps = {
    getNextScenes,
    getSimilar
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPopover);
