import {
	GET_ALL_IMAGES,
    MORE,
	SET_MAP,
	NEXT_SCENE,
	CLEAR_NEXT_SCENE,
	SET_BOUND,
	SET_INFO,
	SET_KEYWORDS,
    SIMILAR,
    GET_GROUP,
    GET_GPS,
    GET_INFO,
    SET_MUST_NOT,
    REMOVE_MUST_NOT,
    SET_FINISH_SEARCH
} from '../actions/search';
import axios from 'axios';

export const searchState = {
	collection: null,
	dates: [],
    visualisation: [],
	nextSceneResponse: null,
	bounds: null,
	info: null,
	keywords: [],
    similarResponse: null,
    groupResponse: null,
    gpsResponse: null,
    infoResponse: null,
    stats: [],
    finishedSearch: 0
};

var isEqual = require('lodash.isequal');

export default function(state = searchState, action) {
	if (action.type === SET_BOUND) {
		return {
			...state,
			bounds: action.bounds
		};
	} else if (action.type === GET_ALL_IMAGES) {
		if (!action.ignoreInfo && state.keywords.length > 0) {
			let newInfo = JSON.parse(JSON.stringify(state.info));
			newInfo.expansion_score = {};
			state.keywords.forEach((keyword) => {
				newInfo.expansion_score[keyword[0]] = keyword[1];
			});
            newInfo.must_not_terms = state.stats.slice()
			const response = axios.post(
				'http://mysceal-sv.computing.dcu.ie/api/images/',
				{
					query: {
						before: '',
						after: '',
						current: '',
						info: newInfo
					},
					gps_bounds: state.bounds,
                    starting_from: action.starting_from,
                    share_info: action.share_info
				},
				{ headers: { 'Content-Type': 'application/json' } }
			);
			return {
				...state,
				collection: response
			};
		} else {
			const response = axios.post(
				'http://mysceal-sv.computing.dcu.ie/api/images/',
				{ query: action.query, gps_bounds: state.bounds,
                    starting_from: action.starting_from, share_info: action.share_info },
				{ headers: { 'Content-Type': 'application/json' } }
			);
			return {
				...state,
				collection: response,
                stats: []
			};
		}
    } else if (action.type === MORE) {
        const response = axios.post('http://mysceal-sv.computing.dcu.ie/api/more/',
            {
                info: state.info
            },
            { headers: { 'Content-Type': 'application/json' } }
		);
			return {
				...state,
				collection: response,
                stats: []
			};
    } else if (action.type === SET_FINISH_SEARCH) {
        return {
            ...state,
            finishedSearch: action.finishedSearch
        };
	} else if (action.type === SET_MAP) {
		if (!isEqual(state.dates, action.dates)) {
			return {
				...state,
				dates: action.dates
			};
		}
	} else if (action.type === NEXT_SCENE) {
		const response = axios.post(
			'http://mysceal-sv.computing.dcu.ie/api/timeline/',
			{
				images: action.images,
				timeline_type: action.timeline_type,
                direction: action.direction
			},
			{ headers: { 'Content-Type': 'application/json' } }
		);
		return {
			...state,
			nextSceneResponse: response
		};
	} else if (action.type === CLEAR_NEXT_SCENE) {
		return {
			...state,
			nextSceneResponse: null,
            groupResponse: null,
            similarResponse: null,
            infoResponse: null
		};
    } else if (action.type === GET_GROUP){
        const response = axios.post(
			'http://mysceal-sv.computing.dcu.ie/api/timeline/group/',
			{
				date: action.date
			},
			{ headers: { 'Content-Type': 'application/json' } }
		);
        return {
			...state,
			groupResponse: response
		};
    } else if (action.type === GET_GPS){
        const response = axios.post(
			'http://mysceal-sv.computing.dcu.ie/api/gps/',
			{
				image: action.image
			},
			{ headers: { 'Content-Type': 'application/json' } }
		);
        return {
			...state,
			gpsResponse: response
		};
    } else if (action.type === GET_INFO) {
        const response = axios.post(
            'http://mysceal-sv.computing.dcu.ie/api/timeline/info/',
            {
                images: action.images
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return {
            ...state,
            infoResponse: response
        };
    }
    else if (action.type === SET_INFO) {
		if (!isEqual(state.info, action.info)) {
			return {
				...state,
				info: action.info
			};
		}
	} else if (action.type === SET_KEYWORDS) {
		if (!isEqual(state.keywords, action.keywords)) {
			return {
				...state,
				keywords: action.keywords
			};
		}
	} else if (action.type === SIMILAR) {
        const response = axios.post(
                'http://mysceal-sv.computing.dcu.ie/api/similar',
                {
                    image_id: action.image,
                    lsc: true,
                    info: state.info,
                    gps_bounds: state.bounds,
                },
                { headers: { 'Content-Type': 'application/json' } }
        );
		return {
			...state,
			similarResponse: response
		}
	} else if (action.type === SET_MUST_NOT) {
        if (!state.stats.includes(action.keyword)){
            let newStats = state.stats.slice()
            newStats.push(action.keyword)
            return {
                ...state,
                stats: newStats
            };
        }
    }
    else if (action.type === REMOVE_MUST_NOT) {
        let newStats = []
        state.stats.forEach(kw => kw === action.keyword? null: newStats.push(kw))
        if (!isEqual(state.stats, newStats)) {
			return {
				...state,
				stats: newStats
			};
		}
    }
	return state;
}
