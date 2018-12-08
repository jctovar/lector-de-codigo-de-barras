import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  lamp: boolean;
  browser: boolean;
  url: string;

  constructor(public navCtrl: NavController, private storage: Storage) {
    storage.get('lamp').then((val) => {
      this.lamp = val;
    });
    storage.get('browser').then((val) => {
      this.browser = val;
    });
    storage.get('url').then((val) => {
      this.url = val;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  public notify() {
    this.storage.set('lamp', this.lamp);
    this.storage.set('browser', this.browser);
    this.storage.set('url', this.url);
  }

}
