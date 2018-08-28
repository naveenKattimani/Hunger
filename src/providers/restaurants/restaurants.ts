import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class Restaurants {
    items=new Array();
    availablerestaurants=new Array();
 
    constructor(public http: Http) {
        this.availablerestaurants = [
            {name:'By2 Coffee',cost:"25",quantity:0,orderID:'101'},
            {name:'Karavali Hotel',cost:"30",quantity:0,orderID:'102'},
            {name:'R K Hotel',cost:"35",quantity:0,orderID:'103'},
            {name:'Havmor Ice-Cream Parlour',cost:"35",quantity:0,orderID:'103'},
            {name:'KFC',cost:"35",quantity:0,orderID:'103'},
          ];
    }
 
    filterItems(searchTerm){
        return this.items.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }); 
    }
}