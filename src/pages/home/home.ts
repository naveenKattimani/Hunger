import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Menu, MenuController } from 'ionic-angular';
import { Restaurants } from '../../providers/restaurants/restaurants';
import { MapPage } from '../map/map';
import {  NgZone, ElementRef, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { HTTP } from '@ionic-native/http';
import { Google_Maps } from '../../providers/google-maps/google-maps';
import { LoadingController,Slides } from 'ionic-angular'
import { MenuPage } from '../menu/menu';
import { MyaccountPage } from '../myaccount/myaccount';
import { CartPage } from '../cart/cart';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import {MyaccountProvider} from '../../providers/myaccount/myaccount';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import firebase from 'firebase';

declare var google: any;
declare var google;
var address="";
let loading;
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
  starList=[];
  slideData = [
  { image: "assets/imgs/1.jpg" },
  { image: "assets/imgs/2.jpg" },
  { image: "assets/imgs/3.jpg" },
  { image: "assets/imgs/4.jpg" },
  { image: "assets/imgs/5.jpg" },
  { image: "assets/imgs/6.jpg" }]
  
  searchTerm: string = '';
    items: any;
    service: any;
    nearbyPlaces = new Array();

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    currentaddress: any;
    @ViewChild(Slides) slides: Slides;
    constructor(public FirebaseProvider:FirebaseProvider,private locationAccuracy: LocationAccuracy,public myacc:MyaccountProvider,public catsvc:CartServiceProvider,public navCtrl: NavController, public loadingCtrl: LoadingController,private Google_Maps:Google_Maps,private restaurant:Restaurants, private nativeGeocoder: NativeGeocoder,private geolocation: Geolocation,public dataService: Restaurants,private ngZone: NgZone) {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if(canRequest) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () =>{
              setTimeout(()=>
              {this.initMap()},200);              
            console.log("success") 
            },
            error => console.log('Error requesting location permissions', error)
          );
        }})   
    }
 
    ionViewDidLoad() { 
      this.slides.autoplayDisableOnInteraction = false;
      console.log(this.restaurant.restaurantnames);      
    }

    ionViewCanEnter():boolean {
      this.currentaddress="Select location.";
      this.openrestaurantPage();
      loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Loading',
      });    
      return true;
    }
    
    setFilteredItems() {
        this.nearbyPlaces = this.restaurant.filterItems(this.searchTerm);
    }   

     openmapPage(){
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if(canRequest) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () =>{
              setTimeout(()=>
              {this.initMap()},100);
              setTimeout(()=>
              {this.navCtrl.push(MapPage);},200);
              
            console.log("success") 
            },
            error => console.log('Error requesting location permissions', error)
          );
        }}) 
       //this.navCtrl.push(MapPage)      
    }

    openrestaurantPage(){
      this.nearbyPlaces=[];
      this.restaurant.items=[];
      setTimeout(()=>
      {this.initMap()},1000);
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
            this.FirebaseProvider.currentaddess=this.currentaddress;
            console.log("My address-----"+ this.currentaddress);
            }
          });
        
        var service = new google.maps.places.PlacesService(map);  
        loading.present();
        this.restaurant.availablerestaurants.forEach((arr1)=>
        {
          service.nearbySearch({
          location: {lat: myplace.lat, lng: myplace.lng},
          radius: 10000,
          type: ["restaurant"],
          name:arr1.name,
          }, (results,status,pagination) => {
            pagination.nextPage();
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {   
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
                  //console.log("My address-----"+ res[0].formatted_address); // read data from here
                  //console.log("-----"+address);
                  }
                  
                  // this.restaurant.availablerestaurants.forEach((arr1)=>
                  //   {
                  //      console.log("----"+arr1.place_id +"---"+serachrestaurant['place_id'])
                      // console.log("----avialbale restaurants"+arr1.name.toUpperCase())
                      //if(arr1.name.toUpperCase()===serachrestaurant.name.toUpperCase() && arr1.place_id===serachrestaurant['place_id'])
                      if(arr1.place_id===serachrestaurant['place_id'])
                      {
                        console.log("-------ratings"+serachrestaurant.rating);
                        console.log("----avialbale restaurants"+arr1.place_id.toUpperCase())
                      console.log("----avialbale restaurants"+arr1.name.toUpperCase())
                        console.log("-----place id"+serachrestaurant.name.toUpperCase() + serachrestaurant['place_id']);
                        //this.nearbyPlaces.push({name:serachrestaurant.name,place_id:arr1.place_id,distance:distkm,desc:arr1.description,r_id:arr1.r_id,img_id:'assets/imgs/Restaurants/'+arr1.r_id+'.png'});
                          var nsearch=0;
                          this.nearbyPlaces.forEach(element => {
                            if(element.place_id===serachrestaurant['place_id'])
                            {
                              nsearch=1;
                            }
                          });
                          if (nsearch===0)
                          {
                            this.starList=[];
                            for(i=1; i<=5; i++) {
                              if(i<= serachrestaurant.rating) {
                                this.starList.push("fa fa-star checked");
                              } else {
                                this.starList.push("fa fa-star");
                              }
                            }
                            this.nearbyPlaces.push({name:serachrestaurant.name,rating:this.starList,place_id:arr1.place_id,distance:distkm,desc:arr1.description,r_id:arr1.r_id,img_id:'assets/imgs/Restaurants/'+arr1.r_id+'.jpg'});
                            this.restaurant.items.push({name:serachrestaurant.name,rating:serachrestaurant.rating,distance:distkm,desc:arr1.description,r_id:arr1.r_id,img_id:'assets/imgs/Restaurants/'+arr1.r_id+'.jpg'});
                          }
                        }
                    //});  
                                    
                });
                    
                  // console.log("-----"+address);
                  // this.nearbyPlaces.push({name:results[i].name,distance:distkm,adrs:address});                    
                }
              }
            });
          });
          var myvar=setTimeout(() => {
            loading.dismiss();
           }, 2000);
           
          }, (error) => {
            //console.log(error);
          }, options);
               
        }


        // calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
        //   //console.log(lat1+"--"+lat2+"--"+long1+"--"+long2+"--");
        //   let p = 0.017453292519943295;    // Math.PI / 180
        //   let c = Math.cos;
        //   let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
        //   let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
        //   return dis;
        // }

        rad = function(x) {
          return x * Math.PI / 180;
        };

        calculateDistance(lat1:number,lat2:number,long1:number,long2:number) {
          var R = 6378137; // Earth’s mean radius in meter
          var dLat = this.rad(lat2 - lat1);
          var dLong = this.rad(long2 - long1);
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = R * c;
          return d/1000; // returns the distance in meter
        };

        openrestaurantmenu(restaurantname,restaurantid)
        {
          console.log("----restaurant name"+ restaurantid)
          this.restaurant.selectedrestaurant=restaurantname;
          this.restaurant.selectedrestaurantid=restaurantid;
          this.FirebaseProvider.getmenu(restaurantid);
          this.catsvc.thecart=[]; 
          
          let loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: 'Loading',
          });    
          loading.present();    
          var myvar=setTimeout(() => {
            loading.dismiss();
          }, 1000);
          this.navCtrl.push(MenuPage);        
        }

        myaccountpage()
        {
          this.navCtrl.push(MyaccountPage);
          //console.log("----accountpage");
        }

        mycartpage()
        {
          this.navCtrl.push(CartPage);
          //console.log("----accountpage");
        }

        slidesChanged() {
        }
      
}