import { Component } from '@angular/core';
import { IonicPage, NavController,NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Dialogs } from '@ionic-native/dialogs';
import {MyaccountProvider} from '../../providers/myaccount/myaccount'

import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import {FirebaseProvider} from '../../providers/dbservice/firebasedb';
import { Restaurants } from '../../providers/restaurants/restaurants';
import { LoadingController } from 'ionic-angular'


@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})


export class MyaccountPage {
  public person: {name: string, contactnumber: string, address: string, landmark: string};
  name: any;
  contactnumber: any;
  //emailid:any;
  address: any;
  landmark:any;
  showProfile: boolean;
  veryficationId;
  userid="";
  notp=0;
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController,public Restaurant:Restaurants,private myacc:MyaccountProvider,public FirebaseProvider:FirebaseProvider, private dialogs:Dialogs,public navParams: NavParams, public alertCtrl:AlertController) {
    this.person = {name: undefined, contactnumber: undefined, address: "HouseNo: " + this.FirebaseProvider.houseno + " "+ this.FirebaseProvider.currentaddess,landmark: this.FirebaseProvider.landmark};
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading',
    });
    loading.present();
    //this.FirebaseProvider.getmyorderhistory();
    var myvar=setTimeout(() => {
      this.FirebaseProvider.getmyorderhistory();
      this.FirebaseProvider.getorders();
      loading.dismiss();
     }, 3000);
  }


  ionViewDidLoad() {
    
    //this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  //  this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-sign-in-recaptcha', {
  //   'size': 'invisible',
  //   'callback': function(response) {
  //     // reCAPTCHA solved - will proceed with submit function
  //     console.log(response);
  //   },
  //   'expired-callback': function() {
  //     // Reset reCAPTCHA?
  //   }
  // }); 
  this.FirebaseProvider.getmyorderhistory();
   let person = JSON.parse(localStorage.getItem('PERSON'));
    if (person){
      this.person = person;
      this.name = this.person.name;
      this.contactnumber = this.person.contactnumber;
    //this.emailid=this.person.emailid;
      this.person.address="HouseNo: " + this.FirebaseProvider.houseno + " "+ this.FirebaseProvider.currentaddess;
      this.address = this.person.address;
      this.landmark = this.person.landmark;
    }
  }

  delete(){
    let promptt = this.alertCtrl.create({
      title: 'Are you sure you want to remove account?',
      buttons: [
        { text: 'Cancel',
          handler: data => { console.log('Cancel clicked'); }
        },
        { text: 'OK',
          handler: data => {     
            this.person = {name: undefined, contactnumber: undefined, address: undefined,landmark: undefined};
            localStorage.setItem('PERSON', JSON.stringify(this.person));
            this.person.name="";
            this.person.contactnumber="";
            this.person.address="";
            this.person.landmark="";
            this.FirebaseProvider.contactnum=undefined;
            this.showProfile = false;
            //delete from firebase need to implement
            //localStorage.clear();
            var user = firebase.auth().currentUser;
                if (user) {
                  user.delete();
                  this.presentAlert("user deleted");
                }

          }
        }
      ]
    });
   promptt.present();  
  }

  save(){    
    this.name = this.person.name;
    this.contactnumber = "+91" + this.person.contactnumber;
    this.address = this.person.address;
    this.landmark = this.person.landmark;
    this.showProfile = true;
       
    // (<any>window).FirebasePlugin.verifyPhoneNumber(this.contactnumber, 60, function (credential) {
    //   let verificationId = credential.verificationId;
    //   //This is STEP 2 — passing verification ID to verify Page
    //   this.navCtrl.push(VerificationPage, { verificationid: verificationId, phone: this.contactnumber });
    //   }, (error) => {
    //   console.error(error);
    //   });
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
             //console.log("current user...."+ firebase.auth().currentUser.phoneNumber); 
             
             //this.presentAlert("current user " +firebase.auth().currentUser.phoneNumber);

             var user = firebase.auth().currentUser;
                if (user) {
                  if (firebase.auth().currentUser.phoneNumber!=this.contactnumber)
                    {
                    firebase.auth().currentUser.updatePhoneNumber(signInCredential);   
                    this.presentAlert("User updated");                 
                    }
                  localStorage.setItem('PERSON', JSON.stringify(this.person));
                  this.FirebaseProvider.contactnum=this.person.contactnumber; 
                }              
                else{                         
                  firebase.auth().signInAndRetrieveDataWithCredential(signInCredential).then((res) => {
                    if(res.additionalUserInfo.isNewUser)
                    {
                      this.presentAlert("User Created "+ res.user.phoneNumber);
                    }
                    console.log('success');
                    localStorage.setItem('PERSON', JSON.stringify(this.person));
                    this.myacc.myaccounts.push({name:this.name,contactnumber:this.contactnumber,address: "HouseNo: " + this.FirebaseProvider.houseno + " "+ this.FirebaseProvider.currentaddess,landmark: this.FirebaseProvider.landmark,userid:res.user.uid})
                    this.FirebaseProvider.contactnum=this.person.contactnumber; 
                  }).catch(function (error) {
                    this.person = {name: undefined, contactnumber: undefined, address: "HouseNo: " + this.FirebaseProvider.houseno + " "+ this.FirebaseProvider.currentaddess,landmark: undefined};
                    this.FirebaseProvider.contactnum=undefined; 
                    localStorage.setItem('PERSON', JSON.stringify(this.person));
                      console.error("wrong phone");
                    });
              }
              
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
        this.person = {name: undefined, contactnumber: undefined, address: undefined};
        localStorage.setItem('PERSON', JSON.stringify(this.person));
      });     
   
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'User',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

// savedata(udata)
//   {
//     console.log("uuuuu"+udata);
//     firebase.auth().onAuthStateChanged( user => {
//       if (user) { this.userid = user.uid }
//     });
//     console.log("user id"+this.userid);
//     if(udata.length>=10)
//         {
//         localStorage.setItem('PERSON', JSON.stringify(this.person));
//         this.myacc.myaccounts.push({name:this.name,contactnumber:this.contactnumber,userid:this.userid})
//         console.error("success" + this.myacc.myaccounts[0]);
//         }
//         else
//         {
//           this.reset();
//           this.person = {name: undefined, contactnumber: undefined, address: undefined};
//           localStorage.setItem('PERSON', JSON.stringify(this.person));
//           console.error("failed");
//         }

//   }  

//   signIn(phoneNumber: number,_callback){    
//     this.notp=0;
//     const appVerifier = this.recaptchaVerifier;
//     const phoneNumberString = "+91" + phoneNumber;
//     firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
//       .then(confirmationResult => {
//         // SMS sent. Prompt user to type the code from the message, then sign the
//         // user in with confirmationResult.confirm(code).
//         let prompt = this.alertCtrl.create({
//         title: 'Enter the Confirmation code',
//         inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
//         buttons: [
//           { text: 'Cancel',
//             handler: data => { console.log('Cancel clicked'); }
//           },
//           { text: 'Send',
//             handler: data => {
//               confirmationResult.confirm(data.confirmationCode)
//               .then(function (result) {
//                 // User signed in successfully.
//                 console.log(result.user);
//                 _callback(result.user.phoneNumber);
//                 // this.userid=result.user
//                 // this.notp=1;
//                 // ...
//               }).catch(function (error) {
//                 console.log("wrong otp");
//               });
//             }
//           }
//         ]
//       });
//       prompt.present();
//     })
//     .catch(function (error) {
//       console.error("wrong phone");
//     });
  
//   }
}