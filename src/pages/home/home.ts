import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Menu } from 'ionic-angular';
import { Restaurants } from '../../providers/restaurants/restaurants';
import { MapPage } from '../map/map';
import {  NgZone, ElementRef, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { HTTP } from '@ionic-native/http';
import { Google_Maps } from '../../providers/google-maps/google-maps';
import { LoadingController } from 'ionic-angular'
import { MenuPage } from '../menu/menu';
import { MyaccountPage } from '../myaccount/myaccount';
import { MycartPage } from '../mycart/mycart';


declare var google: any;
declare var google;
var address="";
let map: any;
let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
var myplace = {lat: 0, lng: 0};
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})


export class HomePage {

  searchTerm: string = '';
    items: any;
    service: any;
    nearbyPlaces = new Array();
    

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    currentaddress: any;
    
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,private Google_Maps:Google_Maps,private restaurant:Restaurants, private nativeGeocoder: NativeGeocoder,private geolocation: Geolocation,public dataService: Restaurants,private ngZone: NgZone) {
      
    }
 
    ionViewDidLoad() {
      //this.openrestaurantPage();  
    }

    ionViewCanEnter():boolean {

      let loading = this.loadingCtrl.create({
        content: 'Loading...'
      });    
      loading.present();    
      var myvar=setTimeout(() => {
        loading.dismiss();
      }, 2000);
      this.openrestaurantPage();
      return true;
    }
    
    setFilteredItems() {
        this.nearbyPlaces = this.restaurant.filterItems(this.searchTerm);
    }   

     openmapPage(){
      this.navCtrl.push(MapPage)      
    }

    openrestaurantPage(){
      this.nearbyPlaces=[];
      setTimeout(()=>
      {this.initMap()},500);
    }

    initMap(){
        navigator.geolocation.getCurrentPosition((location) => {
          console.log("this.Google_Maps.newplace.lat  "+ this.Google_Maps.newplace.lat);
          console.log("this.Google_Maps.newplace.lng  "+ this.Google_Maps.newplace.lng);
          if (this.Google_Maps.newplace.lat==0)
          {
            myplace.lat=location.coords.latitude;
            myplace.lng= location.coords.longitude;
          }
          else
          {
          myplace.lat=this.Google_Maps.newplace.lat;
          myplace.lng=this.Google_Maps.newplace.lng;
          this.Google_Maps.newplace.lat=0;
          this.Google_Maps.newplace.lat=0;
          }
          
          var distkm;          
          map = new google.maps.Map(this.mapElement.nativeElement, {
          center: {lat: myplace.lat, lng: myplace.lng},
          zoom: 15
        });

        let geocoder = new google.maps.Geocoder;
          let latlng = {lat: myplace.lat, lng: myplace.lng};
          geocoder.geocode({'location': latlng},(res, status) => {
            if(status==="OK")
            {
            address=res[0].formatted_address;
            this.currentaddress=res[0].formatted_address;
            console.log("current location-----"+ this.currentaddress); 
            }
          });
        
        var service = new google.maps.places.PlacesService(map);        
        service.nearbySearch({
          location: {lat: myplace.lat, lng: myplace.lng},
          radius: 500,
          type: ['restaurant'],
          }, (results,status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                //console.log("<<<<<<<<<<<<<<<<<<<<<"+results[i]);                
                distkm=this.calculateDistance(results[i].geometry.location.lat(),myplace.lat,results[i].geometry.location.lng(),myplace.lng)
                distkm=distkm.toFixed(2);
                address="";
                let geocoder = new google.maps.Geocoder;
                var serachrestaurant=results[i];
                let latlng = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
                geocoder.geocode({'location': latlng},(res, status) => {
                  if(status==="OK")
                  {
                  address=res[0].formatted_address;
                  //console.log("-----"+ res[0].formatted_address); // read data from here
                  //console.log("-----"+address);
                  }
                  console.log("-----"+serachrestaurant.name);
                  this.restaurant.availablerestaurants.forEach((arr1)=>
                    {
                      if(arr1.name===serachrestaurant.name)
                      {
                        //console.log("-----"+arr1.name);
                        this.nearbyPlaces.push({name:serachrestaurant.name,distance:distkm,adrs:address});
                        this.restaurant.items.push({name:serachrestaurant.name,distance:distkm,adrs:address});
                        
                      }
                    });                  
                });
                    
                  // console.log("-----"+address);
                  // this.nearbyPlaces.push({name:results[i].name,distance:distkm,adrs:address});                    
                }
              }
            });
          }, (error) => {
            console.log(error);
          }, options);          
        }

        calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
          //console.log(lat1+"--"+lat2+"--"+long1+"--"+long2+"--");
          let p = 0.017453292519943295;    // Math.PI / 180
          let c = Math.cos;
          let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
          let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
          return dis;
        }

        openrestaurantmenu(restaurantname)
        {
          this.restaurant.selectedrestaurant=restaurantname;
          this.navCtrl.push(MenuPage);
          //console.log("----restaurant"+ restaurantname);          
        }

        myaccountpage()
        {
          this.navCtrl.push(MyaccountPage);
          //console.log("----accountpage");
        }

        mycartpage()
        {
          this.navCtrl.push(MycartPage);
          console.log("----accountpage");
        }
}