import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { ProductCustomerService } from '../../services/product-customer.service';
import { SpinnerService } from '../../services/spinner.service';
import { HomeService } from '../../services/home.service';
import { isNullOrUndefined } from 'util';
import { PagerService } from '../../services/pagination.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-product-list-customer',
  templateUrl: './product-list-customer.component.html',
  styleUrls: ['./product-list-customer.component.css']
})
export class ProductListCustomerComponent implements OnChanges {
  sharedSubsciption: Subscription;
  @Input() category: any;
  categoryId = 0;
  selectedProducts = [];
  productDisplayArr = [];
  productCount = [];
  pager: any = [];
  pageSize = 20;
  currentPage = 1;
  totalCount = 0;

  constructor(private sharedService: SharedService, private productService: ProductCustomerService,
    private router: Router, private activatedRoute: ActivatedRoute, private spinnerService: SpinnerService,
    private homeService: HomeService, private pagerService: PagerService, private errorService: ErrorService) {
  }

  ngOnChanges() {
    this.categoryId = this.category.categoryId;
    this.getProducts(this.category.categoryId, this.currentPage);
  }

  getProducts(categoryId: number, selectedPage) {
    if (isNullOrUndefined(selectedPage)) { selectedPage = this.currentPage; }
    this.productService.getProductsByCategory(categoryId, '', selectedPage, 20, 'CreatedDate', false).subscribe((result: any) => {
      if (result.status === 1) {
        if (!isNullOrUndefined(result.body)) {
          this.selectedProducts = result.body.productResult;
          this.totalCount = result.body.totalCount;
          this.processProducts();
        }
      } else {
        this.errorService.handleFailure(result.statusCode);
      }
    }, (error: any) => {
      this.errorService.handleError(error.status);
    });
  }

  processProducts() {
    this.spinnerService.startRequest();
    this.productDisplayArr = [];
    for (let i = 0; i < this.selectedProducts.length; i++) {
      this.homeService.getProductImages(this.selectedProducts[i].productId, false)
        .subscribe((imageResult: any) => {
          this.spinnerService.endRequest();
          if (imageResult.status === 1) {
            if (!isNullOrUndefined(imageResult.body)) {
              this.productDisplayArr.push({
                src: 'data:image/png;base64,' + imageResult.body.productImageResult[0].imageContent,
                detail: this.selectedProducts[i]
              });
            }
          } else {
            this.errorService.handleFailure(imageResult.statusCode);
          }
        }, (error: any) => {
          this.errorService.handleError(error.status);
        });
    }
    this.setPage(this.currentPage);
  }

  selectProduct(productName: any, pdtObj: any) {
    this.sharedService.sendProductObj(pdtObj);
    const url = productName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  pageSelect(pageNumber?: number) {
    this.currentPage = pageNumber;
    this.getProducts(this.categoryId, this.currentPage);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
  }

}
