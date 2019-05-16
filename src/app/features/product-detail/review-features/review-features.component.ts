import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { ProductCustomerService } from '../../../services/product-customer.service';
import { ErrorService } from '../../../services/error.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-review-features',
  templateUrl: './review-features.component.html',
  styleUrls: ['./review-features.component.css']
})
export class ReviewFeaturesComponent implements OnInit {
  reviewForm: FormGroup;
  submitted = false;
  id = 0;
  @Input() productId: any;
  @Output() reviewAdded = new EventEmitter<any>();
  selectedRating = 0;
  resetRating = false;
  ratingExists = false;

  constructor(private formbuilder: FormBuilder, private toastr: ToastrService,
    private productCustomerService: ProductCustomerService, private spinnerService: SpinnerService,
    private translate: TranslateService, private errorService: ErrorService, private router: Router) {
    this.reviewForm = this.formbuilder.group({
      reviewTitle: [''],
      review: ['']
    });
  }

  ngOnInit() {
    this.getRatingByCustomer();
  }

  getRatingByCustomer() {
    this.productCustomerService.getProductRatingByCustomer(this.productId).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.ratingExists = true;
          this.reviewForm.patchValue({
            reviewTitle: result.body.reviewTitle,
            review: result.body.review
          });
          this.selectedRating = result.body.rating;
        } else {
          this.ratingExists = false;
        }
        }, (error: any) => {
          this.ratingExists = false;
          this.router.navigate(['/login']);
          this.toastr.info(this.translate.instant('pdt-detail.login-review', ''));
      });
  }

  selectRating(rate) {
    this.selectedRating = rate;
  }

  addReview(form: FormGroup, rate: any) {
    if (form.valid) {
      if (!isNullOrUndefined(rate)) {
        form.value.rating = rate;
        form.value.productId = this.productId;
        this.productCustomerService.addRating(form.value).
          subscribe((result: any) => {
            if (result.status === 1) {
              this.toastr.success(this.translate.instant('common.insert', { param: 'Review' }), '');
            } else {
              this.errorService.handleFailure(result.statusCode);
            }
            this.reviewAdded.emit();
          }, (error: any) => {
            this.errorService.handleError(error.status);
            this.reviewAdded.emit();
          });
      }
    }
    this.submitted = true;
  }

  resetForm(form: FormGroup) {
    this.resetRating = true;
    this.submitted = false;
    this.selectedRating = 0;
  }

  deleteRating() {
    const del = confirm(this.translate.instant('common.confirm-delete', { param: 'Rating' }));
    if (del) {
      this.productCustomerService.deleteRating(this.productId).
        subscribe((result: any) => {
          if (result.status === 1) {
            this.toastr.success(this.translate.instant('common.delete'), '');
          } else {
            this.errorService.handleFailure(result.statusCode);
            this.toastr.error(this.translate.instant('common.err-delete', { param: 'Rating' }), '');
          }
          this.reviewAdded.emit();
        }, (error: any) => {
          this.errorService.handleError(error.status);
          this.reviewAdded.emit();
        });
    }
  }
}
