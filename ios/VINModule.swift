//
//  VINModule.swift
//  VINScanner
//
//  Created by Joe on 29/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

@objc(VINModul)
class VINModul : RCTEventEmitter {
  
  @objc(EventToJS:)
  func EventToJS(name: String) {
    print("IOS. Event with name:", name)
  }
  
  @objc
  override func supportedEvents() -> [String]! {
    return ["EventToJS"]
  }
  
  
}
