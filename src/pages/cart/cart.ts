import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController,Platform, DateTime } from 'ionic-angular';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
//import {Http, Headers, RequestOptions } from '@angular/http';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import {Restaurants} from '../../providers/restaurants/restaurants';
import {MyaccountProvider} from '../../providers/myaccount/myaccount';
import { InAppBrowser,InAppBrowserOptions,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { HomePage } from '../home/home';
import { SMS } from '@ionic-native/sms';
import { MyaccountPage } from '../myaccount/myaccount';
import { OrdertransactionPage } from '../ordertransaction/ordertransaction';
import { LoadingController,Slides } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import {checkoutdetailsPage} from '../../pages/checkoutdetails/checkoutdetails';

//var Insta = require('instamojo-nodejs');
//import { Http, Headers, RequestOptions } from '@angular/http';;
//Insta.setKeys('394500a621e669c6b9e37f613c8211a3', '6b9b0b723f69b0186ef6788725821698');

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})

export class CartPage {
  browser;
  items=this.cartSvc.thecart;
  totalcartamount=0;
  packagingcharge=20;
  deliverycharge=20;
  totalamount=0;
  resp="";
  public timeStampInMs;
  public checksum;
  contactnum;
  ncount: number;
  person;
  ninapp=false;

  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController,private sms: SMS,private myacc:MyaccountProvider,private restaurant:Restaurants,public FirebaseProvider:FirebaseProvider,public alertCtrl:AlertController,public platform: Platform,private iab: InAppBrowser,public cartSvc:CartServiceProvider,public httpClient: HttpClient,public Http:HTTP) {
    // this.person = JSON.parse(localStorage.getItem('PERSON'));
    // if (this.person){
    //   this.FirebaseProvider.landmark=this.person.landmark;
    // }
    this.cartSvc.updatetotal();
    this.totalcartamount=this.cartSvc.totalcartamount;
    this.FirebaseProvider.totalamount=this.totalcartamount;
  }

  ionViewWillEnter() {
    //console.log('ionViewDidLoad cartpage');
    this.cartSvc.updatetotal();
    this.totalcartamount=this.cartSvc.totalcartamount;
    this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge;
    
    //this.sms.send('9591317407', 'Hello world!');
  }

  incrementQty(item: any) {
    item.quantity++;
    var nflag=0;
    this.cartSvc.thecart.forEach(cartitem => {   
      if (cartitem.OrderId==item.OrderId)
      {
        cartitem.quantity=item.quantity;
        nflag=1;
        this.cartSvc.updatetotal();
        this.totalcartamount=this.cartSvc.totalcartamount;
        this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge;
        this.FirebaseProvider.totalamount=this.totalcartamount;
      }
     });
     if (nflag==0)
    {
      this.cartSvc.additem(item);
      this.cartSvc.updatetotal();
      this.totalcartamount=this.cartSvc.totalcartamount;  
      this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge; 
      this.FirebaseProvider.totalamount=this.totalcartamount;   
    }
  }

  decrementQty(item: any) {
    this.ncount=0;
    this.cartSvc.thecart.forEach((cartitem,arrindex) =>{   
      this.ncount++;
      //console.log("------name" +cartitem.title);
      if (cartitem.OrderId==item.OrderId)
        {
          if(cartitem.quantity>0)
          {
            cartitem.quantity=cartitem.quantity-1;
            //console.log("total quantity " + cartitem.quantity);
            this.cartSvc.updatetotal();
            this.totalcartamount=this.cartSvc.totalcartamount;
            this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge;
            this.FirebaseProvider.totalamount=this.totalcartamount;
            if(cartitem.quantity==0)
            {
              //console.log("------index" + arrindex + "----"+ cartitem.title +"---" + cartitem.quantity);
              this.cartSvc.thecart.splice(arrindex,1);
            }   
          }      
        }
     });
  }

  checkout()
  {
    this.FirebaseProvider.totalamount=this.totalcartamount;
    this.navCtrl.push(checkoutdetailsPage);
  }
  // payonline()
  // {      
  //   console.log(">>>>>"+this.myacc.contactnum);
  //   console.log(">>>>>"+undefined);
  //   console.log(">>>>>"+this.myacc.contactnum==="undefined");
  //   console.log(">>>>>"+typeof new String(this.myacc.contactnum)==="undefined");
    
  //   // this.timeStampInMs=Date.now();
  //   // this.FirebaseProvider.orderid=this.timeStampInMs;
  //   // this.navCtrl.push(OrdertransactionPage);
  //   //this.presentAlert(this.myacc.contactnum);
    
  //   if(this.FirebaseProvider.contactnum!==undefined && this.FirebaseProvider.currentaddess!==undefined)
  //   {
  //   this.timeStampInMs=Date.now();
  //   this.FirebaseProvider.orderid=this.timeStampInMs;
  //   var transferdata;
    
  //   // let headers = new Headers();
  //   // headers.append('Content-Type', 'application/json');
  //   // headers.append("Accept", 'application/json');
  //   //headers.append("Cache-Control", 'no-cache');
  //   // headers.append("Pragma", 'no-cache');
  //   //const requestOptions = new RequestOptions({ headers: headers });

  //   var link = 'https://restaurantpay-219614.appspot.com/pgRedirect';


  //   var gencheksumparams="MID=Foodie22607738817864&"
  //   gencheksumparams=gencheksumparams+"ORDER_ID="+this.timeStampInMs+"&"
  //  //gencheksumparams=gencheksumparams+"REQUEST_TYPE=DEFAULT&"
  //   gencheksumparams=gencheksumparams+"CUST_ID=88667677778788&"
  //   gencheksumparams=gencheksumparams+"INDUSTRY_TYPE_ID=Retail&"
  //   gencheksumparams=gencheksumparams+"CHANNEL_ID=WAP&"
  //   gencheksumparams=gencheksumparams+"TXN_AMOUNT="+this.totalamount+"&"
  //   gencheksumparams=gencheksumparams+"WEBSITE=APPSTAGING&"
  //   gencheksumparams=gencheksumparams+"CALLBACK_URL=https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+this.timeStampInMs
                
  //   link = link+"?" + gencheksumparams;
    
  //   this.Http.post(link, '','')
  //     .then(data => {
  //       //console.log(data);
        
  //       //data = data["_body"]; 
  //       this.presentAlert(data.data);
  //       var respdata=data.data;
  //       this.checksum=respdata.substring(respdata.indexOf('CHECKSUMHASH" value="')+21,respdata.length)
  //       this.checksum=this.checksum.substring(0,this.checksum.indexOf('">'));
  //       //this.cartSvc.checksum=this.checksum;
  //       this.cartSvc.checksum=respdata;
  //       console.log("CHECKSUM = " + this.cartSvc.checksum);
        
  //       let loading = this.loadingCtrl.create({
  //         content: 'Loading...'
  //       });    
  //       loading.present();    
  //       var myvar=setTimeout(() => {
  //         loading.dismiss();
  //       }, 1000);

  //       this.paytmpage(this.cartSvc.checksum,this.timeStampInMs);
  //       console.log("--------------");
  //       //this.presentAlert(localStorage.getItem('response'));
  //        //place order on successfull transaction
  //       //  this.FirebaseProvider.placeorder(this.restaurant.selectedrestaurantid,this.restaurant.selectedrestaurant,this.timeStampInMs,this.cartSvc.thecart);
  //       //  this.FirebaseProvider.orderhistory(this.timeStampInMs,this.totalcartamount,this.packagingcharge,this.deliverycharge);         
  //       }, error => {
  //         console.log(error);
  //       });     
  //     }   
  //     else{  
  //     this.presentAlert("To continue the checkout process, please create an account");
  //     this.navCtrl.push(MyaccountPage);
  //     //this.navCtrl.push(OrdertransactionPage);
  //     }
    
  //   }    

  // paytmpage(chcksum,timeStampInMs)
  // {      
  //   //this.presentAlert('in paytm page')
	// chcksum=chcksum.replace(/\+/g,"%2B");
  //   this.ninapp=false;
  //   // let headers = new Headers();
  //   // headers.append('Content-Type', 'application/json');
  //   // headers.append("Accept", 'application/json');
  //   // const requestOptions = new RequestOptions({ headers: headers });
  //   var transferdata="MID=Foodie22607738817864&"
  //   //transferdata=transferdata+"REQUEST_TYPE=DEFAULT&"
  //   transferdata=transferdata+"ORDER_ID="+timeStampInMs+"&"
  //   transferdata=transferdata+"CUST_ID=88667677778788&"
  //   transferdata=transferdata+"INDUSTRY_TYPE_ID=Retail&"
  //   transferdata=transferdata+"CHANNEL_ID=WAP&"
  //   transferdata=transferdata+"TXN_AMOUNT="+this.totalamount+"&"
  //   transferdata=transferdata+"WEBSITE=APPSTAGING&"    
  //   //transferdata=transferdata+"MSISDN=9591317407&"
  //   // transferdata=transferdata+"EMAIL=k32.naveen@gmail.com&"
  //   // transferdata=transferdata+"VERIFIED_BY=k29.naveen@gmail.com&"
  //     transferdata=transferdata+"CALLBACK_URL=https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+timeStampInMs+"&"
  //   //transferdata=transferdata+"CHECKSUMHASH=qWebFKLhQPOCyYVOK/b/ngdeA+irG5Xlg80NzShs9WDzbToq3Nh3hXIy9BVTW5KZMihLfxwy6zP+aF7SMLIhhxGTy7dK/5hBWiKnqE4V0Zg=";
  //   transferdata=transferdata+"CHECKSUMHASH="+ chcksum;

  
  //     //this.browser = this.iab.create('https://securegw-stage.paytm.in/theia/processTransaction?'+transferdata,"_blank","location=no");
  //     // window.open("https://securegw-stage.paytm.in/theia/processTransaction?"+transferdata,"_self","location=no")
  //    let loading = this.loadingCtrl.create({
  //       content: 'Loading...'
  //     });

  //     const bb = this.iab.create("https://securegw-stage.paytm.in/theia/processTransaction?"+transferdata,"_blank",'location=no')
  //     bb.on("loadstart")
  //       .subscribe((ev: InAppBrowserEvent) => {
  //         this.presentAlert(ev.url);
  //           if(ev.url == "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+timeStampInMs){
  //             console.log("----------------payment sucess");
  //             loading.present();
  //             bb.close();
  //             var txnchecksum = 'https://restaurantpay-219614.appspot.com/TxnStatus?';
  //             txnchecksum=txnchecksum+"ORDER_ID="+this.timeStampInMs+"&"
  //             this.Http.post(txnchecksum, '','')
  //             .then(data => {
  //               //data = data["_body"]; 
  //               var respdata=data.data;
  //               this.presentAlert(respdata);
  //               var myvar=setTimeout(() => {
  //                 loading.dismiss();
  //                }, 4000);
  //               if (respdata.indexOf("STATUS=TXN_SUCCESS")>-1)
  //               {
  //                 var currentdate = new Date();
  //                 var datetime = currentdate.getDate() + "/"
  //                 + (currentdate.getMonth()+1)  + "/" 
  //                 + currentdate.getFullYear() + " "  
  //                 + currentdate.getHours() + ":"  
  //                 + currentdate.getMinutes() + ":" 
  //                 + currentdate.getSeconds();
  //                 this.FirebaseProvider.txnstatus=1;
  //                 this.FirebaseProvider.placeorder(this.timeStampInMs,this.cartSvc.thecart);
  //                 this.FirebaseProvider.orderhistory("",this.restaurant.selectedrestaurantid,this.timeStampInMs,this.totalcartamount,this.packagingcharge,this.deliverycharge,datetime );      
  //                 this.cartSvc.thecart=[];
  //                 this.navCtrl.push(OrdertransactionPage);
  //               }
  //               if (respdata.indexOf("STATUS=TXN_FAILURE")>-1)
  //               {
  //                 this.FirebaseProvider.txnstatus=0;
  //                 this.navCtrl.push(OrdertransactionPage);
  //               }                
  //             })

              
  //           }
  //       }), error => {
  //                 console.log(error);
  //               };
  // }

  closeBrowser(){
    this.browser.close();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}