import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RenderService {

  constructor() {

  }

  showPrice(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['House'] || categoriesMap['Restaurant'] ||
      categoriesMap['Other_Business]']) && needsMap['forSale']) {
      result = true;
    }
    return result;
  }

  showWage(needsMap, categoriesMap): boolean {
    return needsMap.hiring;
  }

  showNoOfEmployees(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showNoOfChairs(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showNoOfTables(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showIncome(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showRent(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showOtherCost(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showLeaseEnd(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showArea(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['House']
      || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  showYearsOld(needsMap, categoriesMap): boolean {
    let result = false;
    if ((categoriesMap['Nail_Salon'] || categoriesMap['Hair_Salon'] ||
      categoriesMap['Restaurant'] || categoriesMap['House']
      || categoriesMap['Other_Business']) &&
      (needsMap['forSale'] || needsMap['forShare'])) {
      result = true;
    }
    return result;
  }

  shakeoutItem(item, needsMap, categoriesMap) {
    if (!this.showPrice(needsMap, categoriesMap)) {
      item.price = "";
    }
    if (!this.showWage(needsMap, categoriesMap)) {
      item.wage = "";
    }
    if (!this.showNoOfEmployees(needsMap, categoriesMap)) {
      item.noOfEmployees = "";
    }
    if (!this.showNoOfChairs(needsMap, categoriesMap)) {
      item.noOfChairs = "";
    }
    if (!this.showNoOfTables(needsMap, categoriesMap)) {
      item.noOfTables = "";
    }
    if (!this.showIncome(needsMap, categoriesMap)) {
      item.income = "";
    }
    if (!this.showRent(needsMap, categoriesMap)) {
      item.rentCost = "";
    }
    if (!this.showOtherCost(needsMap, categoriesMap)) {
      item.otherCost = "";
    }
    if (!this.showLeaseEnd(needsMap, categoriesMap)) {
      item.leaseEnd = "";
    }
    if (!this.showYearsOld(needsMap, categoriesMap)) {
      item.yearOld = "";
    }
    if (!this.showArea(needsMap, categoriesMap)) {
      item.area = "";
    }
    return item;
  }

  scrollIntoError() {
    const firstElementWithError = document.querySelector('.ng-invalid')[0];
    if (firstElementWithError) {
      let scrollTopPosition = firstElementWithError.getBoundingClientRect().top;
      firstElementWithError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
