// import { Injectable } from '@angular/core';
// import { Title, Meta } from '@angular/platform-browser';
// import { MetaTag } from '../model/meta-tag';

// @Injectable({
//     providedIn: 'root'
// })
// export class MetaTagService {

//     //private urlMeta: string = "og:url";
//     private titleMeta: string = "og:title";
//     private imageMeta: string = "og:image";
//     //private imageWidth: string = "og:image:width";
//     //private imageHeight: string = "og:image:height";
//     private descriptionMeta: string = "og:description";
//     //private secureImageMeta: string = "og:image:secure_url";

//     private twitterCard: string = "twitter:card";
//     private twitterImageMeta: string = "twitter:image";
//     private twitterTitleMeta: string = "twitter:title";
//     private twitterDescription: string = "twitter:description";

//     constructor(private titleService: Title, private metaService: Meta) { }

//     public setTitle(title: string): void {
//         this.titleService.setTitle(title);
//     }

//     public setSocialMediaTags(url, title: string, description: string, imageUrl: string): void {
//         //new MetaTag(this.urlMeta, url, true),
//         //new MetaTag(this.imageWidth, "600", true),
//         //new MetaTag(this.imageHeight, "314", true),
//         //new MetaTag(this.secureImageMeta, imageUrl, true),
//         var tags = [
//             new MetaTag(this.titleMeta, title, true),
//             new MetaTag(this.imageMeta, imageUrl, true),
//             new MetaTag(this.descriptionMeta, description, true),
//             new MetaTag(this.twitterCard, "summary_large_image", false),
//             new MetaTag(this.twitterTitleMeta, title, false),
//             new MetaTag(this.twitterImageMeta, imageUrl, false),
//             new MetaTag(this.twitterDescription, description, false)
//         ];
//         this.setTags(tags);
//     }

//     private setTags(tags: MetaTag[]): void {
//         tags.forEach(siteTag => {
//             const tag = siteTag.isFacebook ? this.metaService.getTag(`property='${siteTag.name}'`) : this.metaService.getTag(`name='${siteTag.name}'`);
//             if (siteTag.isFacebook) {
//                 this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
//             } else {
//                 this.metaService.updateTag({ name: siteTag.name, content: siteTag.value });
//             }
//         });
//     }
// }
