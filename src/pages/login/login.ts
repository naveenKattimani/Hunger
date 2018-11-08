import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import firebase from 'firebase';
import { Dialogs } from '@ionic-native/dialogs';
import {MyaccountProvider} from '../../providers/myaccount/myaccount';
import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import { Restaurants } from '../../providers/restaurants/restaurants';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  loading: Loading;
  contactnumber;
  registerCredentials  = { contactnumber: '' };

  constructor(public navctrl: NavController,public loadingCtrl: LoadingController,public Restaurant:Restaurants,private myacc:MyaccountProvider,public FirebaseProvider:FirebaseProvider, private dialogs:Dialogs, public alertCtrl:AlertController) {   
  }

  ionViewCanEnter() {
        // let loading;
        // loading = this.loadingCtrl.create({
        //   cssClass: 'myalert'
        // });
        // loading.present();
        // firebase.auth().onAuthStateChanged( user => {
        //   if (user) { loading.dismiss();this.navctrl.push(HomePage);}
        // });
        // setTimeout(() => {
        //   loading.dismiss();
        // }, 5000);
  }

  login() {
    if (this.registerCredentials.contactnumber === null) {
      return false;
    } else {
        this.contactnumber = "+91" + this.registerCredentials.contactnumber;
        var verificationId;
        var code ;//= inputField.value.toString();
        let promptt = this.alertCtrl.create({
          title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            { text: 'Cancel',
              handler: data => { console.log('Cancel clicked'); }
            },
            { text: 'Send',
              handler: data => {  
                 code=data.confirmationCode;  
                 var signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);                       
                      firebase.auth().signInAndRetrieveDataWithCredential(signInCredential).then((res) => {
                        console.log('success');
                        localStorage.setItem('PERSON', JSON.stringify(this.registerCredentials));
                        this.FirebaseProvider.contactnum=this.registerCredentials.contactnumber; 
                        this.navctrl.setRoot(HomePage);
                      }).catch(function (error) {
                        this.registerCredentials = {contactnumber: undefined};
                        this.FirebaseProvider.contactnum=undefined; 
                        localStorage.setItem('PERSON', JSON.stringify(this.registerCredentials));
                          console.error("wrong phone");
                        });
                  //}                  
              }
            }
          ]
        });
        promptt.present();
        (<any>window).FirebasePlugin.verifyPhoneNumber(this.contactnumber, 60, function(credential) {
          console.log(credential);
          // ask user to input verificationCode:
           verificationId = credential.verificationId;    
          //  var signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
          //  firebase.auth().signInWithCredential(signInCredential);       
          }, function(error) {
            this.reset();
            this.registerCredentials = {contactnumber: undefined};
            localStorage.setItem('PERSON', JSON.stringify(this.registerCredentials));
          });  
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
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss(); 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}