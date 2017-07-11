import { NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { Rating } from './index';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        Rating
    ],
    exports: [
        Rating
    ],
})
export class RatingModule {}