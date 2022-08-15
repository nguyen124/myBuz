import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiringItemsComponent } from './hiring-items/hiring-items.component';
import { HiringRoutingModule } from './hiring-routing.module';
import { UploadHiringComponent } from './upload-hiring/upload-hiring.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [
    HiringItemsComponent,
    UploadHiringComponent
  ],
  imports: [
    CommonModule,
    HiringRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ]
})
export class HiringModule { }
