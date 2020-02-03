import { NgModule } from '@angular/core';
import { PolicyComponent } from './policy/policy.component';
import { Routes, RouterModule } from '@angular/router';
import { PolicyEuComponent } from './policy-eu/policy-eu.component';
import { PolicyCaComponent } from './policy-ca/policy-ca.component';

const routes: Routes = [
  {
    path: 'policy',
    component: PolicyComponent
  },
  {
    path: 'policy-eu',
    component: PolicyEuComponent
  }, {
    path: 'policy-ca',
    component: PolicyCaComponent
  }
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PolicyTermRoutingModule { }
