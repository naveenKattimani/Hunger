import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { checkoutdetailsPage } from '../pages/checkoutdetails/checkoutdetails';
import { Restaurants } from '../providers/restaurants/restaurants';
import { Connectivity } from '../providers/connectivity/connectivity';
import { LocationsProvider } from '../providers/locations/locations';
import { Google_Maps } from '../providers/google-maps/google-maps';
import { InAppBrowser,InAppBrowserOptions,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import{ MapPage } from '../pages/map/map';
import{ MenuPage } from '../pages/menu/menu';
import{ MyaccountPage } from '../pages/myaccount/myaccount';
import { CartPage } from '../pages/cart/cart';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import{CartServiceProvider} from '../providers/cart-service/cart-service'
import { HTTP } from '@ionic-native/http';
import { FIREBASE_CONFIG } from '../../src/environment/environment';
import { AngularFireDatabaseModule,AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from '../providers/dbservice/firebasedb';
import { Dialogs } from '@ionic-native/dialogs';
import { MyaccountProvider } from '../providers/myaccount/myaccount';
import { OrdertransactionPage } from '../pages/ordertransaction/ordertransaction';
import { SMS } from '@ionic-native/sms';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LoginPage } from '../pages/login/login';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    MenuPage,
    MyaccountPage,
    CartPage,
    OrdertransactionPage,
    LoginPage,
    checkoutdetailsPage,
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
    MyApp,
    HomePage,
    MapPage,
    MenuPage,
    MyaccountPage,
    CartPage,
    OrdertransactionPage,
    LoginPage,
    checkoutdetailsPage,
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
    MyaccountProvider,
    SMS,
    LocationAccuracy,
  ]
})
export class AppModule {}
