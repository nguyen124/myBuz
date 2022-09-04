import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GoogleSeoService {

  constructor(@Inject(DOCUMENT) private doc) { }

  async createLinkForCanonicalURL() {
    let link: HTMLLinkElement = this.doc.getElementById("canonicalId");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute("id", "canonicalId")
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', document.URL.split("?")[0]);
      this.doc.head.appendChild(link);
    } else {
      link.setAttribute('href', document.URL.split("?")[0]);
    }
  }
}
