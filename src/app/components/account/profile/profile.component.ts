import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { LocalStorageService, LoaderService, BroadcastService } from '../../../providers';
import { GLOBAL_CONSTANTS } from '../../../global-constants';

import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profilePhotoChanged = false;
  profilePhotoUrl: string;
  files: any;
  formProfile: FormGroup;
  message: string;
  alertType: string;
  showDatePicker: boolean;
  userDetail: User;
  maxDate: Date = new Date();
  formErrors = {
    'name': '',
    'email': '',
    'number': ''
  };

  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'email is required.',
      'pattern': 'email is invalid'
    },
    'number': {
      'required': 'number is required.',
      'pattern': 'number is invalid'
    }
  };

  constructor(public fb: FormBuilder,
    private userService: UserService,
    private loaderService: LoaderService,
    private broadcastService: BroadcastService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.profilePhotoUrl = '';
    this.buildForm();
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    const userId = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    this.userService.getUserDetails(userId)
      .then(res => {
        this.userDetail = res;
        this.userDetail.name = res.name;
        this.userDetail.email = res.email;
        this.userDetail.number = res.number;
        this.formProfile.controls['name'].patchValue(this.userDetail.name);
        this.formProfile.controls['email'].patchValue(this.userDetail.email);
        this.formProfile.controls['number'].patchValue(this.userDetail.number);
        this.formProfile.controls['gender'].patchValue(this.userDetail.gender);
        this.formProfile.controls['dob'].patchValue(this.userDetail.dob);
        this.formProfile.controls['photo'].patchValue(this.userDetail.photo);
        this.profilePhotoUrl = this.userDetail.photo || 'assets/images/empty-avatar.png';
      });
  }

  buildForm(): void {
    const name = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'name');
    const email = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'email');
    const mobile = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'mobile');
    this.formProfile = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]],
      gender: [''],
      number: ['', [Validators.required, Validators.pattern('^[0-9]{10,10}')]],
      dob: [''],
      photo: ['']
    });

    this.formProfile.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.formProfile) { return; }
    const form = this.formProfile;

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

  toggleShowDatePicker() {
    this.showDatePicker = !this.showDatePicker;
    return this.showDatePicker;
  }

  public onSelectionDone(dateSelected) {
    this.showDatePicker = false;
    this.formProfile.controls['dob'].patchValue(dateSelected.toLocaleDateString());
  }

  saveUserProfile(): void {
    if (this.formProfile.valid) {
      this.loaderService.display(true);
      this.userService.updateUser(this.formProfile.value)
        .then(res => {
          this.message = res;
          localStorage.setItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME, this.formProfile.get('name').value);
          localStorage.setItem(GLOBAL_CONSTANTS.LS_MOBILE, this.formProfile.get('number').value);
          this.broadcastService.broadcast(GLOBAL_CONSTANTS.BROASCAST_ISLOGGEDIN, true);
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });
    }
  }

  onChange(event) {
    this.files = event.srcElement.files;
    this.profilePhotoChanged = true;
    this.uploadProfilePhoto();
  }

  uploadProfilePhoto() {
    this.profilePhotoUrl = 'assets/images/loading.gif';
    const file: File = this.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.userService.uploadProfileImage(formData)
      .then(res => {
        this.profilePhotoUrl = res;
        this.formProfile.controls['photo'].patchValue(this.profilePhotoUrl);
      });
  }

}
