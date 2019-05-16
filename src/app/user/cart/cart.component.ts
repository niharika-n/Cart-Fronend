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
import { OrderDetail } from './order-detail';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  user: LoginUser;
  isUser = false;
  isCart = false;
  productResult = '';
  totalCount = 0;
  currentPage = 1;
  pager: any = [];
  productList = [];
  math = Math;
  orderDetail: OrderDetail;

  constructor(private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private errorService: ErrorService, private homeService: HomeService, private cartService: CartService,
    private pagerService: PagerService, private spinnerService: SpinnerService, private sharedService: SharedService) { }

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user !== null) {
      this.cartService.getCart().
        subscribe((result: any) => {
          if (result.status === 1) {
            this.isCart = true;
            this.productResult = result.body;
            this.sharedService.sendCartCount(result.body.length);
            this.getImages(this.productResult);
          } else {
            if (!isNullOrUndefined(result.message) && result.message === 'cart-empty') {
              this.isCart = false;
            } else {
              this.errorService.handleFailure(result.statusCode);
            }
          }
        }, (error: any) => {
          this.isCart = false;
          this.errorService.handleError(error.statusCode);
        });
      this.isUser = true;
    } else {
      this.isUser = false;
      this.toastr.info(this.translate.instant('wishlist.cart-login', ''));
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
    this.getOrderDetails(this.productList);
    this.spinnerService.endRequest();
  }

  getOrderDetails(data) {
    this.setOrder();
    let totalMrp = 0;
    let totalPrice = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalDelivery = 0;
    data.forEach((ele: any) => {
      const mrp = ele.product.price;
      let price = 0;
      let discount = 0;
      let tax = 0;
      let delivery = 0;
      if (ele.product.isDiscounted) {
        price = this.math.round((ele.product.price) * (1 - ele.product.discountPercent / 100));
        discount = this.math.round((ele.product.price) * (ele.product.discountPercent / 100));
      } else {
        price = ele.product.price;
      }
      if (!ele.product.taxExempted) {
        tax = this.math.round((ele.product.price) * (ele.product.tax / 100));
      }
      if (!ele.product.shipingEnabled) {
        delivery = ele.product.shippingCharges;
      }
      totalTax = ele.quantity * tax + totalTax;
      totalMrp = ele.quantity * mrp + totalMrp;
      totalPrice = ele.quantity * price + totalPrice;
      totalDiscount = ele.quantity * discount + totalDiscount;
      totalDelivery = ele.quantity * delivery;
    });
    this.orderDetail.mrp = totalMrp;
    this.orderDetail.discount = totalDiscount;
    this.orderDetail.deliveryCharges = totalDelivery;
    this.orderDetail.estimatedTax = totalTax;
    this.orderDetail.price = totalPrice;
    this.orderDetail.total = totalMrp - totalDiscount + totalDelivery + totalTax;
  }

  delete(id: number) {
    if (!isNullOrUndefined(id)) {
      this.cartService.deleteFromCart(id).
        subscribe((result: any) => {
          if (result.status === 1) {
            this.toastr.success(this.translate.instant('common.delete'), '');
            this.getCart();
          }
        });
    }
  }

  moveToWishlist(id) {
    this.cartService.moveFromCartToWishlist(id).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.toastr.success(this.translate.instant('wishlist.add-wishlist', ''));
          this.getCart();
        }
      });
  }

  newQuantity(id: number, quant: number) {
    const index = this.productList.findIndex(x => x.productId === id);
    this.productList[index].quantity = +quant;
    this.cartService.updateCartQuantity(this.productList[index]).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.getOrderDetails(this.productList);
        } else {
          this.toastr.error(this.translate.instant('wishlist.update-quantity-error', ''));
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
      });
  }

  setOrder() {
    this.orderDetail = {
      mrp: 0,
      discount: 0,
      estimatedTax: 0,
      deliveryCharges: 0,
      total: 0,
      price: 0
    };
  }

}
