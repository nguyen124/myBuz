import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  selectedRadioValue: string = "all";

  @Input()
  all: number;
  @Input()
  viewed: string;

  @Output()
  radionSelectionChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onRadioSelectionChanged() {
    this.radionSelectionChanged.emit(this.selectedRadioValue);
    console.log(this.selectedRadioValue);
  }
}
