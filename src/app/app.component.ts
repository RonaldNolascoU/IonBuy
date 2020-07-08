import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CartService } from './services/cart.service';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  cartItemCount;
  isLogged:boolean
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private cartService: CartService,
    private afAuth: AngularFireAuth,
    private navCtr: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.cartItemCount = this.cartService.getCartItemCount();
    console.log(this.checkLoggedUser())
    this.checkLoggedUser();
    const path = window.location.pathname.split('folder/')[1];
  }

  checkLoggedUser() {
      this.afAuth.authState.forEach(auth => {
      if (auth == null) {
        this.isLogged = false
      } else {
        this.isLogged = true
      }
    });
  }

  logout() {
    if (this.isLogged) {
      this.afAuth.signOut().then((result) => {
        this.navCtr.navigateRoot('/login')
      }).catch((err) => {
        console.log(err)
      });
    }
  }
}
