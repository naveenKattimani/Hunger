import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import firebase from 'firebase';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';

 
@Injectable()
export class FirebaseProvider {
  restaurantsfb=new Array();
  itemname=new Array();
  recommendedname=new Array();
  dests=new Array();
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
    
    this.itemname=[];
    this.dests=[];
    this.recommendedname=[];
    let itemsbytype = {};
    var listlength:number;
    console.log("------------restname "+ restaurantid);
    var i=0;
    let ref = firebase.database().ref('/Menu').child(restaurantid);
    ref.on('child_added', (snapshot)=>{
      listlength=snapshot.numChildren();
      //console.log("-------restaurant ID"+snapshot.key);
      this.itemname[i]=new Array();
      ref.child(snapshot.key+'/').on('child_added', (snapshot)=>{
        //console.log("key---"+snapshot.key + ":value------" + snapshot.val());
        this.itemname[i][snapshot.key]=snapshot.val();
      })
      //recommended items
      if (this.itemname[i].recommended=="1")
        {
          this.recommendedname.push(this.itemname[i]);
        }
      //item lists;
        console.log(">>-----length"+listlength +"---" + i);      
        
          if (!itemsbytype[this.itemname[i].type]) {
            itemsbytype[this.itemname[i].type] = [];      }
          itemsbytype[this.itemname[i].type].push(this.itemname[i]);
          //console.log("-----------"+ itemsbytype[item.type][0].title);
          this.dests=[];
          // if (listlength==i)
          // {
            console.log(">>-----inside if"+listlength +"---" + i);   
            for (let dest in itemsbytype) {
              //console.log("-----------"+ dest);
              this.dests.push({type: dest, items: itemsbytype[dest]});     
              //console.log("----------->>"+ this.dests.length); 
            }
          //}
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