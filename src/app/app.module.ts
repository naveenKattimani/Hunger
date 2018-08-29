import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
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
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    MenuPage,
    MyaccountPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      mode: 'md'
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    MenuPage,
    MyaccountPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Restaurants,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Connectivity,
    LocationsProvider,
    Google_Maps,
    Geolocation,
    NativeGeocoder,
    Network,
    HTTP
  ]
})
export class AppModule {}
