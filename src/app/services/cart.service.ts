import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private router: Router, private httpclient: HttpClient) { }

  deleteFromWishlist(id) {
    return this.httpclient.delete('api/cart/deletefromwishlist/' + id);
  }

  addTowishlist(id) {
    return this.httpclient.post('api/cart/addproductstowishlist/', id).
      pipe(map(x => {
        return x;
      }));
  }

  getCart() {
    return this.httpclient.get('api/cart/getcart');
  }

  addToCart(cartModel) {
    return this.httpclient.post('api/cart/addtocart', cartModel).
      pipe(map(x => {
        return x;
      }));
  }

  moveFromWishlistToCart(id) {
    return this.httpclient.post('api/cart/movefromwishlisttocart', id).
      pipe(map(x => {
        return x;
      }));
  }

  deleteFromCart(id) {
    return this.httpclient.delete('api/cart/deletefromcart/' + id);
  }

  moveFromCartToWishlist(id) {
    return this.httpclient.post('api/cart/movefromcarttowishlist', id).
      pipe(map(x => {
        return x;
      }));
  }

  updateCartQuantity(cartModel) {
    return this.httpclient.put('api/cart/updatecartquantity', cartModel).
      pipe(map(x => {
        return x;
      }));
  }
}

