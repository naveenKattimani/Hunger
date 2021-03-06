import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import {MyaccountProvider} from '../../providers/myaccount/myaccount'
import { HomePage } from '../home/home';
import { Restaurants } from '../../providers/restaurants/restaurants';

/**
 * Generated class for the OrdertransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ordertransaction',
  templateUrl: 'ordertransaction.html',
})
export class OrdertransactionPage {
  orderid=this.FirebaseProvider.orderid;
  txnstatus=this.FirebaseProvider.txnstatus;
  currentaddess=this.FirebaseProvider.currentaddess;
  deliveryaddress=this.FirebaseProvider.deliveryaddress;
  
  constructor(public navCtrl: NavController,private restaurant:Restaurants,private myacc:MyaccountProvider,public FirebaseProvider:FirebaseProvider, public navParams: NavParams) {
    console.log("????" + this.orderid+ this.currentaddess);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdertransactionPage');
  }

  closeorderpage()
  {
    this.restaurant.firsttimeload=false;
    this.navCtrl.setRoot(HomePage);   
  }

  backorderpage()
  {
    this.navCtrl.pop(); 
  }
}
