import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoggingService } from '../shared/services/system/logging.service';

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

  constructor(private _log: LoggingService) { }

  ngOnInit() {
  }

  onRadioSelectionChanged() {
    this.radionSelectionChanged.emit(this.selectedRadioValue);
    this._log.log(this.selectedRadioValue);
  }
}
