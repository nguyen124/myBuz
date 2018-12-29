import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ItemComponent } from './item/item.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { ItemsComponent } from './items/items.component';
import { UserComponent } from './user/user.component';
import { FileUtils } from './utils/FileUtils';
import { DatePipe } from './date-pipe.pipe';
import { FilterComponent } from './filter/filter.component';
import { ItemService } from './services/item.services';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ItemComponent,
    FooterComponent,
    BodyComponent,
    ItemsComponent,
    UserComponent,
    DatePipe,
    FilterComponent
  ],
  imports: [
    BrowserModule, FormsModule, FileUtils, HttpClientModule
  ],
  providers: [ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
