import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService, AuthService, LoaderService } from 'app/providers';
import { GLOBAL_CONSTANTS } from 'app/global-constants';

@Component({
    selector: 'app-change-password',
    templateUrl: 'change-password.component.html',
    styleUrls: ['change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    alertType = 'error-textbox';
    userId: string;
    responseMessage = '';

    constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private loaderService: LoaderService, private authServce: AuthService) {}

    ngOnInit() {
        this.userId = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
        this.buildForm();
    }

    buildForm() {
        this.changePasswordForm = this.fb.group({
            currPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        });
        this.changePasswordForm.get('confirmPassword').valueChanges.debounceTime(400).subscribe(val => {
            const newPassword = this.changePasswordForm.get('newPassword').value;
            if (val !== newPassword) {
                this.changePasswordForm.setErrors({ password_notmatch: true });
                this.responseMessage = 'New and Confirm Password did not match';
            } else {
                this.changePasswordForm.setErrors(null);
                this.responseMessage = '';
            }
        });
    }
    changePassword() {
        if (this.changePasswordForm.valid) {
            this.loaderService.display(true);
            const oldPassword = this.changePasswordForm.get('currPassword').value;
            const newPassword = this.changePasswordForm.get('newPassword').value;
            this.authServce.changePassword(this.userId, oldPassword, newPassword).subscribe(
                res => {
                    this.handleSuccess(res);
                },
                err => {},
                () => {
                    this.loaderService.display(false);
                }
            );
        } else {
            if (this.changePasswordForm.errors && this.changePasswordForm.errors.password_notmatch === true) {
                this.responseMessage = 'New and Confirm Password did not match';
            } else {
                this.responseMessage = 'All fields are mandatory';
            }
        }
    }

    handleSuccess(data) {
        if (data && data.status === true) {
            this.alertType = 'success-textbox';
        } else {
            this.alertType = 'error-textbox';
        }
        this.responseMessage = data.message;
    }
}
