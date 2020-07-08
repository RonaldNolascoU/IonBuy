import { Component, OnInit } from '@angular/core';
import {
  ToastController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {
    name: '',
    email: '',
    password: '',
  };
  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,) { }

  ngOnInit() {
  }
  async register() {
    if (this.formValidation()) {
      let loader = this.loadingCtrl.create({
        message: "Please wait...",
      });
      (await loader).present();

      try {
        await this.afAuth
          .createUserWithEmailAndPassword(this.user.email, this.user.password)
          .then((data) => {
            console.log(data);
            this.navCtrl.navigateRoot("folder/Homepage");
          });
      } catch (e) {
        this.showToast(e);
      }
      (await loader).dismiss();
    }
  }
  formValidation() {
    if (!this.user.email) {
      this.showToast("Enter Email");
      return false;
    }
    if (!this.user.password) {
      this.showToast("Enter Password");
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
