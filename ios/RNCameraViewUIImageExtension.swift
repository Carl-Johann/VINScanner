//
//  RNCameraViewUIImageExtension.swift
//  VINScanner
//
//  Created by Joe on 29/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit

extension UIColor {
  convenience init(hex: String, alpha: CGFloat = 1.0) {
    var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    
    if (cString.hasPrefix("#")) { cString.removeFirst() }
    
    if ((cString.count) != 6) {
      self.init(hex: "ff0000") // return red color for wrong hex input
      return
    }
    
    var rgbValue: UInt32 = 0
    Scanner(string: cString).scanHexInt32(&rgbValue)
    
    self.init(red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
              green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
              blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
              alpha: alpha)
  }
}

extension UIView {
  
  var snapshot: UIImage? {
    UIGraphicsBeginImageContextWithOptions(bounds.size, false, 0)
    defer { UIGraphicsEndImageContext() }
    drawHierarchy(in: bounds, afterScreenUpdates: true)
    return UIGraphicsGetImageFromCurrentImageContext()
  }
  
  
  func capture() -> UIImage? {
    var image: UIImage?
    
    if #available(iOS 10.0, *) {
      let format = UIGraphicsImageRendererFormat()
      format.opaque = isOpaque
      let renderer = UIGraphicsImageRenderer(size: frame.size, format: format)
      image = renderer.image { context in
        drawHierarchy(in: frame, afterScreenUpdates: true)
      }
    } else {
      UIGraphicsBeginImageContextWithOptions(frame.size, isOpaque, UIScreen.main.scale)
      drawHierarchy(in: frame, afterScreenUpdates: true)
      image = UIGraphicsGetImageFromCurrentImageContext()
      UIGraphicsEndImageContext()
    }
    
    return image
  }
}


extension UIImage {
  
  func alpha(_ value:CGFloat) -> UIImage {
    UIGraphicsBeginImageContextWithOptions(size, false, scale)
    draw(at: CGPoint.zero, blendMode: .normal, alpha: value)
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    return newImage!
  }
  
  func rotate(radians: Float) -> UIImage? {
    var newSize = CGRect(origin: CGPoint.zero, size: self.size).applying(CGAffineTransform(rotationAngle: CGFloat(radians))).size
    // Trim off the extremely small float value to prevent core graphics from rounding it up
    newSize.width = floor(newSize.width)
    newSize.height = floor(newSize.height)
    
    UIGraphicsBeginImageContext(newSize);
    let context = UIGraphicsGetCurrentContext()!
    
    // Move origin to middle
    context.translateBy(x: newSize.width/2, y: newSize.height/2)
    // Rotate around middle
    context.rotate(by: CGFloat(radians))
    
    self.draw(in: CGRect(x: -self.size.width/2, y: -self.size.height/2, width: self.size.width, height: self.size.height))
    
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    
    return newImage
  }
  
  func resizeImage(targetSize: CGSize) -> UIImage {
    let size = self.size
    let widthRatio  = targetSize.width  / size.width
    let heightRatio = targetSize.height / size.height
    let newSize = widthRatio > heightRatio ?  CGSize(width: size.width * heightRatio, height: size.height * heightRatio) : CGSize(width: size.width * widthRatio,  height: size.height * widthRatio)
    let rect = CGRect(x: 0, y: 0, width: newSize.width, height: newSize.height)
    
    UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
    self.draw(in: rect)
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    
    UIGraphicsEndImageContext()
    
    return newImage!
  }
}



extension String {
  
  var stripped: String {
    let okayChars = Set("ABCDEFGHJKLKMNPRSTUVWXYZ 1234567890")
    return self.filter {okayChars.contains($0) }
  }
}






