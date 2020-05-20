import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'source[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class DefaultSourceDirective {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = this.default;
  }
}

