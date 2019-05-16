import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { isNullOrUndefined, debug } from 'util';
import { SpinnerService } from '../../../services/spinner.service';
import { ErrorService } from '../../../services/error.service';
import { HomeService } from '../../../services/home.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  categoryArr = [];
  productArr = [];
  newArr = [];

  constructor(private layoutService: LayoutService, private homeService: HomeService,
    private router: Router, private spinnerService: SpinnerService, private errorService: ErrorService,
    private sharedService: SharedService, private eRef: ElementRef) {
  }

  ngOnInit() {
    this.getAllCategories();
  }

  processCategories() {
    this.categoryArr.map((category) => {
      if (category.parentCategory) {
        const obj = Object.assign({}, category);
        const cat_children = this.categoryArr.filter(x => x.childCategory === category.categoryId);
        obj.children = cat_children;
        this.newArr.push(obj);
      }
    });
  }

  getAllCategories() {
    this.spinnerService.startRequest();
    this.homeService.getAllCategories().
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 1) {
          if (result.body.length !== 0 && !isNullOrUndefined(result.body)) {
            this.categoryArr = result.body;
            this.processCategories();
            this.getProducts();
            this.sharedService.sendCategories(this.categoryArr);
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
      });
  }

  getProducts() {
    this.homeService.getProducts().
      subscribe((result: any) => {
        if (result.status === 1) {
          if (!isNullOrUndefined(result.body) && result.body.length > 0) {
            this.productArr = result.body;
            this.sharedService.sendProducts(this.productArr);
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
      });
  }

  selectCategory(category) {
    if (category.parentCategory) {
      const url = category.categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
      this.router.navigate(['', url]);
    } else {
      const parent = this.categoryArr.filter(x => x.categoryId === category.childCategory);
      const parentUrl = parent[0].categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
      const url = category.categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
      this.router.navigate([parentUrl, url]);
    }
  }

}
