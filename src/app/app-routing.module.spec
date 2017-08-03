import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalModule, DatepickerModule, TimepickerModule, AlertModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule, routes, RoutedComponents, SubComponents } from './app-routing.module';

import { FilterByPipe, TitleCasePipe, TrimPipe } from './pipes';

const pipes = [FilterByPipe, TitleCasePipe, TrimPipe];

describe('Router: App', () => {
    let location: Location;
    let router: Router;
    const fixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                ModalModule.forRoot(),
                DatepickerModule.forRoot(),
                TimepickerModule.forRoot(),
                AlertModule.forRoot(),
                RouterTestingModule.withRoutes(routes)
            ],
            declarations: [
                AppComponent,
                SubComponents,
                RoutedComponents,
                pipes
            ]
        });

        router = TestBed.get(Router);
        location = TestBed.get(location);

        // fixture = TestBed.createComponent(AppComponent);
        // router.initialNavigation();
    });

    it('fakeAsync works', fakeAsync(() => {
        const promise = new Promise((resolve) => {
            setTimeout(resolve, 10);
        });
        let done = false;
        promise.then(() => done = true);
        tick(50);
        expect(done).toBeTruthy();
    }));

    // it('it navigate to "signin" redirects you to /signin', fakeAsync(() => {
    //     router.navigate(['']);
    //     tick(50);
    //     expect(location.path()).toBe('/signin');
    // }));

});