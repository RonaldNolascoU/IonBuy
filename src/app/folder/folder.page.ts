import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { CartService } from './../services/cart.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { LayoutUtilsService } from '../services/layout-utils.service';
@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  cart = [];
  productsData = [];
  cartItemCount: BehaviorSubject<number>;
  public folder: string;
  showProductForm: false;
  products = []
  @ViewChild('cart', { static: false, read: ElementRef }) fab: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController,
    private cartService: CartService,
    private loadingCtrl: LoadingController,
    private toastrCtrl: ToastController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private layoutService: LayoutUtilsService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    //this.getProducts();
    console.log(this.cartService);
    this.getFirebaseProducts();
    console.log(this.products)
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  async getFirebaseProducts() {
    let loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      await this.firebaseService.getProducts().subscribe(data => {
        console.log(data)
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
      });
    } catch (e) {
      this.showToast(e);
    }
    (await loader).dismiss();
  }

  addToCart(product) {
    this.layoutService.addToCart(product, this.fab);
  }

  openCart() {
    this.layoutService.openCart(this.fab);
  }

  async deletePost(id: string) {
    let loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();

    await this.firebaseService.deleteProduct(id);

    (await loader).dismiss();
  }

  showToast(message: string) {
    this.toastrCtrl
      .create({
        message: message,
        duration: 3000,
      })
      .then((toastDate) => toastDate.present());
  }

  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add('animated', animationName)
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove('animated', animationName);
      }
      node.removeEventListener('animationend', handleAnimationEnd)
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }

}
