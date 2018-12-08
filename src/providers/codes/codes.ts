import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';
import PouchdbErase from 'pouchdb-erase';

/*
  npm install pouchdb-find --save
  npm install pouchdb pouchdb-erase --save
*/

@Injectable()
export class CodesProvider {
  data: any;
  db: any;
  remote: any;
 
  constructor() {
    PouchDB.plugin(PouchdbFind);
    PouchDB.plugin(PouchdbErase);
    this.db = new PouchDB('barcodes');
    //this.remote = 'http://localhost:5984/cloudo';
 
    /*let options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.db.sync(this.remote, options);*/
  }

  getCodes() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
   
    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true, descending : false
      }).then((result) => {
        this.data = [];
   
        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });
   
        resolve(this.data);
   
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  createIndex() {
    this.db.createIndex({
      index: {
        fields: ['datetime']
      }
    }).then(function (result) {
      console.log(':) ' + JSON.stringify(result));
    }).catch(function (err) {
      console.log(err);
    });
  }

  getByDatetime() {
    this.db.find({
      selector: {datetime: {'$gte': null}},
      sort: [{datetime: 'desc'}]
    }).then(function (result) {
      console.log('=) ' + JSON.stringify(result));
    }).catch(function (err) {
      console.log(err);
    });
  }
 
  createCode(code){
    this.db.post(code);
  }
   
  updateCode(code){
    this.db.put(code).catch((err) => {
      console.log(err);
    });
  }
   
  deleteCode(code){
    this.db.remove(code).catch((err) => {
      console.log(JSON.stringify(err));
    });
  }

  deleteAll(){
    this.db.erase().catch((err) => {
      console.log(JSON.stringify(err));
    });
  }
 
  handleChange(change){
    let changedDoc = null;
    let changedIndex = null;
   
    this.data.forEach((doc, index) => {
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
    });
   
    //A document was deleted
    if(change.deleted){
      this.data.splice(changedIndex, 1);
    }
    else {
      //A document was updated
      if(changedDoc){
        this.data[changedIndex] = change.doc;
      }
      //A document was added
      else {
        this.data.push(change.doc);
      }
    }
  }

}
