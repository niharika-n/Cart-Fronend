import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule, MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CKEditorModule } from 'ng2-ckeditor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastOptions } from './custom.toast';
import { ErrorService } from './services/error.service';
import {BarRatingModule} from 'ngx-bar-rating';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { APPROUTERMODULE } from './routes/app.route';
import { AuthInterceptor } from './shared/Interceptor';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './services/authorization.service';
import { AuthGuard } from './services/auth.guard';
import { CategoryComponent } from './admin/category/category.component';
import { CategoryfeaturesComponent } from './admin/category/categoryfeatures/categoryfeatures.component';
import { PagerService } from './services/pagination.service';
import { SharedService } from './services/shared.service';
import { SortDirective } from './shared/directives/sort.directive';
import { SettingsComponent } from './admin/settings/settings.component';
import { LocationComponent } from './shared/location/location.component';
import { PagingComponent } from './shared/paging/paging.component';
import { ProductComponent } from './admin/product/product.component';
import { ProductfeaturesComponent } from './admin/product/productfeatures/productfeatures.component';
import { ProductAttributesComponent } from './admin/product-attributes/product-attributes.component';
import {
  ProductAttributeFeaturesComponent
} from './admin/product-attributes/product-attribute-features/product-attribute-features.component';
import { HomeComponent } from './features/home/home.component';
import { LayoutComponent } from './features/layout/layout.component';
import { AdminChangePasswordComponent } from './admin/admin-change-password/admin-change-password.component';
import { RegisterAdminComponent } from './admin/register-admin/register-admin.component';
import { ProductImagesComponent } from './admin/product/productfeatures/product-images/product-images.component';
import {
  ProductAttributeValuesComponent
} from './admin/product/productfeatures/product-attribute-values/product-attribute-values.component';
import { CategoryProductsComponent } from './admin/category/categoryfeatures/category-products/category-products.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { LogoutComponent } from './features/logout/logout.component';
import { SpinnerDirective } from './shared/directives/spinner.directive';
import { TemplateComponent } from './admin/template/template.component';
import { UserDetailComponent } from './admin/user-detail/user-detail.component';
import { LayoutHeaderComponent } from './features/layout/layout-header/layout-header.component';
import { LayoutFooterComponent } from './features/layout/layout-footer/layout-footer.component';
import { MenuBarComponent } from './features/layout/menu-bar/menu-bar.component';
import { FeaturedProductsComponent } from './features/home/featured-products/featured-products.component';
import { ProductBoxComponent } from './shared/product-box/product-box.component';
import { CategoryCustomerComponent } from './features/category-customer/category-customer.component';
import { CategorySidebarComponent } from './features/category-customer/category-sidebar/category-sidebar.component';
import { ProductListCustomerComponent } from './features/product-list-customer/product-list-customer.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { ProductReviewsComponent } from './features/product-detail/product-reviews/product-reviews.component';
import { ReviewFeaturesComponent } from './features/product-detail/review-features/review-features.component';
import { WishlistComponent } from './user/wishlist/wishlist.component';
import { CartComponent } from './user/cart/cart.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    APPROUTERMODULE,
    BrowserAnimationsModule,
    MatTabsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ToastrModule.forRoot(ToastOptions),
    MatProgressSpinnerModule,
    CKEditorModule,
    BarRatingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AdminLayoutComponent,
    SidebarComponent,
    CategoryComponent,
    CategoryfeaturesComponent,
    SortDirective,
    SettingsComponent,
    LocationComponent,
    PagingComponent,
    ProductComponent,
    ProductfeaturesComponent,
    ProductAttributesComponent,
    ProductAttributeFeaturesComponent,
    HomeComponent,
    LayoutComponent,
    AdminChangePasswordComponent,
    RegisterAdminComponent,
    ProductImagesComponent,
    ProductAttributeValuesComponent,
    CategoryProductsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LogoutComponent,
    SpinnerDirective,
    TemplateComponent,
    UserDetailComponent,
    LayoutHeaderComponent,
    LayoutFooterComponent,
    MenuBarComponent,
    FeaturedProductsComponent,
    ProductBoxComponent,
    CategoryCustomerComponent,
    CategorySidebarComponent,
    ProductListCustomerComponent,
    ProductDetailComponent,
    ProductReviewsComponent,
    ReviewFeaturesComponent,
    WishlistComponent,
    CartComponent
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    AuthGuard,
    PagerService,
    ErrorService,
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
