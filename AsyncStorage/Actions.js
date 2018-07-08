import { AsyncStorage } from 'react-native'

import {
    STOCK_COUNT_OBJECT_KEY,
} from './AsyncStorageKeys'



export const getStockCountObjectActionAS = (callback) =>  {
  AsyncStorage.getItem( STOCK_COUNT_OBJECT_KEY )
  .then( data => {
    data = JSON.parse(data)
    callback(data)
  })
}

export const getStockCountValueActionAS = (callback, key) =>  {
  AsyncStorage.getItem( STOCK_COUNT_OBJECT_KEY )
  .then( data => {
    data = JSON.parse(data)
    data = data[key]
    callback(data)
  })
}


export const setSiteActionAS = (site) => {
  return AsyncStorage.mergeItem( STOCK_COUNT_OBJECT_KEY, JSON.stringify({
    site
  }))
}


export const setBatchIdActionAS = (batchId) => {
  return AsyncStorage.mergeItem( STOCK_COUNT_OBJECT_KEY, JSON.stringify({
    batchId
  }))
}

export const setCountInitActionAS = (countInit) => {
  return AsyncStorage.mergeItem( STOCK_COUNT_OBJECT_KEY, JSON.stringify({
    "count-init": countInit
  }))
}