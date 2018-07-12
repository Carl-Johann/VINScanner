//
//  SetupFunctions.swift
//  VINScanner
//
//  Created by Joe on 24/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import AVFoundation


extension SwiftCameraView {
  
  // MARK: - Setup
  func viewSetup() {
    // Starts the video.
    startLiveVideo()
    
    // The 'Scan Now' and 'Enter Now' buttons.
//    scanNowTypeNowBtnSetup()
    
    // The function responsible for creating the 'rectOfInterest' and it's corresponding 'mask' and 'succesRect'.
    // They are responsible for show the user for how much longer to scan the Unit or VIN.
//    createUIScanRects()
    
    // Creates a UITapGestureRecognizer, so the user can click on the screen, and manually focus on the user's click.
//    let focus: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(manualFocus(_:)))
//    self.addGestureRecognizer(focus)
  }
  
  
  
  
  
//
//
//  func scanNowTypeNowBtnSetup() {
//    let buttonWidth = ((self.screenWidth * 0.75) / 2) - 5
//    let buttonHeight: CGFloat = 55
//
//    // 'Scan Now' button
//    let scanNowButton = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Scan Now")
//    scanNowButton.center = CGPoint(x: ((self.screenWidth/2) + (buttonWidth/2)) + 5, y: self.screenHeight * 0.75)
//    scanNowButton.addTarget(self, action: #selector(self.manualScan(sender:)), for: .touchUpInside)
//
//    // 'Enter Now' button
//    let typeNowButton = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Enter Now")
//    typeNowButton.center = CGPoint(x: ((self.screenWidth/2) - (buttonWidth/2)) - 5 , y: self.screenHeight * 0.75)
//    typeNowButton.addTarget(self, action: #selector(self.enterVINOrUnitmanually(sender:)), for: .touchUpInside)
//
//    if isIPhoneX == true {
//      scanNowButton.frame.origin.y -= 40
//      typeNowButton.frame.origin.y -= 40
//      self.rectOfInterest.origin.y -= 40
//    }
//
//    scanNowButton.isUserInteractionEnabled = true
//    typeNowButton.isUserInteractionEnabled = true
//
//    self.addSubview(scanNowButton)
//    self.addSubview(typeNowButton)
//    self.bringSubview(toFront: scanNowButton)
//    self.bringSubview(toFront: typeNowButton)
//  }
  
  
  
  func startLiveVideo() {
    
//    for input in self.session.inputs { self.session.removeInput(input) }
//    for output in self.session.outputs { self.session.removeOutput(output) }

    //    check for sim or old device
    let deviceInput = try! AVCaptureDeviceInput(device: captureDevice!)
//    let deviceOutput = AVCaptureVideoDataOutput()
////    deviceOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)]
////    deviceOutput.setSampleBufferDelegate(self, queue: DispatchQueue.global(qos: DispatchQoS.QoSClass.default))
    
    
    // To get the video to fill the whole screen on an iPhoneX
    if isIPhoneX {
      imageLayer.videoGravity = .resizeAspectFill
    }
    imageLayer.session = session
    imageLayer.frame = self.frame
    self.layer.addSublayer(imageLayer)

    let deviceOutput = AVCaptureMetadataOutput()
//    deviceOutput.rectOfInterest = rectOfInterest
    
    session.addInput(deviceInput)
    session.addOutput(deviceOutput)
    
    deviceOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
    deviceOutput.metadataObjectTypes = [.code128]
    
    
    session.startRunning()
  }

  
  
  
  func createUIScanRects() {
    let viewOfInterest = UIView(frame: self.rectOfInterest)
    viewOfInterest.layer.cornerRadius = 2
    viewOfInterest.layer.borderWidth = 4
    viewOfInterest.layer.borderColor = UIColor.lightGray.cgColor
    viewOfInterest.tag = 99
    
    if isIPhoneX == true {
      self.rectOfInterest.origin.y -= 40
    }
  
    self.addSubview(viewOfInterest)
    
    
//    self.successRect.frame = self.rectOfInterest
//    self.successRect.layer.cornerRadius = 2
//    self.successRect.layer.borderWidth = 4
//    self.successRect.layer.borderColor = UIColor.green.cgColor
//    self.addSubview(self.successRect)
//
//    self.succesMask.contentsGravity = kCAGravityResizeAspect
//    self.succesMask.bounds = CGRect(x: 0, y: 0, width: 0, height: self.screenHeight * 0.1)
//    self.succesMask.anchorPoint = CGPoint(x: 0.5, y: 0.5)
//    self.succesMask.backgroundColor = UIColor.orange.cgColor
//    self.succesMask.position = CGPoint(x: self.successRect.frame.size.width/2, y: self.successRect.frame.size.height/2)
//    self.successRect.layer.mask = self.succesMask
  }
  
}
