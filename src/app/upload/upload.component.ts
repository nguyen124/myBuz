import { Component, OnInit, Inject, isDevMode, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { Router } from '@angular/router';
import { SystemService } from '../shared/services/utils/system.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { FileValidatorDirective } from '../shared/directive/file-validator.directive';
import { AuthService } from '../shared/services/security/auth.service';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';
import { CheckoutService } from '../shared/services/checkout.service';
import { GoogleMapService } from '../shared/services/google-map.service';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from '../shared/services/system/logging.service';
import { RenderService } from '../shared/services/utils/render.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Editor, Toolbar } from 'ngx-editor';

declare var firebase: any;
declare var google: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy, AfterViewInit {
  MAX_ALLOWED_FILES: number = 10;
  parsedTags: string[] = [];
  itemForm: UntypedFormGroup;
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
  autocompleteZipcode: any;
  needsOption = [];
  needsMap: any = {};
  categoriesMap: any = {};
  editor: Editor;
  tooManyFilesError = false;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  @ViewChild('autoAddress', { static: false }) autoAddress: ElementRef;
  @ViewChild('autoZipcode', { static: false }) autoZipcode: ElementRef;
  @ViewChild('phone', { static: false }) phone: ElementRef;

  constructor(
    private _itemSvc: ItemService,
    private _systemSvc: SystemService,
    private _commSvc: CommunicateService,
    private _toastr: ToastrService,
    private _checkoutSvc: CheckoutService,
    private _router: Router,
    private _fb: UntypedFormBuilder,
    private _authSvc: AuthService,
    private _apiService: GoogleMapService,
    private _translate: TranslateService,
    private _logSvc: LoggingService,
    private _renderSvc: RenderService,
    private recaptchaV3Service: ReCaptchaV3Service,
    @Inject(JQ_TOKEN) private $: any) {

  }

  ngAfterViewInit() {
    this._apiService.api.then((maps) => {
      this.buildAutoCompleteAddressForm();
    });
  }

  ngOnInit() {
    this.editor = new Editor();
    this.invokeStripe();
    this.initForm();
    this.destination = this.today.getFullYear() + "/" + this.today.getMonth() + "/" + this.today.getDate() + "/" + this._authSvc.user.username + "/";
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  buildAutoCompleteAddressForm() {
    this.autocompleteAddress = new google.maps.places.Autocomplete(
      this.autoAddress.nativeElement,
      {
        componentRestrictions: this.countryRestrict
      }
    );
    this.autocompleteZipcode = new google.maps.places.Autocomplete(
      this.autoZipcode.nativeElement,
      {
        componentRestrictions: this.countryRestrict
      }
    );
    this.autocompleteAddress.addListener('place_changed', this.autoFillAddress);
    this.autocompleteZipcode.addListener('place_changed', this.autoFillAddress2);
  }

  autoFillAddress = () => {
    // Get the place details from the autocomplete object.
    const place = this.autocompleteAddress.getPlace();
    this.fill(place);
  }

  autoFillAddress2 = () => {
    // Get the place details from the autocomplete object.
    const place = this.autocompleteZipcode.getPlace();
    this.fill(place);
  }

  fill(place) {
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
          address1 = component.long_name; break;
        }
        case "route": {
          address1 = (address1 !== "") ? (address1 + ' ' + component.long_name) : component.long_name; break;
        }
        case "postal_code": {
          postcode = component.long_name; break;
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

    this.f.address.setValue(address1);
    this.f.zipcode.setValue(postcode);
    this.f.city.setValue(city);
    this.f.state.setValue(state);
    this.f.country.setValue(country);

    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line to encourage
    // entry of subpremise information such as apartment, unit, or floor number.
    this.phone.nativeElement.focus();
  }

  initForm() {
    this.itemForm = this._fb.group({
      title: ['', [Validators.pattern(/^.{5,100}$/), this._systemSvc.nonSpaceString]],
      businessName: ['', [Validators.pattern(/^.{1,50}$/), this._systemSvc.nonSpaceString]],
      file: ['', [FileValidatorDirective.validate, this._systemSvc.checkFileMaxSize]],
      categories: ['', [Validators.required]],
      needs: [[], [Validators.required]],
      tags: [''],
      price: [0, [Validators.min(0)]],
      wage: [0, [Validators.min(0)]],
      address: ['', [Validators.pattern(/^.{0,100}$/)]],
      address2: ['', [Validators.pattern(/^.{0,50}$/)]],
      zipcode: ['', [Validators.pattern(/^.{1,10}$/), this._systemSvc.nonSpaceString]],
      city: ['', [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
      state: ['', [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
      country: ['', [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
      noOfEmployees: [0, [Validators.min(0)]],
      noOfChairs: [0, [Validators.min(0)]],
      noOfTables: [0, [Validators.min(0)]],
      contactPhoneNo: ['', [this._systemSvc.nonSpaceString]],
      contactEmail: ['', [this._systemSvc.validateEmail, Validators.pattern(/^.{0,50}$/)]],
      income: [0, [Validators.min(0)]],
      rentCost: [0, [Validators.min(0)]],
      otherCost: [0, [Validators.min(0)]],
      leaseEnd: [''],
      yearOld: [''],
      area: [0, [Validators.min(0)]],
      description: ['', [Validators.pattern(/^[\s\S]{0,1000}$/)]],
      overview: ['', [Validators.pattern(/^[\s\S]{0,180}$/)]],
      duration: [1]
    });
    this.initCategoriesMap();
    this.itemForm.get('categories').valueChanges.subscribe(value => {
      this.initCategoriesMap();
      this.populateNeeds(value);
      this.categoriesMap[value] = true;
    });
    this.itemForm.get('needs').valueChanges.subscribe(value => {
      this.initNeedsMap();
      for (let v of value) {
        this.needsMap[v] = true;
      }
    });
  }

  initCategoriesMap() {
    this.categoriesMap = {
      "Nail_Salon": false,
      "Hair_Salon": false,
      "Restaurant": false,
      "House": false,
      "Repair": false,
      "Tax": false,
      "Insurance": false,
      "Lending": false,
      "Babysit": false,
      "Teaching": false,
      "Other_Business": false,
    };
  }
  initNeedsMap() {
    this.needsMap = {
      "forSale": false,
      "forLease": false,
      "forShare": false,
      "hiring": false
    };
  }

  populateNeeds(value) {
    switch (value) {
      case 'House': {
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.houseForSale" });
        this.needsOption.push({ "key": "forLease", "value": "item.upload.needs.forLease" });
        this.needsOption.push({ "key": "forShare", "value": "item.upload.needs.forShare" });
        break;
      }
      case 'Repair':
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.repair" });
        this.needsOption.push({ "key": "hiring", "value": "item.upload.needs.hiring" });
        break;
      case 'Tax':
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.tax" });
        this.needsOption.push({ "key": "hiring", "value": "item.upload.needs.hiring" });
        break;
      case 'Insurance':
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.insurance" });
        this.needsOption.push({ "key": "hiring", "value": "item.upload.needs.hiring" });
        break;
      case 'Lending': {
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.lending" });
        this.needsOption.push({ "key": "hiring", "value": "item.upload.needs.hiring" });
        break;
      }
      case 'Babysit': {
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.babysit" });
        this.needsOption.push({ "key": "hiring", "value": "item.upload.needs.hiring" });
        break;
      }
      case 'Teaching': {
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.teaching" });
        this.needsOption.push({ "key": "hiring", "value": "item.upload.needs.hiring" });
        break;
      }
      default: {
        this.needsOption = [];
        this.f["needs"].reset([]);
        this.needsOption.push({ "key": "forSale", "value": "item.upload.needs.forSale" });
        this.needsOption.push({ "key": "hiring", "value": "item.upload.needs.hiring" });
        this.needsOption.push({ "key": "forShare", "value": "item.upload.needs.forShare" });
      }
    }
  }

  checkTooManyFiles() {
    if (!this.submitted) {
      return;
    }
    if (this.toUploadFiles.length > this.MAX_ALLOWED_FILES) {
      this.f['file'].setErrors({ 'tooMany': true });
      this.tooManyFilesError = true;
    } else {
      this.f['file'].setErrors({ 'tooMany': null });
      this.f['file'].updateValueAndValidity();
      this.tooManyFilesError = false;
    }
  }

  get f() { return this.itemForm.controls; }

  get showPrice(): boolean {
    return this._renderSvc.showPrice(this.needsMap, this.categoriesMap);
  }

  get showWage(): boolean {
    return this._renderSvc.showWage(this.needsMap, this.categoriesMap);
  }

  get showNoOfEmployees(): boolean {
    return this._renderSvc.showNoOfEmployees(this.needsMap, this.categoriesMap);
  }

  get showNoOfChairs(): boolean {
    return this._renderSvc.showNoOfChairs(this.needsMap, this.categoriesMap);
  }

  get showNoOfTables(): boolean {
    return this._renderSvc.showNoOfTables(this.needsMap, this.categoriesMap);
  }

  get showIncome(): boolean {
    return this._renderSvc.showIncome(this.needsMap, this.categoriesMap);
  }

  get showRent(): boolean {
    return this._renderSvc.showRent(this.needsMap, this.categoriesMap);
  }

  get showOtherCost(): boolean {
    return this._renderSvc.showOtherCost(this.needsMap, this.categoriesMap);
  }

  get showLeaseEnd(): boolean {
    return this._renderSvc.showLeaseEnd(this.needsMap, this.categoriesMap);
  }

  get showArea(): boolean {
    return this._renderSvc.showArea(this.needsMap, this.categoriesMap);
  }

  get showYearsOld(): boolean {
    return this._renderSvc.showYearsOld(this.needsMap, this.categoriesMap);
  }

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
          that.checkTooManyFiles();
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
    this.checkTooManyFiles();
    if (this.tooManyFilesError) {
      return;
    }
    if (this.itemForm.invalid) {
      this._renderSvc.scrollIntoError();
      return;
    }
    this.recaptchaV3Service.execute('/svc/validate_captcha')
      .subscribe((token: string) => {
        this.makePayment(this.f.duration.value);
      });
  }

  makePayment(duration: any) {
    let that = this;
    let cost = 0;
    let description = "";
    duration += "";
    if (!duration || isNaN(duration)) {
      that._toastr.error(this._translate.instant("common.label.error.invalidInput"));
    }
    switch (duration) {
      case "1":
        cost = 20;
        description = this._translate.instant("stripe.label.chargeDescription", { month: 1 });
        break;
      case "3":
        cost = 40;
        description = this._translate.instant("stripe.label.chargeDescription", { month: 3 });
        break;
      case "6":
        cost = 60;
        description = this._translate.instant("stripe.label.chargeDescription", { month: 6 });
        break;
      case "12":
        cost = 80;
        description = this._translate.instant("stripe.label.chargeDescription", { month: 12 });
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
      name: this._translate.instant("common.label.troiviet"),
      description: description,
      amount: cost * 100
    });
  }

  startPostingAfterChargeSuccessfully() {
    let that = this;
    try {
      let uploadedResults = [];
      let storage = firebase.storage().ref();
      for (let file of this.toUploadFiles) {
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
            that.cancelCharge(that);
            that.handleFirebaseUploadError(error, that);
          },
          () => {
            that.handleSuccess(uploadTask, uploadedResults, that);
          }
        );
      }
    } catch (error) {
      that.cancelCharge(that);
    }
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
    try {
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
    } catch (err) {
      that.cancelCharge(that);
    }

  }

  handleSuccess(uploadTask, uploadedResults, that) {
    try {
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
          needs: that.f.needs.value,
          title: that.f.title.value.trim(),
          businessName: that.f.businessName.value.trim(),
          price: that.f.price.value,
          wage: that.f.price.wage,
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

        that._itemSvc.createItem(this._renderSvc.shakeoutItem(item, this.needsMap, this.categoriesMap)).subscribe((newItem: any) => {
          that._toastr.success(this._translate.instant("item.upload.validate.success"));
          that._router.navigate(["/business/user"]);
        }, (err: any) => {
          that.cancelCharge(that);
          that.handleError(err, that);
        });
      }
    } catch (error) {
      that.cancelCharge(that);
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
    if (this._commSvc.hiringActive) {
      this._router.navigate(['/business/hiring']);
      return;
    } else if (this._commSvc.otherForSaleActive) {
      this._router.navigate(['/business/other']);
      return;
    }
    this._router.navigate(['/business/forSale']);
    return;
  }

  removePreviewMedia(index) {
    this.toUploadFiles.splice(index, 1);
    this.checkTooManyFiles();
    return false;
  }
}
