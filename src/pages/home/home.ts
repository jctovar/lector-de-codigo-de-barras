import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, ActionSheetController, PopoverController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CodesProvider } from '../../providers/codes/codes';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MenuHomePage } from '../menu-home/menu-home';
import Url from 'is-url';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  codes: any;
  lamp: boolean;
  browser: boolean;
  url: string;

  descending: boolean = false;
  order: number;
  column: string = 'type';

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public codesProvider: CodesProvider, private iab: InAppBrowser, private storage: Storage, public popoverCtrl: PopoverController, private socialSharing: SocialSharing) {
  }

  public ionViewDidLoad() {
    this.codesProvider.getCodes().then((data) => {
      this.codes = data;
    });
  }

  deleteCode(code){
    this.codesProvider.deleteCode(code);
  }

  public ionViewDidEnter() {
    this.storage.get('lamp').then((val) => {
      this.lamp = val;
    });
    this.storage.get('browser').then((val) => {
      this.browser = val;
    });
    this.storage.get('url').then((val) => {
      this.url = val;
    });
  }
  

  public openLector() {
    this.barcodeScanner.scan({torchOn: this.lamp}).then(barcodeData => {
      console.log('Barcode data', JSON.stringify(barcodeData));
      
      if (barcodeData.cancelled == true) {
        this.cancelAlert();
      } else {
        let data = {_id: new Date().toJSON(), code: barcodeData.text, type: barcodeData.format, datetime: new Date().toISOString()};
        this.codesProvider.createCode(data);
        if (this.browser == true) {
          this.openBrowser(data);
        }
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  public cancelAlert() {
    const alert = this.alertCtrl.create({
      title: 'Accion cancelada!',
      subTitle: 'La solicitud fue cancelada por el usuario!',
      buttons: ['OK']
    });
    alert.present();
  }

  public loadMenu(event) {
    let popover = this.popoverCtrl.create(MenuHomePage);
    popover.present({
      ev: event
    });
  }

  public itemSelected(code) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Codigo: ' + code.code,
      buttons: [
        {
          text: 'Compartir',
          handler: () => {
            console.log('share...');
            this.shareItem(code);
          }
        },{
          text: 'Abrir en navegador',
          handler: () => {
            console.log('Archive clicked');
            this.openBrowser(code);
          }
        },{
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.deleteCode(code);
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public shareItem(code) {
    var msg = code.code;
    this.socialSharing.share(msg, 'Código de barras ' + code.type, null, null);
  }

  public openBrowser(code) {
    let url: string;

    if(Url(code.code) == true) {
      url = code.code;
    } else {
      if (this.url == '') {
        url = 'https://www.google.com/search?q=' + code.code;
      } else {
        url = this.url + code.code;
      }
    }

    const browser = this.iab.create(url, '_system'); 
  }
}
