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

  scrollIntoError() {
    const firstElementWithError = document.querySelector('.ng-invalid')[0];
    if (firstElementWithError) {
      let scrollTopPosition = firstElementWithError.getBoundingClientRect().top;
      firstElementWithError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
