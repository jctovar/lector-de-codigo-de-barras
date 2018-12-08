import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics';
import { AppCenterCrashes } from '@ionic-native/app-center-crashes';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private androidPermissions: AndroidPermissions, private appCenterAnalytics: AppCenterAnalytics, private AppCenterCrashes: AppCenterCrashes) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.CAMERA
        ]
      );
      this.appCenterAnalytics.setEnabled(true).then(() => {
        this.appCenterAnalytics.trackEvent('My Event', { TEST: 'HELLO_WORLD' }).then(() => {
            console.log('Custom event tracked');
        });
      });
      this.AppCenterCrashes.setEnabled(true).then(() => {
        this.AppCenterCrashes.lastSessionCrashReport().then(report => {
            console.log('Crash report', report);
        });
      });
      statusBar.backgroundColorByHexString("4a0072");
      statusBar.styleBlackTranslucent();
      splashScreen.hide();
    });
  }
}
