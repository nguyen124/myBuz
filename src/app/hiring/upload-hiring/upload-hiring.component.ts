import { Component, OnInit, Inject, isDevMode, ViewChild, ElementRef, } from '@angular/core';

import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from 'src/app/shared/services/utils/system.service';
import { CommunicateService } from 'src/app/shared/services/utils/communicate.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { AuthService } from 'src/app/shared/services/security/auth.service';
import { GoogleMapService } from 'src/app/shared/services/google-map.service';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/services/system/logging.service';
import { JQ_TOKEN } from 'src/app/shared/services/jQuery.service';
import { FileValidatorDirective } from 'src/app/shared/directive/file-validator.directive';
import { environment } from '../../../environments/environment';
import { environment as prodEnvironment } from '../../../environments/environment.prod';
declare var firebase: any;
declare var google: any;

@Component({
  selector: 'app-upload-hiring',
  templateUrl: './upload-hiring.component.html',
  styleUrls: ['./upload-hiring.component.css']
})
export class UploadHiringComponent implements OnInit {
  parsedTags: string[] = [];
  itemForm: FormGroup;
  submitted = false;
  isUploading = false;
  uploadingProgress: number;
  today = new Date();
  destination: string = "";
  filesArr: File[] = [];
  toUploadFiles: any[] = [];
  currentUploadTasks: any[] = [];
  geometry: any;
  paymentHandler = null;
  charge = null;
  countryRestrict: any = { country: 'us' };
  autocompleteAddress: any;

  @ViewChild('autoAddress', { static: false }) autoAddress: ElementRef;
  @ViewChild('address2', { static: false }) address2: ElementRef;

  constructor(
    private _systemSvc: SystemService,
    private _commSvc: CommunicateService,
    private _toastr: ToastrService,
    private _checkoutSvc: CheckoutService,
    private _router: Router,
    private _fb: FormBuilder,
    private _authSvc: AuthService,
    private _apiService: GoogleMapService,
    private _translate: TranslateService,
    private _logSvc: LoggingService,
    @Inject(JQ_TOKEN) private $: any) {

  }

  ngAfterViewInit() {
    this._apiService.api.then((maps) => {
      this.buildAutoCompleteAddressForm();
    });
  }

  ngOnInit() {
    this.invokeStripe();
    this.initForm();
    this.destination = this.today.getFullYear() + "/" + this.today.getMonth() + "/" + this.today.getDate() + "/" + this._authSvc.user.username + "/";
  }

  buildAutoCompleteAddressForm() {
    this.autocompleteAddress = new google.maps.places.Autocomplete(
      this.autoAddress.nativeElement,
      {
        componentRestrictions: this.countryRestrict
      }
    );
    this.autocompleteAddress.addListener('place_changed', this.autoFillAddress);
  }

  autoFillAddress = () => {
    let that = this;
    // Get the place details from the autocomplete object.
    const place = that.autocompleteAddress.getPlace();
    this.geometry = place.geometry;
    let address1 = "";
    let postcode = "";
    let city = "";
    let state = "";
    let country = "";
    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    for (const component of place.address_components as any[]) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`; break;
        }
        case "route": {
          address1 += component.short_name; break;
        }
        case "postal_code": {
          postcode = `${component.long_name}${postcode}`; break;
        }
        // case "postal_code_suffix": {
        //   postcode = `${postcode}-${component.long_name}`;
        //   break;
        // }
        case "locality":
          city = component.long_name; break;
        case "administrative_area_level_1":
          state = component.short_name; break;
        case "country":
          country = component.long_name; break;
      }
    }

    that.f.address.setValue(address1);
    that.f.zipcode.setValue(postcode);
    that.f.city.setValue(city);
    that.f.state.setValue(state);
    that.f.country.setValue(country);

    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line to encourage
    // entry of subpremise information such as apartment, unit, or floor number.
    this.address2.nativeElement.focus();
  }

  initForm() {
    this.itemForm = this._fb.group({
      title: ['', [Validators.pattern(/^.{5,50}$/), this._systemSvc.nonSpaceString]],
      businessName: ['', [Validators.pattern(/^.{1,50}$/), this._systemSvc.nonSpaceString]],
      file: ['', [FileValidatorDirective.validate, this._systemSvc.checkFileMaxSize]],
      categories: ['Nail_Salon'],
      tags: [''],
      price: [0, [Validators.min(0)]],
      address: ['', [Validators.pattern(/^.{1,50}$/), this._systemSvc.nonSpaceString]],
      address2: ['', [Validators.pattern(/^.{0,50}$/)]],
      zipcode: ['', [Validators.pattern(/^.{1,10}$/), this._systemSvc.nonSpaceString]],
      city: ['', [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
      state: ['', [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
      country: ['', [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
      noOfEmployees: [0, [Validators.min(0)]],
      noOfChairs: [0, [Validators.min(0)]],
      noOfTables: [0, [Validators.min(0)]],
      contactPhoneNo: ['', []],
      contactEmail: ['', [this._systemSvc.validateEmail, this._systemSvc.nonSpaceString, Validators.pattern(/^.{0,50}$/)]],
      income: [0, [Validators.min(0)]],
      rentCost: [0, [Validators.min(0)]],
      otherCost: [0, [Validators.min(0)]],
      leaseEnd: [''],
      yearOld: [1],
      area: [0, [Validators.min(0)]],
      description: ['', [Validators.pattern(/^[\s\S]{0,1000}$/)]],
      overview: ['', [Validators.pattern(/^[\s\S]{0,180}$/)]],
      duration: [1]
    });
  }

  get f() { return this.itemForm.controls; }

  checkError(field: string) {
    return this._systemSvc.checkError(this.itemForm, field, this.submitted);
  }

  handleFileInput(files: FileList) {
    let fileArr = [],
      that = this;
    for (let idx = 0; idx < files.length; idx++) {
      fileArr.push(files[idx]);
    }
    if (this.toUploadFiles && this.toUploadFiles.length) {
      this.itemForm.controls.file.setValue(true);
    }

    fileArr.forEach(toUploadFile => {
      if (toUploadFile) {
        let reader = new FileReader();
        reader.onload = function (e) {
          that.toUploadFiles.push({
            url: e.target["result"],
            fileType: toUploadFile.type,
            pathName: that.destination + toUploadFile.name
          });
        }
        reader.readAsDataURL(toUploadFile);
      }
    });
  }

  onTagsChange(input) {
    this.parsedTags = input.split(/[ ,;.\/\\]+/).slice(0, 5).filter(el => el.length != 0);
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51LSD2fJbUrktT3xj6s57seUsslyiQidJwLpl63lEeqjZN1XNh2PsVuCNncoRTqOSKElEWkU5s8JhHW4vPaAUU8VT00PnJIt8pz',
          locale: 'auto',
          token: function (stripeToken: any) {
            this._logSvc.log(stripeToken);
          }
        });
      };
      window.document.body.appendChild(script);
    }
  }

  createPost() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }
    this.makePayment(this.f.duration.value);
  }

  makePayment(duration: string) {
    let that = this;
    let cost = 0;
    let description = "";
    duration += "";
    switch (duration) {
      case "1":
        cost = 20;
        description = "Tạo Quảng Cáo Cho 1 Tháng";
        break;
      case "3":
        cost = 40;
        description = "Tạo Quảng Cáo Cho 3 Tháng";
        break;
      case "6":
        cost = 60;
        description = "Tạo Quảng Cáo Cho 6 Tháng";
        break;
      case "12":
        cost = 80;
        description = "Tạo Quảng Cáo Cho 12 Tháng";
        break;
    }
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51LSD2fJbUrktT3xj6s57seUsslyiQidJwLpl63lEeqjZN1XNh2PsVuCNncoRTqOSKElEWkU5s8JhHW4vPaAUU8VT00PnJIt8pz',
      locale: 'auto',
      token: function (stripeToken: any) {
        that._checkoutSvc.makePayment({ duration, stripeToken }).subscribe((data: any) => {
          if (data.status === "success") {
            that.charge = data.charge;
            that.startPostingAfterChargeSuccessfully();
          }
        });
      }
    });
    paymentHandler.open({
      name: 'Me2Meme',
      description: description,
      amount: cost * 100
    });
  }

  startPostingAfterChargeSuccessfully() {
    let uploadedResults = [];
    let that = this;
    let storage = firebase.storage().ref();
    this.toUploadFiles.forEach(file => {
      let storageRef = storage.child(file.pathName);
      let uploadTask = storageRef.putString(file.url, 'data_url', {
        contentType: file.fileType,
      });
      this.currentUploadTasks.push(uploadTask);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot: any) => {
          that.handleSnapshot(snapshot, that);
        },
        (error: any) => {
          that.handleFirebaseUploadError(error, that);
          that.cancelCharge(that);
        },
        () => {
          that.handleSuccess(uploadTask, uploadedResults, that);
        }
      );
    });
  }

  cancelCharge(that) {
    if (that.charge) {
      that._checkoutSvc.refund({ chargeId: that.charge.id }).subscribe(data => {
        that.charge = null;
      });
    }
  }

  handleSnapshot(snapshot, that) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    that.isUploading = true;
    that.uploadingProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    // this._toastr.info('Upload is ' + this.uploadingProgress + '% done');

    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        that._toastr.info(this._translate.instant("item.update.validate.uploadingPaused"));
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        //this._toastr.info('Upload is running');
        break;
    }
  }

  handleSuccess(uploadTask, uploadedResults, that) {
    // Upload completed successfully, now we can get the download URL
    that.isUploading = false;
    that._toastr.success(this._translate.instant("uploading.validate.success"));
    // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL: string) => {

    // });
    let bucketName = isDevMode() ? environment.bucketname : prodEnvironment.bucketname;
    let downloadURL = 'https://storage.googleapis.com/' + bucketName + '/' + uploadTask.snapshot.metadata.fullPath;

    uploadedResults.push({
      url: downloadURL,
      filename: uploadTask.snapshot.metadata.fullPath,
      fileType: uploadTask.snapshot.metadata.contentType
    });

    if (uploadedResults.length == that.toUploadFiles.length) {
      let item = {
        tags: that.parsedTags,
        categories: [that.f.categories.value],
        title: that.f.title.value.trim(),
        businessName: that.f.businessName.value.trim(),
        price: that.f.price.value,
        address: that.f.address.value.trim(),
        address2: that.f.address2.value.trim(),
        zipcode: that.f.zipcode.value.trim(),
        city: that.f.city.value.trim(),
        state: that.f.state.value.trim(),
        country: that.f.country.value.trim(),
        noOfEmployees: that.f.noOfEmployees.value,
        noOfChairs: that.f.noOfChairs.value,
        noOfTables: that.f.noOfTables.value,
        contactPhoneNo: that.f.contactPhoneNo.value,
        contactEmail: that.f.contactEmail.value.trim(),
        income: that.f.income.value,
        rentCost: that.f.rentCost.value,
        otherCost: that.f.otherCost.value,
        leaseEnd: that.f.leaseEnd.value,
        yearOld: that.f.yearOld.value,
        area: that.f.area.value,
        duration: +that.f.duration.value,
        description: that.f.description.value == null ? '' : that.f.description.value.trim(),
        files: uploadedResults,
        overview: that.f.overview.value == null ? '' : that.f.overview.value.trim(),
        charge: that.charge,
        geometry: that.geometry
      };
      //append charge info into item

      that._itemSvc.createItem(item).subscribe((newItem: any) => {
        that._toastr.success(this._translate.instant("item.upload.validate.success"));
        that._router.navigate(["/user/business"]);
      }, (err: any) => {
        that.cancelCharge(that);
        that.handleError(err, that);
      });
    }
  }

  handleFirebaseUploadError(error, that) {
    that.isUploading = false;
    // Errors list: https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        that._toastr.error(this._translate.instant("item.update.validate.storageUnauthorized"));
        break;

      case 'storage/canceled':
        that._toastr.error(this._translate.instant("item.update.validate.uploadCancel"));
        break;

      case 'storage/unknown':
        that._toastr.error(this._translate.instant("item.update.validate.unknownError"));
        break;
    }
  }

  handleError(err, that) {
    that._toastr.error(this._translate.instant("item.upload.validate.error"));
    this._logSvc.log(err);
  }

  goBackToHomePage() {
    this._router.navigate(["/business"]);
  }

  removePreviewMedia(index) {
    this.toUploadFiles.splice(index, 1);
    return false;
  }

}
