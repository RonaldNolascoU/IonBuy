import {ViewChild, ElementRef, Injectable} from '@angular/core';
import { CartService } from './cart.service';
import { ModalController } from '@ionic/angular';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
@Injectable({
  providedIn: 'root'
})
export class LayoutUtilsService {

  constructor(private cartService: CartService,  private modalCtrl: ModalController) { }


  addToCart(product, el) {
    this.cartService.addProduct(product);
    this.animateCSS('tada', false, el);
  }

  async openCart(el) {
    this.animateCSS('bounceOutLeft', true, el);

    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
      el.nativeElement.classList.remove('animated', 'bounceOutLeft')
      this.animateCSS('bounceInLeft', false, el);
    });
    modal.present()
  }

  animateCSS(animationName, keepAnimated = false, el) {
    const node = el.nativeElement;
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
