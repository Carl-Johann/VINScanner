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


@objc(RNCameraViewSwift)
class RNCameraViewSwift : RCTViewManager, AVCaptureVideoDataOutputSampleBufferDelegate, UITextFieldDelegate {
  let screenWidth = UIScreen.main.bounds.width
  let screenHeight = UIScreen.main.bounds.height
  
  var contentView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  var cameraView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  var VINCorrectionView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  
  let urlSession = URLSession.shared
  var mask: CALayer = CALayer()
  var successRect: UIView = UIView()
  
  var takePicture = false
  
  let session = AVCaptureSession()
  let captureDevice = AVCaptureDevice.default(for: AVMediaType.video)
  let rectOfInterest = CGRect(x: (UIScreen.main.bounds.width / 2) - (UIScreen.main.bounds.width * 0.375),
                              y: UIScreen.main.bounds.height / 2 - (UIScreen.main.bounds.height * 0.045),
                              width: UIScreen.main.bounds.width * 0.75,
                              height: UIScreen.main.bounds.height * 0.09)
  var loaded = 0
  var vinScanned: Bool = false
  //  How many times the camera will have to detect a 17 charachter word
  let scanThreshold: Int = 6
  
  
  var userWantsToScan: Bool? = nil
  var croppedImageForScan: UIImage? = nil
  var VINForScan: String? = nil
//  var rgForScan: VNTextObservation? = nil
  var symbolsForScan: [[String : AnyObject]]? = nil
  
  
  
  
  
  
  
  override func view() -> UIView! {
    // Shoulc be hidden in the beginning
    VINCorrectionView.alpha = 0
    startLiveVideo()
    
    let button = UIButton()
    let buttonWidth = self.screenWidth * 0.75
    button.frame = CGRect.init(x: 0, y: self.screenHeight * 0.75, width: buttonWidth, height: 55)
    button.center = CGPoint(x: self.screenWidth/2 , y: self.screenHeight * 0.75)
    button.setTitle("Manual Scan", for: .normal)
    button.setTitleColor(UIColor.black, for: .normal)
    button.adjustsImageWhenHighlighted = true
    button.backgroundColor = UIColor(hex: "#ffb307")
    button.layer.cornerRadius = 4
    button.layer.borderWidth = 2
    button.layer.borderColor = UIColor(hex: "#ffb307").cgColor
    button.titleLabel?.textAlignment = NSTextAlignment.center
    button.titleLabel!.font = UIFont(name: "AppleSDGothicNeo-Regular", size: 24)
    button.showsTouchWhenHighlighted = true
    button.isUserInteractionEnabled = true
    button.titleLabel!.textColor = UIColor.black
    button.addTarget(self, action: #selector(self.manualScan(sender:)), for: .touchUpInside)
    self.cameraView.addSubview(button)
    
    // The scanned VIN should be inside of the rect
    self.createUIScanRects()
    
    
    // DON'T REMOVE. This is removed right after launch, but will crash without it.
    let layerDummy = CALayer()
    layerDummy.frame = CGRect(x: 0, y: 0, width: 0, height: 0)
    cameraView.layer.addSublayer(layerDummy)
    ///////////////////////////////////////////////////////////////////////////////
    
    // Creates a gesture recognizer that hides the keyboard when the screen is clicked
    let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: contentView, action: #selector(VINCorrectionView.endEditing(_:)))
    VINCorrectionView.addGestureRecognizer(tap)
    VINCorrectionView.backgroundColor = UIColor.lightGray.withAlphaComponent(0.2)
    
    self.contentView.addSubview(cameraView)
    self.contentView.addSubview(VINCorrectionView)
    return contentView
  }
  
  
  func startLiveVideo() {        
    
    for input in self.session.inputs { self.session.removeInput(input) }
    for output in self.session.outputs { self.session.removeOutput(output) }
    
    //    check for sim or retarded device
    let deviceInput = try! AVCaptureDeviceInput(device: captureDevice!)
    let deviceOutput = AVCaptureVideoDataOutput()
    deviceOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)]
    deviceOutput.setSampleBufferDelegate(self, queue: DispatchQueue.global(qos: DispatchQoS.QoSClass.default))
    session.addInput(deviceInput)
    session.addOutput(deviceOutput)
    
    
//      self.contentView.subviews.forEach({ $0.removeFromSuperview() })
    let imageLayer = AVCaptureVideoPreviewLayer(session: self.session)
    imageLayer.frame = self.contentView.bounds
    
    self.cameraView.layer.addSublayer(imageLayer)
//    }
    
    
    showCameraView()
    
  }
  
  func createUIScanRects() {
    let viewOfInterest = UIView(frame: self.rectOfInterest)
    viewOfInterest.layer.cornerRadius = 8
    viewOfInterest.layer.borderWidth = 4
    viewOfInterest.tag = 99
    viewOfInterest.layer.borderColor = UIColor.lightGray.cgColor
    self.cameraView.addSubview(viewOfInterest)
    
    
    self.successRect.frame = self.rectOfInterest
    self.successRect.layer.cornerRadius = 8
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
      self.vinScanned = false
      self.session.startRunning()
      
      self.contentView.bringSubview(toFront: self.cameraView)
      // The scanrects disappear for some reason
      //if we dont' show them every time cameraview has been send to background
      self.createUIScanRects()
      
      
      self.contentView.bringSubview(toFront: self.successRect)
      UIView.animate(withDuration: 0.7, animations: {
        self.cameraView.alpha = 1
      })
    }
  }
  func hideCameraView() {
    DispatchQueue.main.async {
      self.contentView.backgroundColor = UIColor(hex: "#E5E5E5")
      self.contentView.sendSubview(toBack: self.cameraView)
      
      UIView.animate(withDuration: 0.7, animations: {
        self.cameraView.alpha = 0
      }, completion: { success in
        self.session.stopRunning()
        self.mask.bounds = CGRect(x: 0, y: 0, width: 0, height: self.screenHeight * 0.1)
      })
    }
  }  
  func showVINCorrectionView() {
    DispatchQueue.main.async {
      
      self.contentView.bringSubview(toFront: self.VINCorrectionView)
      UIView.animate(withDuration: 0.7, animations: {
        self.VINCorrectionView.alpha = 1
      })
    }
  }
  func hideVINCorrectionView() {
    DispatchQueue.main.async {
      
      self.contentView.sendSubview(toBack: self.VINCorrectionView)
      UIView.animate(withDuration: 0.7, animations: {
        self.VINCorrectionView.alpha = 0
      })
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
  
  
//  func createCALayerFromRect(rect: CGRect) {
//    let outline = CALayer()
//    outline.frame = CGRect(x: rect.origin.x, y: rect.origin.y, width: rect.width, height: rect.height)
//    outline.borderColor = UIColor.green.cgColor
//    outline.cornerRadius = 3
//    outline.borderWidth = 2
//    if rect.width > 100 && rect.height > 25 {
//      contentView.layer.addSublayer(outline)
//    }
//  }
  

  func cleanVIN(_ VIN: String) -> String {
    var text = VIN
    
    text = text.uppercased()
    text = text.replacingOccurrences(of: "I", with: "1")
    text = text.replacingOccurrences(of: "Q", with: "0")
    text = text.replacingOccurrences(of: "O", with: "0")
    text = text.stripped
    
    return text
  }
  
  open func takeScreenshot(_ shouldSave: Bool = true) -> UIImage? {
    UIGraphicsBeginImageContext(self.contentView.frame.size)
    self.cameraView.layer.render(in: UIGraphicsGetCurrentContext()!)
    let image = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
  
    return image
  }
  
  
  @objc fileprivate func manualScan(sender: UIButton) {
    self.takePicture = true
    
//    UIGraphicsBeginImageContext(self.view.bounds.size)
//    self.view.drawHierarchy(in: view.bounds, afterScreenUpdates: false)
//    let image = UIGraphicsGetImageFromCurrentImageContext()
//    UIGraphicsEndImageContext()
  }

  
  
  
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
      

      if self.takePicture == false {
        do {
          try imageRequestHandler.perform([textRequest])
        } catch {
          print(error)
        }
      } else {
        
        DispatchQueue.main.async {
        self.takePicture = false
        self.vinScanned = true
        let image = self.getImageFromSampleBuffer(sampleBuffer: sampleBuffer)
        var scannedImage = UIImage(ciImage: image!)
        scannedImage = scannedImage.rotate(radians: .pi / 2)!
        scannedImage = scannedImage.resizeImage(targetSize: CGSize(width: self.screenWidth, height: self.screenHeight))
        guard let scannedImageAsCG = scannedImage.cgImage else { return }
        
        // Cropping image
        let croppedCGImage = scannedImageAsCG.cropping(to: self.rectOfInterest)
        let croppedUIImage = UIImage(cgImage: croppedCGImage!)
        
        
        // Stops the session, and posts the image for proccesing
        
          self.postImage(croppedImage: croppedUIImage, originalImage: UIImage(ciImage: image!).rotate(radians: .pi / 2)!)
          // 1.
          if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
            print("------------------------------------------------------------")
            print("Returning VIN")
            eventEmitter.sendEvent(withName: "ShouldShowVinDetail", body: "true")
          }
//          self.hideCameraView()
          print(123)
        }
      }
//      self.takePicture = false
    }
  }
  
  
  
  
  
  
  
  
  
  
//
//
//  func createAndRemoveRects(_ rect: CGRect) {
//    self.contentView.layer.sublayers?.removeSubrange(3...)
//    if self.loaded != self.scanThreshold { self.createCALayerFromRect(rect: rect) }
//  }
//
  
  
  
  
  
  
  // Called from CaptureOutput
  func detectTextHandler(request: VNRequest, error: Error?, image: CIImage, pixelBuffer: CVPixelBuffer) {
    print(4)
//    self.takePicture = false
    if !self.vinScanned {
      // Get the results
      guard let observations = request.results else { return }
      let result = observations.map({$0 as? VNTextObservation})
      
      DispatchQueue.main.async() {
        // For each 'region'. A region is like a word
        for region in result {
          guard let rg = region else { return }
          guard let boxes = rg.characterBoxes else { return }
          let regionBox = self.highlightWord(box: rg)
          
          // If the 'word' has 17 boxes, which isn't always 17 letters and numbers
//          if boxes.count == 17 {
          if self.rectOfInterest.contains(regionBox) {
          
            // We only create boxes around expected VINs
//            self.createAndRemoveRects(regionBox)
            
            // If the scanned VIN is inside the rect of interest.
            // We cant just take pictures of everything on screen being 17 boxes long
              if boxes.count > 12 && boxes.count < 18 {
              
              // If we have scanned a VIN as many times as we have specified
              if self.loaded == self.scanThreshold {
                self.vinScanned = true
                
                // Rotates, and resizes the image so we can propperly crop it.
                var scannedImage = UIImage(ciImage: image)
                scannedImage = scannedImage.rotate(radians: .pi / 2)!
                scannedImage = scannedImage.resizeImage(targetSize: CGSize(width: self.screenWidth, height: self.screenHeight))
                guard let scannedImageAsCG = scannedImage.cgImage else { return }
                
                // Cropping image
                let croppedCGImage = scannedImageAsCG.cropping(to: self.rectOfInterest)
                let croppedUIImage = UIImage(cgImage: croppedCGImage!)
                
                
                // Stops the session, and posts the image for proccesing
                DispatchQueue.main.async {
                  self.postImage(croppedImage: croppedUIImage, originalImage: UIImage(ciImage: image).rotate(radians: .pi / 2)!, rg)
                  // 1.
                  if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
                    print("------------------------------------------------------------")
                    print("Returning VIN")
                    eventEmitter.sendEvent(withName: "ShouldShowVinDetail", body: "true")
                  }
                  self.hideCameraView()
                }
                
              
              } else {
                self.IncrementLoadBar()
              }
            }
          }
        }
      }
    }
  }
  
  
  
  func IncrementLoadBar() {
    
    if self.loaded <= self.scanThreshold + 1 {
      let widthToincrement = (screenWidth * 0.9)/CGFloat(scanThreshold)
      var maskWidth = mask.bounds.width
      maskWidth += widthToincrement
      UIView.animate(withDuration: 0.4, animations: {
        self.mask.bounds = CGRect(x: 0, y: 0, width: maskWidth, height: self.screenHeight * 0.1)
      })
    }
    self.loaded += 1
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




