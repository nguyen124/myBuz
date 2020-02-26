import { AdsenseModule } from 'ng2-adsense';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ToastrModule } from 'ngx-toastr';
import { UsersModule } from './users/users.module';

import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { CommentComponent } from './comment/comment.component';
import { CommentReactComponent } from './comment-react/comment-react.component';
import { CommentsComponent } from './comments/comments.component';
import { FileUtils } from './utils/FileUtils';
import { FilterComponent } from './filter/filter.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ItemComponent } from './item/item.component';
import { ItemModalComponent } from './itemModal/itemModal.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import { MyItemsComponent } from './my-items/my-items.component';
import { NotificationComponent } from './notification/notification.component';
import { ReactComponent } from './react/react.component';
import { RegisterComponent } from './register/register.component';
import { ReportComponent } from './report/report.component';
import { UploadComponent } from './upload/upload.component';

import { AuthService } from './shared/services/security/auth.service';
import { CommentService } from './shared/services/comment.services';
import { CommunicateService } from './shared/services/utils/communicate.service';
import { ErrorInterceptorService } from './shared/services/system/error-interceptor.service';
import { ItemService } from './shared/services/item.services';
import { NotificationService } from './shared/services/notification.service';
import { VoiceMessageServiceService } from './shared/services/voice-message.service'
import { JQ_TOKEN } from './shared/services/jQuery.service';

import { ChildrenAuthGuard } from './shared/guard/childrenGuard';
import { ParentAuthGuard } from './shared/guard/parentGuard';

import { DatePipe } from './date-pipe.pipe';

import { routing } from './app.routing';
import { SaveLoginComponent } from './save-login/save-login.component';
import { CommentPicComponent } from './comment-box/comment-pic/comment-pic.component';
import { CommentVoiceComponent } from './comment-box/comment-voice/comment-voice.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ReplyToComponent } from './comment-box/reply-to/reply-to';
import { TooltipDirective } from './shared/directive/tooltip.directive';

let jQuery: any = window['$'];

@NgModule({
  declarations: [
    AdminComponent,
    AppComponent,
    CommentComponent,
    CommentBoxComponent,
    CommentsComponent,
    CommentReactComponent,
    DatePipe,
    FilterComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    ItemComponent,
    ItemModalComponent,
    ItemsComponent,
    LoginComponent,
    MyItemsComponent,
    NotificationComponent,
    UploadComponent,
    ReactComponent,
    RegisterComponent,
    ReportComponent,
    SaveLoginComponent,
    CommentPicComponent,
    CommentVoiceComponent,
    TooltipComponent,
    ReplyToComponent,
    TooltipDirective
  ],
  entryComponents: [TooltipComponent],
  imports: [
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7640562161899788',
      adSlot: 7259870550,
    }),
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FileUtils,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ShareButtonsModule,
    UsersModule,
    ToastrModule.forRoot(),
    routing
  ],
  providers: [
    AuthService,
    CommunicateService,
    CommentService,
    ChildrenAuthGuard,
    ItemService,
    NotificationService,
    ParentAuthGuard,
    VoiceMessageServiceService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: JQ_TOKEN, useValue: jQuery }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
