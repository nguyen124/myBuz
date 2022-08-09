import { AdsenseModule } from 'ng2-adsense';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';

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
import { CreateNodeComponent } from './createNode/createNode.component';

import { ErrorInterceptorService } from './shared/services/system/error-interceptor.service';
import { JQ_TOKEN } from './shared/services/jQuery.service';
import { ChildrenAuthGuard } from './shared/guard/childrenGuard';
import { ParentAuthGuard } from './shared/guard/parentGuard';
import { AdminAuthGuard } from './shared/guard/adminGuard';

import { DatePipe } from './shared/pipe/date.pipe';
import { KeyPipe } from './shared/pipe/key.pipe';
import { NumberPipe } from './shared/pipe/number.pipe';
import { routing } from './app.routing';
import { SaveLoginComponent } from './save-login/save-login.component';
import { CommentPicComponent } from './comment-box/comment-pic/comment-pic.component';
import { CommentVoiceComponent } from './comment-box/comment-voice/comment-voice.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ReplyToComponent } from './comment-box/reply-to/reply-to';
import { TooltipDirective } from './shared/directive/tooltip.directive';
import { MergeQueryParamsDirective } from './shared/directive/merge-query-params.directive';
import { FileValidatorDirective } from './shared/directive/file-validator.directive';
import { FileValueAccessor } from './upload/file-control-value-accessor';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { ImageMobileLinkPipe } from './shared/pipe/mobile-link.pipe';
import { DefaultImageDirective } from './shared/directive/default-image.directive';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ShareModule } from './shared/share/share.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { PlaceSearchComponent } from './place-search/place-search.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { UpdateItemComponent } from './update-item/update-item.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

let jQuery: any = window['$'];

@NgModule({
  declarations: [
    AppComponent,
    CommentComponent,
    CommentBoxComponent,
    CommentsComponent,
    CommentReactComponent,
    DatePipe,
    KeyPipe,    
    NumberPipe,
    ImageMobileLinkPipe,
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
    CreateNodeComponent,
    ReactComponent,
    RegisterComponent,
    ReportComponent,
    SaveLoginComponent,
    CommentPicComponent,
    CommentVoiceComponent,
    TooltipComponent,
    ReplyToComponent,
    TooltipDirective,
    MergeQueryParamsDirective,
    FileValueAccessor,
    FileValidatorDirective,
    ResetPasswordComponent,
    ResetPasswordFormComponent,
    DefaultImageDirective,
    PlaceSearchComponent,
    UpdateItemComponent
  ],
  entryComponents: [TooltipComponent],
  imports: [
    NgxMaskModule.forRoot(),
    ShareButtonsModule.withConfig({
      debug: true
    }),
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7640562161899788',
      adSlot: 7259870550,
    }),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animation: false
    }),
    BrowserAnimationsModule,
    BrowserModule,    
    FileUtils,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ShareButtonsModule,
    ShareIconsModule,
    UsersModule,
    AdminModule,
    ShareModule,
    ToastrModule.forRoot(),
    routing
  ],
  providers: [
    ChildrenAuthGuard,
    ParentAuthGuard,
    AdminAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: JQ_TOKEN, useValue: jQuery }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
