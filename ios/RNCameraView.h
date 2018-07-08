//
//  RNCameraView.h
//  VINScanner
//
//  Created by Joe on 28/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTView.h>
#import <React/RCTViewManager.h>


@interface RNCameraViewSwift : RCTViewManager

@property (nonatomic, assign) NSArray *locations;
@property (nonatomic, assign) NSArray *colors;
@property (nonatomic, assign) BOOL *ShouldScan;
@property (nonatomic, assign) BOOL *takingStock;
@property (nonatomic, assign) BOOL *ShouldEnterDataManually;
@property (nonatomic, assign) BOOL *ShouldTakePicture;

@end
