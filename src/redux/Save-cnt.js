import { connect } from 'react-redux';
import Save from '../components/Save';
import { setKeywords } from './actions/search';
import { nextQuery, exportSaved } from './actions/submit'

function mapStateToProps(state) {
	return {
		saved: state.save.saved,
		info: state.search.info,
		keywords: state.search.keywords,
	};
}

const mapDispatchToProps = {
	setKeywords,
};

export default connect(mapStateToProps, mapDispatchToProps)(Save);
