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
  
  
  
  
  // Missing Coordinates Error
  func raiseMissingCoordinatesError() {
    guard let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter else { print("ERROR at raiseMissingCoordinatesError"); return }
    eventEmitter.sendEvent(withName: "RaiseMissingCoordinatesAlert", body: "")

  }
  
  @objc(missingCoordinatesErrorFromJS:)
  func missingCoordinatesErrorFromJS(_ name: Int) {
    print("missingCoordinatesError called from javascript")

    // For debugging purposes we startLiveVideo. Prod should be startSession()
    startLiveVideo()
    //    startSession()
  }
  //  
  
}
