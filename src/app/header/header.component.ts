import { Component, EventEmitter, isDevMode, Output } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent {

  readonly PER_PAGE: number = isDevMode() ? environment.ITEM_PER_PAGE : prodEnvironment.ITEM_PER_PAGE;

  @Output() languageEmitter: EventEmitter<any> = new EventEmitter();
  language: string = 'Tiếng Việt';
  isShowingSecondTopHeader: boolean = false;
  constructor(
    public authSvc: AuthService,
    private _router: Router,
    private _translate: TranslateService,
    private _commSvc: CommunicateService
  ) {
    this._translate.setDefaultLang('vn');
    this._translate.use('vn');
    this._router.events.subscribe((val: any) => {
      if (val instanceof NavigationStart) {
        if (val.url) {
          let splits = val.url.split("?");
          if (splits.length > 0) {
            switch (splits[0]) {
              case '/business/forSale': {
                this.isShowingSecondTopHeader = true;
                this._commSvc.setFlag(true, false, false);
                return;
              }
              case '/business/hiring': {
                this.isShowingSecondTopHeader = true;
                this._commSvc.setFlag(false, true, false);
                return;
              }
              case '/business/other': {
                this.isShowingSecondTopHeader = true;
                this._commSvc.setFlag(false, false, true);
                return;
              }
              default:
                this.isShowingSecondTopHeader = false;
                return;
            }
          }
        }
      }
    });
  }

  logout() {
    this.authSvc.logout().subscribe(
      data => { this._router.navigate(["/"]) },
      err => { }
    );
  }

  useLanguage(value: string) {
    this.language = value === 'en' ? 'English' : 'Tiếng Việt';
    this.languageEmitter.emit(value);
  }

  setFlag(flag1: boolean, flag2: boolean, flag3: boolean) {
    this._commSvc.setFlag(flag1, flag2, flag3);
  }

  get businessForSaleActive(): boolean {
    return this._commSvc.businessForSaleActive;
  }

  get hiringActive(): boolean {
    return this._commSvc.hiringActive;
  }

  get otherForSaleActive(): boolean {
    return this._commSvc.otherForSaleActive;
  }
}
