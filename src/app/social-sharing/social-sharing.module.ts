import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookComponent } from './facebook/facebook.component';

@NgModule({
  declarations: [FacebookComponent],
  imports: [
    CommonModule
  ], exports: [
    FacebookComponent
  ]
})
export class SocialSharingModule { }
