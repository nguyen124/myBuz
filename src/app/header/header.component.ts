import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() languageEmitter: EventEmitter<any> = new EventEmitter();
  language: string = 'Tiếng Việt';
  constructor(public authSvc: AuthService, private _router: Router, private _translate: TranslateService) {
    this._translate.setDefaultLang('vn');
    this._translate.use('vn');
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
}
