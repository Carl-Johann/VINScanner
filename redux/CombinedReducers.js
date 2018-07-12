import { combineReducers } from 'redux'

import ViewsReducer       from './Views/ViewsReducer'
import StockCountReducer  from './StockCount/StockCountReducer'
import ScannedDataReducer from './ScannedData/ScannedDataReducer'
import DetailBoxesReducer from './DetailBoxes/DetailBoxesReducer'

export default combineReducers({
  ViewsReducer      ,
  StockCountReducer ,
  ScannedDataReducer,
  DetailBoxesReducer,
})