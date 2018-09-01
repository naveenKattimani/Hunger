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
            {name:'By2 Coffee',r_id:'foodie_20001'},
            {name:'Karavali Hotel',r_id:'foodie_20002'},
            {name:'R K Hotel',r_id:'foodie_20003'},
            {name:'Havmor Ice-Cream Parlour',r_id:'foodie_20004'},
            {name:'KFC',r_id:'foodie_20005'},
          ];
    }
 
    filterItems(searchTerm){
        return this.items.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }); 
    }
}