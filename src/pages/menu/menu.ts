import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { Restaurants } from '../../providers/restaurants/restaurants';
import{CartServiceProvider} from '../../providers/cart-service/cart-service'
import { LoadingController } from 'ionic-angular'
import { CartPage } from '../cart/cart';
import { HomePage } from '../home/home';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import { OrdertransactionPage } from '../ordertransaction/ordertransaction';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  @ViewChild(Slides) slides: Slides;
  restaurantname: string;
  restaurantid: String;
  ncount: number;
  recommendeditems = new Array();
  itemsbytype = new Array();
  dests = [];
  items;
  constructor(public cartSvc:CartServiceProvider,public FirebaseProvider:FirebaseProvider,public loadingCtrl: LoadingController,public navCtrl: NavController,public Restaurant:Restaurants,public navParams: NavParams) {
    this.restaurantname=this.Restaurant.selectedrestaurant;
    this.restaurantid=this.Restaurant.selectedrestaurantid;
    this.items=this.FirebaseProvider.itemname;
    //console.log("---"+ this.restaurantname);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MainPage');
  }

  changeBackground()
  {
    return(this.cartSvc.thecart.length>0 ? 'green' : 'darklategrey');
  }
  
  
  // items = [
  //   {type:'burgers',title:'wow stanadard',cost:"25",quantity:0,orderID:'101',recommended:'1'},
  //   {type:'burgers',title:'wow masal paneer',cost:"30",quantity:0,orderID:'102',recommended:'0'},
  //   {type:'burgers',title:'wow schezwan',cost:"35",quantity:0,orderID:'103',recommended:'1'},
  //   {type:'burgers',title:'wow crunchy',cost:"35",quantity:0,orderID:'104',recommended:'0'},
  //   {type:'vadapav',title:'wow corn cheese nuggets',cost:"35",quantity:0,orderID:'105',recommended:'1'},
  //   {type:'vadapav',title:'wow chatpata fries',cost:"35",quantity:0,orderID:'106',recommended:'0'},
  //   {type:'vadapav',title:'wow hot masala',cost:"35",quantity:0,orderID:'107',recommended:'1'},
  // ];

  itemSelected(item: string) {
    //console.log("Selected Item", item);
  }
  
    incrementQty(item: any) {
      item.quantity++;
      var nflag=0;
      this.cartSvc.thecart.forEach(cartitem => { 
        if (cartitem.OrderId==item.OrderId)
        {
          console.log("order in cart " + cartitem.OrderId +":"+item.OrderId); 
          cartitem.quantity=item.quantity;          
          nflag=1;
        }
       });
       if (nflag==0)
      {
        //console.log("itemname " + item.name);
        this.cartSvc.additem(item);
      }
    }

  
    decrementQty(item: any) {
      this.ncount=0;
      if(item.quantity>0)
      {
        item.quantity=item.quantity-1;
        this.cartSvc.thecart.forEach((cartitem,arrindex) =>{   
        this.ncount++;
        if (cartitem.OrderId==item.OrderId)
          {
            if(cartitem.quantity>=0)
            {
              cartitem.quantity=item.quantity;
              //console.log("-----"+cartitem.quantity);
              this.cartSvc.updatetotal();
              if(cartitem.quantity==0)
              {
                //console.log("------index" + arrindex + "----"+ cartitem.title +"---" + cartitem.quantity);
    
                this.cartSvc.thecart.splice(arrindex,1);
              }   
            }      
          }
        });
      }
    }

    find_in_object(my_object, my_criteria){

      return my_object.filter(function(obj) {
        return Object.keys(my_criteria).every(function(c) {
          return obj[c] == my_criteria[c];
        });
      });    
    }

    mycartpage()
    {
      this.navCtrl.push(CartPage);
      //console.log("----accountpage");
    }

    Homepage()
    {
      this.navCtrl.push(HomePage);
    }

    toggleSection(i) {
      console.log("detss---"+this.FirebaseProvider.dests[i].type);
      this.FirebaseProvider.dests[i].open = !this.FirebaseProvider.dests[i].open;
    }
  
}

