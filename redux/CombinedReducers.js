import { combineReducers } from 'redux'

import ViewsReducer       from './Views/ViewsReducer'
import ScannedDataReducer from './ScannedData/ScannedDataReducer'
import DetailBoxesReducer from './DetailBoxes/DetailBoxesReducer'

export default combineReducers({
  ViewsReducer,
  ScannedDataReducer,
  DetailBoxesReducer,
})