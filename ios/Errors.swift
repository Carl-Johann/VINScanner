//
//  File.swift
//  VINScanner
//
//  Created by Joe on 30/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

@objc(RNCameraViewSwift)
extension RNCameraViewSwift {
  
  
  
  
//  // Missing Coordinates Error
//  func raiseMissingCoordinatesError() {
//    guard let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter else { print("ERROR at raiseMissingCoordinatesError"); return }
//    eventEmitter.sendEvent(withName: "RaiseMissingCoordinatesAlert", body: "")
//
//  }
  
//  @objc(missingCoordinatesErrorFromJS:)
//  func missingCoordinatesErrorFromJS(_ name: Int) {
//    print("missingCoordinatesError called from javascript")
//
//    // For debugging purposes we startLiveVideo. Prod should be startSession()
////    startLiveVideo()
//        self.showCameraView()
//  }
  //

  
  
 
  // This function gets called when the VIN doens't exist in the database. The user either clicks 'Check VIN' or
  // 'Scan Again'. If the user wants to scan vin we show the the correctDataFromGoogleManually()
  @objc(CheckDataOrScanAgain:)
  func CheckDataOrScanAgain(_ ShouldScan: Bool) {
//    print("checkVINOrScanAgain called from javascript with value", ShouldScan)
    
    
    if ShouldScan == true {
    // User wants to scan.
      self.showCameraView()
    
    } else if ShouldScan == false {
    // User wants to change characters manually
      self.showDataCorrectionView()
      self.correctDataFromGoogleManually()
    
    } else {
      // Something isn't right if it gets here
      print("ERROR CheckDataOrScanAgain swift")
      self.showCameraView()
    }
  }
  
  
  
  
  
}
