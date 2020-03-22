import { connect } from 'react-redux'
import { clearNextEvents } from './actions/search'
import { saveScene, removeScene } from './actions/save'
import { sendToMap } from './actions/select'

import Thumbnail from '../components/Thumbnail'

function mapStateToProps(state) {
    return { markersSelected: state.select.markersSelected }
}

const mapDispatchToProps = {
    saveScene,
    removeScene,
    sendToMap,
    clearNextEvents,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Thumbnail);
