import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController,public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }
  
  openPage(p) {
    this.navCtrl.push(p);
  }


}
