import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  PER_PAGE = 40;

  @Output() languageEmitter: EventEmitter<any> = new EventEmitter();
  language: string = 'Tiếng Việt';
  constructor(
    public authSvc: AuthService,
    private _router: Router,
    private _translate: TranslateService,
    private _commSvc: CommunicateService
  ) {
    this._translate.setDefaultLang('vn');
    this._translate.use('vn');
    this._router.events.subscribe((val: any) => {
      if (val && val.route) {
        switch (val.route.path) {
          case 'business': this._commSvc.setFlag(true, false, false); return;
          case 'hiring': this._commSvc.setFlag(false, true, false); return;
          case 'sale': this._commSvc.setFlag(false, false, true); return;
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

  get itemsActive(): boolean {
    return this._commSvc.itemsActive;
  }

  get hiringActive(): boolean {
    return this._commSvc.hiringActive;
  }

  get saleActive(): boolean {
    return this._commSvc.saleActive;
  }

  getPostLink() {
    if (this.itemsActive) return "/business/post";
    if (this.hiringActive) return "/hiring/post"
  }
}
