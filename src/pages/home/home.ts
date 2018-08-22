import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Restaurants } from '../../providers/restaurants/restaurants';
import { MapPage } from '../map/map';
import {  NgZone, ElementRef, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GeolocationOptions ,Geoposition ,PositionError } from 'ionic-native';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';


declare var google: any;
declare var google;
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
    constructor(public navCtrl: NavController, private geolocation: Geolocation,public dataService: Restaurants,private ngZone: NgZone) {
   
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
        console.log('>>>>>>>>location---', myplace.lat +"---" + myplace.lng);
       }).catch((error) => {
         console.log('Error getting location', error);
       });

        navigator.geolocation.getCurrentPosition((location) => {
            console.log(location);
            map = new google.maps.Map(this.mapElement.nativeElement, {
              center: {lat: location.coords.latitude, lng: location.coords.longitude},
              zoom: 15
            });
        
       
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: {lat: location.coords.latitude, lng: location.coords.longitude},
              radius: 500,
              type: ['restaurant']
            }, (results,status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                  //console.log("<<<<<<<<<<<<<<<<<<<<<"+results[i]);
                  this.nearbyPlaces.push(results[i]);                    
                }
              }
            });
          }, (error) => {
            console.log(error);
          }, options);
          
        }
}