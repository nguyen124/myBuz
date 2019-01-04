import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ItemComponent } from './item/item.component';
import { FooterComponent } from './footer/footer.component';
import { ItemsComponent } from './items/items.component';
import { UserComponent } from './user/user.component';
import { FileUtils } from './utils/FileUtils';
import { DatePipe } from './date-pipe.pipe';
import { FilterComponent } from './filter/filter.component';
import { ItemService } from './services/item.services';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ItemComponent,
    FooterComponent,
    ItemsComponent,
    UserComponent,
    DatePipe,
    FilterComponent,
    CommentsComponent,
    LoginComponent,
    AdminComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FileUtils,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  providers: [ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
