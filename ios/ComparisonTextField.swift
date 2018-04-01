//
//  ComparisonTextField.swift
//  VINScanner
//
//  Created by Joe on 31/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit

extension RNCameraViewSwift {
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    // A TextField can only have 1 character.
    guard let text = textField.text else { return true }
    let newLength = text.count + string.count - range.length
    return newLength <= 1
  }
  
  func textFieldDidEndEditing(_ textField: UITextField) {
    // If a textfield was left blank, we make the user aware
    if textField.text?.count != 1 {
      textField.layer.borderWidth = 2
      textField.layer.borderColor = UIColor.red.cgColor
    } else {
      textField.layer.borderWidth = 0.4
      textField.layer.borderColor = UIColor.black.withAlphaComponent(0.8).cgColor
    }
  }
}

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
