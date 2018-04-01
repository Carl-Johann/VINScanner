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
  let urlSession = URLSession.shared
  var mask = CALayer()
  var successRect = UIView()
  
  let session = AVCaptureSession()
  let captureDevice = AVCaptureDevice.default(for: AVMediaType.video)
  let rectOfInterest = CGRect(x: (UIScreen.main.bounds.width / 2) - (UIScreen.main.bounds.width * 0.45),
                              y: UIScreen.main.bounds.height / 2 - (UIScreen.main.bounds.height * 0.05),
                              width: UIScreen.main.bounds.width * 0.9,
                              height: UIScreen.main.bounds.height * 0.1)
  var loaded = 0
  var vinScanned: Bool = false
  //  How many times the camera will have to detect a 17 charachter word
  let scanThreshold: Int = 6
  
  
  
  
  override func view() -> UIView! {
    startLiveVideo()
    
    
    // The scanned VIN should be inside of the rect
    let viewOfInterest = UIView(frame: self.rectOfInterest)
    viewOfInterest.layer.cornerRadius = 8
    viewOfInterest.layer.borderWidth = 4
    viewOfInterest.tag = 99
    viewOfInterest.layer.borderColor = UIColor.lightGray.cgColor
    contentView.addSubview(viewOfInterest)
  
    
    self.successRect.frame = self.rectOfInterest
    self.successRect.layer.cornerRadius = 8
    self.successRect.layer.borderWidth = 4
    self.successRect.layer.borderColor = UIColor.green.cgColor
    contentView.addSubview(self.successRect)
    
    self.mask.contentsGravity = kCAGravityResizeAspect
    self.mask.bounds = CGRect(x: 0, y: 0, width: 0, height: screenHeight * 0.1)
    self.mask.anchorPoint = CGPoint(x: 0.5, y: 0.5)
    self.mask.backgroundColor = UIColor.orange.cgColor
    self.mask.position = CGPoint(x: successRect.frame.size.width/2, y: successRect.frame.size.height/2)
    self.successRect.layer.mask = self.mask
    
    
    
    
    // DON'T REMOVE. This is removed right after launch, but will crash without it.
    let layerDummy = CALayer()
    contentView.frame = CGRect(x: 0, y: 0, width: 0, height: 0)
    contentView.layer.addSublayer(layerDummy)
    ///////////////////////////////////////////////////////////////////////////////
    
    // Creates a gesture recognizer that hides the keyboard when the screen is clicked
    let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: contentView, action: #selector(contentView.endEditing(_:)))
    contentView.addGestureRecognizer(tap)
    contentView.backgroundColor = UIColor.lightGray.withAlphaComponent(0.2)
    
    return contentView
  }
  
  
  func startLiveVideo() {
    
    //    check for sim or retarded device
    let deviceInput = try! AVCaptureDeviceInput(device: captureDevice!)
    let deviceOutput = AVCaptureVideoDataOutput()
    deviceOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)]
    deviceOutput.setSampleBufferDelegate(self, queue: DispatchQueue.global(qos: DispatchQoS.QoSClass.default))
    session.addInput(deviceInput)
    session.addOutput(deviceOutput)
    
    let imageLayer = AVCaptureVideoPreviewLayer(session: session)
    imageLayer.frame = contentView.bounds
    contentView.layer.addSublayer(imageLayer)
    startSession()
  }
  
  func startSession() {
    loaded = 0
    vinScanned = false
    session.startRunning()
    UIView.animate(withDuration: 0.7, animations: {
      self.contentView.alpha = 1
    })
  }
  
  func stopSession() {
    self.contentView.backgroundColor = UIColor(hex: "#E5E5E5")
    UIView.animate(withDuration: 0.7, animations: {
      self.contentView.alpha = 0
    }, completion: { success in
      self.session.stopRunning()
      self.mask.bounds = CGRect(x: 0, y: 0, width: 0, height: self.screenHeight * 0.1)
    })
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
  


  
  
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    if !self.vinScanned {
      guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
      var requestOptions:[VNImageOption : Any] = [:]
      guard let outputImage = getImageFromSampleBuffer(sampleBuffer: sampleBuffer) else { return }
      
      let textRequest = VNDetectTextRectanglesRequest { request, error in
        self.detectTextHandler(request: request, error: error, image: outputImage, pixelBuffer: pixelBuffer)
      }
      textRequest.reportCharacterBoxes = true

      
      if let camData = CMGetAttachment(sampleBuffer, kCMSampleBufferAttachmentKey_CameraIntrinsicMatrix, nil) {
        requestOptions = [.cameraIntrinsics:camData]
      }
      
      let imageRequestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: CGImagePropertyOrientation.right, options: requestOptions)
      
      
      do {
        try imageRequestHandler.perform([textRequest])
      } catch {
        print(error)
      }
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
          if boxes.count == 17 {
            // We only create boxes around expected VINs
//            self.createAndRemoveRects(regionBox)
            
            // If the scanned VIN is inside the rect of interest.
            // We cant just take pictures of everything on screen being 17 boxes long
            if self.rectOfInterest.contains(regionBox) {
              
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
                  self.postImage(croppedImage: croppedUIImage, originalImage: UIImage(ciImage: image).rotate(radians: .pi / 2)!, rg: rg)
                  if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
                    print("Returning VIN")
                    eventEmitter.sendEvent(withName: "ShouldShowVinDetail", body: "true")
                  }
                  self.stopSession()
                }

              } else {
//                self.loaded += 1
                self.IncrementLoadBar()
              }
            }
          }
        }
      }
    }
  }
  
  
  
  func IncrementLoadBar() {
    self.loaded += 1
    if self.loaded <= self.scanThreshold {
      let widthToincrement = (screenWidth * 0.9)/CGFloat(scanThreshold)
      var maskWidth = mask.bounds.width
      maskWidth += widthToincrement
      UIView.animate(withDuration: 0.4, animations: {
        self.mask.bounds = CGRect(x: 0, y: 0, width: maskWidth, height: self.screenHeight * 0.1)
      })
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




