import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductCustomerService {
    search = '';
    id = 0;
    file = null;
    size = 0;
    order = true;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    getProductsByCategory(id, search, page, size, column, order) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page).set('SortOrder', Order)
            .set('SortColumn', column).set('PageSize', Size);
        return this.httpclient.get('api/product/getproductbycategoryforcustomer/' + id, { params: queryParameters });
    }

    getProductDetailForCustomer(id) {
        return this.httpclient.get('api/product/getproductdetailforcustomer/' + id);
    }

    getProductbyName(id, pdtName) {
        const queryParameters = new HttpParams().set('pdtName', pdtName);
        return this.httpclient.get('api/product/getproductbynamefromcategory/' + id, { params: queryParameters });
    }

    getProductAttributesForCustomer(id) {
        return this.httpclient.get('api/product/getproductattributevaluesforcustomer/' + id);
    }

    getProductReviewList(id, search, page, size, column, order) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page).set('SortOrder', Order)
            .set('SortColumn', column).set('PageSize', Size);
        return this.httpclient.get('api/product/getproductreviewlist/' + id, { params: queryParameters });
    }

    getProductRating(id) {
        return this.httpclient.get('api/product/gettotalratingofproduct/' + id);
    }

    getProductRatingByCustomer(id) {
        return this.httpclient.get('api/product/getproductratingbyid/' + id);
    }

    addRating(form) {
        console.log(form);
        return this.httpclient.post('api/product/rateproduct/', form).
            pipe(map(x => {
                return x;
            }));
    }

    deleteRating(id) {
        const Id = JSON.stringify(id);
        const queryParameters = new HttpParams().set('productId', Id);
        return this.httpclient.delete('api/product/deleterating/', {params: queryParameters});

    }
}
