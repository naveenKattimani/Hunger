import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import firebase from 'firebase';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import {CartServiceProvider} from '../../providers/cart-service/cart-service';

 
@Injectable()
export class FirebaseProvider {
  orderid;
  txnstatus;
  restaurantsfb=new Array();
  itemname=new Array();
  myorderhistory=new Array();
  myorders=new Array();
  recommendedname=new Array();
  dests=new Array();
  restaurantname;
  contactnum;
  public currentaddess;
  public srcurl;


  constructor(public afd: AngularFireDatabase,public cartsvc:CartServiceProvider,public zone:NgZone) {
    let person = JSON.parse(localStorage.getItem('PERSON'));
    if (person){
      this.contactnum=person.contactnumber;
      console.log("ccccccccc"+this.contactnum);
    }
    this.getrestaurants();
   }

  getrestaurants() {
    var i=0;
    let ref = firebase.database().ref('/restaurants');
    ref.on('child_added', (snapshot)=>{
      this.restaurantsfb[i]=new Array();
      ref.child(snapshot.key+'/').on('child_added', (snapshot)=>{
        this.restaurantsfb[i][snapshot.key]=snapshot.val();
      })
      i=i+1;
    })
  }

  getmenu(restaurantid) {
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
      this.itemname[i]=new Array();
      ref.child(snapshot.key+'/').on('child_added', (snapshot)=>{
        this.itemname[i][snapshot.key]=snapshot.val();
      })
      //recommended items
      if (this.itemname[i].recommended=="1")
        {
          //firebase.storage().ref().child(this.itemname[i].OrderId+'.jpg').getDownloadURL().then(url => this.srcurl = url); 
          this.itemname[i].url=this.srcurl;      
          this.recommendedname.push(this.itemname[i]);
        }
          if (!itemsbytype[this.itemname[i].type]) {
            itemsbytype[this.itemname[i].type] = [];      
          }
          itemsbytype[this.itemname[i].type].push(this.itemname[i]);
          this.dests=[]; 
            for (let dest in itemsbytype) {
              this.dests.push({type: dest, items: itemsbytype[dest]}); 
            }
      i=i+1;
    })    
  }

  display(name)
  {
    firebase.storage().ref().child(name+'.jpg').getDownloadURL().then(function(url) {                        
     this.srcurl=url;       
                 
   });
  }
  placeorder(selectedrestaurantid,selectedrestaurant,orderid,thecart) {
    var index=1;
    var orderef = firebase.database().ref("OrderDetails/");   
    this.cartsvc.thecart.forEach(cartitem => {   
          orderef.child(selectedrestaurantid).child(this.contactnum).child(orderid).child("item"+index).set({
          OrderId:cartitem.OrderId,
          name:cartitem.name,
          cost:cartitem.cost,
          quantity:cartitem.quantity,
          Ordertype:cartitem.type,
        });
        index=index+1;
     });
  }

  orderhistory(orderid,totalcartamount,packagingcharge,deliverycharge,orderdate) {
    var index=1;
    var orderef = firebase.database().ref("OrderAmount/");
    this.cartsvc.thecart.forEach(cartitem => {   
          orderef.child(orderid).set({
            contactnumber:this.contactnum,
            totalcartamount:totalcartamount,
            packagingcharge:packagingcharge,
            deliverycharge:deliverycharge,
            orderdate:orderdate,
        });
        index=index+1;
     });
  }

  getorderhistory(selectedrestaurantid,ordernumber) {
    var i=0;
    let ref = firebase.database().ref('/OrderDetails/'+selectedrestaurantid+'/'+this.contactnum+'/'+ordernumber);
    ref.on('child_added', (snapshot)=>{
      this.myorders[i]=new Array();
      ref.child(snapshot.key+'/').on('child_added', (snapshot)=>{
        this.myorders[i][snapshot.key]=snapshot.val();
      })
      i=i+1;
    })
    
  }

  getorders(selectedrestaurantid) {
    var i=0;
    let ref = firebase.database().ref('/OrderDetails/'+selectedrestaurantid+'/'+this.contactnum+'/');
    ref.on('child_added', (snapshot)=>{
      console.log("----order number:"+snapshot.key);
      this.getorderhistory(selectedrestaurantid,snapshot.key)
      
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