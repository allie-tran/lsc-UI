import { connect } from 'react-redux'
import { clearNextEvents } from './actions/search'
import { saveScene, removeScene } from './actions/save'
import { sendToMap, selectMarkers } from './actions/select'

import Thumbnail from '../components/Thumbnail'

function mapStateToProps(state) {
    return { markersSelected: state.select.markersSelected }
}

const mapDispatchToProps = {
    saveScene,
    removeScene,
    sendToMap,
    clearNextEvents,
    selectMarkers
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Thumbnail);
