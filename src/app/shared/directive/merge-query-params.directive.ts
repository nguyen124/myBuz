import { Directive, Input, OnInit } from '@angular/core';
import { RouterLinkWithHref, ActivatedRoute } from '@angular/router';

@Directive({
  selector: 'a[routerLink][merge]'
})
export class MergeQueryParamsDirective implements OnInit {

  @Input() queryParms: { [k: string]: any };
  @Input() preserveQueryParams: boolean;

  constructor(private link: RouterLinkWithHref, private route: ActivatedRoute) {

  }

  public ngOnInit(): void {
    this.link.queryParams = Object.assign(Object.assign({}, this.route.snapshot.queryParams), this.link.queryParams);
  }

}
