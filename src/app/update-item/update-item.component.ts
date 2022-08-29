import { Component, OnInit, isDevMode, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileValidatorDirective } from '../shared/directive/file-validator.directive';
import { ItemService } from '../shared/services/item.services';
import { AuthService } from '../shared/services/security/auth.service';
import { SystemService } from '../shared/services/utils/system.service';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';
import { GoogleMapService } from '../shared/services/google-map.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from '../shared/services/system/logging.service';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { RenderService } from '../shared/services/utils/render.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { OnDestroy } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';

declare var firebase: any;
declare var google: any;

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit, OnDestroy, AfterViewInit {
  MAX_ALLOWED_FILES: number = 10;
  parsedTags: string[] = [];
  itemForm: UntypedFormGroup;
  submitted: boolean = false;
  currentUploadTasks: any[] = [];
  toUploadFiles: any[] = [];
  today = new Date();
  destination: string = "";
  paymentHandler = null;
  charge = null;
  itemId: string;
  countryRestrict: any = { country: 'us' };
  autocompleteAddress: any;
  autocompleteZipcode: any;
  geometry: any;
  isUploading: boolean = false;
  needsOption = [];
  needsMap: any = {
    "forSale": false,
    "forLease": false,
    "forShare": false,
    "hiring": false
  };
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
    private _route: ActivatedRoute,
    private _itemSvc: ItemService,
    private _systemSvc: SystemService,
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _authSvc: AuthService,
    private _apiService: GoogleMapService,
    private _toastr: ToastrService,
    private _translate: TranslateService,
    private _logSvc: LoggingService,
    private _commSvc: CommunicateService,
    private _renderSvc: RenderService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private cdr: ChangeDetectorRef) {
    this.itemForm = this._fb.group({});
    this.destination = this.today.getFullYear() + "/" + this.today.getMonth() + "/" + this.today.getDate() + "/" + this._authSvc.user.username + "/";
  }

  initForm() {
    this.itemForm = this._fb.group({
      title: ['', []],
      businessName: ['', []],
      file: ['', []],
      categories: [''],
      needs: [''],
      tags: [''],
      price: [0, []],
      wage: [0, []],
      address: ['', []],
      address2: ['', []],
      zipcode: ['', []],
      city: ['', []],
      state: ['', []],
      country: ['', []],
      noOfEmployees: [0, []],
      noOfChairs: [0, []],
      noOfTables: [0, []],
      contactPhoneNo: ['', []],
      contactEmail: ['',],
      income: [0, []],
      rentCost: [0, []],
      otherCost: [0, []],
      leaseEnd: [''],
      yearOld: [1],
      area: [0, []],
      description: ['', []],
      overview: ['', []]
    });
  }

  ngAfterViewInit() {
    this._apiService.api.then((maps) => {
      this.buildAutoCompleteAddressForm();
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.initForm();
    this._route.params.subscribe(params => {
      this.itemId = params.itemId;
      this._itemSvc.getItemById(this.itemId).subscribe(item => {
        this.parsedTags = item.tags;
        this.itemForm = this._fb.group({
          title: [item.title, [Validators.pattern(/^.{5,100}$/), this._systemSvc.nonSpaceString]],
          businessName: [item.businessName, [Validators.pattern(/^.{1,50}$/), this._systemSvc.nonSpaceString]],
          file: [, [FileValidatorDirective.validate, this._systemSvc.checkFileMaxSize]],
          categories: [...item.categories, [Validators.required]],
          needs: [item.needs, [Validators.required]],
          tags: [item.tags],
          price: [item.price, [Validators.min(0)]],
          wage: [item.wage, [Validators.min(0)]],
          address: [item.address, [Validators.pattern(/^.{0,100}$/)]],
          address2: [item.address2, []],
          zipcode: [item.zipcode, [Validators.pattern(/^.{1,10}$/), this._systemSvc.nonSpaceString]],
          city: [item.city, [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
          state: [item.state, [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
          country: [item.country, [Validators.pattern(/^.{1,20}$/), this._systemSvc.nonSpaceString]],
          noOfEmployees: [item.noOfEmployees, [Validators.min(0)]],
          noOfChairs: [item.noOfChairs, [Validators.min(0)]],
          noOfTables: [item.noOfTables, [Validators.min(0)]],
          contactPhoneNo: [item.contactPhoneNo, [this._systemSvc.nonSpaceString]],
          contactEmail: [item.contactEmail, [this._systemSvc.validateEmail, Validators.pattern(/^.{0,50}$/)]],
          income: [item.income, [Validators.min(0)]],
          rentCost: [item.rentCost, [Validators.min(0)]],
          otherCost: [item.otherCost, [Validators.min(0)]],
          leaseEnd: [item.leaseEnd && item.leaseEnd.split("T")[0]],
          yearOld: [item.yearOld],
          area: [item.area, [Validators.min(0)]],
          description: [item.description, [Validators.pattern(/^[\s\S]{0,1000}$/)]],
          overview: [item.overview, [Validators.pattern(/^[\s\S]{0,180}$/)]]
        });
        this.geometry = item.geometry;
        this.toUploadFiles = item.files;
        this.initCategoriesMap(item);
        this.populateNeeds(item.categories);
        this.initNeedsMap(item);
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
      });
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  initCategoriesMap(item?: any) {
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
    if (item) {
      this.categoriesMap[item.categories] = true;
    }
  }

  initNeedsMap(item?: any) {
    this.needsMap = {
      "forSale": false,
      "forLease": false,
      "forShare": false,
      "hiring": false
    };
    if (item) {
      for (let need of item.needs) {
        this.needsMap[need] = true;
      }
      this.f.needs.setValue(item.needs);
    }
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

  onTagsChange(input) {
    this.parsedTags = input.split(/[ ,;.\/\\]+/).slice(0, 5).filter(el => el.length != 0);
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

  removePreviewMedia(index) {
    this.toUploadFiles.splice(index, 1);
    this.checkTooManyFiles();
    return false;
  }

  checkError(field: string) {
    return this._systemSvc.checkError(this.itemForm, field, this.submitted);
  }

  updatePost() {
    this.submitted = true;
    if (this.toUploadFiles && this.toUploadFiles.length) {
      this.itemForm.controls.file.setValue(true);
    }
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
        this.startPostingAfterChargeSuccessfully();
      });
  }

  startPostingAfterChargeSuccessfully() {
    let uploadedResults = [];
    let that = this;
    let storage = firebase.storage().ref();
    this.toUploadFiles.forEach(file => {
      if (!file.url.startsWith("https")) {
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
          },
          () => {
            that.handleSuccess(uploadTask, uploadedResults, that);
          }
        );
      } else {
        uploadedResults.push(file);
        that.handleSuccess(null, uploadedResults, that);
      }
    });
  }

  handleSuccess(uploadTask, uploadedResults, that) {
    // Upload completed successfully, now we can get the download URL
    that.isUploading = false;
    // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL: string) => {      
    // });
    if (uploadTask) {
      that._toastr.success(this._translate.instant("uploading.validate.success"));
      let bucketName = isDevMode() ? environment.bucketname : prodEnvironment.bucketname;
      let downloadURL = 'https://storage.googleapis.com/' + bucketName + '/' + uploadTask.snapshot.metadata.fullPath;

      uploadedResults.push({
        url: downloadURL,
        filename: uploadTask.snapshot.metadata.fullPath,
        fileType: uploadTask.snapshot.metadata.contentType
      });
    }
    if (uploadedResults.length == that.toUploadFiles.length) {
      let item = {
        tags: that.parsedTags,
        categories: that.f.categories.value,
        needs: that.f.needs.value,
        title: that.f.title.value.trim(),
        businessName: that.f.businessName.value.trim(),
        price: that.f.price.value,
        wage: that.f.wage.value,
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
        description: that.f.description.value == null ? '' : that.f.description.value.trim(),
        files: uploadedResults,
        overview: that.f.overview.value == null ? '' : that.f.overview.value.trim(),
        geometry: that.geometry
      };
      //append charge info into item

      that._itemSvc.updateItem(this.itemId, this._renderSvc.shakeoutItem(item, this.needsMap, this.categoriesMap))
        .subscribe((newItem: any) => {
          that._toastr.success(this._translate.instant("item.update.validate.success"));
          that._router.navigate(["/business/user"]);
        }, (err: any) => {
          that.handleError(err, that);
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

  handleError(err, that) {
    that._toastr.error(this._translate.instant("item.update.validate.error"));
    this._logSvc.log(err);
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
}
