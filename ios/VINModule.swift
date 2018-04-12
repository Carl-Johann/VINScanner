//
//  VINModule.swift
//  VINScanner
//
//  Created by Joe on 29/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

@objc(VINModul)
class VINModul : RCTEventEmitter {
  
  @objc(RaiseMissingCoordinatesAlert)
  func RaiseMissingCoordinatesAlert() {
    print("Asking JS to raise an alert, since that apparently not possible in iOS with react-native")
  }
  
  
  
  
  
  
  
  @objc(ShouldShowVinDetail)
  func ShouldShowVinDetail() {
    print("ShouldShowVinDetail was called from swift")
  }
  
  
  @objc(VINNotReturned)
  func VINNotReturned() {
    print("VIN not return error posted to JS")
  }
  
  
  @objc(DoesVINExistInDatabase:)
  func DoesVINExistInDatabase(_ toShow: Bool) {
    print("Asking JS to either show or hide VIN detail")
  }
  
  @objc(hideAndResetEverything)
  func hideAndResetEverything() {
    print("Resets everything. An error occured")
  }
  
  @objc(VINIsAVIN:)
  func VINIsAVIN(_ data: [String : AnyObject]) {
    print("VIN exists. Sending data to JS")
  }
  
  @objc
  override func supportedEvents() -> [String]! {
    return ["ShouldShowVinDetail", "RaiseMissingCoordinatesAlert", "VINNotReturned", "DoesVINExistInDatabase", "hideAndResetEverything", "VINIsAVIN"]
  }
  
  
}
