import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import firebase from 'firebase';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import {CartServiceProvider} from '../../providers/cart-service/cart-service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

 
@Injectable()
export class FirebaseProvider {
  orderid;
  txnstatus;
  restaurantsfb=new Array();
  itemname=new Array();
  myorderhistory=new Array();
  myorders=new Array();
  myadress=[];
  gorderdetails=new Array();
  recommendedname=new Array();
  dests=new Array();
  restaurantname;
  contactnum;
  totalamount:any;
  public deliveryaddress;
  public currentaddess;
  public landmark;
  public houseno;
  public srcurl;
  public adressname;


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
  placeorder(orderid,thecart) {
    var index=1;
    var orderef = firebase.database().ref("OrderDetails/");   
    this.cartsvc.thecart.forEach(cartitem => {   
          orderef.child(orderid).child("item"+index).set({
          OrderId:cartitem.OrderId,
          name:cartitem.name,
          cost:cartitem.cost,
          quantity:cartitem.quantity,
          Ordertype:cartitem.type,
          
        });
        index=index+1;
     });
  }

  orderhistory(deliveryaddress,selectedrestaurantid,orderid,totalcartamount,packagingcharge,deliverycharge,orderdate) {
    var orderef = firebase.database().ref("OrderHistory/");  
      orderef.child(orderid).set({
        contactnumber:this.contactnum,
        totalcartamount:totalcartamount,
        packagingcharge:packagingcharge,
        deliverycharge:deliverycharge,
        orderdate:orderdate,
        //address:"HouseNo: " + this.houseno + " "+ this.currentaddess + ", LandMark:" + this.landmark,
        address:deliveryaddress,
        restaurantid:selectedrestaurantid
    });
  }

  getmyorderhistory() {
    //this.contactnum='9591317407'
    var i=0;
    var nflag;
    this.myorders=[];
    let ref = firebase.database().ref('/OrderHistory/');
    ref.on('child_added', (snapshot)=>{
      var orderid=snapshot.key;      
      this.myorders[i]=new Array();
      nflag=0;
      ref.child(snapshot.key+'/').on('child_added', (snapshot)=>{ 
        
        if (snapshot.key=="contactnumber" && snapshot.val()==this.contactnum)
        {
          //console.log(snapshot.key);
          nflag=1;
          this.myorders[i].orderid=orderid;
          //console.log('orderid'+orderid);
          firebase.database().ref('/OrderHistory/'+ orderid +'/').on('child_added', (snapshot)=>{
            switch(snapshot.key)
            {
            case ('orderdate'):
              this.myorders[i].orderdate=snapshot.val();
              break
            case ('address'):
              this.myorders[i].address=snapshot.val();
              break
            case ('restaurantid'):
              this.myorders[i].restaurantid=snapshot.val();
              break
            case ('packagingcharge'):
              this.myorders[i].packagingcharge=snapshot.val();
              break
            case ('deliverycharge'):
              this.myorders[i].deliverycharge=snapshot.val();
              break
            case ('totalcartamount'):
              this.myorders[i].totalcartamount=snapshot.val();
              break
            }            
          });  
        }  
              
      })
      if(nflag==1)
      i=i+1;
    })    
  }

  getorders() {
    this.gorderdetails=[];
    for(var i=0;i<this.myorders.length;i++) {
      console.log('====='+this.myorders[i].orderid);
      this.getorderhistory(this.myorders[i].orderid);
    }
  }

  getorderhistory(e1) {
    var myorderdetails=[];
    var i=0;
    var l=0;
    //var e1=this.myorders[0].orderid;
    //this.myorders.forEach(function(el) {
        //this.myorderdetails[i]=new Array();
        //console.log('orderid---------------'+e1);
        var ref=firebase.database().ref('/OrderDetails/');
        return(ref.child(e1 +'/').on('child_added', (snapshot)=>{    
           //console.log('key---------------'+snapshot.key);
           myorderdetails[i]=new Array();
           myorderdetails[i].cartOrderId=e1;
          ref.child(e1 +'/'+snapshot.key+'/').on('child_added', (snapshot)=>{ 
            // console.log('key---------------'+snapshot.key);
            // console.log('OrderId'==snapshot.key);
            // console.log('---------------'+i);
            switch(snapshot.key)
            {
            case ('OrderId'):
              //console.log('--------------in-'+snapshot.key);
              myorderdetails[i].OrderId=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].OrderId);
              break;
            case ('Ordertype'):
              //console.log('--------------in-'+snapshot.key);
              myorderdetails[i].Ordertype=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].Ordertype);
              break;
            case ('cost'):
              //console.log('--------------in-'+snapshot.key);
              myorderdetails[i].cost=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].cost);
              break;
            case ('name'):
              //console.log('--------------in-'+snapshot.key);
              myorderdetails[i].name=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].name);
              break;
            case ('quantity'):
              //console.log('--------------in-'+snapshot.key);
              myorderdetails[i].quantity=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].quantity);
              break;
            }
          })
        this.pushorder(myorderdetails[i])      
        i=i+1; 
      }));
      //});
  }

  pushorder(myorderdetails)
  {
    var i=this.gorderdetails.length;
    this.gorderdetails[i]=new Array();
    this.gorderdetails[i]['OrderId']=myorderdetails.OrderId;
    this.gorderdetails[i].Ordertype=myorderdetails.Ordertype;
    this.gorderdetails[i].cost=myorderdetails.cost;
    this.gorderdetails[i].name=myorderdetails.name;
    this.gorderdetails[i].quantity=myorderdetails.quantity;
    this.gorderdetails[i].cartOrderId=myorderdetails.cartOrderId;
    console.log('--------------in-'+i+'>>>'+this.gorderdetails[i]['OrderId']+this.gorderdetails[i].name);
  }

  addItem(name) {
    this.afd.list('/shoppingItems/').push(name);
  }
 
  removeItem(id) {
    this.afd.list('/shoppingItems/').remove(id);
  }

  saveadress(adressname1,landmark1,housenumber1,address1)
  {
    var orderef = firebase.database().ref("useraccount/");     
          orderef.child(this.contactnum).child(adressname1).set({
          landmark:landmark1,
          housenumber:housenumber1,
          address:address1,   
        });
  }

  getaddress()
  {
    this.myadress=[];
    this.contactnum='9591317407';
    var i=0;
    let ref = firebase.database().ref('/useraccount/'+this.contactnum+'/');
    ref.on('child_added', (snapshot)=>{
      console.log('--------------in1-'+snapshot.key);
      var addressname=snapshot.key;   
      this.myadress[i]=new Array(); 
      this.myadress[i].adressname=addressname;
      console.log('--------------in2-'+this.myadress[i].adressname);
          ref.child(addressname+'/').on('child_added', (snapshot)=>{ 
            switch(snapshot.key)
            {
            case ('landmark'):
              //console.log('--------------in-'+snapshot.key);
              this.myadress[i].landmark=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].OrderId);
              break;
            case ('housenumber'):
              //console.log('--------------in-'+snapshot.key);
              this.myadress[i].housenumber=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].OrderId);
              break;
            case ('address'):
              //console.log('--------------in-'+snapshot.key);
              this.myadress[i].address=snapshot.val();
              //console.log('--------------in-'+myorderdetails[i].OrderId);
              break;
            }
          })      
        i=i+1; 
      });
  }
}