# Generic Autocomplete Module with ng-bootstrap for Angular

# Using
- Import GenericAutocompleteComponent from the ng-generic-autocomplete package into your module
- Add HTML tags <generic-autocomplete [itemList]="list" propertyName="property" [outputProperties]="myOutputPropertiesArray" title="title" [showTitle]="true" helpText="helpText" [showHelpText]="true" placeholder="placeholder" failedText="failedText"  fetchDataText="fetchDataText" (onItemSelect)="itemSelected($event)" (onFetchData)="fetchData()" [showItems]="true" [showTableText]="true" tableText="tableText" [pageSize]="5" [maxSize]="5" [clearInput]="false"></generic-autocomplete>

# Available properties
- REQUIRED: itemList: any[] - List of objects to filter
- REQUIRED: propertyName: string - Property to filter by
- outputProperties: string[] - List of properties to display output as (default: [])
- outputDelimiter: string - Delimiter to separate display properties with (default: ' ')
- title: string - Title above text input (default: 'Search')
- showTitle: boolean - Boolean to display title over input (default: true)
- helpText: string - Helper text under input (default: 'Begin typing and search suggestions will appear')
- showHelpText: boolean - Boolean to display help text under input (default: true)
- placeholder: string - Placeholder text in input (default: 'Search..')
- failedText: string - Text to display when search failed (default: 'No items matched your search')
- fetchDataText: string - Text to display when data not yet fetched (default: 'Click to fetch data')
- clearInput: boolean - Whether to clear input after item selected or not (default: true)
- showItems: boolean - Whether to show a table containing all items in itemList or not (default: false)
- showTableText: boolean - Display text above item table (default: true)
- tableText: string - Text shown over item table (default: 'Or choose from all items..')
- pageSize: number - Number of items to display for each page in table (default: 5)
- maxSize: number - Max number of pages shown in pagination before wrapping (default: 5)

# Outputs
- onItemSelect: Returns a single item of the type in your itemList array of objects
- onFetchData: Emitted when user clicks the component and data is not yet fetched