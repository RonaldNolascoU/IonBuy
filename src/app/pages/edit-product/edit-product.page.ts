import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {
  LoadingController,
  ToastController,
  NavController,
} from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  id
  product = {
    name: '',
    category: {},
    price: ''
  }
  categories
  categoryName
  constructor(
    private actRouter: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private firebaseService: FirebaseService
  ) {
    this.id = this.actRouter.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getProductsById(this.id);
    this.getFirebaseCategories();
  }


  async getProductsById(id: string) {
    let loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();

    this.firestore
      .doc(`Products/${id}`)
      .valueChanges()
      .subscribe((data) => {
        console.log(data)
        this.product.name = data["name"];
        this.product.category = data["category"];
        this.product.price = data["price"];
      });

    (await loader).dismiss();
  }

  async getFirebaseCategories() {
    let loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      await this.firebaseService.getCategories().subscribe(data => {
        console.log(data)
        this.categories = data.map(e => {
          return {
            id: e.payload.doc.id,
            isEdit: false,
            name: e.payload.doc.data()['name'],
          };
        })
      });
    } catch (e) {
      console.log(e)
    }
    (await loader).dismiss();
  }

  async editProduct() {
    console.log(this.product);
    if (this.formValidation()) {
      let loader = this.loadingCtrl.create({
        message: "Please wait...",
      });
      (await loader).present();

      try {
        console.log(this.product);
        await this.firebaseService.updateProduct(this.id, this.product)
      } catch (e) {
        this.showToast(e);
      }
      (await loader).dismiss();
      this.navCtrl.navigateBack("folder/Homepage");
    }
  }

  formValidation() {
    if (!this.product.name) {
      this.showToast("Enter name");
      return false;
    }
    if (!this.product.category) {
      this.showToast("Enter category");
      return false;
    }

    if (!this.product.price) {
      this.showToast("Enter price");
      return false;
    }

    return true;
  }

  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000,
      })
      .then((toastDate) => toastDate.present());
  }

}
