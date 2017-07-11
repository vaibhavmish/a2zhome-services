import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DatepickerModule } from 'ngx-bootstrap';

import { AccountRoutingModule } from './account-routing.module';
import { LoadingModule } from './../../core/loading/loading.module';
import { UserService } from './user.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DatepickerModule.forRoot(),
        LoadingModule,
        AccountRoutingModule
    ],
    declarations: [AccountRoutingModule.components],
    providers: [
        UserService
    ]
})
export class AccountModule { }