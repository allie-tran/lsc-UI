import { connect } from 'react-redux'
import { saveScene } from './actions/save'
import ImageGrid from '../components/Images'


function mapStateToProps(state) {
    return { collection: state.search.collection }
}


export default connect(
    mapStateToProps,
    null
)(ImageGrid);

