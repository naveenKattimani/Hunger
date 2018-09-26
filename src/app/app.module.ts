import { BrowserModule } from '@angular/platform-browser';
import { NewTransactionPage } from '../pages/instamojo/new_transaction'
import {InAppBrowser} from '@ionic-native/in-app-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
//import { HTTP } from '@ionic-native/http';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Restaurants } from '../providers/restaurants/restaurants';
import { Connectivity } from '../providers/connectivity/connectivity';
import { LocationsProvider } from '../providers/locations/locations';
import { Google_Maps } from '../providers/google-maps/google-maps';
import{ MapPage } from '../pages/map/map';
import{ MenuPage } from '../pages/menu/menu';
import{ MyaccountPage } from '../pages/myaccount/myaccount';
import { CartPage } from '../pages/cart/cart';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import{CartServiceProvider} from '../providers/cart-service/cart-service'
import { HTTP } from '@ionic-native/http';
import { importType } from '@angular/compiler/src/output/output_ast';
import {CheckoutPage} from '../pages/checkout/checkout'
import { FIREBASE_CONFIG } from '../../src/environment/environment';
import { AngularFireDatabaseModule,AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from '../providers/dbservice/firebasedb';
import { Dialogs } from '@ionic-native/dialogs';
import { MyaccountProvider } from '../providers/myaccount/myaccount';
//import { HTTP } from 'ionic-native';



@NgModule({
  declarations: [
      NewTransactionPage,
    MyApp,
    HomePage,
    MapPage,
    MenuPage,
    MyaccountPage,
    CartPage,
    CheckoutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{
      mode: 'md'
      }),
      AngularFireModule.initializeApp(FIREBASE_CONFIG.firebase),
      AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
      NewTransactionPage,
    MyApp,
    HomePage,
    MapPage,
    MenuPage,
    MyaccountPage,
    CartPage,
    CheckoutPage,
  ],
  providers: [
      InAppBrowser,
      HTTP,
    StatusBar,
    SplashScreen,
    Restaurants,
    CartServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Connectivity,
    LocationsProvider,
    Google_Maps,
    Geolocation,
    NativeGeocoder,
    Network,
    FirebaseProvider,
    Dialogs,
    MyaccountProvider
    
    
  ]
})
export class AppModule {}
