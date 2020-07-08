import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";
import { NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private afAuth: AngularFireAuth, private navCtr: NavController) { }

  canActivate(): boolean {
    this.afAuth.authState.forEach(auth => {
      if (auth == null) {
        this.navCtr.navigateRoot('/login')
        return false
      }
    });
    return true;
  }
}
