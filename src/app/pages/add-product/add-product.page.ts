import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from "@angular/fire/firestore";
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  productData = {
    name: '',
    category: {},
    price: ''
  }
  categories
  constructor(private firebaseService: FirebaseService, private loadingCtrl: LoadingController,
    private navCtrl: NavController, private db: AngularFirestore) {
  }

  ngOnInit() {
    this.getFirebaseCategories();
  }

  async getFirebaseCategories() {
    let loader = this.loadingCtrl.create({
      message: "Please wait...",
  });
  (await loader).present();
  try {
    await  this.firebaseService.getCategories().subscribe(data => {
      console.log(data)
      this.categories = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['name'],
        };
      })
    });
  }catch(e) {
    console.log(e)
  }
  (await loader).dismiss();
  }

  createProduct() {
    // this.productData = {...this.productData, categoryId}
    // const productCategory = {
    //   productId: '',
    //   categoryId: ''
    // }
    this.firebaseService.createProduct(this.productData).then(resp => {
      console.log(resp)
      // productCategory.productId = resp.id;
      // productCategory.categoryId = this.productData.category_id
      // this.db.collection('Product_Category').add(productCategory).then((result) => {
      //   console.log(result)
      // }).catch((err) => {
        
      // });
      this.navCtrl.navigateRoot("/folder/Homepage")
    })
      .catch(error => {
        console.log(error);
      });
  }

}
