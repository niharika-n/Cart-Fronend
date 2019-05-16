import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { isNullOrUndefined, debug } from 'util';
import { LoginUser } from '../../shared/login-model';
import { SigninService } from '../../services/login.service';
import { SpinnerService } from '../../services/spinner.service';
import { ErrorService } from '../../services/error.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private layoutService: LayoutService, private loginService: SigninService, private homeService: HomeService,
    private router: Router, private spinnerService: SpinnerService, private errorService: ErrorService) { }
  loginModel: LoginUser;
  categoryArr = [];
  parentCategoryArr = [];
  childCategoryArr = [];
  isCategoryDropdown = false;

  ngOnInit() {
    if (localStorage.getItem('user') != null) {
      this.loginModel = JSON.parse(localStorage.getItem('user'));
      this.loginModel.imageContent = 'data:image/png;base64,' + this.loginModel.imageContent;
    }
  }

  logout() {
    this.loginService.logout();
  }
}
