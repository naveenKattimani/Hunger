import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Environment } from '@ionic-native/google-maps';
import { checkoutdetailsPage } from '../pages/checkoutdetails/checkoutdetails';
import { FIREBASE_CONFIG } from '../../src/environment/environment';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    firebase.initializeApp(FIREBASE_CONFIG.firebase);

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      //this.rootPage=HomePage;
      firebase.auth().onAuthStateChanged( user => {
        if (user) {this.rootPage=HomePage;}
        else{this.rootPage=LoginPage;}
      });
    });
  }
  
}

