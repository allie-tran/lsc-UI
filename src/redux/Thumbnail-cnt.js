import { connect } from 'react-redux'
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Thumbnail);
