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
            {name:'wow cafe',r_id:'foodie_20005'},
          ];
    }
 
    filterItems(searchTerm){
        return this.items.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }); 
    }
}