import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ItemModalComponent } from './itemModal/itemModal.component';
import { FooterComponent } from './footer/footer.component';
import { ItemsComponent } from './items/items.component';
import { UserComponent } from './user/user.component';
import { FileUtils } from './utils/FileUtils';
import { DatePipe } from './date-pipe.pipe';
import { FilterComponent } from './filter/filter.component';
import { ItemService } from './services/item.services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { AlertComponent } from './alert/alert.component';
import { ErrorInterceptorService } from './services/system/error-interceptor.service';
import { JwtInterceptorService } from './services/utils/jwt-interceptor.service';
import { AuthService } from './services/security/auth.service';
import { RegisterComponent } from './register/register.component';
import { routing } from './app.routing';
import { ParentAuthGuard } from './guard/parentGuard';
import { ChildrenAuthGuard } from './guard/childrenGuard';
import { ItemComponent } from './item/item.component';
import { ReactComponent } from './react/react.component';
import { CommunicateService } from './services/utils/communicate.service';
import { CommentService } from './services/comment.services';
import { CommentComponent } from './comment/comment.component';
import { VoiceMessageServiceService } from './services/voice-message.service'
import { CommentReactComponent } from './comment-react/comment-react.component';
import { FocusDirective } from './focus.directive';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { UploadComponent } from './upload/upload.component';
import { MyItemsComponent } from './my-items/my-items.component';

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
    UserComponent,
    ReactComponent,
    RegisterComponent,
    MyItemsComponent
  ],
  imports: [
    BrowserModule,
    FileUtils,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
