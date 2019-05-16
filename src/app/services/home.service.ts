import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    search = '';
    id = 0;
    file = null;
    size = 0;
    order = true;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    getProducts() {
        return this.httpclient.get('api/product/getproductsforcustomer');
    }

    getProductImages(id, getAll) {
        const count = JSON.stringify(getAll);
        const queryParameters = new HttpParams().set('getAll', count);
        return this.httpclient.get('api/product/getproductimagesforcustomer/' + id, { params: queryParameters });
    }

    getAllCategories() {
        return this.httpclient.get('api/category/getallcategoriesforcustomer');
    }

    getCategoryImage(id) {
        return this.httpclient.get('api/category/getcategoryimageforcustomer/' + id);
    }

    getWishlist(page) {
        const pageNumber = JSON.stringify(page);
        const size = JSON.stringify(10);
        const queryParameters = new HttpParams().set('PageNumber', pageNumber).set('PageSize', size);
        return this.httpclient.get('api/cart/getwishlist', { params: queryParameters });
    }
}
