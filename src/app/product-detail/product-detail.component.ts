import { Component, Input, OnInit } from '@angular/core';
import { IProducts } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Input() product: IProducts;
  constructor() { }

  ngOnInit(): void {
  }

}
