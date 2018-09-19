import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import firebase from 'firebase';

 
@Injectable()
export class FirebaseProvider {
  restaurantsfb=new Array();
  constructor(public afd: AngularFireDatabase) {
    this.getrestaurants();
   }

  getrestaurants() {
    //return this.afd.list('/restaurants/foodie_2005');
    var i=0;
    let ref = firebase.database().ref('/restaurants');
    ref.on('child_added', (snapshot)=>{
      //console.log("-------restaurant ID"+snapshot.key);
      this.restaurantsfb[i]=new Array();
      ref.child(snapshot.key+'/').on('child_added', (snapshot)=>{
        //console.log("key---"+snapshot.key + ":value------" + snapshot.val());
        this.restaurantsfb[i][snapshot.key]=snapshot.val();
      })
      i=i+1;
    })
  }
 
  addItem(name) {
    this.afd.list('/shoppingItems/').push(name);
  }
 
  removeItem(id) {
    this.afd.list('/shoppingItems/').remove(id);
  }
}