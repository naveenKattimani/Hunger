import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FirebaseProvider } from '../dbservice/firebasedb';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireList } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { AngularFireModule } from 'angularfire2';
 
@Injectable()
export class Restaurants {
    items=new Array();
    availablerestaurants=new Array();
    selectedrestaurant;
    selectedrestaurantid;
    restaurantnames: AngularFireList<any>;
    newItem = '';
    firsttimeload=false;
 
    constructor(public http: Http,public firebaseProvider: FirebaseProvider) {        
        // this.availablerestaurants = [
        //     {name:'wow cafe',description:'Burger vadapav and more',place_id:'ChIJoTN7T1y_yDsREvscujjUSYI',r_id:'foodie-20005'},
        //     {name:'Green Kababish',description:'Non Vegand Veg',place_id:'ChIJoTN7T1y_yDsREvscujjUSYI',r_id:'foodie-20006'},
        //     {name:'KFC',description:'Non Vegand Veg',place_id:'ChIJoTN7T1y_yDsREvscujjUSYI',r_id:'foodie-20007'},
        //   ];
        this.availablerestaurants=this.firebaseProvider.restaurantsfb;
    }
 
    filterItems(searchTerm){
        return this.items.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }); 
    }
}