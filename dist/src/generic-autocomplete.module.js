import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GenericAutocompleteComponent } from './generic-autocomplete.component';
import { FormsModule } from '@angular/forms';
var GenericAutocompleteModule = (function () {
    function GenericAutocompleteModule() {
    }
    GenericAutocompleteModule.forRoot = function () {
        return { ngModule: GenericAutocompleteModule, providers: [] };
    };
    GenericAutocompleteModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        NgbModule.forRoot(),
                        CommonModule,
                        FormsModule
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
export { GenericAutocompleteModule };
//# sourceMappingURL=generic-autocomplete.module.js.map