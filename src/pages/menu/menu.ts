import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { Restaurants } from '../../providers/restaurants/restaurants';
import{CartServiceProvider} from '../../providers/cart-service/cart-service'
import { LoadingController } from 'ionic-angular'

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  @ViewChild(Slides) slides: Slides;
  restaurantname: string;
  ncount: number;
  recommendeditems = new Array();
  constructor(public cartSvc:CartServiceProvider,public loadingCtrl: LoadingController,public navCtrl: NavController,public Restaurant:Restaurants,public navParams: NavParams) {
    this.restaurantname=this.Restaurant.selectedrestaurant;
    console.log("---"+ this.restaurantname);
  }

  ionViewCanEnter():boolean {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });    
    loading.present();    
    var myvar=setTimeout(() => {
      loading.dismiss();
    }, 2000);
    var my_json = JSON.stringify(this.items)
    this.recommendeditems = this.find_in_object(JSON.parse(my_json), {recommended: '1'});
    console.log(">>>>>><><><>><>"+ this.recommendeditems[0].title);
    return true;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }
  
  items = [
    {title:'wow stanadard',cost:"25",quantity:0,orderID:'101',recommended:'1'},
    {title:'wow masal paneer',cost:"30",quantity:0,orderID:'102',recommended:'0'},
    {title:'wow schezwan',cost:"35",quantity:0,orderID:'103',recommended:'1'},
    {title:'wow crunchy',cost:"35",quantity:0,orderID:'104',recommended:'0'},
    {title:'wow corn cheese nuggets',cost:"35",quantity:0,orderID:'105',recommended:'1'},
    {title:'wow chatpata fries',cost:"35",quantity:0,orderID:'106',recommended:'0'},
    {title:'wow hot masala',cost:"35",quantity:0,orderID:'107',recommended:'1'},
  ];

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
  
    incrementQty(item: any) {
      item.quantity++;
      var nflag=0;
      this.cartSvc.thecart.forEach(cartitem => {   
        if (cartitem.orderID==item.orderID)
        {
          cartitem.quantity=item.quantity;
          console.log("total quantity " + cartitem.quantity);
          nflag=1;
        }
       });
       if (nflag==0)
      {
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
        if (cartitem.orderID==item.orderID)
          {
            if(cartitem.quantity>=0)
            {
              cartitem.quantity=item.quantity;
              console.log("-----"+cartitem.quantity);
              this.cartSvc.updatetotal();
              if(cartitem.quantity==0)
              {
                console.log("------index" + arrindex + "----"+ cartitem.title +"---" + cartitem.quantity);
    
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
}

