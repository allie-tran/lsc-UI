import { connect } from 'react-redux';
import { getSimilar, getGroups, getNextScenes } from './actions/search';

import Page from '../components/Page';

const mapDispatchToProps = {
    getSimilar,
    getGroups, getNextScenes,
};

export default connect(null, mapDispatchToProps)(Page);
