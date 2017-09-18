import { NgModule, ModuleWithProviders } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GenericAutocompleteComponent } from './generic-autocomplete.component';
import { FormsModule } from '@angular/forms';

@NgModule({
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
})
export class GenericAutocompleteModule {
    static forRoot(): ModuleWithProviders {
        return { ngModule: GenericAutocompleteModule, providers: [] };
    }
}
