import { Router } from '@angular/router';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, OnInit } from '@angular/core';

import { ModalService, IModalContent } from '../../core/modal/modal.service';
import { PackageRequest, PackageForm } from './../../models';
import { LoaderService, LocalStorageService, PackageService, AuthService } from './../../providers';
import { GLOBAL_CONSTANTS } from './../../global-constants';

enum STEP {
    PROPERTY_SELECTION,
    PACKAGE_FORM_SHOW,
    PACKAGE_FORM_SUBMIT,
    SERVICE_SELECTION,
    VISIT_SELECTION,
    DURATION_SELECTION,
    SHOW_PRICE
}

enum NAV_MODE {
    PREV,
    NEXT
}

@Component({
    selector: 'app-maintenance-package',
    templateUrl: './maintenance-package.component.html',
    styleUrls: ['./maintenance-package.component.css']
})
export class MaintenancePackageComponent implements OnInit {
    [name: string]: any;
    STEP: typeof STEP = STEP;
    NAV_MODE: typeof NAV_MODE = NAV_MODE;
    stepTitles: Array<string> = ['Type of Property', 'Select Services', 'Number of Visits', 'Duration of Package'];
    userId: string;
    step: STEP;
    pageTitle: string;
    stepTitle: string;
    navButtonText: string;
    message: string;
    formSubmission: boolean;
    isACServiceEnabled: boolean;
    isNonACServiceEnabled: boolean;
    isBookingPackageDone: boolean;
    _duration: string;
    _visit: string;
    _propertyType: string;
    _serviceType: Array<string>;
    _area: string;
    GET_PRICE = 'Calculate Price';
    BOOK_PACKAGE = 'BOOK PACKAGE';
    PROCEED_TO_VERIFICATION = 'PROCEED TO VERIFICATION';
    order_id: string;
    isCarpentry_Selected = false;
    isPlumbing_Selected = false;
    isElectrical_Selected = false;
    isAC_Selected = false;
    txtArea: string;
    txtACCount: string;
    price: string;
    showNavbar: boolean;
    bookPackageResponse: {
        booked_id: '';
        order_id: '';
    };
    propertyTypes: Array<string> = ['home', 'office', 'society', 'commercial complex'];
    serviceTypes: Array<any> = ['Carpenter', 'Plumbing Services', 'Electrical Service', 'AC Service'];
    packageDurations: Array<any> = [{ text: '3 months', value: '3' }, { text: '6 months', value: '6' }, { text: '12 months', value: '12' }];
    packageVisits: Array<any> = [{ text: '15', value: '15' }, { text: '30', value: '30' }, { text: 'Unlimited', value: 'unlimited' }];
    // package platformBrowserDynamic
    packageForm: PackageForm;
    packageErrorMessage: string;
    HANDY_PACKAGE_FORM = 'Handy Package Form';
    packageFormSubmitted: boolean;
    showNavButtons = false;

    constructor(
        private router: Router,
        private packageService: PackageService,
        private localStorageService: LocalStorageService,
        private modalService: ModalService,
        private authService: AuthService,
        private loaderService: LoaderService
    ) {}

    ngOnInit() {
        this.userId = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
        this.step = STEP.PROPERTY_SELECTION;
        const currDate = new Date();
        this.scheduleDate = currDate.toLocaleDateString();
        this.scheduleTime = currDate.toLocaleTimeString();
        this.navButtonText = 'Next';

        this.pageTitle = 'Maintanence Package';
        this._propertyType = '';
        this._duration = '';
        this._visit = '';
        this.txtArea = '';
        this.formSubmission = false;
        this.packageFormSubmitted = false;
        this.isNonACServiceEnabled = false;
        this.isACServiceEnabled = false;
        this.showNavbar = true;
        this.bookPackageResponse = {
            booked_id: '',
            order_id: ''
        };
        this.packageForm = new PackageForm();
    }

    navigateToPage(navMode: NAV_MODE) {
        if (this.step === STEP.PROPERTY_SELECTION) {
            this.showNavButtons = false;
            if (navMode === NAV_MODE.PREV) {
                // back button will be disabld
            } else if (navMode === NAV_MODE.NEXT) {
                this.showNavButtons = true;
                if (this.formSubmission) {
                    this.stepTitle = this.HANDY_PACKAGE_FORM;
                    this.navButtonText = 'SUBMIT';
                    this.showNavbar = false;
                    this.packageFormSubmitted = false;
                    this.packageForm.name = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME);
                    this.packageForm.email = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'email');
                    this.packageForm.number = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'mobile');
                    this.packageForm.location = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_CITY);
                    this.step = STEP.PACKAGE_FORM_SHOW;
                    this.navButtonText = 'SUBMIT';
                } else {
                    this.step = STEP.SERVICE_SELECTION;
                }
            }
        } else if (this.step === STEP.PACKAGE_FORM_SHOW) {
            if (navMode === NAV_MODE.PREV) {
                this.step = STEP.PROPERTY_SELECTION;
                this.navButtonText = 'NEXT';
            } else if (navMode === NAV_MODE.NEXT) {
                this.submitPackageForm();
            }
        } else if (this.step === STEP.PACKAGE_FORM_SUBMIT) {
            if (navMode === NAV_MODE.NEXT) {
            }
        } else if (this.step === STEP.SERVICE_SELECTION) {
            if (navMode === NAV_MODE.PREV) {
                this.step = STEP.PROPERTY_SELECTION;
                this._duration = '';
                this._visits = '';
                this.showNavButtons = false;
            } else if (navMode === NAV_MODE.NEXT) {
                if (this.isAC_Selected) {
                    this._visit = '-1';
                    this.setUpDuration();
                    this.step = STEP.DURATION_SELECTION;
                } else {
                    this.step = STEP.VISIT_SELECTION;
                }
            }
        } else if (this.step === STEP.VISIT_SELECTION) {
            if (navMode === NAV_MODE.PREV) {
                this.step = STEP.SERVICE_SELECTION;
                this.navButtonText = 'NEXT';
            } else if (navMode === NAV_MODE.NEXT) {
                this.setUpDuration();
                if (this._visit !== 'unlimited') {
                    this.txtArea = 'N/A';
                }
                this.navButtonText = this.GET_PRICE;
                this.step = STEP.DURATION_SELECTION;
            }
        } else if (this.step === STEP.DURATION_SELECTION) {
            if (navMode === NAV_MODE.PREV) {
                this.navButtonText = 'NEXT';
                if (this.isAC_Selected) {
                    this._visit = '';
                    this.step = STEP.SERVICE_SELECTION;
                } else {
                    this.step = STEP.VISIT_SELECTION;
                }
            } else if (navMode === NAV_MODE.NEXT) {
                this.getPackagePrice();
                if (this.isAC_Selected === false) {
                    this.txtACCount = 'N/A';
                } else {
                    this._visit = 'N/A';
                }
                // if (this._visit !== 'unlimited') {
                //     this.txtArea = 'N/A';
                // } else {
                //     this._area = this.txtArea + ' sq. ft';
                // }
                this._area = this._visit === 'unlimited' ? `${this.txtArea} sq. ft` : 'N/A';
            }
        } else if (this.step === STEP.SHOW_PRICE) {
            if (navMode === NAV_MODE.PREV) {
                this.step = STEP.DURATION_SELECTION;
                this.navButtonText = this.GET_PRICE;
            } else if (navMode === NAV_MODE.NEXT) {
                this.bookPackage();
            }
        }
    }

    goToPrev() {
        this.message = '';
        this.showNavbar = true;
        this.navigateToPage(NAV_MODE.PREV);
    }

    goToNext() {
        this.message = this.getErrorMessage();
        if (this.message === '') {
            // if no validation error, proceed
            this.navigateToPage(NAV_MODE.NEXT);
        }
    }

    getStepTitle(): string {
        let title = '';
        if (this.step === STEP.PROPERTY_SELECTION) {
            title = this.stepTitles[0];
        } else if (this.step === STEP.SERVICE_SELECTION) {
            title = this.stepTitles[1];
        } else if (this.step === STEP.VISIT_SELECTION) {
            title = this.stepTitles[2];
        } else {
            title = this.stepTitles[3];
        }
        return title;
    }
    setUpDuration() {
        if (this._visit === '15') {
            this.packageDurations = [{ text: '3 months', value: '3' }];
        } else if (this._visit === '30') {
            this.packageDurations = [{ text: '6 months', value: '6' }, { text: '12 months', value: '12' }];
        } else if (this._visit === '-1') {
            this.packageDurations = [{ text: '12 months', value: '12' }];
        } else {
            this.packageDurations = [{ text: '3 months', value: '3' }, { text: '6 months', value: '6' }, { text: '12 months', value: '12' }];
        }
    }

    setPropertyType(propertyType: string) {
        this._propertyType = propertyType;
        this.formSubmission = ['society', 'commercial complex'].indexOf(this._propertyType) > -1;
        this.message = this.getErrorMessage();
        if (this._propertyType === 'society') {
            this.packageForm.type = 'Society';
        } else if (this._propertyType === 'commercial complex') {
            this.packageForm.type = 'Organization Name';
        }
        this.goToNext();
    }

    setServiceType(val, isChecked) {
        this.message = '';
        this._duration = '';
        this._visits = '';
        this.txtACCount = '';
        if (val === this.serviceTypes[3]) {
            this.isNonACServiceEnabled = isChecked;
        } else {
            this.isACServiceEnabled = this.isCarpentry_Selected || this.isPlumbing_Selected || this.isElectrical_Selected;
        }
        if (this.isAC_Selected === true) {
            this.txtArea = '0';
        }
    }

    getPackagePrice() {
        this.loaderService.display(true);
        if (this.isAC_Selected) {
            this.packageService.getACPackagePrice(this.txtACCount).subscribe(res => {
                this.price = res;
                this.navButtonText = this.BOOK_PACKAGE;
                this.showNavbar = false;
                this.step = STEP.SHOW_PRICE;
                this.loaderService.display(false);
            });
        } else {
            if (this._visit === 'unlimited') {
                this.packageService.getUnlimitedPackagePrice(this._duration, this.txtArea, this.isServiceSelected().toString()).subscribe(res => {
                    this.price = res;
                    this.navButtonText = this.BOOK_PACKAGE;
                    this.showNavbar = false;
                    this.step = STEP.SHOW_PRICE;
                    this.loaderService.display(false);
                });
            } else {
                this.packageService.getPackagePrice(this._duration, this._visit).subscribe(res => {
                    this.price = res;
                    this.navButtonText = this.BOOK_PACKAGE;
                    this.showNavbar = false;
                    this.step = STEP.SHOW_PRICE;
                    this.loaderService.display(false);
                });
            }
        }
    }

    getErrorMessage(): string {
        let errorMessage = '';
        if (this.step === STEP.PROPERTY_SELECTION) {
            if (this._propertyType === '') {
                errorMessage = 'Please select Property Type';
            }
        } else if (this.step === STEP.SERVICE_SELECTION) {
            if (this.isServiceSelected() === 0) {
                errorMessage = 'Please select atleast one Service';
            } else if (this.isAC_Selected) {
                if (this.txtACCount === undefined || this.txtACCount === null || this.txtACCount === '0') {
                    errorMessage = 'Number Of AC is Required';
                } else if (this.txtACCount && parseInt(this.txtACCount, 10) < 1) {
                    errorMessage = 'Number Of AC can not be negative or zero';
                }
            }
        } else if (this.step === STEP.PACKAGE_FORM_SHOW) {
            errorMessage = this.getPackageFormErrorMessage();
        } else if (this.step === STEP.VISIT_SELECTION) {
            if (this._visit === '') {
                errorMessage = 'Please select Number Of Visit';
            } else if (this._visit === 'unlimited') {
                if (this.txtArea && (this.txtArea === '' || this.txtArea === '0')) {
                    errorMessage = 'Area is Required';
                } else if (this.txtArea && parseInt(this.txtArea, 10) < 1) {
                    errorMessage = 'Area can not be negative or zero';
                }
            }
        } else if (this.step === STEP.DURATION_SELECTION) {
            if (this._duration === '') {
                errorMessage = 'Please select Package Duration';
            }
        }
        return errorMessage;
    }

    getPackageFormErrorMessage() {
        let message = '';
        if (!this.packageForm.name || !this.packageForm.number || !this.packageForm.message) {
            message = 'All fields are required';
        }
        return message;
    }

    submitPackageForm() {
        this.loaderService.display(true);
        this.packageService.saveForm(this.packageForm).subscribe(res => {
            this.packageFormSubmitted = true;
            this.navButtonText = 'HOME';
            this.loaderService.display(false);
        });
    }

    isServiceSelected(): number {
        let count = 0;
        if (this.isElectrical_Selected) {
            count++;
        }
        if (this.isPlumbing_Selected) {
            count++;
        }
        if (this.isCarpentry_Selected) {
            count++;
        }
        if (this.isAC_Selected) {
            count++;
        }
        return count;
    }

    getSelectedServices() {
        let result = '';
        if (this.isCarpentry_Selected) {
            result = result + this.serviceTypes[0] + ', ';
        }
        if (this.isPlumbing_Selected) {
            result = result + this.serviceTypes[1] + ', ';
        }
        if (this.isElectrical_Selected) {
            result = result + this.serviceTypes[2] + ', ';
        }
        if (this.isAC_Selected) {
            result = result + this.serviceTypes[3] + ', ';
        }
        return result.slice(0, result.length - 2);
    }

    getSelectedServiceTypes(): Array<string> {
        const result = [];
        if (this.isCarpentry_Selected) {
            result.push(this.serviceTypes[0]);
        }
        if (this.isPlumbing_Selected) {
            result.push(this.serviceTypes[1]);
        }
        if (this.isElectrical_Selected) {
            result.push(this.serviceTypes[2]);
        }
        if (this.isAC_Selected) {
            result.push(this.serviceTypes[3]);
        }
        return result;
    }

    bookPackage() {
        const packageRequest = new PackageRequest();
        packageRequest.propertyType = this._propertyType;
        packageRequest.user_id = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
        packageRequest.services = this.getSelectedServiceTypes();
        if (this._visit === 'unlimited') {
            packageRequest.left = '0'; // no. of visits selected(if limited) or 0 (if unlimited)
        } else {
            packageRequest.left = this._visit.toString(); // no. of visits selected(if limited) or 0 (if unlimited)
        }

        if (this._visit === 'unlimited') {
            packageRequest.area = this.txtArea;
        } else {
            packageRequest.area = '0';
        }
        packageRequest.duration = this._duration;
        packageRequest.price = this.price;
        if (this.isAC_Selected) {
            packageRequest.num_ac = this.txtACCount;
        }

        if (this.authService.isAuthenticated()) {
            this.packageService.savePackage(packageRequest);
            this.router.navigate(['book-package']);
        } else {
            const modalContent: IModalContent = {
                header: 'Not Logged-in',
                body: 'You must logged-in to book a package. Press Yes to continue.',
                cancelButtonText: 'No',
                OKButtonText: 'Yes'
            };
            this.modalService.show(modalContent).then(result => {
                if (result === true) {
                    this.packageService.savePackage(packageRequest);
                    this.router.navigate(['book-package']);
                }
            });
        }
    }
}
