import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class Restaurants {
 
    items: any;
 
    constructor(public http: Http) {
 
        this.items = [
            {title: 'Shanti Sagar'},
            {title: 'Nisarga'},
            {title: 'Barbeque Nation'},
            {title: 'Punjabi Dhaba'},
            {title: 'Hyderabadi Biryani'},
            {title: 'Udupi Hotel'}
        ]
 
    }
 
    filterItems(searchTerm){
        return this.items.filter((item) => {
            return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }); 
    }

}