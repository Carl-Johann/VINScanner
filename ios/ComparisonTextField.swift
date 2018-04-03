//
//  ComparisonTextField.swift
//  VINScanner
//
//  Created by Joe on 31/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit

//extension RNCameraViewSwift {
//  
//}

class ComparisonTextField : UITextField {
  
  init(size: CGSize) {
    super.init(frame: CGRect())
    self.setup(size)
  }
  
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)!
  }
  
  func setup(_ size: CGSize) {
    self.frame.size = CGSize(width: size.width, height: size.width)
    self.backgroundColor = UIColor(hex: "#E5E5E5")
    self.layer.borderWidth = 0.4
    self.layer.borderColor = UIColor.black.withAlphaComponent(0.8).cgColor
    self.contentVerticalAlignment = UIControlContentVerticalAlignment.center
    self.font = UIFont(name: "AppleSDGothicNeo-SemiBold", size: 24)
    self.adjustsFontSizeToFitWidth = true
    self.textAlignment = NSTextAlignment.center
  }
  
}
