import { connect } from 'react-redux'
import { saveScene, removeScene } from './actions/save'
import Thumbnail from '../components/Thumbnail'

const mapDispatchToProps = {
    saveScene,
    removeScene
};

export default connect(
    null,
    mapDispatchToProps
)(Thumbnail);

