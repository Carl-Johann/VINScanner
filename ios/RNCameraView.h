//
//  RNCameraView.h
//  VINScanner
//
//  Created by Joe on 28/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTView.h>
#import <React/RCTViewManager.h>


@interface RNCameraView : RCTView

@property (nonatomic, assign) NSArray *locations;
@property (nonatomic, assign) NSArray *colors;

@end

