import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProductCustomerService } from '../../services/product-customer.service';
import { HomeService } from '../../services/home.service';
import { isNullOrUndefined } from 'util';
import { LoginUser } from '../../shared/login-model';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from '../../services/error.service';
import { CartService } from '../../services/cart.service';
import { CartModel } from '../../user/cart/cart';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  cart: CartModel;
  subscription: Subscription;
  sharedSubscription: Subscription;
  countSubscription: Subscription;
  productId = 0;
  productDetail = '';
  productAttributes = '';
  productImages = [];
  math = Math;
  totalRating = 0;
  selectedCategory = '';
  selectedProduct = '';
  isLoggedIn = false;
  userObj: LoginUser;
  showReview = true;
  cartCount = 0;

  constructor(private sharedService: SharedService, private activatedRoute: ActivatedRoute, private router: Router,
    private productCustomerService: ProductCustomerService, private homeService: HomeService, private toastr: ToastrService,
    private translate: TranslateService, private errorService: ErrorService, private cartService: CartService,
    private spinnerService: SpinnerService) {
    this.subscription = this.sharedService.selectedProduct.subscribe(data => this.getProductDetail(data));
    this.countSubscription = this.sharedService.cartCount.subscribe(data => this.checkCount(data));
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.selectedCategory = params.childId;
      this.selectedProduct = params.pdtId;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getProductDetail(data: any) {
    if (data != null) {
      this.productId = data.productId;
      this.spinnerService.startRequest();
      this.productCustomerService.getProductDetailForCustomer(this.productId).
        subscribe((result: any) => {
          this.spinnerService.endRequest();
          if (result.status === 1) {
            this.productDetail = result.body;
            this.getProductRating(this.productId);
            this.getProductAttributes(this.productId);
            this.getProductImages(this.productId);
          } else {
            this.errorService.handleFailure(result.statusCode);
          }
        }, (error: any) => {
          this.spinnerService.endRequest();
          this.errorService.handleError(error.status);
        });
    } else {
      this.sharedSubscription = this.sharedService.categories.subscribe(category => this.filterProductDetail(category));
    }
  }

  filterProductDetail(data) {
    const categoryArr = data;
    const categoryNameArr = [];
    for (let i = 0; i < categoryArr.length; i++) {
      const name = categoryArr[i].categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
      categoryNameArr.push({
        categoryId: categoryArr[i].categoryId,
        categoryName: name
      });
    }
    const category = categoryNameArr.filter(x => x.categoryName === this.selectedCategory);
    this.spinnerService.startRequest();
    this.productCustomerService.getProductbyName(category[0].categoryId, this.selectedProduct).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 1) {
          this.productDetail = result.body;
          this.getProductRating(result.body.productId);
          this.getProductAttributes(result.body.productId);
          this.getProductImages(result.body.productId);
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
      });
  }

  getProductImages(id) {
    this.homeService.getProductImages(id, true).
      subscribe((result: any) => {
        if (result.status === 1) {
          for (let i = 0; i < result.body.productImageResult.length; i++) {
            this.productImages.push({ src: 'data:image/png;base64,' + result.body.productImageResult[i].imageContent });
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
      });
  }

  getProductAttributes(id) {
    this.productCustomerService.getProductAttributesForCustomer(id).
      subscribe((result: any) => {
        if (result.status === 1) {
          if (!isNullOrUndefined(result.body.productAttributeValueResult) && result.body.productAttributeValueResult.length > 0) {
            this.productAttributes = result.body.productAttributeValueResult;
          }
        }
      });
  }

  getProductRating(id) {
    this.productCustomerService.getProductRating(id).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.totalRating = result.body;
        }
      });
  }

  addReview() {
    this.userObj = JSON.parse(localStorage.getItem('user'));
    if (this.userObj != null) {
      this.isLoggedIn = true;
      this.showReview = true;
    } else {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
      this.toastr.info(this.translate.instant('pdt-detail.login-review', ''));
    }
  }

  hideReview() {
    if (this.showReview) {
      this.showReview = false;
    }
  }

  updateReviews(event: any) {
    this.hideReview();
    this.getProductRating(this.productId);
  }

  addToWishlist(id: number) {
    this.cartService.addTowishlist(id).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.toastr.success(this.translate.instant('wishlist.add-wishlist', ''));
        } else {
          if (!isNullOrUndefined(result.message) && result.message === 'product-present') {
            this.toastr.info(this.translate.instant('wishlist.present-in-list', ''));
          } else {
            this.errorService.handleFailure(result.status);
          }
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
      });
  }

  addToCart(id: number, quantity: any) {
    this.setCart();
    this.cart.quantity = +quantity;
    this.cart.productId = id;
    this.cartService.addToCart(this.cart).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.cartCount = this.cartCount + 1;
          this.sharedService.sendCartCount(this.cartCount);
          this.toastr.success(this.translate.instant('wishlist.add-cart', ''));
        } else {
          console.log('flag');
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
      });
  }

  setCart() {
    this.cart = {
      cartId: 0,
      product: '',
      productId: 0,
      quantity: 0,
      userId: 0
    };
  }

  checkCount(data) {
    if (!isNullOrUndefined(data)) {
      this.cartCount = data;
    } else {
      this.cartCount = 0;
    }
  }
}
