import { Component, ElementRef, ViewChild } from '@angular/core';
import { Google_Maps } from '../../providers/google-maps/google-maps';
import { NavController, Platform,AlertController } from 'ionic-angular';
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
  houseno;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
 
   constructor(public navCtrl: NavController, public alertCtrl:AlertController,public maps: Google_Maps, public platform: Platform,public fbprovider:FirebaseProvider) {
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
    if(this.houseno===undefined)
    { this.fbprovider.houseno="--";
      }
    else{this.fbprovider.houseno=this.houseno;
    }
    
    console.log('landmark in map is:'+ this.fbprovider.landmark);
    console.log('housenumber is is:'+ this.fbprovider.houseno);
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

  saveaddress()
  {
    let alert = this.alertCtrl.create({
      title: 'Save Address',
      cssClass:'myaccountalertCustomCss',
      buttons: [
        {
          text: 'save', handler: data => {
 
            if(this.houseno===undefined)
            { 
              this.fbprovider.houseno="--";
            }
            else{this.fbprovider.houseno=this.houseno;
            }
            if(this.landmark===undefined)
            { 
              this.fbprovider.landmark="--";
            }
            else{this.fbprovider.landmark=this.landmark;
            }

            this.fbprovider.adressname="";
            if(data.address!="")
            {
              this.fbprovider.adressname=JSON.stringify(data.address);
            }
            
            console.log('name is :'+ this.fbprovider.adressname);
            console.log('landmark in map is:'+ this.fbprovider.landmark);
            console.log('housenumber is is:'+ this.fbprovider.houseno);
            if((this.fbprovider.adressname!=""))
            {
              console.log("saving address"+ this.fbprovider.adressname!="");
              this.fbprovider.saveadress(this.fbprovider.adressname,this.fbprovider.landmark, this.fbprovider.houseno,this.fbprovider.currentaddess);
            }
            
          }
        }
      ],
      inputs: [
        {
          name: 'address',
          placeholder: 'ex: Home, Office etc',
        },
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }
}