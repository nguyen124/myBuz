import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policy-eu',
  templateUrl: './policy-eu.component.html',
  styleUrls: ['./policy-eu.component.css']
})
export class PolicyEuComponent implements OnInit, AfterViewChecked {

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
