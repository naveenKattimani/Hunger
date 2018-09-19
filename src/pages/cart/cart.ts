import { Component } from '@angular/core';
import { NewTransactionPage } from '../instamojo/new_transaction';
import { IonicPage, NavController } from 'ionic-angular';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import {Http, Headers, RequestOptions } from '@angular/http';
import {CheckoutPage} from '../checkout/checkout';

//var Insta = require('instamojo-nodejs');
//import { Http, Headers, RequestOptions } from '@angular/http';;
//Insta.setKeys('394500a621e669c6b9e37f613c8211a3', '6b9b0b723f69b0186ef6788725821698');

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})

export class CartPage {
  
  // newTransaction() {
  //   this.navCtrl.push(NewTransactionPage, {
  //     amount: 10
  //   });
  // }
  
  items=this.cartSvc.thecart;
  totalcartamount=0;
  packagingcharge=20;
  deliverycharge=20;
  totalamount=0;
  resp="";
  public checksum;

  ncount: number;
  constructor(public navCtrl: NavController,public cartSvc:CartServiceProvider,public httpClient: HttpClient,public Http:Http) {
    
    this.cartSvc.updatetotal();
    this.totalcartamount=this.cartSvc.totalcartamount;
  }

  ionViewWillEnter() {
    //console.log('ionViewDidLoad cartpage');
    this.cartSvc.updatetotal();
    this.totalcartamount=this.cartSvc.totalcartamount;
    this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge;
  }

  incrementQty(item: any) {
    item.quantity++;
    var nflag=0;
    this.cartSvc.thecart.forEach(cartitem => {   
      if (cartitem.orderID==item.orderID)
      {
        cartitem.quantity=item.quantity;
        nflag=1;
        this.cartSvc.updatetotal();
        this.totalcartamount=this.cartSvc.totalcartamount;
        this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge;
      }
     });
     if (nflag==0)
    {
      this.cartSvc.additem(item);
      this.cartSvc.updatetotal();
      this.totalcartamount=this.cartSvc.totalcartamount;  
      this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge;    
    }
  }

  decrementQty(item: any) {
    this.ncount=0;
    this.cartSvc.thecart.forEach((cartitem,arrindex) =>{   
      this.ncount++;
      //console.log("------name" +cartitem.title);
      if (cartitem.orderID==item.orderID)
        {
          if(cartitem.quantity>0)
          {
            cartitem.quantity=cartitem.quantity-1;
            //console.log("total quantity " + cartitem.quantity);
            this.cartSvc.updatetotal();
            this.totalcartamount=this.cartSvc.totalcartamount;
            this.totalamount=this.totalcartamount + this.packagingcharge+ this.deliverycharge;
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
    var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
    console.log(timeStampInMs, Date.now());
    timeStampInMs=Date.now();
    
    
    let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append("Accept", 'application/json');
      //headers.append("Cache-Control", 'no-cache');
     // headers.append("Pragma", 'no-cache');
      const requestOptions = new RequestOptions({ headers: headers });
  
      var link = 'http://localhost/foodie/pgRedirect.php';
    //   var myData = JSON.stringify({'MID':'Foodie22607738817864',
    //   'ORDER_ID':timeStampInMs,
    //   'CUST_ID':'8878788',
    //   'INDUSTRY_TYPE_ID':'Retail',
    //   'CHANNEL_ID':'WAP',
    //   'TXN_AMOUNT':'25',
    //   'CALLBACK_URL':'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID='+timeStampInMs,
    //   'WEBSITE':'APPSTAGING',  
    //   // 'MSISDN': '9591317407',
    //   // 'EMAIL': 'k32.naveen@gmail.com',
    //   // 'VERIFIED_BY': 'k29.naveen@gmail.com',    
    //  });   

    var gencheksumparams="MID=Foodie22607738817864&"
    gencheksumparams=gencheksumparams+"ORDER_ID="+timeStampInMs+"&"
    gencheksumparams=gencheksumparams+"CUST_ID=8878788&"
    gencheksumparams=gencheksumparams+"INDUSTRY_TYPE_ID=Retail&"
    gencheksumparams=gencheksumparams+"CHANNEL_ID=WAP&"
    gencheksumparams=gencheksumparams+"TXN_AMOUNT=25&"
    gencheksumparams=gencheksumparams+"WEBSITE=APPSTAGING&"
    gencheksumparams=gencheksumparams+"CALLBACK_URL=https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+timeStampInMs+"&"
                
    link = link+"?" + gencheksumparams;

      this.Http.post(link, '',requestOptions)
        .subscribe(data => {
          //console.log(data);
          data = data["_body"]; 
          var respdata=data.toString();
          console.log(respdata);
          this.checksum=respdata.substring(respdata.indexOf('CHECKSUMHASH" value="')+21,respdata.length)
          this.checksum=this.checksum.substring(0,this.checksum.indexOf('">'));
          //this.cartSvc.checksum=this.checksum;
          this.cartSvc.checksum=respdata;
          console.log("CHECKSUM = " + this.cartSvc.checksum);

          // var transferdata = JSON.stringify({'MID':'Foodie22607738817864',
          //   'ORDER_ID ':'ORDER8899993927',
          //   'CUST_ID ':'8878788',
          //   'INDUSTRY_TYPE_ID':'Retail',
          //   'CHANNEL_ID':'WAP',
          //   'TXN_AMOUNT':'25',
          //   'CALLBACK_URL':'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=ORDER8899993927',
          //   'WEBSITE':'APPSTAGING',   
          //   //'MSISDN': '9591317407',
          //   // 'EMAIL': 'k32.naveen@gmail.com',
          //   // 'VERIFIED_BY': 'k29.naveen@gmail.com',
          //   'CHECKSUMHASH': this.cartSvc.checksum,
          // });
            var transferdata="MID=Foodie22607738817864&"
            transferdata=transferdata+"ORDER_ID="+timeStampInMs+"&"
            transferdata=transferdata+"CUST_ID=8878788&"
            transferdata=transferdata+"INDUSTRY_TYPE_ID=Retail&"
            transferdata=transferdata+"CHANNEL_ID=WAP&"
            transferdata=transferdata+"TXN_AMOUNT=25&"
            transferdata=transferdata+"WEBSITE=APPSTAGING&"
           // transferdata=transferdata+"MSISDN=9591317407&"
            //transferdata=transferdata+"EMAIL=k32.naveen@gmail.com&"
            //transferdata=transferdata+"VERIFIED_BY=k29.naveen@gmail.com&"
            transferdata=transferdata+"CALLBACK_URL=https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID="+timeStampInMs+"&"
            //transferdata=transferdata+"CHECKSUMHASH=qWebFKLhQPOCyYVOK/b/ngdeA+irG5Xlg80NzShs9WDzbToq3Nh3hXIy9BVTW5KZMihLfxwy6zP+aF7SMLIhhxGTy7dK/5hBWiKnqE4V0Zg=";
            transferdata=transferdata+"CHECKSUMHASH="+ this.cartSvc.checksum;

            setTimeout(()=>
              {
             this.Http.post('http://localhost:8100/processTransaction?'+transferdata, '',requestOptions)
            .subscribe(data => {
              this.resp = data["_body"]; 
              //console.log(data['_body']);
              this.cartSvc.checkoutresp=this.resp;
              document.getElementsByTagName("ion-content")[1].innerHTML = this.resp;
              //this.navCtrl.push(CheckoutPage);
            }, error => {
              console.log(error);
            });},2000);
          }, error => {
            console.log(error);
          });
    
    }        
}


 // var data = new Insta.PaymentData();
    // Insta.isSandboxMode(false);
    // data.purpose = "Test";            // REQUIRED
    // data.amount = '9';                  // REQUIRED
    // data.setRedirectUrl('http://localhost:8100');
    
    // Insta.createPayment(data, function(error, response) {
    //   if (error) {
    //     // some error
    //   } else {
    //     // Payment redirection link at response.payment_request.longurl
    //     console.log(response);
    //   }
    // });