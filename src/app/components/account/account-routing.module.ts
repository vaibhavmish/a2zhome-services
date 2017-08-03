import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        children: [
            { path: 'profile', component: ProfileComponent }, 
            { path: 'change-password', component: ChangePasswordComponent }, 
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {
    static components = [AccountComponent, ProfileComponent, AddressesComponent, AddAddressComponent,ChangePasswordComponent];
}
