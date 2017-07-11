import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LocationService, LocalStorageService, LoaderService, PackageService } from '../../providers';
import { Location } from '../../models';
import { GLOBAL_CONSTANTS } from '../../global-constants';

enum FormType {
  HOMEMAKER = 1,
  CORPORATE,
  BECOME_PARTNER
};

@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.css']
})
export class PackageFormComponent implements OnInit {
  rows: number;
  formSubmitted = false;
  formType: number;
  title: string;
  type: string;
  formPackageForm: FormGroup;
  currLocation: string;
  locationData: Location[];
  formErrors = {
    'name': '',
    'number': '',
    'email': '',
    'org_name': '',
    'message': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required'
    },
    'number': {
      'required': 'Mobile Number is required',
      'pattern': 'Mobile Number must be 10 digit number'
    },
    'email': {
      'required': 'email is required',
      'pattern': 'email is invalid'
    },
    'org_name': {
      'required': 'Organzation Name is required'
    },
    'message': {
      'required': 'Message is required'
    }
  };
  EMAIL_PATTERN = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  MOBILE_PATTERN = '^[0-9]{10,10}';

  constructor(
    private router: Router,
    private routes: ActivatedRoute,
    private locationService: LocationService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private packageService: PackageService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.currLocation = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_CITY);
    this.fetchCityList();
    this.routes.queryParams.subscribe(params => {
      this.formType = +params['form-type'];
      this.setTitle();
    });
    this.buildForm();
  }

  fetchCityList(): void {
    this.locationService.getLocations()
      .subscribe(res => {
        this.locationData = res;
      });
  }

  setTitle(): void {
    if (this.formType === 1) {
      this.title = 'Home MakeOver Package';
      this.type = 'Society';
      this.rows = 5;
    } if (this.formType === 2) {
      this.title = 'For Corporate';
      this.type = 'Organization';
      this.rows = 2;
    } else if (this.formType === 3) {
      this.title = 'Become a Partner';
      this.type = 'Partner';
      this.rows = 5;
    }
  }

  buildForm(): void {
    if (this.formType === 1 || this.formType === 3) {
      this.formPackageForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]],
        number: ['', [Validators.required, Validators.pattern(this.MOBILE_PATTERN)]],
        location: [this.currLocation, Validators.required],
        org_name: '',
        message: ['', Validators.required],
        type: [this.type]
      });
    } else if (this.formType === 2) {
      this.formPackageForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]],
        number: ['', [Validators.required, Validators.pattern(this.MOBILE_PATTERN)]],
        location: [this.currLocation, Validators.required],
        org_name: ['', Validators.required],
        message: ['', Validators.required],
        type: [this.type]
      });
    }
    this.formPackageForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.formPackageForm) { return; }
    const form = this.formPackageForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.invalid) {
          const messages = this.validationMessages[field];

          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  submitPackageForm(): void {
    if (this.formPackageForm.valid) {
      this.loaderService.display(true);
      if (this.formType === 1) {
        this.packageService.saveHomeMOPackageForm(this.formPackageForm.value)
          .subscribe(res => {
            if (res === 'HMP created') {
              this.formSubmitted = true;
            }
            this.loaderService.display(false);
          });
      } else if (this.formType === 2) {
        this.packageService.saveCorporatePackageForm(this.formPackageForm.value)
          .subscribe(res => {
            if (res === 'Corporate created') {
              this.formSubmitted = true;
            }
            this.loaderService.display(false);
          });
      } else if (this.formType === 3) {
        this.packageService.savePartnerForm(this.formPackageForm.value)
          .subscribe(res => {
            if (res === 'Partner created') {
              this.formSubmitted = true;
            }
            this.loaderService.display(false);
          });
      }
    }
  }

}
