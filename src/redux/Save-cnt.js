import { connect } from 'react-redux';
import Save from '../components/Save';
import { setKeywords } from './actions/search';
import { setSaved } from './actions/save'

function mapStateToProps(state) {
	return {
		saved: state.save.saved,
		info: state.search.info,
		keywords: state.search.keywords,
	};
}

const mapDispatchToProps = {
	setKeywords,
    setSaved
};

export default connect(mapStateToProps, mapDispatchToProps)(Save);
