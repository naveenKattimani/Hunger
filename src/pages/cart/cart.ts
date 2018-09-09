import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
//import { Http, Headers, RequestOptions } from '@angular/http';;

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  items=this.cartSvc.thecart;
  totalcartamount=0;
  packagingcharge=20;
  deliverycharge=20;
  totalamount=0;

  ncount: number;
  constructor(public navCtrl: NavController,public cartSvc:CartServiceProvider,private httpClient: HttpClient) {
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
    // var headers=new Headers({ 'Content-Type': 'application/json'});
    // //headers.append( 'Accept', 'application/json');
    // //headers.append( 'Content-Type', 'application/json');
    // const options=new RequestOptions({headers:headers});
    // this.http.post('http://localhost:8100/createPayment','',{headers:headers}).
    // subscribe(data=>{
    //   console.log("--------"+data);
    // });

    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    let body = {  something: 'value' };

    this.httpClient.post('http://localhost:8100/CreatePayment', body, {headers: headers})
                .subscribe((result: any) => {
                    console.log(result);
            }, (errorResponse: HttpErrorResponse) => {
                console.error(errorResponse);
            });
  }
}