import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { TopMenuComponent } from './component/top-menu/top-menu.component';


import { ServiceAPIs } from './services/service-apis.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TopMenuComponent
  ],
  exports: [
    TopMenuComponent
  ],
  providers: [ServiceAPIs],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class CoreModule { }
