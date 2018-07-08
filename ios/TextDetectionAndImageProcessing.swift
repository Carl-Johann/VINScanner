//
//  TextDetectionAndImageProcessing.swift
//  VINScanner
//
//  Created by Joe on 24/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import Vision
import AVFoundation

extension SwiftCameraView {
  
  
  // MARK: - CaptureOutput Text
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    if self.shouldScan == true {
      
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
      
//      print("enterDataManually", self.enterDataManually)
//      print("takePicture", self.takePicture)
      
      if self.takePicture == false && self.enterDataManually == false {
//        print("enterDataManually", self.enterDataManually)
//        print("takePicture", self.takePicture)
        do { try imageRequestHandler.perform([textRequest])
        } catch { print(error) }
        
        
      } else if self.takePicture == true {
        
        DispatchQueue.main.async {
          self.takePicture = false
          guard let image = self.getImageFromSampleBuffer(sampleBuffer: sampleBuffer) else {
            print("Couldn't get image from getImageFromSampleBuffer()"); return
          }
          self.successfulScan(image)
        }
        
      } else if self.enterDataManually == true {
//        print(1)
        self.enterDataManually = false
        self.shouldScan = false
        
        guard let image = self.getImageFromSampleBuffer(sampleBuffer: sampleBuffer) else {
          print("Couldn't get image from getImageFromSampleBuffer()"); return
        }
   
        if let imageData = encodeImage(image) {
          guard let RCTbride = self.bridge else { print("Couldn't get self.bridge in enterVINOrUnitmanually()"); return }
          guard let eventEmitter = RCTbride.module(for: VINModul.self ) as? RCTEventEmitter else { print("Couldn't get eventEmitter in captureOutput"); return }
          
            eventEmitter.sendEvent(withName: "shouldShowDataCorrectionView", body: [ "shouldShow" : true, "imageAs64": imageData ])
//            eventEmitter.sendEvent(withName: "ShouldShowCameraView", body: [ "shouldShow" : false ])
          
        } else {
          print(2)
        }
        
      }
    }
  }
  
  
  
  
  func encodeImage(_ image: CIImage) -> String? {
    let imageAsUI = cropImage(image)
    let base64String = UIImageJPEGRepresentation(imageAsUI, 1.0)
    
    if (base64String != nil) {
      return base64String?.base64EncodedString()
    } else { return nil }
  }
  
  
  
  
  
  // MARK: - Image Processing
  func cropImage(_ image: CIImage) -> UIImage {
    var scannedImage = UIImage(ciImage: image)
    scannedImage = scannedImage.rotate(radians: .pi / 2)!
    scannedImage = scannedImage.resizeImage(targetSize: CGSize(width: self.screenWidth, height: self.screenHeight))
    guard let scannedImageAsCG = scannedImage.cgImage else { return scannedImage }
    
    
    
    var rect = CGRect()
    rect = self.rectOfInterest
    
    
    // We need to move where we capture the image up quite abit. About 60 px
    if self.isIPhoneX == true {
      rect.origin.y -= CGFloat(60)
    }
    
//    print("croppedCGImage rect", rect.origin.y )
    let croppedCGImage = scannedImageAsCG.cropping(to: rect)
    let croppedUIImage = UIImage(cgImage: croppedCGImage!)
    
    return croppedUIImage
  }
  
  func cropAndPostImage(_ image: CIImage) {
    DispatchQueue.main.async {
      
      // Cropping image
      let croppedUIImage = self.cropImage(image)
      guard let RCTBridge = self.bridge else { print("Couldn't get RCTBridge in cropAndPostImage()"); return }
      
      // Stops the session, and posts the image for proccesing
      ApiRequests.sharedInstance.postImage(
        croppedUIImage,
        RCTBridge,
        UIImage(ciImage: image).rotate(radians: .pi / 2)!
      )
      
      
      // Notifies JS
      if let eventEmitter = RCTBridge.module(for: VINModul.self) as? RCTEventEmitter {
//        print("------------------------------------------------------------")
        eventEmitter.sendEvent(withName: "ShouldShowFirstDetailBox", body: "true")
      }
      
    }
  }
  
  
  
  
  
  
  func getRegionBoxCoordinates(box: VNTextObservation) -> CGRect  {
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
  
    let xCord = maxX * UIScreen.main.bounds.width
    let yCord = (1 - minY) * UIScreen.main.bounds.height
    let width = (minX - maxX) * UIScreen.main.bounds.width
    let height = (minY - maxY) * UIScreen.main.bounds.height
    
    return CGRect(x: xCord, y: yCord, width: width, height: height)
  }
  
  
  
  
  // MARK: - detectTextHandler
  // Called from CaptureOutput
  func detectTextHandler(request: VNRequest, error: Error?, image: CIImage, pixelBuffer: CVPixelBuffer) {
    
    if self.shouldScan == true {
      // Get the results
      guard let observations = request.results else { return }
      let result = observations.map({$0 as? VNTextObservation})
      
      DispatchQueue.main.async() {
        // For each 'region'. A region is like a word
        for region in result {
          guard let rg = region else { return }
          guard let boxes = rg.characterBoxes else { return }
          let regionBox = self.getRegionBoxCoordinates(box: rg)
          
          
          
          // If the scanned VIN is inside the rect of interest.
          if self.rectOfInterest.contains(regionBox) {
            // The VIN in the window
            
            
            if boxes.count > 14 && boxes.count <= 17 {
              self.IncrementLoadBar()
              // If we have scanned a VIN as many times as we have specified
              if ((self.loaded == self.scanThreshold) && (self.shouldScan == true)) {
                // We scanned a VIN
                self.successfulScan(image)
              }
              
              
            } else if ((boxes.count == 6) || (boxes.count == 7)) {
              // UNIT is either 6 or 7 characters long
              
              self.IncrementLoadBar()
              if ((self.loaded == self.scanThreshold) && (self.shouldScan == true)) {
                // We scanned a unit
                self.successfulScan(image)
              }
              
            }
            
            
          }
        }
      }
    }
  }
  
  
  
  
  
  
  // MARK: - Helpers
  func successfulScan(_ image: CIImage) {
    
    // Notifies JS
    guard let RCTBridge = self.bridge else { print("Couldn't get RCTBridge in cropImage()"); return }
    if let eventEmitter = RCTBridge.module(for: VINModul.self) as? RCTEventEmitter {
//      eventEmitter.sendEvent(withName: "ShouldShowCameraView", body: [ "shouldShow" : false ])
//      eventEmitter.sendEvent(withName: "shouldShowDataCorrectionView", body: [ "shouldShow" : false ])
    }
    
    self.shouldScan = false
    self.cropAndPostImage(image)
    
    
    
    
    let bg: DispatchQueue = { return DispatchQueue.global(qos: DispatchQoS.QoSClass.background) }() // keep this in the global scope
    bg.async {
      sleep(1)
      self.loaded = 0
      
//      print("Resetting view")
      DispatchQueue.main.async {
        self.succesMask.bounds = CGRect(x: 0, y: 0, width: 0, height: self.screenHeight * 0.1)
      }
      
    }
  }
  
  func resetVINScannedAndLoaded() {
    self.shouldScan = false
    self.loaded = 0
  }
  
  func IncrementLoadBar() {
    self.loaded += 1
    
    
    let widthToincrement = (screenWidth * 0.9)/CGFloat(scanThreshold)
    var maskWidth = succesMask.bounds.width
    maskWidth += widthToincrement
    
    UIView.animate(withDuration: 0.2, animations: {
      self.succesMask.bounds = CGRect(x: 0, y: 0, width: maskWidth, height: self.screenHeight * 0.1)
    })
    
    
    
    // If the camera scans something, but nothing doesn't finish the whole scan
    // we decrement self.loaded and re-animate the successMask (succesRect) backwards
    let bg: DispatchQueue = { return DispatchQueue.global(qos: DispatchQoS.QoSClass.background) }() //keep this in the global scope
    bg.async {
      sleep(7)
      
      if self.loaded > 0 {
        self.loaded -= 1
        
        DispatchQueue.main.async {
          var maskWidth = self.succesMask.bounds.width
          maskWidth -= widthToincrement
          
          UIView.animate(withDuration: 0.4, animations: {
            self.succesMask.bounds = CGRect(x: 0, y: 0, width: maskWidth, height: self.screenHeight * 0.1)
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
