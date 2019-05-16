import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject, ReplaySubject, Observable, BehaviorSubject } from 'rxjs';

export class SharedService {
    public static EMPTY = new Object();
    categories = new ReplaySubject<any>();
    products = new ReplaySubject<any>();
    selectedProduct = new BehaviorSubject<any>(null);
    cartCount = new BehaviorSubject<any>(null);

    sendCategories(data: any) {
        this.categories.next(data);
    }

    getCategories(): Observable<any> {
        return this.categories.asObservable();
    }

    sendProducts(data: any) {
        this.products.next(data);
    }

    getProducts(): Observable<any> {
        return this.products.asObservable();
    }

    getProductObj(): Observable<any> {
        return this.selectedProduct.asObservable();
    }

    sendProductObj(data: any) {
        this.selectedProduct.next(data);
    }

    getCartCount(): Observable<any> {
        return this.cartCount.asObservable();
    }

    sendCartCount(data: any) {
        this.cartCount.next(data);
    }
}
