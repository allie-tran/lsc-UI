import {connect} from 'react-redux'
import {getImages} from './actions/search'

import Bar from '../components/AppBar'

const mapDispatchToProps = {
    getImages
};

export default connect(
    null,
    mapDispatchToProps
)(Bar);

