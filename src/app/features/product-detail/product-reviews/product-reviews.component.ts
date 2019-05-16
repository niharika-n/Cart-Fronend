import { Component, OnInit, Input, Output } from '@angular/core';
import { ProductCustomerService } from '../../../services/product-customer.service';
import { PagerService } from '../../../services/pagination.service';
import { isNullOrUndefined } from 'util';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId: any;
  currentPage = 1;
  productReviews = '';
  totalCount = 0;
  pager: any = [];
  pageSize = 5;

  constructor(private productCustomerService: ProductCustomerService,
    private pagerService: PagerService, private errorService: ErrorService) { }

  ngOnInit() {
    this.getProductRatingList(this.currentPage);
  }

  getProductRatingList(selectedPage) {
    if (isNullOrUndefined(selectedPage)) { selectedPage = this.currentPage; }
    this.productCustomerService.getProductReviewList(this.productId, '', this.currentPage, 5, 'RatingId', false).
      subscribe((result: any) => {
        if (result.status === 1) {
          if (result.body !== null && result.body.productRatingReviewResult.length > 0) {
            this.productReviews = result.body.productRatingReviewResult;
            this.totalCount = result.body.totalCount;
            this.setPage(this.currentPage);
          }
        }
      });
  }

  pageSelect(pageNumber?: number) {
    this.currentPage = pageNumber;
    this.getProductRatingList(this.currentPage);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
  }
}
