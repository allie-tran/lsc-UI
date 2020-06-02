import {connect} from 'react-redux'
import {getImages} from './actions/search'
import {resetSelection} from './actions/select'
import {startTimer} from './actions/submit'

import Bar from '../components/AppBar'

const mapDispatchToProps = {
    getImages,
    resetSelection,
    startTimer
};

export default connect(
    null,
    mapDispatchToProps
)(Bar);
