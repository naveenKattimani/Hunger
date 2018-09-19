import { Injectable } from '@angular/core';
import { Connectivity } from '../connectivity/connectivity';
import { Geolocation, GoogleMapsEvent } from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
declare var google;

 
@Injectable()
export class Google_Maps {
 
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  markers: any = [];
  apiKey: string;
  markerlatlong: any;
  newplace = {lat: 0, lng: 0};
 
  constructor(public connectivityService: Connectivity,private http: Http) {
 
  }
 
  init(mapElement: any, pleaseConnect: any): Promise<any> { 
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect; 
    return this.loadGoogleMaps(); 
  }
 
  loadGoogleMaps(): Promise<any> { 
    return new Promise((resolve) => { 
      if(typeof google == "undefined" || typeof google.maps == "undefined"){ 
        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap(); 
        if(this.connectivityService.isOnline()){ 
          window['mapInit'] = () => { 
            this.initMap().then(() => {
              resolve(true);
            });
             this.enableMap();
          } 
          let script = document.createElement("script");
          script.id = "googleMaps"; 
          if(this.apiKey){
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';  
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';      
          }
          document.body.appendChild(script); 
        }
      }
      else { 
        if(this.connectivityService.isOnline()){
          this.initMap();
          this.enableMap();
        }
        else {
          this.disableMap();
        } 
      } 
      this.addConnectivityListeners(); 
    }); 
  }
  
  initMap(): Promise<any> {
 
    this.mapInitialised = true; 
    return new Promise((resolve) => { 
      Geolocation.getCurrentPosition().then((position) => {
        var lat= position.coords.latitude;
        var lng= position.coords.longitude;
        if (this.newplace.lat!=0)
          {
            lat=this.newplace.lat;
            lng= this.newplace.lng;
          }

        let latLng = new google.maps.LatLng(lat, lng); 
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
        }
 
        this.map = new google.maps.Map(this.mapElement, mapOptions);
        this.addMarker(lat,lng);
        resolve(true); 
      }); 
    }); 
  }
 
  disableMap(): void { 
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
    } 
  }
 
  enableMap(): void { 
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
    } 
  }
 
  addConnectivityListeners(): void {
     document.addEventListener('online', () => { 
      console.log("online"); 
      setTimeout(() => { 
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        }
        else {
          if(!this.mapInitialised){
            this.initMap();
          } 
          this.enableMap();
        } 
      }, 2000); 
    }, false); 
    document.addEventListener('offline', () => { 
      console.log("offline"); 
      this.disableMap(); 
    }, false); 
  }
 
  addMarker(lat: number, lng: number): void { 
    let latLng = new google.maps.LatLng(lat, lng); 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable:true,
      zoom:5,
      position: {
        lat: lat,
        lng: lng
      }
    });
 
    google.maps.event.addListener(marker, 'drag', () => {
      console.log("lat"+ marker.position.lat());
      console.log("lng"+ marker.position.lng());
      this.newplace.lat=marker.position.lat();
      this.newplace.lng=marker.position.lng();
    })
  }
 
}