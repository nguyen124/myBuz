import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyTermRoutingModule } from './policy-term-routing.module';
import { PolicyComponent } from './policy/policy.component';
import { PolicyEuComponent } from './policy-eu/policy-eu.component';
import { PolicyCaComponent } from './policy-ca/policy-ca.component';
import { DoNotSellComponent } from './do-not-sell/do-not-sell.component';
import { TosComponent } from './tos/tos.component';
import { RulesComponent } from './rules/rules.component';
import { ReferencesComponent } from './references/references.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [
    PolicyComponent,
    PolicyEuComponent,
    PolicyCaComponent,
    DoNotSellComponent,
    TosComponent,
    RulesComponent,
    ReferencesComponent
  ],
  imports: [
    CommonModule,
    PolicyTermRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [

  ]
})
export class PolicyTermModule { }
