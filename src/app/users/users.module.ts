import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UserHomeComponent } from './user-home/user-home.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UserHomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    UsersRoutingModule
  ],
  exports: [

  ]
})
export class UsersModule { }
