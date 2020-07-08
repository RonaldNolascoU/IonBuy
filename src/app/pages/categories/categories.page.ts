import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {
  LoadingController,
  ToastController,
  NavController,
} from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { LayoutUtilsService } from 'src/app/services/layout-utils.service';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  id
  products
  category
  cart
  cartItemCount
  @ViewChild('cart', { static: false, read: ElementRef }) fab: ElementRef;
  constructor(
    private actRouter: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private layoutService: LayoutUtilsService,
    private cartService: CartService
) {
    this.id = this.actRouter.snapshot.paramMap.get("id");
}

  ngOnInit() {
    this.getProductsByCategory(this.id);
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  addToCart(product) {
    console.log(product)
    this.layoutService.addToCart(product, this.fab);
  }

  openCart() {
    this.layoutService.openCart(this.fab);
  }
  
  async getProductsByCategory(id: string) {
    let loader = this.loadingCtrl.create({
        message: "Please wait...",
    });
    (await loader).present();

    this.firestore.collection('Products', ref => ref.where('category.id','==', this.id))
        .snapshotChanges()
        .subscribe((data) => {
          this.products = data.map(e => {
            return {
              id: e.payload.doc.id,
              isEdit: false,
              name: e.payload.doc.data()['name'],
              category: e.payload.doc.data()['category'],
              price: e.payload.doc.data()['price']
            };
          })
          console.log(this.products)
          this.category = this.products[0].category.name;
        });

    (await loader).dismiss();
}
}
