import { Component } from '@angular/core';
import { IonicPage, NavController,NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Dialogs } from '@ionic-native/dialogs';

@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {
  public person: {name: string, contactnumber: string, address: string,emailid: string};
  name: any;
  contactnumber: any;
  emailid:any;
  address: any;
  showProfile: boolean;
  veryficationId;
  notp=0;
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController, private dialogs:Dialogs,public navParams: NavParams, public alertCtrl:AlertController) {
    this.person = {name: undefined, contactnumber: undefined, address: undefined,emailid:undefined};
  }

  ionViewDidLoad() {
   // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
   this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-sign-in-recaptcha', {
    'size': 'invisible',
    'callback': function(response) {
      // reCAPTCHA solved - will proceed with submit function
      console.log(response);
    },
    'expired-callback': function() {
      // Reset reCAPTCHA?
    }

   }); 

   
   let person = JSON.parse(localStorage.getItem('PERSON'));
    if (person){
      this.person = person;
      this.name = this.person.name;
      this.contactnumber = this.person.contactnumber;
      this.emailid=this.person.emailid;
      this.address = this.person.address;
    }
  }

  reset(){
    this.person = {name: null, contactnumber: null, address: null,emailid:null};
    this.showProfile = false;
  }

  save(){    
    this.name = this.person.name;
    this.contactnumber = this.person.contactnumber;
    this.emailid=this.person.emailid;
    this.address = this.person.address;
    this.showProfile = true;
    this.signIn(this.contactnumber);
    if(this.notp==1)
    {
    localStorage.setItem('PERSON', JSON.stringify(this.person));
    console.error("success");
    }
    else
    {
      this.reset();
      this.person = {name: undefined, contactnumber: undefined, address: undefined,emailid:undefined};
      localStorage.setItem('PERSON', JSON.stringify(this.person));
      console.error("failed");
    }
  }

  signIn(phoneNumber: number){    
    this.notp=0;
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let prompt = this.alertCtrl.create({
        title: 'Enter the Confirmation code',
        inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
        buttons: [
          { text: 'Cancel',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Send',
            handler: data => {
              confirmationResult.confirm(data.confirmationCode)
              .then(function (result) {
                // User signed in successfully.
                console.log(result.user);
                this.notp=1;
                // ...
              }).catch(function (error) {
                console.log("wrong otp");
              });
            }
          }
        ]
      });
      prompt.present();
    })
    .catch(function (error) {
      console.error("wrong phone");
    });
  
  }

}