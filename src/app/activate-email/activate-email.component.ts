import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user-service.service';

@Component({
  selector: 'app-activate-email',
  templateUrl: './activate-email.component.html',
  styleUrls: ['./activate-email.component.css']
})
export class ActivateEmailComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private _userSvc: UserService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      var hashStatus = params['hashStatus'];
      this._userSvc.activateEmail(hashStatus).subscribe((ok) => {
        this.router.navigate(['/login']);
      })
    });
  }
}
