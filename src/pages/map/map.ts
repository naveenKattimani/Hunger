import { Component, ElementRef, ViewChild } from '@angular/core';
import { Google_Maps } from '../../providers/google-maps/google-maps';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation, GoogleMapsEvent } from 'ionic-native';

declare var google;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})


export class MapPage {
 
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
 
   constructor(public navCtrl: NavController, public maps: Google_Maps, public platform: Platform) {
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

    searchtext(value){
    let input = document.getElementById('places').getElementsByTagName('input')[0];
    
    let autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete = new google.maps.places.Autocomplete(input);
    
    google.maps.event.addListener(autocomplete, 'place_changed', () => {

      let place = autocomplete.getPlace();
      console.log("places---" +place);
      this.maps.newplace.lat = place.geometry.location.lat();
      this.maps.newplace.lng = place.geometry.location.lng();
      //alert(this.maps.newplace.lat + ", " + this.maps.newplace.lng);      
      
      var myLatLng = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};

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
}