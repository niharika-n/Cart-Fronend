import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.css']
})
export class ProductBoxComponent implements OnInit {
  pdtDetail: any;
  @Input() pdt: any;
  @Output() pdtId = new EventEmitter<any>();
  math = Math;

  constructor(private spinnerService: SpinnerService) {
  }

  ngOnInit() {
  }

  productDetail(pdtId: any) {
    this.pdtDetail = pdtId;
    this.pdtId.emit(this.pdtDetail);
  }

}
