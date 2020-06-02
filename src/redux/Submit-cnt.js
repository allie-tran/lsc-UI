import { connect } from 'react-redux';
import Submit from '../components/Submit';
import { nextQuery, exportSaved, disable } from './actions/submit'

function mapStateToProps(state) {
	return {
        currentQuery: state.save.currentQuery,
        saved: state.save.saved,
        timerRunning: state.save.timerRunning,
        saveResponse: state.save.saveResponse,
        finished: state.save.finished[state.save.currentQuery - 1]
	};
}

const mapDispatchToProps = {
    nextQuery,
    exportSaved,
    disable
};

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
