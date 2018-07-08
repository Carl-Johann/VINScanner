//
//  CameraView.swift
//  test01
//
//  Created by Joe on 22/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import AVKit
import UIKit
import AVFoundation
import Vision




//
//class lorteView : UIView, AVCaptureVideoDataOutputSampleBufferDelegate, AVCaptureMetadataOutputObjectsDelegate, UITextFieldDelegate {
//
//  init(frame: CGRect, bridge: RCTBridge) {
//    super.init(frame: frame);
//    self.frame = frame;
//    print("lorteView init")
//
//
//
//
//
//
////    guard let eventEmitter = bridge.module(for: VINModul.self ) as? RCTEventEmitter else { print("Couldn't get eventEmitter in lorteView"); return }
////    eventEmitter.sendEvent(withName: "ShouldShowFirstDetailBox", body: "true")
//
//  }
//
//  required init?(coder aDecoder: NSCoder) {
//    fatalError("init(coder:) has not been implemented")
//  }
//
//
//  @objc(setLocations:)
//  func setLocations(_ locations: NSArray) {
//    print(1)
////    print(locations)
//  }
//
//
//  @objc func setColors(_ colors: NSArray) {
//    print(2)
////    print(colors)
//  }
//}





@objc(RNCameraViewSwift)
class RNCameraViewSwift : RCTViewManager, AVCaptureVideoDataOutputSampleBufferDelegate, AVCaptureMetadataOutputObjectsDelegate, UITextFieldDelegate {
  
  // MARK: - Global Variables And Constants
  let screenWidth = UIScreen.main.bounds.width
  let screenHeight = UIScreen.main.bounds.height
  
  var contentView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  var cameraView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  var dataCorrectionView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  
  let urlSession = URLSession.shared
  var mask: CALayer = CALayer()
  var successRect: UIView = UIView()
  var toolbar: UIToolbar = UIToolbar(frame: CGRect(x: 0, y: 0,  width: UIScreen.main.bounds.width, height: 45))
  
  var takePicture = false
  var enterDataManually = false
  
  let isIPhoneX = UIScreen.main.nativeBounds.height == 2436 ? true : false
  
  let session = AVCaptureSession()
  let imageLayer = AVCaptureVideoPreviewLayer()
  
  let captureDevice = AVCaptureDevice.default(for: AVMediaType.video)
  var rectOfInterest = CGRect(x: (UIScreen.main.bounds.width / 2) - (UIScreen.main.bounds.width * 0.375),
                              y: UIScreen.main.bounds.height / 2 - (UIScreen.main.bounds.height * 0.045),
                              width: UIScreen.main.bounds.width * 0.75,
                              height: UIScreen.main.bounds.height * 0.09)
  var loaded = 0
  var vinScanned: Bool = false
  //  How many times the camera will have to detect a charachter word
  let scanThreshold: Int = 3
  
  
  var userWantsToScan: Bool? = nil
  var croppedImageForScan: UIImage? = nil
  var dataFromScan: String? = nil
  
//  var colors: [UIColor] = []
  var locations: [CGFloat] = []
  
 
  
  
  
  
  
  // MARK: - 'ViewDidLoad'
  override func view() -> UIView! {
    
    // dataCorrectionView should be hidden in the beginning
//    dataCorrectionView.alpha = 0
//    startLiveVideo()
    
//
//
//
////    let buttonWidth = ((self.screenWidth * 0.75) / 2) - 5
//    let buttonWidth = self.screenWidth * 0.75
//    let buttonHeight: CGFloat = 55
//
//    // 'Scan Now' button
//    let scanNowButton = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Scan Now")
//    scanNowButton.center = CGPoint(x: self.screenWidth/2, y: self.screenHeight * 0.75)
//    scanNowButton.addTarget(self, action: #selector(self.manualScan(sender:)), for: .touchUpInside)
//
//    // 'Enter Now' button
////    let typeNowButton = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Enter Now")
////    typeNowButton.center = CGPoint(x: ((self.screenWidth/2) - (buttonWidth/2)) - 5 , y: self.screenHeight * 0.75)
////    typeNowButton.addTarget(self, action: #selector(self.enterVINOrUnitmanually(sender:)), for: .touchUpInside)
//
//    if isIPhoneX {
//      scanNowButton.frame.origin.y -= 40
////      typeNowButton.frame.origin.y -= 40
//      self.rectOfInterest.origin.y -= 40
//    }
//
//    self.cameraView.addSubview(scanNowButton)
////    self.cameraView.addSubview(
//
//
//
//    // The scanned data should be inside of the rect
//    self.createUIScanRects()
//
//    let focus: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(manualFocus(_:)))
//    cameraView.addGestureRecognizer(focus)
//
//    // Creates a gesture recognizer that hides the keyboard when the screen is clicked
//    let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: contentView, action: #selector(dataCorrectionView.endEditing(_:)))
//    dataCorrectionView.addGestureRecognizer(tap)
//    dataCorrectionView.backgroundColor = UIColor.lightGray.withAlphaComponent(0.2)
//
//    //init toolbar
//    setupVINCorrectionKeyboardToolbar()
//
//
//    self.contentView.backgroundColor = UIColor(hex: "#282828")
//    self.cameraView.backgroundColor = UIColor(hex: "#282828")
//    self.dataCorrectionView.backgroundColor = UIColor(hex: "#282828")
//
//
//    self.contentView.addSubview(dataCorrectionView)
//    self.contentView.addSubview(cameraView)
//
    return SwiftCameraView(frame: CGRect(x: 0, y: 0, width: screenWidth, height: screenHeight), bridge: self.bridge)
//    return contentView
  }

  @objc(setLocations:)
  func setLocations(_ locations: NSArray) {
    print(1)
//    print(locations)
  }


  @objc func setColors(_ colors: NSArray) {
    print(2)
//    print(colors)
  }

  func startLiveVideo() {        
    
    for input in self.session.inputs { self.session.removeInput(input) }
    for output in self.session.outputs { self.session.removeOutput(output) }
    
    //    check for sim or old device
    let deviceInput = try! AVCaptureDeviceInput(device: captureDevice!)
    let deviceOutput = AVCaptureVideoDataOutput()
    deviceOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)]
    deviceOutput.setSampleBufferDelegate(self, queue: DispatchQueue.global(qos: DispatchQoS.QoSClass.default))

  
  
    // To get the video to fill most of the screen.
    if isIPhoneX {
        imageLayer.videoGravity = .resizeAspectFill
    }
    imageLayer.session = session
    imageLayer.frame = self.contentView.frame
    self.cameraView.layer.addSublayer(imageLayer)
  
    
    
    session.addInput(deviceInput)
//    session.sessionPreset = .hd4K3840x2160'
    session.addOutput(deviceOutput)

    
    showCameraView()
  }
  
  func createUIScanRects() {
    let viewOfInterest = UIView(frame: self.rectOfInterest)
    viewOfInterest.layer.cornerRadius = 2
    viewOfInterest.layer.borderWidth = 4
    viewOfInterest.tag = 99
    viewOfInterest.layer.borderColor = UIColor.lightGray.cgColor
    self.cameraView.addSubview(viewOfInterest)
    
    
    self.successRect.frame = self.rectOfInterest
    self.successRect.layer.cornerRadius = 2
    self.successRect.layer.borderWidth = 4
    self.successRect.layer.borderColor = UIColor.green.cgColor
    self.cameraView.addSubview(self.successRect)
    
    self.mask.contentsGravity = kCAGravityResizeAspect
    self.mask.bounds = CGRect(x: 0, y: 0, width: 0, height: self.screenHeight * 0.1)
    self.mask.anchorPoint = CGPoint(x: 0.5, y: 0.5)
    self.mask.backgroundColor = UIColor.orange.cgColor
    self.mask.position = CGPoint(x: self.successRect.frame.size.width/2, y: self.successRect.frame.size.height/2)
    self.successRect.layer.mask = self.mask
  }
  
  func showCameraView() {
    DispatchQueue.main.async {
      self.loaded = 0
      self.session.startRunning()
      
      
      // The scanrects disappear for some reason
      // if we don't show them every time cameraview has been send to background
      self.createUIScanRects()
      
      
      
      UIView.animate(withDuration: 0.7, animations: { self.cameraView.alpha = 1 })
      self.contentView.bringSubview(toFront: self.cameraView)
      self.contentView.bringSubview(toFront: self.successRect)
      
//      for view in self.dataCorrectionView.subviews {
//        if let button = view as? YellowRoundedButton {
//          // Do Something
//          print("yellow button")
//          button.isUserInteractionEnabled = false
//        }
//      }

      
      // If the scanner has scanned before, we wait 1 second before activating it again,
      // because it can scan really quick, and that's not always wanted
      if self.vinScanned == true {
        let bg:DispatchQueue = { return DispatchQueue.global(qos: DispatchQoS.QoSClass.background) }() //keep this in the global scope
        bg.async {
          sleep(1)
          self.vinScanned = false
        }
      }
      
    }
  }
  func hideCameraView() {
    DispatchQueue.main.async {
//
//      for view in self.dataCorrectionView.subviews {
//        if let button = view as? YellowRoundedButton {
//          // Do Something
//          print("yellow button")
//          button.isUserInteractionEnabled = true
//        }
//      }
//
      UIView.animate(withDuration: 0.7, animations: {
        self.cameraView.alpha = 0
      }, completion: { success in
        self.contentView.sendSubview(toBack: self.cameraView)
        self.session.stopRunning()
        self.mask.bounds = CGRect(x: 0, y: 0, width: 0, height: self.screenHeight * 0.1)
      })
    }
  }  
  func showDataCorrectionView() {
    DispatchQueue.main.async {
      
//      for view in self.cameraView.subviews {
//        if let button = view as? YellowRoundedButton {
//          // Do Something
//          print("yellow button")
//          button.isUserInteractionEnabled = false
//        }
//      }
//
      
      UIView.animate(withDuration: 0.7, animations: {
        self.dataCorrectionView.alpha = 1
      })
      self.contentView.bringSubview(toFront: self.dataCorrectionView)
      
      if ((self.dataFromScan != nil) && (self.croppedImageForScan != nil)) {
        let scannedVIN = self.dataFromScan!
        let scannedImage = self.croppedImageForScan!
        // Sets the text in the VINCorrection textfields to the newly scanned VIN, else ""
        for i in 1...17 {
          if let textField = self.dataCorrectionView.viewWithTag(100 + i) as? UITextField {
            if i <= scannedVIN.count {
              let text = scannedVIN.index(scannedVIN.startIndex, offsetBy: i - 1)
              textField.text = String(scannedVIN[text])
            } else { textField.text = "" }
          }
        }
        
        guard let comparisonImage = self.dataCorrectionView.viewWithTag(118) as? UIImageView else {
          print("could't get comparisonImage in showDataCorrectionView"); return
        }
        comparisonImage.image = scannedImage
        
      }
    }
  }
  func hideVINCorrectionView() {
    DispatchQueue.main.async {
      
//      for view in self.cameraView.subviews {
//        if let button = view as? YellowRoundedButton {
//          // Do Something
//          print("yellow button")
//          button.isUserInteractionEnabled = true
//        }
//      }
      
      UIView.animate(withDuration: 0.7, animations: {
        self.dataCorrectionView.alpha = 0
      })
      self.contentView.sendSubview(toBack: self.dataCorrectionView)
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  func highlightWord(box: VNTextObservation) -> CGRect  {
    guard let boxes = box.characterBoxes else { return CGRect() }
    
    var maxX: CGFloat = 9999.0
    var minX: CGFloat = 0.0
    var maxY: CGFloat = 9999.0
    var minY: CGFloat = 0.0
    
    for char in boxes {
      if char.bottomLeft.x < maxX { maxX = char.bottomLeft.x }
      if char.bottomRight.x > minX { minX = char.bottomRight.x }
      if char.bottomRight.y < maxY { maxY = char.bottomRight.y }
      if char.topRight.y > minY { minY = char.topRight.y }
    }
    
    let xCord = maxX * contentView.frame.size.width
    let yCord = (1 - minY) * contentView.frame.size.height
    let width = (minX - maxX) * contentView.frame.size.width
    let height = (minY - maxY) * contentView.frame.size.height
    
    return CGRect(x: xCord, y: yCord, width: width, height: height)
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
  

  @objc fileprivate func manualFocus(_ sender: UITapGestureRecognizer) {
    // Since I couldn't figure out how to manually capture a frame,
    // and taking a screenshot doesn't work on

    let x = sender.location(in: cameraView).y / screenHeight
    let y = 1.0 - sender.location(in: cameraView).x / screenWidth
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
  
  
  @objc fileprivate func manualScan(sender: UIButton) {
    // Since I couldn't figure out how to manually capture a frame,
    // and taking a screenshot doesn't work on.
    self.takePicture = true
  }
  
  @objc fileprivate func enterVINOrUnitmanually(sender: UIButton) {
    // Some VIN's are pretty impossible to s
//    print(123)
    self.enterDataManually = true
//    self.setCheckOrScanAttribues(UIImage(), "                 ")
//    self.showDataCorrectionView()
    
  }

  
  
  
  
  
  // MARK: - CaptureOutput QR
  
  func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
    
//    print("detected something")
    // Check if the metadataObjects array is not nil and it contains at least one object.
    if metadataObjects.count == 0 {
//      qrCodeFrameView?.frame = CGRect.zero
      print("No QR code is detected")
//      messageLabel.text = "No QR code is detected"
      return
    }
    
    // Get the metadata object.
    let metadataObj = metadataObjects[0] as! AVMetadataMachineReadableCodeObject
    
//    if metadataObj.type == AVMetadataObject.ObjectType.dataMatrix {
      // If the found metadata is equal to the QR code metadata then update the status label's text and set the bounds
//      let barCodeObject = imageLayer.transformedMetadataObject(for: metadataObj)
//      qrCodeFrameView?.frame = barCodeObject!.bounds
      
      if ((metadataObj.stringValue != nil) && (vinScanned == false)) {
        print("metadataObj.stringValue", metadataObj.stringValue!)
//        messageLabel.text = metadataObj.stringValue
        
        if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
          eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [ "ShouldShow" : true, "VIN" : metadataObj.stringValue! ])
        }
        validateVIN(metadataObj.stringValue!)
      }
    vinScanned = true
//    }
  }
  
  
  
  // MARK: - CaptureOutput Text
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    if self.vinScanned == false {
      
      guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { self.takePicture = false; return }
      var requestOptions:[VNImageOption : Any] = [:]
      guard let outputImage = getImageFromSampleBuffer(sampleBuffer: sampleBuffer) else { self.takePicture = false; return }
      
      let textRequest = VNDetectTextRectanglesRequest { request, error in
        self.detectTextHandler(request: request, error: error, image: outputImage, pixelBuffer: pixelBuffer)
      }
      textRequest.reportCharacterBoxes = true

      
      if let camData = CMGetAttachment(sampleBuffer, kCMSampleBufferAttachmentKey_CameraIntrinsicMatrix, nil) {
        requestOptions = [.cameraIntrinsics:camData]
      }
      
      let imageRequestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: CGImagePropertyOrientation.right, options: requestOptions)
      

      if self.takePicture == false && self.enterDataManually == false {
        do {
          try imageRequestHandler.perform([textRequest])
        } catch {
          print(error)
        }
      } else if self.takePicture == true {
        
        DispatchQueue.main.async {
          self.takePicture = false
          guard let image = self.getImageFromSampleBuffer(sampleBuffer: sampleBuffer) else {
            print("Couldn't get image from getImageFromSampleBuffer()"); return
          }
          self.cropAndPostImage(image)
          self.hideCameraView()
        }
        
      }
//      else if self.enterDataManually == true {
//        DispatchQueue.main.async {
//          self.enterDataManually = false
//          guard let image = self.getImageFromSampleBuffer(sampleBuffer: sampleBuffer) else {
//            print("Couldn't get image from getImageFromSampleBuffer()"); return
//          }
//
//
//          self.setCheckOrScanAttribues(self.cropImage(image), "                 ")
//          self.showDataCorrectionView()
//          self.correctDataFromGoogleManually()
////          self.showDataCorrectionView()
////          self.hideCameraView()
////          self.correctDataFromGoogleManually()
//
//        }
//      }
    }
  }
  
  func cropImage(_ image: CIImage) -> UIImage {
    var scannedImage = UIImage(ciImage: image)
    scannedImage = scannedImage.rotate(radians: .pi / 2)!
    scannedImage = scannedImage.resizeImage(targetSize: CGSize(width: self.screenWidth, height: self.screenHeight))
    guard let scannedImageAsCG = scannedImage.cgImage else { return scannedImage }
    
    
    // Cropping image
    var rect = CGRect()
    rect = self.rectOfInterest
    
    
    // We need to move where we capture the image up quite abit. About 60 px
    if self.isIPhoneX == true {
      rect.origin.y -= CGFloat(60)
    }
    
    
    let croppedCGImage = scannedImageAsCG.cropping(to: rect)
    let croppedUIImage = UIImage(cgImage: croppedCGImage!)
    
    return croppedUIImage
  }
  
  func cropAndPostImage(_ image: CIImage) {
    DispatchQueue.main.async {
      
      let croppedUIImage = self.cropImage(image)
      
      // Stops the session, and posts the image for proccesing
      self.postImage(croppedImage: croppedUIImage, originalImage: UIImage(ciImage: image).rotate(radians: .pi / 2)!)
      
      
      // Notifies JS
      if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
        print("------------------------------------------------------------")
        eventEmitter.sendEvent(withName: "ShouldShowFirstDetailBox", body: "true")
      }
      
    }
  }
  
  
  
  // Called from CaptureOutput
  func detectTextHandler(request: VNRequest, error: Error?, image: CIImage, pixelBuffer: CVPixelBuffer) {
    if self.vinScanned == false {
      // Get the results
      guard let observations = request.results else { return }
      let result = observations.map({$0 as? VNTextObservation})
      
      DispatchQueue.main.async() {
        // For each 'region'. A region is like a word
        for region in result {
          guard let rg = region else { return }
          guard let boxes = rg.characterBoxes else { return }
          let regionBox = self.highlightWord(box: rg)
          
          // If the scanned VIN is inside the rect of interest.
          if self.rectOfInterest.contains(regionBox) {
            
            // The VIN in the window
            if boxes.count > 14 && boxes.count <= 17 {
              self.IncrementLoadBar()
              // If we have scanned a VIN as many times as we have specified
              if self.loaded == self.scanThreshold {
                self.resetVINScannedAndLoaded()
                
                self.cropAndPostImage(image)
                self.hideCameraView()
//                self.IncrementLoadBar()
              } else {
//                self.IncrementLoadBar()
              }
              
            // UNIT is either 6 or 7 characters long
            } else if ((boxes.count == 6) || (boxes.count == 7)) {
              self.IncrementLoadBar()
//              sleep(UInt32(0.4))
              if ((self.loaded == self.scanThreshold) && (self.vinScanned == false)) {
                self.resetVINScannedAndLoaded()
                
                self.cropAndPostImage(image)
                self.hideCameraView()
//                self.IncrementLoadBar()
              } else {
//                self.IncrementLoadBar()
              }
            }
          }
        }
      }
    }
  }
  
  @objc(resetVINScannedAndLoaded)
  func resetVINScannedAndLoaded() {
    self.vinScanned = true
    self.loaded = 0
  }
  
  
  
  func IncrementLoadBar() {
    self.loaded += 1
    
    
    let widthToincrement = (screenWidth * 0.9)/CGFloat(scanThreshold)
    var maskWidth = mask.bounds.width
    maskWidth += widthToincrement

    UIView.animate(withDuration: 0.4, animations: {
      self.mask.bounds = CGRect(x: 0, y: 0, width: maskWidth, height: self.screenHeight * 0.1)
    })
    
    
    
    
    let bg:DispatchQueue = { return DispatchQueue.global(qos: DispatchQoS.QoSClass.background) }() //keep this in the global scope
    bg.async {
      sleep(7)
      
      if self.loaded > 0 {
        DispatchQueue.main.async {
          let widthToincrement = (self.screenWidth * 0.9)/CGFloat(self.scanThreshold)
          var maskWidth = self.mask.bounds.width
          maskWidth -= widthToincrement
          
          UIView.animate(withDuration: 0.4, animations: {
            self.mask.bounds = CGRect(x: 0, y: 0, width: maskWidth, height: self.screenHeight * 0.1)
          })
        }
      }
    }
    
  }
  
  
  
  
  func getImageFromSampleBuffer(sampleBuffer: CMSampleBuffer) -> CIImage? {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
      return nil
    }
    CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)
    let width = CVPixelBufferGetWidth(pixelBuffer)
    let height = CVPixelBufferGetHeight(pixelBuffer)
    let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
    guard let context = CGContext(data: baseAddress, width: width, height: height, bitsPerComponent: 8, bytesPerRow: bytesPerRow, space: colorSpace, bitmapInfo: bitmapInfo.rawValue) else {
      return nil
    }
    guard let cgImage = context.makeImage() else {
      return nil
    }
    
    let image = CIImage(cgImage: cgImage)
    CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
    return image
  }
  
  
  
}




