# Generic Autocomplete Module with ng-bootstrap for Angular

# Using ng-generic-autocomplete
- Import GenericAutocompleteModule from the ng-generic-autocomplete package into your module
- Add element with required properties
- <generic-autocomplete [itemList]="myDataList" propertyName="queryProperty"></generic-autocomplete>

# Available input properties
## Autocomplete settings
#### General
- REQUIRED: itemList: any[] - List of objects to filter
- REQUIRED: propertyName: string - Property to filter by
- outputProperties: string[] - List of properties to display output as (default: [])
- outputDelimiter: string - Delimiter to separate display properties with (default: ' ')
- clearInput: boolean - Whether to clear input after item selected or not (default: true)
#### Text settings
- title: string - Title above text input (default: 'Search')
- showTitle: boolean - Boolean to display title over input (default: true)
- helpText: string - Helper text under input (default: 'Begin typing and search suggestions will appear')
- showHelpText: boolean - Boolean to display help text under input (default: true)
- placeholder: string - Placeholder text in input (default: 'Search..')
- failedText: string - Text to display when search failed (default: 'No items matched your search')
- fetchDataText: string - Text to display when data not yet fetched (default: 'Click to fetch data')

## Table settings
#### General
- showItems: boolean - Whether to show a table containing all items in itemList or not (default: false)
- pageSize: number - Number of items to display for each page in table (default: 5)
- maxSize: number - Max number of pages shown in pagination before wrapping (default: 5)
#### Text settings
- showTableText: boolean - Display text above item table (default: true)
- tableText: string - Text shown over item table (default: 'Or choose from all items..')

# Output events
- onItemSelect: Returns a single item of the type in your itemList array of objects
- onFetchData: Emitted when user clicks the component and data is not yet fetched

If the onFetchData output is supplied, neither the autocomplete nor the table will be shown until the user clicks the field to fetch new data. When the data has been fetched, the autocomplete input and table will be available for use.
