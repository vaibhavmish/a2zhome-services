import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';


import { MyModalModule } from './core/modal/modal.module';
import { Modal2Module } from './core/modal2/modal2.module';
import { LoadingModule } from './core/loading/loading.module';
import { ModalModule, DatepickerModule, TimepickerModule, AlertModule } from 'ngx-bootstrap';


import { ConsoleLogService } from './logger/log.service';
import { Logger } from './logger/default-log.service';

import { AppComponent } from './app.component';
import { AppRoutingModule, RoutedComponents, SubComponents } from './app-routing.module';

import { FilterByPipe, TitleCasePipe, TrimPipe } from './pipes';

const pipes = [FilterByPipe, TitleCasePipe, TrimPipe];

import { MultiSelectComponent } from './components/multi-select/multi-select.component';

import { providers } from './app.providers';
import { AppConfigService } from './providers';

export function loadConfig(context: AppConfigService) {
    return () => context.load();
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        MyModalModule,
        Modal2Module,
        LoadingModule,
        AppRoutingModule,
        ModalModule.forRoot(),
        DatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        AlertModule.forRoot()
    ],
    declarations: [
        AppComponent,
        SubComponents,
        RoutedComponents,
        pipes
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [AppConfigService],
            multi: true
        },
        {
            provide: Logger,
            useClass: ConsoleLogService
        },
        providers
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
