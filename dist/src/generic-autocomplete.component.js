import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
var GenericAutocompleteComponent = /** @class */ (function () {
    function GenericAutocompleteComponent() {
        var _this = this;
        this.itemList = [];
        this.propertyName = '';
        this.outputProperties = [];
        this.outputDelimiter = ' ';
        this.title = 'Search';
        this.placeholder = 'Search..';
        this.failedText = 'No items matched your search';
        this.helpText = 'Begin typing and search suggestions will appear';
        this.fetchDataText = 'Click to fetch data';
        this.showTitle = true;
        this.showHelpText = true;
        this.clearInput = true;
        this.onItemSelect = new EventEmitter();
        this.onFetchData = new EventEmitter();
        this.showItems = false;
        this.showTableText = true;
        this.tableText = 'Or choose from all items..';
        this.pageSize = 5;
        this.maxSize = 5;
        this.tableActive = true;
        this.page = 1;
        this.searching = false;
        this.searchFailed = false;
        this.hideSearchingWhenUnsubscribed = new Observable(function () { return function () { return _this.searching = false; }; });
        this.inputFormatter = function (input) { return _this.clearInput ? null : input[_this.propertyName]; };
        this.resultFormatter = function (input) { return _this.formatOutput(input); };
        this.hasItems = function () { return _this.itemList.length > 0; };
        this.search = function (query) {
            return query.debounceTime(300).distinctUntilChanged()
                .do(function () { return _this.searching = true; })
                .switchMap(function (term) {
                return _this.searchInternalList(term)
                    .do(function (items) {
                    _this.searchFailed = false;
                })
                    .catch(function () {
                    _this.searchFailed = true;
                    return Observable.of([]);
                });
            })
                .do(function () { return _this.searching = false; })
                .merge(_this.hideSearchingWhenUnsubscribed);
        };
    }
    GenericAutocompleteComponent.prototype.searchInternalList = function (term) {
        var _this = this;
        var query = term.toUpperCase();
        if (term === '') {
            return Observable.of([]);
        }
        return Observable.of(this.itemList.filter(function (item) {
            var propertyValue = item[_this.propertyName].toString().toUpperCase();
            return propertyValue.substr(0, query.length) === query;
        }));
    };
    GenericAutocompleteComponent.prototype.tableSelect = function (item) {
        this.onItemSelect.emit(item);
    };
    GenericAutocompleteComponent.prototype.formatOutput = function (item) {
        var _this = this;
        if (this.outputProperties && this.outputProperties.length > 0) {
            var result = this.outputProperties.map(function (p) { return _this.resolve(p, item); });
            return result.join(this.outputDelimiter);
        }
        else {
            return item[this.propertyName];
        }
    };
    GenericAutocompleteComponent.prototype.itemSelected = function (event) {
        var item = event.item;
        this.onItemSelect.emit(item);
    };
    GenericAutocompleteComponent.prototype.fetchData = function () {
        this.onFetchData.emit(true);
    };
    GenericAutocompleteComponent.prototype.resolve = function (path, obj) {
        return path === null ? '' :
            path.split('.').reduce(function (prev, curr) {
                return prev ? prev[curr] : null;
            }, obj);
    };
    GenericAutocompleteComponent.decorators = [
        { type: Component, args: [{
                    selector: 'generic-autocomplete',
                    template: "\n  <label for=\"typeahead\" *ngIf=\"showTitle\">{{ title }}</label>\n  <div class=\"overlay\" *ngIf=\"hasItems() !== true\" (click)=\"fetchData()\">\n      <span class=\"overlay-text\"><i class=\"fa fa-refresh\"></i> {{ fetchDataText }}</span>\n  </div>\n  <input id=\"typeahead\" [disabled]=\"hasItems() !== true\" type=\"text\" class=\"form-control\" name=\"typeahead\" aria-describedby=\"typeaheadHelp\" [class.is-invalid]=\"searchFailed\" [(ngModel)]=\"model\" [ngbTypeahead]=\"search\" [inputFormatter]=\"inputFormatter\" [resultFormatter]=\"resultFormatter\"\n      [placeholder]=\"hasItems() ? placeholder : ''\" (selectItem)=\"itemSelected($event)\" />\n  <small id=\"typeaheadHelp\" class=\"form-text text-muted\" *ngIf=\"showHelpText\">\n      {{ helpText }}\n  </small>\n  <div class=\"invalid-feedback\" *ngIf=\"searchFailed\">{{ failedText }}</div>\n  <span *ngIf=\"searching\">Searching...</span>\n  \n  <div *ngIf=\"showItems && hasItems()\">\n      <div class=\"row\">\n          <div class=\"col-6\">\n              <small class=\"form-text text-muted\" *ngIf=\"showTableText\">{{ tableText }}</small>\n          </div>\n          <div class=\"col-6 text-right\">\n              <small class=\"form-text text-muted pointer\" (click)=\"tableActive = !tableActive\">{{tableActive ? 'Hide' : 'Show'}}</small>    \n          </div>\n      </div>\n      <div class=\"row\" *ngIf=\"tableActive\">\n          <div class=\"col-6\">\n              <div class=\"input-group input-group-sm\">\n                  <div class=\"input-group-addon input-group-sm\">Items per page</div>\n                  <select class=\"form-control form-control-sm\" [(ngModel)]=\"pageSize\">\n                      <option value=\"5\">5</option>\n                      <option value=\"10\">10</option>\n                      <option value=\"25\">25</option>\n                      <option value=\"50\">50</option>\n                  </select>\n              </div>\n          </div>\n          <div class=\"col-6 d-flex\">\n              <ngb-pagination class=\"mx-auto\" [collectionSize]=\"itemList.length\" [rotate]=\"true\" [maxSize]=\"maxSize\" [pageSize]=\"pageSize\" [(page)]=\"page\" [boundaryLinks]=\"true\" size=\"sm\"></ngb-pagination>\n          </div>\n      </div>\n      <div class=\"row\" *ngIf=\"tableActive\">\n          <div class=\"col-12\">\n              <table class=\"table table-striped table-hover table-sm\">\n                  <tr class=\"pointer\" (click)=\"tableSelect(item)\" *ngFor=\"let item of itemList | slice:(page-1)*pageSize:pageSize*page\">\n                      <td>{{formatOutput(item)}}</td>\n                  </tr>\n              </table>\n          </div>\n      </div>\n  </div>\n  ",
                    styles: ["\n  .overlay {\n    text-align: center;\n    position: absolute;\n    width: calc(100% - 2rem);\n    font-size: 1rem;\n    line-height:1.25;\n    padding:0.5rem 0.75rem;\n    cursor:pointer;\n  }\n  .overlay span.overlay-text {\n    color: #505050;\n    font-weight: 700;\n  }\n  "]
                },] },
    ];
    /** @nocollapse */
    GenericAutocompleteComponent.ctorParameters = function () { return []; };
    GenericAutocompleteComponent.propDecorators = {
        'itemList': [{ type: Input },],
        'propertyName': [{ type: Input },],
        'outputProperties': [{ type: Input },],
        'outputDelimiter': [{ type: Input },],
        'title': [{ type: Input },],
        'placeholder': [{ type: Input },],
        'failedText': [{ type: Input },],
        'helpText': [{ type: Input },],
        'fetchDataText': [{ type: Input },],
        'showTitle': [{ type: Input },],
        'showHelpText': [{ type: Input },],
        'clearInput': [{ type: Input },],
        'onItemSelect': [{ type: Output },],
        'onFetchData': [{ type: Output },],
        'showItems': [{ type: Input },],
        'showTableText': [{ type: Input },],
        'tableText': [{ type: Input },],
        'pageSize': [{ type: Input },],
        'maxSize': [{ type: Input },],
    };
    return GenericAutocompleteComponent;
}());
export { GenericAutocompleteComponent };
//# sourceMappingURL=generic-autocomplete.component.js.map