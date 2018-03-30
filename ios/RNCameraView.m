//
//  RNCameraView.m
//  VINScanner
//
//  Created by Joe on 28/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

//#import "RNCameraView.h"
#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNCameraViewSwift, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(locations, NSArray);
RCT_EXPORT_VIEW_PROPERTY(colors, NSArray);
RCT_EXTERN_METHOD(missingCoordinatesErrorFromJS:)



@end

