//
//  FunctionsFromRN.swift
//  VINScanner
//
//  Created by Joe on 25/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

@objc(SwiftCameraView)
extension SwiftCameraView {
  
  
  @objc(shouldShowCameraView:)
  func shouldShowCameraView(_ ShouldScan: Bool) {
    //    print("checkVINOrScanAgain called from javascript with value", ShouldScan)
    
    print(1)
    print(1)
    print(1)
    print("ShouldScan", ShouldScan)
    print(1)
    print(1)
    print(1)
    
  }
    
//    if ShouldScan == true {
//      // User wants to scan.
//      self.showCameraView()
//
//    } else if ShouldScan == false {
//      // User wants to change characters manually
//      self.showDataCorrectionView()
//      self.correctDataFromGoogleManually()
//
//    } else {
//      // Something isn't right if it gets here
//      print("ERROR CheckDataOrScanAgain swift")
//      self.showCameraView()
//    }
//  }
//
}
