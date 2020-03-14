import { connect } from 'react-redux'
import { saveScene } from './actions/save'
import Image from '../components/Image'

const mapDispatchToProps = {
    saveScene
};

export default connect(
    null,
    mapDispatchToProps
)(Image);

