import { Component, ElementRef, ViewChild } from '@angular/core';
import { Google_Maps } from '../../providers/google-maps/google-maps';
import { NavController, Platform } from 'ionic-angular';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import { HomePageModule } from '../home/home.module';
import { HomePage } from '../home/home';


declare var google;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})


export class MapPage {
  landmark;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
 
   constructor(public navCtrl: NavController, public maps: Google_Maps, public platform: Platform,public fbprovider:FirebaseProvider) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
    });
    }
 
  ionViewDidLoad(){
 
    this.platform.ready().then(() => { 
        let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
        console.log("ion view load");
    });

  }

  ionViewDidLeave()
  {
    this.fbprovider.landmark=this.landmark;
    console.log('landmark in map is:'+ this.fbprovider.landmark);
  }

    searchtext(value){
    let input = document.getElementById('places').getElementsByTagName('input')[0];
    
    let autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete = new google.maps.places.Autocomplete(input);
    
    google.maps.event.addListener(autocomplete, 'place_changed', () => {

      let place = autocomplete.getPlace();
      console.log(place.address_components.formatted_address);
      this.maps.newplace.lat = place.geometry.location.lat();
      this.maps.newplace.lng = place.geometry.location.lng();
      //alert(this.maps.newplace.lat + ", " + this.maps.newplace.lng);      
      
      var myLatLng = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
      this.getaddress(myLatLng)
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: myLatLng
        });
        this.maps.map.setCenter(myLatLng);
        this.maps.addMarker(myLatLng.lat,myLatLng.lng);
    });
  }

  myLocation()
  {
    this.maps.newplace.lat=0;
    this.maps.newplace.lng=0;
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
  }

  getaddress(latlng)
  {
    let geocoder = new google.maps.Geocoder;
    //let latlng = {lat: myplace.lat, lng: myplace.lng};
    geocoder.geocode({'location': latlng},(res, status) => {
      if(status==="OK")
      {
      this.fbprovider.currentaddess=res[0].formatted_address;
      HomePage.prototype.currentaddress=this.fbprovider.currentaddess;
      console.log("My address----->>----"+ HomePage.prototype.currentaddress);
      }
    });
  }
}