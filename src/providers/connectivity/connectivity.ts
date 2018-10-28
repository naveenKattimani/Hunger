import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
 
declare var Connection;
 
@Injectable()
export class Connectivity {
 
  onandroidDevice: boolean;
  oniosdDevice: boolean;
 
  constructor(public platform: Platform,private network: Network){
    this.onandroidDevice = this.platform.is('android');
    this.oniosdDevice = this.platform.is('ios');
  }
 
  isOnline(): boolean {
    if((this.onandroidDevice||this.oniosdDevice) && this.network.type){
      return this.network.type != 'none';
    } else {
       return navigator.onLine;
    }
  }
 
  isOffline(): boolean {
    if((this.onandroidDevice||this.oniosdDevice) && this.network.type){
      return this.network.type == 'none';
    } else {
       return !navigator.onLine;  
    }
  }

  watchOnline(): any {
    return this.network.onConnect();
  }
 
  watchOffline(): any {
    return this.network.onDisconnect();
  }
 
}