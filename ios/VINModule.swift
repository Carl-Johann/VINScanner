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
  
  
  @objc(ShouldShowFirstDetailBox)
  func ShouldShowFirstDetailBox() {
    print("ShouldShowFirstDetailBox was called from swift")
  }

  
  @objc(ShouldShowDataInFirstDetailBox:)
  func ShouldShowDataInFirstDetailBox(_ data: [String : AnyObject]) {
    print("Data exists. Sending to JS")
  }

  
  @objc(ShouldShowDataInSecondDetailBox:)
  func ShouldShowDataInSecondDetailBox(_ toShow: Bool) {
    print("Asking JS to either show or hide VIN detail")
  }
  
  
  @objc(NoDataReturnedFromGoogle)
  func NoDataReturnedFromGoogle() {
    print("VIN not return error posted to JS")
  }

  
  @objc(hideAndResetEverything)
  func hideAndResetEverything() {
    print("Resets everything. An error occured")
  }
  
  
  @objc(showCameraView)
  func showCameraView() {
    print("Should show CameraView")
  }
  
  @objc(shouldShowDataCorrectionView)
  func showDataCorrectionView() {
    print("Should show DataCorrectionView")
  }
  
  
  
  @objc
  override func supportedEvents() -> [String]! {
    return ["ShouldShowFirstDetailBox", "NoDataReturnedFromGoogle", "ShouldShowDataInSecondDetailBox", "hideAndResetEverything", "ShouldShowDataInFirstDetailBox",
            
        "ShouldShowCameraView", "shouldShowDataCorrectionView"
    ]
  }
  
  
}
