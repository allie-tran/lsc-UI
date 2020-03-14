import { connect } from 'react-redux'
import { removeScene } from './actions/save'
import Save from '../components/Save'


function mapStateToProps(state) {
    return { saved: state.save.saved }
}

export default connect(
    mapStateToProps,
    null
)(Save);

