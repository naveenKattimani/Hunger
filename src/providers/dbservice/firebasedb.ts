import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import firebase from 'firebase';

 
@Injectable()
export class FirebaseProvider {
  restaurantsfb=new Array();
  itemname=new Array();
  restaurantname;
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

  getmenu(restaurantid) {
    //return this.afd.list('/restaurants/foodie_2005');
    console.log("------------restname "+ restaurantid);
    var i=0;
    let ref = firebase.database().ref('/Menu').child(restaurantid);
    ref.on('child_added', (snapshot)=>{
      //console.log("-------restaurant ID"+snapshot.key);
      this.itemname[i]=new Array();
      ref.child(snapshot.key+'/').on('child_added', (snapshot)=>{
        //console.log("key---"+snapshot.key + ":value------" + snapshot.val());
        this.itemname[i][snapshot.key]=snapshot.val();
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