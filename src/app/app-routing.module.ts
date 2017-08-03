import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './providers';

import {
  HomeComponent,
  SignInComponent,
  SignUpComponent,
  WelcomeComponent,
  VerifyOtpComponent,
  ForgetPasswordComponent,
  CallbackComponent,
  PackageFormComponent, MaintenancePackageComponent, BookPackageComponent,
  MultiSelectComponent,
  ServiceSearchComponent, ServiceDetailsComponent,
  BookOrderListComponent,
  BookServiceComponent, ServiceSelectionComponent, PersonalComponent, ScheduleOrderComponent, ConfirmOrderComponent,
  PageNotFoundComponent,
  NavbarTopComponent, BannerComponent,
  CustomerReviewComponent, CustomerReviewItemComponent,PackagesComponent, FooterComponent, MediaCoverageComponent,
  ServicesComponent, AboutComponent,
  AddressComponent, ReferComponent, RatingComponent,
  NavbarComponent, UserPackagesComponent,
  CarouselComponent, SlideComponent, MobileAppComponent,
  ClientComponent, FeedbackComponent, MyListComponent, ShareButtonComponent
} from './components';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'signin', pathMatch: 'full', component: SignInComponent },
  { path: 'signup', pathMatch: 'full', component: SignUpComponent },
  { path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
  { path: 'refer', pathMatch: 'full', component: ReferComponent, canActivate: [AuthGuardService] },
  { path: 'verify-otp', pathMatch: 'full', component: VerifyOtpComponent },
  { path: 'reset-password', pathMatch: 'full', component: ForgetPasswordComponent },
  { path: 'feedback', pathMatch: 'full', component: FeedbackComponent },
  { path: 'request-callback', pathMatch: 'full', component: CallbackComponent },
  { path: 'package-form', pathMatch: 'full', component: PackageFormComponent },
  { path: 'maintenance-package', pathMatch: 'full', component: MaintenancePackageComponent },
  { path: 'book-package', pathMatch: 'full', component: BookPackageComponent, canActivate: [AuthGuardService] },
  { path: 'free-services', pathMatch: 'full', component: UserPackagesComponent, canActivate: [AuthGuardService] },
  { path: 'service-search', pathMatch: 'full', component: ServiceSearchComponent },
  { path: 'service/:serviceName', component: ServiceDetailsComponent },
  { path: 'account', loadChildren: 'app/components/account/account.module#AccountModule' },
  { path: 'book-order-list', component: BookOrderListComponent },
  {
    path: 'booking',
    component: BookServiceComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuardService],
        children: [
          { path: 'service-selection', component: ServiceSelectionComponent },
          { path: 'personal', component: PersonalComponent },
          { path: 'schedule', component: ScheduleOrderComponent },
          { path: 'confirm', component: ConfirmOrderComponent },
          { path: '', pathMatch: 'full', redirectTo: 'service-selection' }
        ]
      }
    ]
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  // otherwise redirect to page not found-404
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const RoutedComponents = [
  HomeComponent,
  SignInComponent,
  SignUpComponent,
  WelcomeComponent,
  VerifyOtpComponent,
  ForgetPasswordComponent,
  CallbackComponent,
  PackageFormComponent,
  MaintenancePackageComponent, UserPackagesComponent, BookPackageComponent,
  ServiceSearchComponent, ServiceDetailsComponent,
  BookOrderListComponent, ReferComponent,
  BookServiceComponent, ServiceSelectionComponent, PersonalComponent, ScheduleOrderComponent, ConfirmOrderComponent,
  PageNotFoundComponent, FeedbackComponent
];

export const SubComponents = [
  MultiSelectComponent, MultiSelectComponent, NavbarTopComponent, BannerComponent,
  CustomerReviewComponent, CustomerReviewItemComponent,PackagesComponent, FooterComponent, MediaCoverageComponent,
  ServicesComponent, AboutComponent,
  AddressComponent,
  NavbarComponent, RatingComponent,
  CarouselComponent, SlideComponent, MobileAppComponent,
  ClientComponent, MyListComponent, ShareButtonComponent
];

