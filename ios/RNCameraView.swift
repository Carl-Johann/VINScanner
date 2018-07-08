//
//  RNCameraView.swift
//  VINScanner
//
//  Created by Joe on 24/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import AVFoundation


@objc(RNCameraViewSwift)
class RNCameraViewSwift : RCTViewManager {
  let screenWidth = UIScreen.main.bounds.width
  let screenHeight = UIScreen.main.bounds.height
  
  override func view() -> UIView! {
//    print("RNCameraViewSwift2")
    
    return SwiftCameraView(frame: CGRect(x: 0, y: 0, width: screenWidth, height: screenHeight), bridge: self.bridge)
  }
  
  @objc(shouldShowCameraView:)
  func shouldShowCameraView(_ ShouldScan: Bool) {
    //    print("checkVINOrScanAgain called from javascript with value", ShouldScan)
  }
}


@objc(SwiftCameraView)
class SwiftCameraView : UIView, AVCaptureVideoDataOutputSampleBufferDelegate, AVCaptureMetadataOutputObjectsDelegate {
  
  // MARK: - Global Values
  let screenWidth = UIScreen.main.bounds.width
  let screenHeight = UIScreen.main.bounds.height
  
  let isIPhoneX = UIScreen.main.nativeBounds.height == 2436 ? true : false
  var bridge: RCTBridge? = nil
  
  var succesMask: CALayer = CALayer()
  var successRect: UIView = UIView()

  
  let captureDevice = AVCaptureDevice.default(for: AVMediaType.video)
  let session = AVCaptureSession()
  let imageLayer = AVCaptureVideoPreviewLayer()


  let urlSession = URLSession.shared
  
  
  var takePicture: Bool = false
  var enterDataManually: Bool = false
  
  var shouldScan: Bool = true  
  var loaded: Int = 0
  //  How many times the camera will have to detect a charachter word
  let scanThreshold: Int = 3
  
  var rectOfInterest = CGRect(
                              x: (UIScreen.main.bounds.width / 2) - (UIScreen.main.bounds.width * 0.375),
                              y: UIScreen.main.bounds.height / 2 - (UIScreen.main.bounds.height * 0.045),
                              width: UIScreen.main.bounds.width * 0.75,
                              height: UIScreen.main.bounds.height * 0.09 )
  
  
  

  
  // MARK: - Init
  init(frame: CGRect, bridge: RCTBridge) {
    super.init(frame: frame)
    self.frame = frame
    self.bridge = bridge
    //    print("SwiftCameraView init")
    //    guard let eventEmitter = bridge.module(for: VINModul.self ) as? RCTEventEmitter else { print("Couldn't get eventEmitter in SwiftCameraView"); return }
    //    eventEmitter.sendEvent(withName: "ShouldShowFirstDetailBox", body: "true")
    
//    DispatchQueue.main.async {
//      ApiRequests.sharedInstance.lort()
//    }
    
    viewSetup()
  }
  
  
  
  func hideCameraView() {
    guard let RCTBridge = self.bridge else { print("Couldn't get self.bridge in enterVINOrUnitmanually()"); return }
    guard let eventEmitter = RCTBridge.module(for: VINModul.self ) as? RCTEventEmitter else { print("Couldn't get eventEmitter in lorteView"); return }
    eventEmitter.sendEvent(withName: "ShouldShowCameraView", body: [ "shouldShow" : false ])
  }
  
  
  
  
  func cleanCharacters(_ VIN: String) -> String {
    var text = VIN
  
    text = text.uppercased()
    text = text.replacingOccurrences(of: "I", with: "1")
    text = text.replacingOccurrences(of: "Q", with: "0")
    text = text.replacingOccurrences(of: "O", with: "0")
    text = text.stripped
    
    return text
  }
  
  
  
  
  
  
  
  
  
  // MARK: - Button functions
  @objc func enterVINOrUnitmanually(sender: UIButton) {
    // Some (mostly) VIN's are pretty impossible to scan, so we provide the possibility to enter a VIN or Unit manually
    print("Should show data correction view")
    self.enterDataManually = true
  }
  
  @objc func manualScan(sender: UIButton) {
    // Since I couldn't figure out how to manually capture a frame,
    // and taking a screenshot doesn't work on.
//    print("fucking shit")
    self.takePicture = true
    
    
//    DispatchQueue.main.async {
//      ApiRequests.sharedInstance.validateVIN("912903", self.bridge!)
//    }
    
  }
  
  
  
  @objc func manualFocus(_ sender: UITapGestureRecognizer) {
  
    let x = sender.location(in: self).y / screenHeight
    let y = 1.0 - sender.location(in: self).x / screenWidth
    let focusPoint = CGPoint(x: x, y: y)
    
    if let device = captureDevice {
      do {
        try device.lockForConfiguration()
        
        device.focusPointOfInterest = focusPoint
        device.focusMode = .autoFocus
        device.exposurePointOfInterest = focusPoint
        device.exposureMode = AVCaptureDevice.ExposureMode.continuousAutoExposure
        device.unlockForConfiguration()
      }
      catch { }
    }
  }
  
  
  // MARK: - setX functions
  @objc func setLocations(_ locations: NSArray) {
//    print(1)
    //    print(locations)
  }
  
  @objc func setShouldScan(_ shouldScan: Bool) {
//    print("Setting shouldScan to:", shouldScan)
    self.shouldScan = shouldScan
  }
  
  @objc func setShouldEnterDataManually(_ shouldEnterDataManually: Bool) {
//    print("Setting shouldEnterDataManually to:", shouldEnterDataManually)
//    print("ShouldScan:", self.shouldScan)
    self.enterDataManually = shouldEnterDataManually
  }
  
  @objc func setShouldTakePicture(_ shouldTakePicture: Bool) {
//    print("Setting setShouldTakePicture to:", shouldTakePicture)
    self.takePicture = shouldTakePicture
  }
  
  @objc func setTakingStock(_ shouldTakeStock: Bool) {
//    print("Setting taking stock to:", shouldScan)
//    self.takePicture = shouldScan
//    self.shouldScan = shouldScan
  }
  
  @objc func setColors(_ colors: NSArray) {
//    print(2)
    //    print(colors)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
