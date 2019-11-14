import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ItemModalComponent } from './itemModal/itemModal.component';
import { FooterComponent } from './footer/footer.component';
import { ItemsComponent } from './items/items.component';
import { FileUtils } from './utils/FileUtils';
import { DatePipe } from './date-pipe.pipe';
import { FilterComponent } from './filter/filter.component';
import { ItemService } from './shared/services/item.services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { AlertComponent } from './alert/alert.component';
import { ErrorInterceptorService } from './shared/services/system/error-interceptor.service';
import { AuthService } from './shared/services/security/auth.service';
import { RegisterComponent } from './register/register.component';
import { routing } from './app.routing';
import { ParentAuthGuard } from './shared/guard/parentGuard';
import { ChildrenAuthGuard } from './shared/guard/childrenGuard';
import { ItemComponent } from './item/item.component';
import { ReactComponent } from './react/react.component';
import { CommunicateService } from './shared/services/utils/communicate.service';
import { CommentService } from './shared/services/comment.services';
import { CommentComponent } from './comment/comment.component';
import { VoiceMessageServiceService } from './shared/services/voice-message.service'
import { CommentReactComponent } from './comment-react/comment-react.component';
import { FocusDirective } from './focus.directive';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { UploadComponent } from './upload/upload.component';
import { MyItemsComponent } from './my-items/my-items.component';
import { JQ_TOKEN } from './shared/services/jQuery.service';
import { UserHomeComponent } from './user-home/user-home.component';
import { NgxSocialButtonModule, SocialServiceConfig } from "ngx-social-button";
import { SocialComponent } from './social/social.component';

let jQuery: any = window['$'];

// Configs
function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
    .addFacebook("2341935745914929")
    .addGoogle("255336538802-2o65hm0fv0ag6ds098lpa8118s9kdo43.apps.googleusercontent.com");
  return config;
}

@NgModule({
  declarations: [
    AdminComponent,
    AlertComponent,
    AppComponent,
    CommentComponent,
    CommentBoxComponent,
    CommentsComponent,
    CommentReactComponent,
    DatePipe,
    FilterComponent,
    FocusDirective,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    ItemComponent,
    ItemModalComponent,
    ItemsComponent,
    LoginComponent,
    UploadComponent,
    ReactComponent,
    RegisterComponent,
    MyItemsComponent,
    UserHomeComponent,
    SocialComponent
  ],
  imports: [
    BrowserModule,
    FileUtils,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxSocialButtonModule,
    ToastrModule.forRoot(),
    routing
  ],
  providers: [
    AuthService,
    CommunicateService,
    CommentService,
    ChildrenAuthGuard,
    ItemService,
    VoiceMessageServiceService,
    ParentAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: JQ_TOKEN, useValue: jQuery },
    {
      provide: SocialServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
