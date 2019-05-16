import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { isNullOrUndefined } from 'util';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from '../../services/error.service';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  productDisplayArr = [];
  productArr = [];
  productDetailObjectArr: any;
  categoryModel = [];
  productImageMessage = false;
  sharedSubscription: Subscription;


  constructor(private homeService: HomeService, private translate: TranslateService, private router: Router,
    private spinnerService: SpinnerService, private errorService: ErrorService, private sharedService: SharedService) {
    this.sharedSubscription = this.sharedService.getCategories().subscribe(data => this.getCategories(data));
  }

  ngOnInit() {
    this.getProducts();
  }

  ngOnDestroy() {
    this.sharedSubscription.unsubscribe();
  }

  getProducts() {
    this.spinnerService.startRequest();
    this.homeService.getProducts().
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 1) {
          if (!isNullOrUndefined(result.body) && result.body.length > 0) {
            this.productArr = result.body;
          } else {
            this.errorService.handleFailure(result.statusCode);
          }
          this.processProducts();
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
      });
  }

  getCategories(data) {
    this.spinnerService.startRequest();
    const categoryList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    if (!isNullOrUndefined(categoryList) && categoryList.length > 0) {
      const categoryLength = categoryList.length > 4 ? 4 : categoryList.length;
      this.categoryModel = [];
      for (let i = 0; i < categoryLength; i++) {
        this.homeService.getCategoryImage(categoryList[i].categoryId).
          subscribe((result: any) => {
            this.spinnerService.endRequest();
            if (result.status === 1) {
              this.categoryModel.push({
                imageContent: 'data:image/png;base64,' + result.body,
                categoryValue: categoryList[i]
              });
            } else {
              this.errorService.handleFailure(result.status);
            }
          }, (error: any) => {
            this.spinnerService.endRequest();
            this.errorService.handleError(error.status);
          });
      }
    }
  }

  processProducts() {
    for (let i = 0; i < this.productArr.length; i++) {
      this.homeService.getProductImages(this.productArr[i].productId, false)
        .subscribe((imageResult: any) => {
          this.spinnerService.endRequest();
          if (imageResult.status === 1) {
            if (!isNullOrUndefined(imageResult.body)) {
              this.productDisplayArr.push({
                id: this.productArr[i].productId,
                src: 'data:image/png;base64,' + imageResult.body.productImageResult[0].imageContent,
                heading: this.productArr[i].productName,
                description: this.productArr[i].shortDescription,
                price: this.productArr[i].price
              });
            }
          } else {
            this.errorService.handleFailure(imageResult.statusCode);
          }
        }, (error: any) => {
          this.errorService.handleError(error.status);
        });
    }
  }

}
