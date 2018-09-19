import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { FirebaseService} from '../../providers/dbservice/dbservice';
import { ToastController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Firebase } from 'ionic-native';
/**
 * Generated class for the MyaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {
  
  constructor(private toastCtrl: ToastController,public firebase:Firebase,public navCtrl: NavController, afDatabase: AngularFireDatabase,public navParams: NavParams) {
    const personRef: firebase.database.Reference = afDatabase.database.ref('/restaurants/');
    personRef.on('value', personSnapshot => {
      var myPerson = personSnapshot.val();
    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyaccountPage');
   
  }


  // add(value){
  //   this.FirebaseService.addUser(value)
  //   .then( res => {
  //     let toast = this.toastCtrl.create({
  //       message: 'User was created successfully',
  //       duration: 3000
  //     });
  //     toast.present();
  //     //this.resetFields();
  //   }, err => {
  //     console.log(err)
  //   })
  // }


}
