import { Component, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  search(term: string, config: { api: string, endpoint: string }): Observable<any> {
    if (term === '') {
      return Observable.of([]);
    }

    return this.http.get(`${config.api}/${config.endpoint}/${term}`).distinctUntilChanged();
  }
}

@Component({
  selector: 'generic-autocomplete',
  template: `
  <label for="typeahead" *ngIf="showTitle">{{ title }}</label>
  <div class="overlay" *ngIf="hasItems() !== true && !remoteSearch" (click)="fetchData()">
      <span class="overlay-text"><i class="fa fa-refresh"></i> {{ fetchDataText }}</span>
  </div>
  <input id="typeahead" [disabled]="hasItems() !== true && !remoteSearch" type="text" class="form-control" name="typeahead" aria-describedby="typeaheadHelp" [class.is-invalid]="searchFailed" [(ngModel)]="model" [ngbTypeahead]="search" [inputFormatter]="inputFormatter" [resultFormatter]="resultFormatter"
      [placeholder]="hasItems() ? placeholder : ''" (selectItem)="itemSelected($event)" />
  <small id="typeaheadHelp" class="form-text text-muted" *ngIf="showHelpText">
      {{ helpText }}
  </small>
  <div class="invalid-feedback" *ngIf="searchFailed && model">{{ failedText }}</div>
  <span *ngIf="searching">Searching...</span>
  
  <div *ngIf="showItems && hasItems()">
      <div class="row">
          <div class="col-6">
              <small class="form-text text-muted" *ngIf="showTableText">{{ tableText }}</small>
          </div>
          <div class="col-6 text-right">
              <small class="form-text text-muted pointer" (click)="tableActive = !tableActive">{{tableActive ? 'Hide' : 'Show'}}</small>    
          </div>
      </div>
      <div class="row" *ngIf="tableActive">
          <div class="col-6">
              <div class="input-group input-group-sm">
                  <div class="input-group-addon input-group-sm">Items per page</div>
                  <select class="form-control form-control-sm" [(ngModel)]="pageSize">
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                  </select>
              </div>
          </div>
          <div class="col-6 d-flex">
              <ngb-pagination class="mx-auto" [collectionSize]="itemList.length" [rotate]="true" [maxSize]="maxSize" [pageSize]="pageSize" [(page)]="page" [boundaryLinks]="true" size="sm"></ngb-pagination>
          </div>
      </div>
      <div class="row" *ngIf="tableActive">
          <div class="col-12">
              <table class="table table-striped table-hover table-sm">
                  <tr class="pointer" (click)="tableSelect(item)" *ngFor="let item of itemList | slice:(page-1)*pageSize:pageSize*page">
                      <td>{{formatOutput(item)}}</td>
                  </tr>
              </table>
          </div>
      </div>
  </div>
  `,
  styles: [`
  .overlay {
    text-align: center;
    position: absolute;
    width: calc(100% - 2rem);
    font-size: 1rem;
    line-height:1.25;
    padding:0.5rem 0.75rem;
    cursor:pointer;
  }
  .overlay span.overlay-text {
    color: #505050;
    font-weight: 700;
  }
  `],
  providers: [SearchService]
})
export class GenericAutocompleteComponent {
  @Input() itemList: any[] = [];
  @Input() remoteSearch: boolean = false;
  @Input() remoteConfig: {
    api: string,
    endpoint: string
  };
  @Input() propertyName: string = '';
  @Input() outputProperties: string[] = [];
  @Input() outputDelimiter: string = ' ';

  @Input() title: string = 'Search';
  @Input() placeholder: string = 'Search..';
  @Input() failedText: string = 'No items matched your search';
  @Input() helpText: string = 'Begin typing and search suggestions will appear';  
  @Input() fetchDataText: string = 'Click to fetch data';
  @Input() showTitle: boolean = true;
  @Input() showHelpText: boolean = true;
  @Input() clearInput: boolean = true;
  @Output() onItemSelect = new EventEmitter<any>();
  @Output() onFetchData = new EventEmitter<boolean>();

  @Input() showItems: boolean = false;
  @Input() tableActive: boolean = true;
  @Input() showTableText: boolean = true;
  @Input() tableText: string = 'Or choose from all items..';
  @Input() pageSize: number = 5;  
  @Input() maxSize: number = 5;

  page: number = 1;
  model: any;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(private searchService: SearchService) { }

  inputFormatter = (input: any) => this.clearInput ? null : input[this.propertyName];
  resultFormatter = (input: any) => this.formatOutput(input);
  hasItems = () => this.itemList.length > 0;

  search = (query: Observable<string>) => 
    query.debounceTime(300).distinctUntilChanged()
    .do(() => this.searching = true)
    .switchMap(term =>
      this.remoteSearch ? this.searchService.search(term, this.remoteConfig) : this.searchInternalList(term)
    )
    .do((items) => {      
      this.searchFailed = false;
    })
    .catch(() => {
      this.searchFailed = true;
      return Observable.of([]);
    })
    .do(() => this.searching = false)
    .merge(this.hideSearchingWhenUnsubscribed);

  searchInternalList(term: string): Observable<any> {
    let query = term.toUpperCase();

    if (term === '') {
      return Observable.of([]);
    }

    return Observable.of(this.itemList.filter(item => {
      let propertyValue = item[this.propertyName].toString().toUpperCase();
      return propertyValue.substr(0, query.length) === query;
    }));
  }

  tableSelect(item: any) {
    this.onItemSelect.emit(item);
  }

  formatOutput(item: any) {
    if(this.outputProperties && this.outputProperties.length > 0) {
      let result: any[] = this.outputProperties.map(p => this.resolve(p, item));
      return result.join(this.outputDelimiter);
    } else {
      return item[this.propertyName];
    }
  }

  itemSelected(event: NgbTypeaheadSelectItemEvent) {
    let item = event.item;    
    this.onItemSelect.emit(item);
  }
  fetchData() {
    this.onFetchData.emit(true);
  }

  private resolve(path: any, obj: any) {
    return path === null ? '' : 
    path.split('.').reduce(function(prev: any, curr: any) {      
      return prev ? prev[curr] : null
    }, obj);
  }
}