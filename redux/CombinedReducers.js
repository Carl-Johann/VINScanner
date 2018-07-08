import { combineReducers } from 'redux'
import ScannedDataReducer from './ScannedData/ScannedDataReducer'
import DetailBoxesReducer from './DetailBoxes/DetailBoxesReducer'

export default combineReducers({
  ScannedDataReducer,
  DetailBoxesReducer,

})