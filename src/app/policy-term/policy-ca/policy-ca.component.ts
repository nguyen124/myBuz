import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policy-ca',
  templateUrl: './policy-ca.component.html',
  styleUrls: ['./policy-ca.component.css']
})
export class PolicyCaComponent implements OnInit, AfterViewChecked {
  fragment: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewChecked(): void {
    try {
      if (this.fragment) {
        document.querySelector('#' + this.fragment).scrollIntoView();
      }
    } catch (e) { }
  }
}
