(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@ng-bootstrap/ng-bootstrap'), require('rxjs/Observable'), require('rxjs/add/observable/of'), require('rxjs/add/operator/catch'), require('rxjs/add/operator/debounceTime'), require('rxjs/add/operator/distinctUntilChanged'), require('rxjs/add/operator/do'), require('rxjs/add/operator/map'), require('rxjs/add/operator/switchMap'), require('rxjs/add/operator/merge'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@ng-bootstrap/ng-bootstrap', 'rxjs/Observable', 'rxjs/add/observable/of', 'rxjs/add/operator/catch', 'rxjs/add/operator/debounceTime', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/operator/do', 'rxjs/add/operator/map', 'rxjs/add/operator/switchMap', 'rxjs/add/operator/merge', '@angular/forms'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.genericAutocompleteComponent = global.ng.genericAutocompleteComponent || {}),global.ng.core,global._angular_common,global._ngBootstrap_ngBootstrap,global.Rx,global.Rx.Observable,null,null,null,null,global.Rx.Observable.prototype,null,null,global._angular_forms));
}(this, (function (exports,_angular_core,_angular_common,_ngBootstrap_ngBootstrap,rxjs_Observable,rxjs_add_observable_of,rxjs_add_operator_catch,rxjs_add_operator_debounceTime,rxjs_add_operator_distinctUntilChanged,rxjs_add_operator_do,rxjs_add_operator_map,rxjs_add_operator_switchMap,rxjs_add_operator_merge,_angular_forms) { 'use strict';

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
        this.onItemSelect = new _angular_core.EventEmitter();
        this.onFetchData = new _angular_core.EventEmitter();
        this.showItems = false;
        this.showTableText = true;
        this.tableText = 'Or choose from all items..';
        this.pageSize = 5;
        this.maxSize = 5;
        this.tableActive = true;
        this.page = 1;
        this.searching = false;
        this.searchFailed = false;
        this.hideSearchingWhenUnsubscribed = new rxjs_Observable.Observable(function () { return function () { return _this.searching = false; }; });
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
                    return rxjs_Observable.Observable.of([]);
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
            return rxjs_Observable.Observable.of([]);
        }
        return rxjs_Observable.Observable.of(this.itemList.filter(function (item) {
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
        { type: _angular_core.Component, args: [{
                    selector: 'generic-autocomplete',
                    template: "\n  <label for=\"typeahead\" *ngIf=\"showTitle\">{{ title }}</label>\n  <div class=\"overlay\" *ngIf=\"hasItems() !== true\" (click)=\"fetchData()\">\n      <span class=\"overlay-text\"><i class=\"fa fa-refresh\"></i> {{ fetchDataText }}</span>\n  </div>\n  <input id=\"typeahead\" [disabled]=\"hasItems() !== true\" type=\"text\" class=\"form-control\" name=\"typeahead\" aria-describedby=\"typeaheadHelp\" [class.is-invalid]=\"searchFailed\" [(ngModel)]=\"model\" [ngbTypeahead]=\"search\" [inputFormatter]=\"inputFormatter\" [resultFormatter]=\"resultFormatter\"\n      [placeholder]=\"hasItems() ? placeholder : ''\" (selectItem)=\"itemSelected($event)\" />\n  <small id=\"typeaheadHelp\" class=\"form-text text-muted\" *ngIf=\"showHelpText\">\n      {{ helpText }}\n  </small>\n  <div class=\"invalid-feedback\" *ngIf=\"searchFailed\">{{ failedText }}</div>\n  <span *ngIf=\"searching\">Searching...</span>\n  \n  <div *ngIf=\"showItems && hasItems()\">\n      <div class=\"row\">\n          <div class=\"col-6\">\n              <small class=\"form-text text-muted\" *ngIf=\"showTableText\">{{ tableText }}</small>\n          </div>\n          <div class=\"col-6 text-right\">\n              <small class=\"form-text text-muted pointer\" (click)=\"tableActive = !tableActive\">{{tableActive ? 'Hide' : 'Show'}}</small>    \n          </div>\n      </div>\n      <div class=\"row\" *ngIf=\"tableActive\">\n          <div class=\"col-6\">\n              <div class=\"input-group input-group-sm\">\n                  <div class=\"input-group-addon input-group-sm\">Items per page</div>\n                  <select class=\"form-control form-control-sm\" [(ngModel)]=\"pageSize\">\n                      <option value=\"5\">5</option>\n                      <option value=\"10\">10</option>\n                      <option value=\"25\">25</option>\n                      <option value=\"50\">50</option>\n                  </select>\n              </div>\n          </div>\n          <div class=\"col-6 d-flex\">\n              <ngb-pagination class=\"mx-auto\" [collectionSize]=\"itemList.length\" [rotate]=\"true\" [maxSize]=\"maxSize\" [pageSize]=\"pageSize\" [(page)]=\"page\" [boundaryLinks]=\"true\" size=\"sm\"></ngb-pagination>\n          </div>\n      </div>\n      <div class=\"row\" *ngIf=\"tableActive\">\n          <div class=\"col-12\">\n              <table class=\"table table-striped table-hover table-sm\">\n                  <tr class=\"pointer\" (click)=\"tableSelect(item)\" *ngFor=\"let item of itemList | slice:(page-1)*pageSize:pageSize*page\">\n                      <td>{{formatOutput(item)}}</td>\n                  </tr>\n              </table>\n          </div>\n      </div>\n  </div>\n  ",
                    styles: ["\n  .overlay {\n    text-align: center;\n    position: absolute;\n    width: calc(100% - 2rem);\n    font-size: 1rem;\n    line-height:1.25;\n    padding:0.5rem 0.75rem;\n    cursor:pointer;\n  }\n  .overlay span.overlay-text {\n    color: #505050;\n    font-weight: 700;\n  }\n  "]
                },] },
    ];
    /** @nocollapse */
    GenericAutocompleteComponent.ctorParameters = function () { return []; };
    GenericAutocompleteComponent.propDecorators = {
        'itemList': [{ type: _angular_core.Input },],
        'propertyName': [{ type: _angular_core.Input },],
        'outputProperties': [{ type: _angular_core.Input },],
        'outputDelimiter': [{ type: _angular_core.Input },],
        'title': [{ type: _angular_core.Input },],
        'placeholder': [{ type: _angular_core.Input },],
        'failedText': [{ type: _angular_core.Input },],
        'helpText': [{ type: _angular_core.Input },],
        'fetchDataText': [{ type: _angular_core.Input },],
        'showTitle': [{ type: _angular_core.Input },],
        'showHelpText': [{ type: _angular_core.Input },],
        'clearInput': [{ type: _angular_core.Input },],
        'onItemSelect': [{ type: _angular_core.Output },],
        'onFetchData': [{ type: _angular_core.Output },],
        'showItems': [{ type: _angular_core.Input },],
        'showTableText': [{ type: _angular_core.Input },],
        'tableText': [{ type: _angular_core.Input },],
        'pageSize': [{ type: _angular_core.Input },],
        'maxSize': [{ type: _angular_core.Input },],
    };
    return GenericAutocompleteComponent;
}());

var GenericAutocompleteModule = /** @class */ (function () {
    function GenericAutocompleteModule() {
    }
    GenericAutocompleteModule.forRoot = function () {
        return { ngModule: GenericAutocompleteModule, providers: [] };
    };
    GenericAutocompleteModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _ngBootstrap_ngBootstrap.NgbModule.forRoot(),
                        _angular_common.CommonModule,
                        _angular_forms.FormsModule
                    ],
                    declarations: [
                        GenericAutocompleteComponent
                    ],
                    exports: [
                        GenericAutocompleteComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    GenericAutocompleteModule.ctorParameters = function () { return []; };
    return GenericAutocompleteModule;
}());

/**
 * @module
 * @description
 * Entry point for all public APIs of the generic autocomplete package
 */

exports.GenericAutocompleteModule = GenericAutocompleteModule;
exports.GenericAutocompleteComponent = GenericAutocompleteComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
