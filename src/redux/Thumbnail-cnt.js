import { connect } from 'react-redux'
import { saveScene, removeScene } from './actions/save'
import { sendToMap } from './actions/select'
import Thumbnail from '../components/Thumbnail'

const mapDispatchToProps = {
    saveScene,
    removeScene,
    sendToMap
};

export default connect(
    null,
    mapDispatchToProps
)(Thumbnail);
