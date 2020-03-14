import { connect } from 'react-redux'
import { setScene } from './actions/search'
import ImageGrid from '../components/Images'


function mapStateToProps(state) {
    return { collection: state.search.collection }
}

const mapDispatchToProps = {
    setScene
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageGrid);

