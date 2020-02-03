import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyTermRoutingModule } from './policy-term-routing.module';
import { PolicyComponent } from './policy/policy.component';
import { PolicyEuComponent } from './policy-eu/policy-eu.component';
import { PolicyCaComponent } from './policy-ca/policy-ca.component';
import { DoNotSellComponent } from './do-not-sell/do-not-sell.component';



@NgModule({
  declarations: [
    PolicyComponent,
    PolicyEuComponent,
    PolicyCaComponent,
    DoNotSellComponent
  ],
  imports: [
    CommonModule,
    PolicyTermRoutingModule
  ],
  exports: [

  ]
})
export class PolicyTermModule { }
