import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'img[default]',
    host: {
        '(error)': 'updateUrl()',
        '[src]': 'src'
    },
    standalone: false
})
export class DefaultImageDirective {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = this.default;
  }
}

