import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { isNullOrUndefined } from 'util';
import { SpinnerService } from '../../services/spinner.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-category-customer',
  templateUrl: './category-customer.component.html',
  styleUrls: ['./category-customer.component.css']
})
export class CategoryCustomerComponent implements OnInit {
  sharedSubscription: Subscription;
  categoryArr = [];
  sortedCategoryArr = [];
  categoryNameArr = [];
  categoryName = '';
  selectedCategory = [];
  childCount = [];
  parent = [];

  constructor(private sharedService: SharedService, private activatedRoute: ActivatedRoute, private errorService: ErrorService,
    private homeService: HomeService, private spinnerService: SpinnerService, private router: Router, private toastr: ToastrService,
    private translate: TranslateService) {
    this.sharedSubscription = this.sharedService.categories.subscribe(data => this.getCategories(data));
  }

  ngOnInit() {
  }

  getCategories(data) {
    data.map((category) => {
      if (category.parentCategory) {
        const obj = Object.assign({}, category);
        const cat_children = data.filter(x => x.childCategory === category.categoryId);
        obj.children = cat_children;
        this.sortedCategoryArr.push(obj);
      }
      this.categoryArr = data;
    });
    for (let i = 0; i < this.categoryArr.length; i++) {
      const name = this.categoryArr[i].categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
      this.categoryNameArr.push({
        categoryId: this.categoryArr[i].categoryId,
        categoryName: name,
        parentCategory: this.categoryArr[i].parentCategory,
        childCategory: this.categoryArr[i].childCategory
      });
    }
    this.selectCategory();
  }

  selectCategory() {
    let isChild = false;
    let categoryName = '';
    this.activatedRoute.params.subscribe((params: Params) => {
      categoryName = params.categoryId;
      if (!isNullOrUndefined(params.childId)) {
        isChild = true;
        categoryName = params.childId;
      } else {
        isChild = false;
      }
      const title = categoryName;
      if (this.categoryName !== title) {
        this.categoryName = title;
        const category = this.categoryNameArr.filter(x => x.categoryName === this.categoryName);
        if (category.length !== 0) {
          if (!isChild) {
            this.selectedCategory = this.sortedCategoryArr.filter(x => x.categoryId === category[0].categoryId);
            this.parent = this.selectedCategory;
          } else {
            this.selectedCategory = this.categoryArr.filter(x => x.categoryId === category[0].categoryId);
            this.parent = this.sortedCategoryArr.filter(x => x.categoryId === category[0].childCategory);
          }
        }
      }
      this.updateCategory();
    });
  }

  updateCategory() {
    if (!isNullOrUndefined(this.selectedCategory[0].children) && this.selectedCategory[0].children.length !== 0) {
      this.childCount = [];
      let arrLength = 0;
      this.spinnerService.startRequest();
      this.selectedCategory[0].children.forEach((ele: any) => {
        arrLength = arrLength + 1;
        this.homeService.getCategoryImage(ele.categoryId).
          subscribe((result: any) => {
            this.spinnerService.endRequest();
            if (result.status === 1) {
              ele.imageContent = 'data:image/png;base64,' + result.body;
            } else {
              this.errorService.handleFailure(result.statusCode);
            }
          }, (error: any) => {
            this.spinnerService.endRequest();
            this.errorService.handleError(error.status);
          });
      });
      const div = Math.round(arrLength / 3);
      if (div < (arrLength / 3)) {
        arrLength = div + 1;
      } else {
        arrLength = div;
      }
      for (let i = 0; i < arrLength; i++) {
        this.childCount.push(i);
      }
    }
    this.spinnerService.startRequest();
    this.homeService.getCategoryImage(this.selectedCategory[0].categoryId).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 1) {
          this.selectedCategory[0].imageContent = 'data:image/png;base64,' + result.body;
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.spinnerService.startRequest();
        this.errorService.handleError(error.status);
      });
  }

  changeCategory(categorySelected) {
    const url = categorySelected.categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

}
