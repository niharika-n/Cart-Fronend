import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../../shared/login-model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from '../../services/error.service';
import { HomeService } from '../../services/home.service';
import { CartService } from '../../services/cart.service';
import { isNullOrUndefined } from 'util';
import { PagerService } from '../../services/pagination.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  user: LoginUser;
  isUser = false;
  isWishlist = false;
  productResult = '';
  totalCount = 0;
  currentPage = 1;
  pager: any = [];
  productList = [];
  math = Math;

  constructor(private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private errorService: ErrorService, private homeService: HomeService, private cartService: CartService,
    private pagerService: PagerService, private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.getWishlist(this.currentPage);
  }

  getWishlist(selectedPage: number) {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user !== null) {
      if (isNullOrUndefined(selectedPage)) { selectedPage = this.currentPage; }
      this.homeService.getWishlist(1).
        subscribe((result: any) => {
          if (result.status === 1) {
            this.isWishlist = true;
            this.productResult = result.body.productResult;
            this.totalCount = result.body.totalCount;
            this.getImages(this.productResult);
            this.setPage(this.currentPage);
          } else {
            if (!isNullOrUndefined(result.message) && result.message === 'wishlist-empty') {
              this.isWishlist = false;
            } else {
              this.errorService.handleFailure(result.statusCode);
            }
          }
        }, (error: any) => {
          this.isWishlist = false;
          this.errorService.handleError(error.statusCode);
        });
      this.isUser = true;
    } else {
      this.isUser = false;
      this.toastr.info(this.translate.instant('wishlist.wishlist-login', ''));
      this.router.navigate(['/login']);
    }
  }

  getImages(data) {
    this.productList = [];
    data.map((product) => {
      const obj = Object.assign({}, product);
      const pdt_image = '';
      obj.image = pdt_image;
      this.productList.push(obj);
    });
    this.spinnerService.startRequest();
    for (let i = 0; i < this.productList.length; i++) {
      this.homeService.getProductImages(this.productList[i].productId, false).
        subscribe((result: any) => {
          if (result.status === 1) {
            this.productList[i].image = 'data:image/png;base64,' + result.body.productImageResult[0].imageContent;
          }
        });
    }
    this.spinnerService.endRequest();
  }

  delete(id: number) {
    if (!isNullOrUndefined(id)) {
      this.cartService.deleteFromWishlist(id).
        subscribe((result: any) => {
          if (result.status === 1) {
            this.toastr.success(this.translate.instant('common.delete'), '');
            this.getWishlist(this.currentPage);
          }
        });
    }
  }

  moveToCart(id: number) {
    this.cartService.moveFromWishlistToCart(id).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.toastr.success(this.translate.instant('wishlist.add-cart', ''));
          this.getWishlist(this.currentPage);
        }
      });
  }

  pageSelect(pageNumber?: number) {
    this.currentPage = pageNumber;
    this.getWishlist(this.currentPage);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, 10);
  }
}
