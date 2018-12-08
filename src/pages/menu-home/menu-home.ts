import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { CodesProvider } from '../../providers/codes/codes';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-menu-home',
  templateUrl: 'menu-home.html',
})
export class MenuHomePage {
  codes: any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public codesProvider: CodesProvider, public file: File, private socialSharing: SocialSharing) {
  }

  public ionViewDidLoad() {
    this.codesProvider.getCodes().then((data) => {
      this.codes = data;
    });
  }

  exportAll() {
    let data = this.removeFields(this.codes);

    let options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      useBom: false,
      noDownload: false,
      headers: ["code", "type", "datetime"]
    };

    let csv = new Angular5Csv(data, 'Archivo', options);
    console.log((csv["csv"]));
    
    this.writeJSON('mydata.csv', csv["csv"]);

    this.shareItem(csv["csv"]);

    this.viewCtrl.dismiss();
  }

  private removeFields(arr) {
    for (var i = 0, l = Object.keys(arr).length; i < l; i++) {
      console.log(delete arr[i]._id);
      console.log(delete arr[i]._rev);
    }

    return arr;
  }

  private shareItem(csv) {
    
    this.socialSharing.share(csv, 'Código de barras', csv, 'archivo.csv');

    
  }

  private writeJSON(filename, object) {
    // object is the data you need to write as json
    // filename is the filename
    // no error checking done - just an example
    return this.file.writeFile(this.file.externalDataDirectory, filename, JSON.stringify(object), {replace:true})
  }

  deleteAll() {
    console.log('delete all...' + JSON.stringify(this.codes));
    this.codesProvider.deleteAll();

    this.viewCtrl.dismiss();
  }
}
