import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  collectionName = 'Products';
  constructor( private firestore: AngularFirestore) { }

  createProduct(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  getProducts() {
    //snapshotChanges() method: get records and also subscribe it to get updates
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  getCategories() {
    //snapshotChanges() method: get records and also subscribe it to get updates
    return this.firestore.collection('Categories').snapshotChanges();
  }

  updateProduct(recordID, record) {
    //doc() method takes collection name with document id to update the record, then the update() method is called to save the document.
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  deleteProduct(record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }
}
