import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

interface Product {
  name: string;
  description: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products = [];
  productData: Product;
  
  productForm = {
    name: '',
    description: '',
    category: '',
    image:''
  };

  @Output() isValidProduct = new EventEmitter<any>();

  constructor(private firebaseService: FirebaseService,
    public fb: FormBuilder) {
    this.productData = {} as Product;
    console.log('test')
  }

  ngOnInit() {

  }

  createProduct() {
    console.log(this.productForm);

    this.firebaseService.createProduct(this.productForm).then(resp => {
      console.log(resp)
      this.isValidProduct.emit();
    })
      .catch(error => {
        console.log(error);
      });
  }

  removeProduct(rowID) {
    this.firebaseService.deleteProduct(rowID);
  }

  editProduct(record) {
    record.isEdit = true;
    record.editName = record.name;
    record.editDescription = record.description;
    record.editCategory = record.category;
    record.editImage = record.image;
  }

  updateProduct(recordRow) {
    let record = {};
    record['name'] = recordRow.editName;
    record['description'] = recordRow.editDescription;
    record['category'] = recordRow.editCategory;
    record['image'] = recordRow.editImage;
    this.firebaseService.updateProduct(recordRow.id, record);
    recordRow.isEdit = false;
  }

}
