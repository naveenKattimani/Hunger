import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
 
declare var Connection;
 
@Injectable()
export class Connectivity {
 
  onDevice: boolean;
 
  constructor(public platform: Platform){
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    if(this.onDevice && Network.type){
      return Network.type != 'none';
    } else {
      return navigator.onLine;
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && Network.type){
      return Network.type == 'none';
    } else {
      return !navigator.onLine;  
    }
  }

  watchOnline(): any {
    return Network.onConnect();
  }
 
  watchOffline(): any {
    return Network.onDisconnect();
  }
 
}