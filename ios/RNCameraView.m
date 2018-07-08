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
#import <React/RCTView.h>

@interface RCT_EXTERN_MODULE(RNCameraViewSwift, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(locations, NSArray);
RCT_EXPORT_VIEW_PROPERTY(colors, NSArray);
RCT_EXPORT_VIEW_PROPERTY(ShouldScan, BOOL);
RCT_EXPORT_VIEW_PROPERTY(takingStock, BOOL);

RCT_EXPORT_VIEW_PROPERTY(ShouldEnterDataManually, BOOL);
RCT_EXPORT_VIEW_PROPERTY(ShouldTakePicture, BOOL);

RCT_EXTERN_METHOD(missingCoordinatesErrorFromJS:(nonnull NSNumber *)name)
RCT_EXTERN_METHOD(CheckDataOrScanAgain:(nonnull BOOL *)shouldScan)
RCT_EXTERN_METHOD(shouldShowCameraView:(nonnull BOOL *)shouldShow)
@end
