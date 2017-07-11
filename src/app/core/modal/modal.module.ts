import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';

@NgModule({
  imports: [CommonModule],
  exports: [ModalComponent],
  declarations: [ModalComponent],
  providers: [ModalService]
})
export class MyModalModule { }