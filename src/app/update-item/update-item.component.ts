import { Component, OnInit, isDevMode, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileValidatorDirective } from '../shared/directive/file-validator.directive';
import { ItemService } from '../shared/services/item.services';
import { AuthService } from '../shared/services/security/auth.service';
import { SystemService } from '../shared/services/utils/system.service';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';
import { GoogleMapService } from '../shared/services/google-map.service';
import { ToastrService } from 'ngx-toastr';

declare var firebase: any;
declare var google: any;

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit, AfterViewInit {
  parsedTags: string[] = [];
  itemForm: FormGroup;
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
  geometry: any;
  @ViewChild('autoAddress', { static: false }) autoAddress: ElementRef;
  @ViewChild('address2', { static: false }) address2: ElementRef;

  constructor(
    private _route: ActivatedRoute,
    private _itemSvc: ItemService,
    private _systemSvc: SystemService,
    private _fb: FormBuilder,
    private _router: Router,
    private _authSvc: AuthService,
    private _apiService: GoogleMapService,
    private _toastr: ToastrService) {
    this.itemForm = this._fb.group({});
    this.destination = this.today.getFullYear() + "/" + this.today.getMonth() + "/" + this.today.getDate() + "/" + this._authSvc.user.username + "/";
  }

  initForm() {
    this.itemForm = this._fb.group({
      title: ['', [Validators.required, this._systemSvc.nonSpaceString]],
      businessName: ['', [Validators.required, this._systemSvc.nonSpaceString]],
      file: ['', [FileValidatorDirective.validate, this._systemSvc.checkFileMaxSize]],
      categories: ['Nail_Salon'],
      tags: [''],
      price: [0, [Validators.min(0)]],
      address: ['', [Validators.required]],
      address2: ['', []],
      zipcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      noOfEmployees: [0, [Validators.min(0)]],
      noOfChairs: [0, [Validators.min(0)]],
      noOfTables: [0, [Validators.min(0)]],
      contactPhoneNo: ['', [Validators.required, this._systemSvc.nonSpaceString]],
      contactEmail: ['', this._systemSvc.validateEmail],
      income: [0, [Validators.min(0)]],
      rentCost: [0, [Validators.min(0)]],
      otherCost: [0, [Validators.min(0)]],
      leaseEnd: [''],
      yearOld: [1],
      area: [0, [Validators.min(0)]],
      description: ['', [Validators.maxLength(2000)]],
      overview: ['', [Validators.maxLength(500)]]
    });
  }

  ngAfterViewInit() {
    this._apiService.api.then((maps) => {
      this.buildAutoCompleteAddressForm();
    });
  }

  ngOnInit(): void {
    this.initForm();
    this._route.params.subscribe(params => {
      this.itemId = params.itemId;
      this._itemSvc.getItemById(this.itemId).subscribe(item => {
        this.parsedTags = item.tags;
        this.itemForm = this._fb.group({
          title: [item.title, [Validators.required, this._systemSvc.nonSpaceString]],
          businessName: [item.businessName, [Validators.required, this._systemSvc.nonSpaceString]],
          file: [, [FileValidatorDirective.validate, this._systemSvc.checkFileMaxSize]],
          categories: [item.categories],
          tags: [item.tags],
          price: [item.price, [Validators.min(0)]],
          address: [item.address, [Validators.required]],
          address2: [item.address2, []],
          zipcode: [item.zipcode, [Validators.required]],
          city: [item.city, [Validators.required]],
          state: [item.state, [Validators.required]],
          country: [item.country, [Validators.required]],
          noOfEmployees: [item.noOfEmployees, [Validators.min(0)]],
          noOfChairs: [item.noOfChairs, [Validators.min(0)]],
          noOfTables: [item.noOfTables, [Validators.min(0)]],
          contactPhoneNo: [item.contactPhoneNo, [Validators.required, this._systemSvc.nonSpaceString]],
          contactEmail: [item.contactEmail, this._systemSvc.validateEmail],
          income: [item.income, [Validators.min(0)]],
          rentCost: [item.rentCost, [Validators.min(0)]],
          otherCost: [item.otherCost, [Validators.min(0)]],
          leaseEnd: [item.leaseEnd.split("T")[0]],
          yearOld: [item.yearOld],
          area: [item.area, [Validators.min(0)]],
          description: [item.description, [Validators.maxLength(2000)]],
          overview: [item.overview, [Validators.maxLength(500)]]
        });
        this.geometry = item.geometry;
        this.toUploadFiles = item.files;
      });
    });
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
        }
        reader.readAsDataURL(toUploadFile);
      }
    });
  }

  removePreviewMedia(index) {
    this.toUploadFiles.splice(index, 1);
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
    if (this.itemForm.invalid) {
      return;
    }
    this.startPostingAfterChargeSuccessfully();
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
      that._toastr.success("Upload finished!")
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
        description: that.f.description.value == null ? '' : that.f.description.value.trim(),
        files: uploadedResults,
        overview: that.f.overview.value == null ? '' : that.f.overview.value.trim(),
        geometry: that.geometry
      };
      //append charge info into item

      that._itemSvc.updateItem(this.itemId, item).subscribe((newItem: any) => {
        console.log(newItem);
        that._toastr.success("Thông Tin Mới Đã Được Cập Nhật!");
        that._router.navigate(["/user/items"]);
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
        that._toastr.info('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        //this._toastr.info('Upload is running');
        break;
    }
  }

  handleFirebaseUploadError(error, that) {
    that.isUploading = false;
    // Errors list: https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        that._toastr.error("Storage permission denied!");
        break;

      case 'storage/canceled':
        that._toastr.error("Upload canceled!");
        break;

      case 'storage/unknown':
        that._toastr.error("Unknown error in storage!");
        break;
    }
  }

  goBackToHomePage() {
    this._router.navigate(["/items"]);
  }
}
