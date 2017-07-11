import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalService, IModalContent } from '../../../core/modal/modal.service';
import { Address } from '../../../models';
import { AddressService, LocalStorageService } from '../../../providers';
import { GLOBAL_CONSTANTS } from '../../../global-constants';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  addressList: Array<Address>;
  loggedIUserId: string;
  message: string;

  constructor(
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
    private router: Router,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {
    this.loggedIUserId = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    this.addressService.getAllAddress(this.loggedIUserId)
      .then(res => {
        this.addressList = res;
      });

  }
  addAddress(): void {
    this.router.navigate(['account/add-address']);
  }

  deleteAddress(addr_id): void {
    const modalContent: IModalContent = {
      header: 'Delete Address?',
      body: 'Are you sure want to delete this address?',
      cancelButtonText: 'No',
      OKButtonText: 'Yes'
    };
    this.modalService.show(modalContent)
      .then(result => {
        if (result === true) {
          this.addressService.removeAddress(this.loggedIUserId, addr_id)
            .subscribe(res => {
              this.message = res;
              if (res === 'deleted') {
                // this.message = res; // 'Address deleted successfully.';
              }
            });
        }
      });

  }
}
