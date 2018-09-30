import { Component } from '@angular/core';
import { IonicPage, NavController,NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Dialogs } from '@ionic-native/dialogs';
import {MyaccountProvider} from '../../providers/myaccount/myaccount'
import {VerificationPage} from '../verification/verification'
import { Firebase } from 'ionic-native';


@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {
  public person: {name: string, contactnumber: string, address: string};
  name: any;
  contactnumber: any;
  //emailid:any;
  address: any;
  showProfile: boolean;
  veryficationId;
  userid="";
  notp=0;
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController,private accountsvc:MyaccountProvider, private dialogs:Dialogs,public navParams: NavParams, public alertCtrl:AlertController) {
    this.person = {name: undefined, contactnumber: undefined, address: undefined};
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

   
   let person = JSON.parse(localStorage.getItem('PERSON'));
    if (person){
      this.person = person;
      this.name = this.person.name;
      this.contactnumber = this.person.contactnumber;
    //this.emailid=this.person.emailid;
      this.address = this.person.address;
    }
  }

  reset(){
    this.person = {name: undefined, contactnumber: undefined, address: undefined};
    localStorage.setItem('PERSON', JSON.stringify(this.person));
    this.person.name="";
    this.person.contactnumber="";
    this.person.address="";
    this.showProfile = false;
  }

  save(){    
    this.name = this.person.name;
    this.contactnumber = "+91" + this.person.contactnumber;
    this.address = this.person.address;
    this.showProfile = true;
    // if(this.contactnumber!=undefined && this.contactnumber.length==10)
    // {
    //   var pp=this.signIn(this.contactnumber,(_res) => 
    //   {
    //     console.log('huzzah, I\'m done!'+ _res);
    //     this.savedata(_res)
       
    //   })
    // }
    
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
             firebase.auth().signInWithCredential(signInCredential).then((res) => {
              console.log('success');
              localStorage.setItem('PERSON', JSON.stringify(this.person));
              }).catch(function (error) {
                this.person = {name: undefined, contactnumber: undefined, address: undefined};
                localStorage.setItem('PERSON', JSON.stringify(this.person));
                  console.error("wrong phone");
                });
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
        alert("failed");
      });     
   
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
//         this.accountsvc.myaccounts.push({name:this.name,contactnumber:this.contactnumber,userid:this.userid})
//         console.error("success" + this.accountsvc.myaccounts[0]);
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