import { connect } from 'react-redux'
import { getNextScenes } from './actions/search'
import EventPopover from '../components/EventPopover'


function mapStateToProps(state) {
    return { nextSceneRespone: state.search.nextSceneRespone }
}

const mapDispatchToProps = {
    getNextScenes
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPopover);
