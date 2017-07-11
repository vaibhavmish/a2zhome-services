import { Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';

import { CarouselComponent, Direction } from './carousel.component';

@Component({
    selector: 'app-slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit, OnDestroy {
    @Input() public index: number;
    @Input() public direction: Direction;

    @HostBinding('class.active')
    @Input() public active: boolean;

    @HostBinding('class.item')
    @HostBinding('class.carousel-item')
    private addClass = true;

    constructor(private carouselComponent: CarouselComponent) {
    }

    public ngOnInit() {
        this.carouselComponent.addSlide(this);
    }

    public ngOnDestroy() {
        this.carouselComponent.removeSlide(this);
    }
}

