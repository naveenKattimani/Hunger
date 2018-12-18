import { Component } from '@angular/core';
import { IonicPage, NavController,NavParams, AlertController,DateTime } from 'ionic-angular';
import firebase from 'firebase';
import { Dialogs } from '@ionic-native/dialogs';
import {MyaccountProvider} from '../../providers/myaccount/myaccount'
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import { Restaurants } from '../../providers/restaurants/restaurants';
import { LoadingController } from 'ionic-angular'
import { HTTP } from '@ionic-native/http';
import { MyaccountPage } from '../myaccount/myaccount';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Platform } from 'ionic-angular';
import { HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { InAppBrowser,InAppBrowserOptions,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { SMS } from '@ionic-native/sms';
import { OrdertransactionPage } from '../ordertransaction/ordertransaction';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-checkoutdetails',
  templateUrl: 'checkoutdetails.html',
})


export class checkoutdetailsPage {
  public person: {name: string, contactnumber: string, address: string, landmark: string};
  name: any;
  contactnumber: any;
  deliveryaddress:any;
  address: any;
  landmark:any;
  showProfile: boolean;
  veryficationId;
  userid="";
  notp=0;
  opened: Boolean = false;
  topened: Boolean = false;
  aopened: Boolean = false;
  mopened: Boolean = true;
  currentSelected: Boolean = true;
  
  browser;
  items=this.cartSvc.thecart;
  totalcartamount=0;
  packagingcharge=20;
  deliverycharge=20;
  totalamount=0;
  resp="";
  public ordertimeStamp;
  public checksum;
  contactnum;
  ncount: number;
  ninapp=false;
  currentdate = new Date();
  datetime = this.currentdate.getDate() + "/" + this.currentdate.getMonth() + "/"+ this.currentdate.getFullYear() + " "   + this.currentdate.getHours() + ":"   + this.currentdate.getMinutes() + ":" + this.currentdate.getSeconds();

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(private sms: SMS,private locationAccuracy: LocationAccuracy,public platform: Platform,private iab: InAppBrowser,public httpClient: HttpClient,public Http:HTTP,public navCtrl: NavController,private restaurant:Restaurants,public cartSvc:CartServiceProvider,public loadingCtrl: LoadingController,public Restaurant:Restaurants,private myacc:MyaccountProvider,public FirebaseProvider:FirebaseProvider, private dialogs:Dialogs,public navParams: NavParams, public alertCtrl:AlertController) {
    this.person = {name: undefined, contactnumber: undefined, address: "HouseNo: " + this.FirebaseProvider.houseno + " "+ this.FirebaseProvider.currentaddess,landmark: this.FirebaseProvider.landmark};
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading',
    });
    loading.present();
    //this.FirebaseProvider.getmyorderhistory();
    var myvar=setTimeout(() => {
      this.FirebaseProvider.getaddress();
      this.FirebaseProvider.getmyorderhistory();
      this.FirebaseProvider.getorders();
      loading.dismiss();
     }, 3000);
  }


  ionViewDidLoad() {
  //this.presentAlert(this.FirebaseProvider.totalamount);
  this.FirebaseProvider.getmyorderhistory();
   let person = JSON.parse(localStorage.getItem('PERSON'));
    if (person){
      this.person = person;
      this.name = this.person.name;
      this.contactnumber = this.person.contactnumber;
    //this.emailid=this.person.emailid;
      this.person.address="HouseNo: " + this.FirebaseProvider.houseno + " "+ this.FirebaseProvider.currentaddess;
      this.address = this.person.address;
      this.person.landmark = this.FirebaseProvider.landmark;
      this.landmark = this.person.landmark;
    }
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'User',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

    toggleaddress () {
      this.opened = !this.opened;
    }

    toggleorder()
    {
      this.topened = !this.topened;
    }

    togglemyaccount()
    {
      this.mopened = !this.mopened;
    }

    selectaddress(i,items)
    {
      this.currentSelected=i;
      this.deliveryaddress="HouseNo: " + items.housenumber + " "+ items.address + ", LandMark:" + items.landmark;
      this.FirebaseProvider.deliveryaddress=this.deliveryaddress;
      console.log(items.address);
    }

    cod()
    {  
      this.FirebaseProvider.txnstatus=0;
      this.ordertimeStamp=Date.now().toString();
      this.FirebaseProvider.orderid=this.ordertimeStamp;
      if(this.deliveryaddress!==undefined && this.person.name!==undefined && this.person.contactnumber!==undefined)
      {
        this.FirebaseProvider.placeorder(this.ordertimeStamp,this.cartSvc.thecart);
        this.FirebaseProvider.orderhistory(this.deliveryaddress,this.restaurant.selectedrestaurantid,this.ordertimeStamp,this.FirebaseProvider.totalamount,this.packagingcharge,this.deliverycharge,this.datetime );                    
        this.FirebaseProvider.txnstatus=1;
        this.navCtrl.push(OrdertransactionPage);
      }
      if(this.deliveryaddress===undefined)
      {
        this.presentAlert("Please select address");
      }
      else if(this.person.name===undefined || this.person.contactnumber===undefined){
        this.presentAlert("To continue the checkout process, please create an account");
        this.navCtrl.push(MyaccountPage);
      }

    }

   checkout()
   {      
    //  console.log(">>>>>"+this.myacc.contactnum);
    //  console.log(">>>>>"+undefined);
    //  console.log(">>>>>"+this.myacc.contactnum==="undefined");
    //  console.log(">>>>>"+typeof new String(this.myacc.contactnum)==="undefined");
     
     // this.ordertimeStamp=Date.now();
     // this.FirebaseProvider.orderid=this.ordertimeStamp;
     // this.navCtrl.push(OrdertransactionPage);
     //this.presentAlert(this.myacc.contactnum);
     console.log(this.deliveryaddress);
     console.log(this.person.name);
     console.log(this.person.contactnumber);

     
     if(this.deliveryaddress!==undefined && this.person.name!==undefined && this.person.contactnumber!==undefined)
     {
     this.ordertimeStamp=Date.now().toString();
     this.FirebaseProvider.orderid=this.ordertimeStamp;
     var transferdata;
     
     // let headers = new Headers();
     // headers.append('Content-Type', 'application/json');
     // headers.append("Accept", 'application/json');
     //headers.append("Cache-Control", 'no-cache');
     // headers.append("Pragma", 'no-cache');
     //const requestOptions = new RequestOptions({ headers: headers });
 
     var link = 'https://restaurantpay-219614.appspot.com/pgRedirect';
 
 
     var gencheksumparams="MID=Foodie22607738817864&"
     gencheksumparams=gencheksumparams+"ORDER_ID="+this.ordertimeStamp+"&"
    //gencheksumparams=gencheksumparams+"REQUEST_TYPE=DEFAULT&"
     gencheksumparams=gencheksumparams+"CUST_ID=88667677778788&"
     gencheksumparams=gencheksumparams+"INDUSTRY_TYPE_ID=Retail&"
     gencheksumparams=gencheksumparams+"CHANNEL_ID=WAP&"
     gencheksumparams=gencheksumparams+"TXN_AMOUNT="+this.FirebaseProvider.totalamount+"&"
     gencheksumparams=gencheksumparams+"WEBSITE=APPSTAGING&"
     gencheksumparams=gencheksumparams+"CALLBACK_URL=https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+this.ordertimeStamp
                 
     link = link+"?" + gencheksumparams;
     //this.presentAlert('link: '+ link);
     this.Http.post(link, '','')
       .then(data => {
         //console.log(data);
         
         //data = data["_body"]; 
         //this.presentAlert("chksum respdata: "+data.data);
         var respdata=data.data;
         this.checksum=respdata.substring(respdata.indexOf('CHECKSUMHASH" value="')+21,respdata.length)
         this.checksum=this.checksum.substring(0,this.checksum.indexOf('">'));
         //this.cartSvc.checksum=this.checksum;
         this.cartSvc.checksum=respdata;
         //this.presentAlert("chksum respdata: "+this.cartSvc.checksum);
         console.log("CHECKSUM = " + this.cartSvc.checksum);
         
         let loading = this.loadingCtrl.create({
           content: 'Loading...'
         });    
         loading.present();    
         var myvar=setTimeout(() => {
           loading.dismiss();
         }, 1000);
 
         this.paytmpage(this.cartSvc.checksum,this.ordertimeStamp);
         console.log("--------------");
         //this.presentAlert(localStorage.getItem('response'));
          //place order on successfull transaction
           
         }, error => {
           console.log(error);
         });     
       }   
       else{  
         if(this.deliveryaddress===undefined)
         {
          this.presentAlert("Please select address");
         }
         else{
          this.presentAlert("To continue the checkout process, please create an account");
          this.navCtrl.push(MyaccountPage);
         }
       //this.navCtrl.push(OrdertransactionPage);
       }
     
     }    
 
     paytmpage(chcksum,ordertimeStamp)
   {      
     //this.presentAlert('in paytm page')
   chcksum=chcksum.replace(/\+/g,"%2B");
     this.ninapp=false;
     // let headers = new Headers();
     // headers.append('Content-Type', 'application/json');
     // headers.append("Accept", 'application/json');
     // const requestOptions = new RequestOptions({ headers: headers });
     var transferdata="MID=Foodie22607738817864&"
     //transferdata=transferdata+"REQUEST_TYPE=DEFAULT&"
     transferdata=transferdata+"ORDER_ID="+ordertimeStamp+"&"
     transferdata=transferdata+"CUST_ID=88667677778788&"
     transferdata=transferdata+"INDUSTRY_TYPE_ID=Retail&"
     transferdata=transferdata+"CHANNEL_ID=WAP&"
     transferdata=transferdata+"TXN_AMOUNT="+this.FirebaseProvider.totalamount+"&"
     transferdata=transferdata+"WEBSITE=APPSTAGING&"    
     //transferdata=transferdata+"MSISDN=9591317407&"
     // transferdata=transferdata+"EMAIL=k32.naveen@gmail.com&"
     // transferdata=transferdata+"VERIFIED_BY=k29.naveen@gmail.com&"
       transferdata=transferdata+"CALLBACK_URL=https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+ordertimeStamp+"&"
     //transferdata=transferdata+"CHECKSUMHASH=qWebFKLhQPOCyYVOK/b/ngdeA+irG5Xlg80NzShs9WDzbToq3Nh3hXIy9BVTW5KZMihLfxwy6zP+aF7SMLIhhxGTy7dK/5hBWiKnqE4V0Zg=";
     transferdata=transferdata+"CHECKSUMHASH="+ chcksum;
     //this.presentAlert('transferdata:'+ transferdata);
    this.cartSvc.checksum
       //this.browser = this.iab.create('https://securegw-stage.paytm.in/theia/processTransaction?'+transferdata,"_blank","location=no");
       // window.open("https://securegw-stage.paytm.in/theia/processTransaction?"+transferdata,"_self","location=no")
      let loading = this.loadingCtrl.create({
         content: 'Loading...'
       });
 
       const bb = this.iab.create("https://securegw-stage.paytm.in/theia/processTransaction?"+transferdata,"_blank",'location=no')
       bb.on("loadstart")
         .subscribe((ev: InAppBrowserEvent) => {
          //this.presentAlert('transferdata:'+ transferdata);
             if(ev.url == "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+ordertimeStamp){
               console.log("----------------payment sucess");
               loading.present();
               bb.close();
               var txnchecksum = 'https://restaurantpay-219614.appspot.com/TxnStatus?';
               txnchecksum=txnchecksum+"ORDER_ID="+ordertimeStamp+"&"
               //this.presentAlert('txn url:'+ txnchecksum);
               this.Http.post(txnchecksum, '','')
               .then(data => {
                 //data = data["_body"]; 
                 var respdata=data.data;
                 //this.presentAlert(respdata);
                 var myvar=setTimeout(() => {
                   loading.dismiss();
                  }, 4000);
                 if (respdata.indexOf("STATUS=TXN_SUCCESS")>-1)
                 {
                   
                   this.FirebaseProvider.txnstatus=1;
                   this.FirebaseProvider.placeorder(this.ordertimeStamp,this.cartSvc.thecart);
                   this.FirebaseProvider.orderhistory(this.deliveryaddress,this.restaurant.selectedrestaurantid,this.ordertimeStamp,this.FirebaseProvider.totalamount,this.packagingcharge,this.deliverycharge,this.datetime );      
                   //this.cartSvc.thecart=[];
                   this.navCtrl.push(OrdertransactionPage);
                 }
                 if (respdata.indexOf("STATUS=TXN_FAILURE")>-1)
                 {
                   //this.FirebaseProvider.txnstatus=0;
                   //this.navCtrl.push(OrdertransactionPage);
                 }                
               })
 
               
             }
         }), error => {
                   console.log(error);
                 };
   }
 
   closeBrowser(){
     this.browser.close();
   }

   AddAddress()
   {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () =>{
            this.restaurant.firsttimeload=false;
            setTimeout(()=>
            {this.navCtrl.push(MapPage);},200);
            
          console.log("success") 
          },
          error => console.log('Error requesting location permissions', error)
        );
     //}}) 
    // this.initMap()
    // this.navCtrl.push(MapPage)      
  }
 }