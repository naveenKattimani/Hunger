import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Restaurants } from '../../providers/restaurants/restaurants';
import { MapPage } from '../map/map';
import {  NgZone, ElementRef, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GeolocationOptions ,Geoposition ,PositionError } from 'ionic-native';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';



declare var google: any;
declare var google;
var address="";
let map: any;
let infowindow: any;
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
    constructor(public navCtrl: NavController, private nativeGeocoder: NativeGeocoder,private geolocation: Geolocation,public dataService: Restaurants,private ngZone: NgZone) {
   
    }
 
    ionViewDidLoad() {
        this.setFilteredItems();     
        this.nearbyPlaces=[];
      setTimeout(()=>
      {this.initMap()},500);  
    }

 
    setFilteredItems() {
        this.items = this.dataService.filterItems(this.searchTerm);
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

      this.geolocation.getCurrentPosition().then((resp) => {
        myplace.lat=resp.coords.latitude;
        myplace.lng= resp.coords.longitude;
        
       }).catch((error) => {
         console.log('Error getting location', error);
       });

        navigator.geolocation.getCurrentPosition((location) => {
            console.log(location);
            var distkm;
            
            map = new google.maps.Map(this.mapElement.nativeElement, {
              center: {lat: location.coords.latitude, lng: location.coords.longitude},
              zoom: 15
            });
            
            

            var service = new google.maps.places.PlacesService(map);
            
            service.nearbySearch({
              location: {lat: location.coords.latitude, lng: location.coords.longitude},
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
                    console.log("-----"+address);
                    this.nearbyPlaces.push({name:serachrestaurant.name,distance:distkm,adrs:address});
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
}