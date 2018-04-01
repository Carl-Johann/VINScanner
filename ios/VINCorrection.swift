//
//  VINCorrection.swift
//  VINScanner
//
//  Created by Joe on 01/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import Vision

extension RNCameraViewSwift {
  
  // indexInVert
  // 0 = bottomLeft
  // 1 = bottomRight
  // 2 = topRight
  // 3 = topLeft  
  func returnSecureCorner(indexInVertici: Int, _ verticies: [[String : AnyObject]]) -> CGPoint? {
    var pointToReturn = CGPoint()
    guard let xCord = verticies[indexInVertici]["x"] as? CGFloat else {
      raiseMissingCoordinatesError(); print("missing x coordinate"); return nil
    }
    guard let yCord = verticies[indexInVertici]["y"] as? CGFloat else {
      raiseMissingCoordinatesError(); print("missing y coordinate"); return nil
    }
    
    pointToReturn.x = xCord
    pointToReturn.y = yCord
    return pointToReturn
  }
  
  
  
  func compareVINCharachtersWithRetrieved(_ symbols: [[String : AnyObject]], _ rg: VNTextObservation, _ croppedImage: UIImage) {
    var VINDic: Dictionary = [Int : String]()
    
    // We have a manual index counter (instead of symbols.enumerated()) because we dont want index increments on whitespaces.
    var indexValue = 0
    for symbol in symbols {
      guard var text = symbol["text"] as? String else { print("text error at", index, "for symbol:", symbol); return }
      
      // I, O and Q are not not allowed in a VIN so they are replaced with what the could be misinterpreted as.
      // All charachters in a VIN are capitalizd aswell.
      //      text = text.capitalized
      //      text = text.replacingOccurrences(of: "I", with: "1")
      //      text = text.replacingOccurrences(of: "Q", with: "0")
      //      text = text.replacingOccurrences(of: "O", with: "0")
      //      text = text.stripped
      
      // We only clean one character at a time here though.
      text = cleanVIN(text)
      
      // We don't strip whitespaces because Google can misunderstand a letter, but not whitespaces.
      // They should not be included
      if text != " " { VINDic[indexValue] = text }
      indexValue += 1
    }
    
    
    DispatchQueue.main.async {
      if let viewWithTag = self.contentView.viewWithTag(99) { viewWithTag.removeFromSuperview() }
      self.contentView.layer.sublayers?.removeAll()
      self.contentView.backgroundColor = UIColor.lightGray.withAlphaComponent(0.2)
      
      for i in 1...17 {
        
        let key = i - 1
        let value = VINDic[i - 1]
        let symbol = symbols[key]
        
        let imgPerLayer: CGFloat = 9
        // Converts 'key' to a float value with 'imgPerLayer' so that we don't have to do it everywhere below.
        var keyF = CGFloat(key)
        let defaultHeight = self.screenHeight * 0.25
        
        // We set the individual image width based on screen,
        // as long as it is not larger than 45 px, because that will stretch the images too much
        let smallImgWidthScreen = (self.screenWidth * 0.9)/imgPerLayer
        let smallImgWidthMax: CGFloat = 45
        let smallImgWidth = smallImgWidthScreen < smallImgWidthMax ? smallImgWidthScreen : smallImgWidthMax
        
        // The bounding boxes returned from Google are on average 2:1 height compared to width
        let layer = keyF < imgPerLayer ? 1 : 2
        let smallImgHeight = smallImgWidth * 2
        let imgGap = (self.screenWidth - (smallImgWidth * imgPerLayer)) / (imgPerLayer + 1)
        
        // 'Resets' the offset when it starts adding the new layer
        if layer == 2 { keyF -= imgPerLayer }
        
        // How far in (x value) the individual image should be
        var imgOffset = (imgGap * (keyF + 1))
        imgOffset = imgOffset + (CGFloat(Double(keyF) + 0.5) * smallImgWidth)
        
        
        
        // If a full VIN wasn't returned we still want to create empty fields, if the user wants to type them in manually
        if i <= VINDic.count {
          
          guard let boundingBox = symbol["boundingBox"] as? [String : AnyObject] else { print("boundingBox error"); return }
          guard let vertices = boundingBox["vertices"] as? [[String : AnyObject]] else { print("vertices error"); return }
          // Gets the different corners
          guard let bottomLeft: CGPoint = self.returnSecureCorner(indexInVertici: 0, vertices) else { return }
          guard let topRight: CGPoint = self.returnSecureCorner(indexInVertici: 2, vertices) else { return }
          guard let topLeft: CGPoint = self.returnSecureCorner(indexInVertici: 3, vertices) else { return }
          
          
          // Creates a rect based on corners.
          // Makes the crop a little bigger so we dont have to stretch the small images as much.
          let width = (topRight.x - topLeft.x) * 1.1
          let height = (topLeft.y - bottomLeft.y) * 1.5
          let charRect = CGRect(x: bottomLeft.x, y: bottomLeft.y * 0.5, width: width, height: height)
          
          // Cropps the image
          guard let scannedImageAsCG = croppedImage.cgImage else { print("scannedImageAsCG error"); return }
          guard let croppedCGImage = scannedImageAsCG.cropping(to: charRect) else { print("croppedCGImage error"); return }
          let croppedUIImage = UIImage(cgImage: croppedCGImage)
          
          // Creates a small imageview.
          let imageIllustration = UIImageView(image: croppedUIImage)
          imageIllustration.contentMode = UIViewContentMode.scaleToFill
          imageIllustration.frame.size = CGSize(width: smallImgWidth, height: smallImgHeight)
          imageIllustration.center = CGPoint(x: imgOffset, y: defaultHeight + (layer == 1 ? 0 : smallImgHeight * 1.8 ))
          self.contentView.addSubview(imageIllustration)
        }
        
        
        
        // For every character we add a TextField so we can manually change the values if the suck.
        let textField = ComparisonTextField(size: CGSize(width: smallImgWidth, height: smallImgWidth))
        let extraTextFieldOffset = (layer == 1 ? 0 : (smallImgHeight * 1.8)) + ((smallImgWidth * 1.5) + imgGap)
        textField.center = CGPoint(x: imgOffset, y: defaultHeight + extraTextFieldOffset)
        textField.text = value
        textField.delegate = self
        
        // Some characters look alot like another, and can therefore be misidentified. We just make the user aware of them.
        let dangerousChars = ["8", "B", "G", "6", "C"]
        if dangerousChars.contains(value!) {
          textField.font = UIFont(name: "AppleSDGothicNeo-SemiBold", size: 24)
          textField.textColor = UIColor(hex: "#cc0000")
        } else {
          textField.font = UIFont(name: "AppleSDGothicNeo-Regular", size: 24)
          textField.textColor = UIColor(hex: "#555555")
        }
        
        self.contentView.addSubview(textField)
        
      }
    }
  }
  
  
}
