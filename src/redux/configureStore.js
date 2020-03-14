import {applyMiddleware, createStore} from 'redux';
import {apiMiddleware} from 'redux-api-middleware';
import reducer from './reducers'
import thunkMiddleware from 'redux-thunk'


export default function configureStore(initialState = {}) {
  const middlewares = [thunkMiddleware, apiMiddleware]
  const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
  return createStoreWithMiddleware(reducer, initialState);
}