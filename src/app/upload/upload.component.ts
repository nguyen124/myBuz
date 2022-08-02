import { Component, OnInit, Inject, HostListener, isDevMode, SecurityContext } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { USA_STATES } from '../shared/services/utils/USA_STATES';
import { CANADA_STATES } from '../shared/services/utils/CANADA_STATES';
// import { VIETNAM_STATES } from '../shared/services/utils/VIETNAM_STATES';
import { USA_CITIES } from '../shared/services/utils/USA_CITIES';
import { CANADA_CITIES } from '../shared/services/utils/CANADA_CITIES';
import { Router } from '@angular/router';
import { SystemService } from '../shared/services/utils/system.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { FileValidatorDirective } from '../shared/directive/file-validator.directive';
import { AuthService } from '../shared/services/security/auth.service';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';

declare var firebase: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
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
  country = 'USA';
  states = USA_STATES;
  cities = [];

  constructor(
    private _itemSvc: ItemService,
    private _systemSvc: SystemService,
    private _commSvc: CommunicateService,
    private _toastr: ToastrService,
    private _router: Router,
    private _fb: FormBuilder,
    private _authSvc: AuthService,
    @Inject(JQ_TOKEN) private $: any) { }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.resetFormValues();
  }

  ngOnInit() {
    this.invokeStripe();
    this.initForm();
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
      zipcode: ['00000', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['USA', [Validators.required]],
      noOfEmployees: [0, [Validators.min(0)]],
      noOfChairs: [0, [Validators.min(0)]],
      noOfTables: [0, [Validators.min(0)]],
      contactPhoneNo: ['', [Validators.required, this._systemSvc.nonSpaceString]],
      contactEmail: [''],
      income: [0, [Validators.min(0)]],
      rentCost: [0, [Validators.min(0)]],
      otherCost: [0, [Validators.min(0)]],
      leaseEnd: [''],
      yearOld: [1],
      area: [0, [Validators.min(0)]],
      description: ['', [Validators.maxLength(2000)]],
      overview: ['', [Validators.maxLength(500)]],
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

  onCountryChange(input) {
    switch (input) {
      case 'Canada':
        this.country = 'Canada';
        this.states = CANADA_STATES;
        this.initCities('Canada', this.states[0].Key);
        break;
      default:
        this.country = 'USA';
        this.states = USA_STATES;
        this.initCities('USA', this.states[0].Key);
    }
  }

  onStateChange(input) {
    this.initCities(this.country, input);
  }


  initCities(country: string, stateCode: string): any {
    switch (country) {
      case 'Canada':
        this.cities = CANADA_CITIES[stateCode];
        break;
      default:
        this.cities = USA_CITIES[stateCode];
    }

  }

  paymentHandler = null;

  makePayment(amount: number) {
    
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51LSD2fJbUrktT3xj6s57seUsslyiQidJwLpl63lEeqjZN1XNh2PsVuCNncoRTqOSKElEWkU5s8JhHW4vPaAUU8VT00PnJIt8pz',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
      }
    });
    paymentHandler.open({
      name: 'Me2Meme',
      description: 'Create Ads for 1 month',
      amount: amount*100
    });
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
            console.log(stripeToken)
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

    this.makePayment(100);

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
        (snapshot) => {
          that.handleSnapshot(snapshot, that);
        },
        (error) => {
          that.handleFirebaseUploadError(error, that);
        },
        () => {
          that.handleSuccess(uploadTask, uploadedResults, that);
        }
      );
    });
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

  handleSuccess(uploadTask, uploadedResults, that) {
    // Upload completed successfully, now we can get the download URL
    that.isUploading = false;
    that._toastr.success("Upload finished!")
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
        title: that.f.title.value,
        businessName: that.f.businessName.value,
        price: that.f.price.value,
        address: that.f.address.value,
        zipcode: that.f.zipcode.value,
        city: that.f.city.value,
        state: that.f.state.value,
        country: that.f.country.value,
        noOfEmployees: that.f.noOfEmployees.value,
        noOfChairs: that.f.noOfChairs.value,
        noOfTables: that.f.noOfTables.value,
        contactPhoneNo: that.f.contactPhoneNo.value,
        contactEmail: that.f.contactEmail.value,
        income: that.f.income.value,
        rentCost: that.f.rentCost.value,
        otherCost: that.f.otherCost.value,
        leaseEnd: that.f.leaseEnd.value,
        yearOld: that.f.yearOld.value,
        area: that.f.area.value,
        duration: that.f.duration.value,
        description: that.f.description.value == null ? '' : that.f.description.value.trim(),
        files: uploadedResults,
        overview: that.f.overview.value == null ? '' : that.f.overview.value.trim()
      };

      that._itemSvc.createItem(item).subscribe(newItem => {
        that._toastr.success("New post has been created!");
        let modalDismiss = that.$("#cancelBtn");
        if (modalDismiss && modalDismiss[0]) { modalDismiss.click(); }
        that._commSvc.uploadItem(newItem);
        that.resetFormValues();
        that._router.navigate(["/user/items"]);
      }, err => {
        that.handleError(err, that);
      });
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

  handleError(err, that) {
    that._toastr.error("Oops! Failed to create post!");
    console.log(err);
  }

  resetFormValues() {
    this.itemForm.reset();
    this.initForm();

    this.toUploadFiles = [];
    this.isUploading = false;
    this.submitted = false;
    this.parsedTags = [];
    this.cancelUploading(this);
  }

  removePreviewMedia(index) {
    this.toUploadFiles.splice(index, 1);
    return false;
  }

  cancelUploading(that) {
    if (that && that.currentUploadTasks) {
      that.currentUploadTasks.forEach(task => {
        task.cancel();
      });
    }
  }
}
