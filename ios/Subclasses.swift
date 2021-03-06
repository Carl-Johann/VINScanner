//
//  ComparisonTextField.swift
//  VINScanner
//
//  Created by Joe on 31/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit


class YellowRoundedButton : UIButton {
  
  static func button(size: CGSize, title: String) -> YellowRoundedButton {
    let button = YellowRoundedButton(type: .roundedRect)
    
    button.frame.size = size
    button.setTitle(title, for: .normal)
    button.setTitleColor(UIColor(hex: "#555555"), for: .normal)
    button.backgroundColor = UIColor(hex: "#ffb307")
    button.layer.cornerRadius = 2
    button.layer.borderWidth = 2
    button.layer.borderColor = UIColor(hex: "#ffb307").cgColor
    button.titleLabel?.textAlignment = NSTextAlignment.center
    button.titleLabel!.font = UIFont(name: "AppleSDGothicNeo-Regular", size: 24)

    return button
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
