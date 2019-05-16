import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';
import { HomeService } from '../../../services/home.service';
import { ErrorService } from '../../../services/error.service';
import { isNullOrUndefined } from 'util';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {
  productArr = [];
  pageCount = [];
  productDisplayArr = [];
  sharedSubscription: Subscription;
  constructor(private spinnerService: SpinnerService, private homeService: HomeService, private translate: TranslateService,
    private errorService: ErrorService, private sharedService: SharedService, private toastr: ToastrService) {
    this.sharedSubscription = this.sharedService.products.subscribe(data => this.getProducts(data));
  }

  ngOnInit() {
  }

  getProducts(data) {
    this.productArr = data;
    this.processProducts();
  }

  processProducts() {
    const productList = this.productArr.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    this.spinnerService.startRequest();
    for (let i = 0; i < productList.length; i++) {
      this.homeService.getProductImages(this.productArr[i].productId, false)
        .subscribe((imageResult: any) => {
          this.spinnerService.endRequest();
          if (imageResult.status === 1) {
            if (!isNullOrUndefined(imageResult.body)) {
              this.productDisplayArr.push({
                src: 'data:image/png;base64,' + imageResult.body.productImageResult[0].imageContent,
                detail: this.productArr[i]
              });
            }
          } else {
            this.errorService.handleFailure(imageResult.statusCode);
          }
        }, (error: any) => {
          this.errorService.handleError(error.status);
        });
    }
    let arrLength = Math.round(this.productArr.length / 6);
    if (arrLength < this.productArr.length / 6) {
      arrLength = arrLength + 1;
    }
    for (let i = 0; i < arrLength; i++) {
      this.pageCount.push(i);
    }
  }

}
