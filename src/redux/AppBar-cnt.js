import {connect} from 'react-redux'
import {getImages} from './actions/search'
import {resetSelection} from './actions/select'

import Bar from '../components/AppBar'

const mapDispatchToProps = {
    getImages,
    resetSelection
};

export default connect(
    null,
    mapDispatchToProps
)(Bar);
