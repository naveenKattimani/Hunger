import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class Restaurants {
    items=new Array();
    availablerestaurants=new Array();
    selectedrestaurant;
 
    constructor(public http: Http) {
        this.availablerestaurants = [
            {name:'wow cafe',description:'Burger vadapav and more',place_id:'ChIJoTN7T1y_yDsREvscujjUSYI',r_id:'foodie-20005'},
            {name:'Green Kababish',description:'Non Vegand Veg',place_id:'ChIJoTN7T1y_yDsREvscujjUSYI',r_id:'foodie-20006'},
            {name:'KFC',description:'Non Vegand Veg',place_id:'ChIJoTN7T1y_yDsREvscujjUSYI',r_id:'foodie-20007'},
          ];
    }
 
    filterItems(searchTerm){
        return this.items.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }); 
    }
}