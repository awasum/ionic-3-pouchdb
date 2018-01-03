import { PouchDBProvider } from './../../providers/pouch-db/pouch-db';
import { Component, NgZone } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Uuid from "uuid";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public items: Array<any>;

    public constructor(public navCtrl: NavController, public alertCtrl: AlertController, private database: PouchDBProvider, private zone: NgZone) {
        this.items = [];
    }

    public ionViewDidEnter() {
        this.database.sync("http://192.168.8.101:4984/example");
        this.database.getChangeListener().subscribe(data => {
            for(let i = 0; i < data.change.docs.length; i++) {
                this.zone.run(() => {
                    this.items.push(data.change.docs[i]);
                });
            }
        });
        this.database.fetch().then(result => {
            this.items = [];
            for(let i = 0; i < result.rows.length; i++) {
                this.items.push(result.rows[i].doc);
            }
        }, error => {
            console.error(error);
        });
    }

    public insert() {
        let prompt = this.alertCtrl.create({
            title: 'Todo Items',
            message: "Add a new item to the todo list",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Title'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {}
                },
                {
                    text: 'Save',
                    handler: data => {
                        this.database.put({type: "list", title: data.title}, Uuid.v4());
                    }
                }
            ]
        });
        prompt.present();
    }

}