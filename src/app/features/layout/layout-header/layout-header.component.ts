import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { isNullOrUndefined, debug } from 'util';
import { LoginUser } from '../../../shared/login-model';
import { SigninService } from '../../../services/login.service';
import { SpinnerService } from '../../../services/spinner.service';
import { ErrorService } from '../../../services/error.service';
import { CartService } from '../../../services/cart.service';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.css']
})
export class LayoutHeaderComponent implements OnInit {
  subscription: Subscription;
  isQuant = false;
  quantity = 0;

  constructor(private layoutService: LayoutService, private loginService: SigninService,
    private router: Router, private spinnerService: SpinnerService, private errorService: ErrorService,
    private cartService: CartService, private sharedService: SharedService) {
    this.subscription = this.sharedService.cartCount.subscribe(data => this.setCount(data));
  }
  loginModel: LoginUser;

  ngOnInit() {
    if (localStorage.getItem('user') != null) {
      this.loginModel = JSON.parse(localStorage.getItem('user'));
      this.loginModel.imageContent = 'data:image/png;base64,' + this.loginModel.imageContent;
      this.setCount(0);
    }
  }

  setCount(count) {
    if (!isNullOrUndefined(this.loginModel)) {
      this.cartService.getCart().
        subscribe((result: any) => {
          if (result.status === 1) {
            this.isQuant = true;
            this.quantity = result.body.length;
          } else {
            this.isQuant = false;
            this.quantity = 0;
          }
        });
    } else {
      if (!isNullOrUndefined(count) && count !== 0) {
        this.isQuant = true;
        this.quantity = count;
      } else {
        this.isQuant = false;
        this.quantity = 0;
      }
    }
  }

  logout() {
    this.loginService.logout();
  }
}
