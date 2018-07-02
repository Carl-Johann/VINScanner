//
//  RNDataCorrectionView.swift
//  VINScanner
//
//  Created by Joe on 23/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation


@objc(RNDataCorrectionView)
class RNDataCorrectionView: RCTViewManager {
  override func view() -> UIView! {
    return SwiftDataCorrectionView(
      frame: CGRect(
                      x: 0,
                      y: 0,
                      width: UIScreen.main.bounds.width,
                      height: UIScreen.main.bounds.height
                    ),
      bridge: self.bridge
    )
  }
}



class SwiftDataCorrectionView : UIView, UITextFieldDelegate {
  var bridge: RCTBridge? = nil
  
  let isIPhoneX = UIScreen.main.nativeBounds.height == 2436 ? true : false

  var comparisonImage: UIImage? = nil
  var dataFromScan: String? = nil
  
  var toolbar: UIToolbar = UIToolbar(frame: CGRect(x: 0, y: 0,  width: UIScreen.main.bounds.width, height: 45))

  let screenWidth = UIScreen.main.bounds.width
  let screenHeight = UIScreen.main.bounds.height
  
  
  
  

  init(frame: CGRect, bridge: RCTBridge) {
    super.init(frame: frame);
    self.frame = frame;
    self.bridge = bridge
    print("SwiftDataCorrectionView initialized")
    
    let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.endEditing(_:)))
    self.addGestureRecognizer(tap)
    self.backgroundColor = UIColor.lightGray.withAlphaComponent(0.2)
    
//    guard let eventEmitter = bridge.module(for: VINModul.self ) as? RCTEventEmitter else { print("Couldn't get eventEmitter in SwiftDataCorrectionView"); return }
//    eventEmitter.sendEvent(withName: "ShouldShowFirstDetailBox", body: "true")
  }
  
  
  
  @objc func setLocation(_ locations: NSArray) {
    print(11)
    //    print(locations)
  }
  
  @objc func setDataFromScan(_ dataFromScan: NSString) {
//    print("setting data from scan")
//    print("data from scan length", dataFromScan.length)
    self.dataFromScan = dataFromScan as String
    
  }
  
  @objc func setImageAs64AndDataFromScan(_ imageAs64AndDataFromScan: NSDictionary) {
//    print(123, imageAs64AndDataFromScan)
//    print(456, imageAs64AndDataFromScan["dataFromScan"]!)
    
    if let safeDataFromScan = imageAs64AndDataFromScan["dataFromScan"] as? String {
      self.dataFromScan = safeDataFromScan
    }
    
    if let imageAs64 = imageAs64AndDataFromScan["imageAs64"] as? String {
      if let decodedData = Data(base64Encoded: imageAs64, options: .ignoreUnknownCharacters) {
        if let image = UIImage(data: decodedData) {
          comparisonImage = image
//          print("image converted")
        } else {
          comparisonImage = UIImage()
//          print("Couldn't decode data in decodedData")
        }
      }
    }
    
    viewSetup()
    
  }
  
  @objc func setImageAs64(_ imageAs64: String) {
//    print("setComparisonImage called")
    if let decodedData = Data(base64Encoded: imageAs64, options: .ignoreUnknownCharacters) {
      if let image = UIImage(data: decodedData) {
        comparisonImage = image
      } else {
        comparisonImage = UIImage()
        print("Couldn't decode data in decodedData")
      }
    } else {
      print("Couldn't decode image in setComparisonImage()")
    }
    
    
  }
  
  @objc func setColor(_ colors: NSArray) {
//    print(22)
    //    print(colors)
  }
  
  
  
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
