/**
 * Represents a single status option used in columns of type 'status'.
 *
 * @interface DatatableStatusOption
 *
 * @property {string} id
 *   The raw value stored in the data row (used for matching).
 *   Usage: Compared against the row field value to find the display text.
 *   Example: "active"
 *
 * @property {string} text
 *   The human-readable label displayed in the cell.
 *   Usage: Shown in the table cell when id matches the row value.
 *   Example: "Active"
 */
export interface DatatableStatusOption {
  id: string;
  text: string;
}

/**
 * Defines a single action button rendered in the Action column.
 *
 * @interface DatatableAction
 *
 * @property {'Edit' | 'Delete' | 'Approve'} type
 *   The action type. Controls which icon and color are rendered.
 *   - 'Edit'    → pencil icon, primary color
 *   - 'Delete'  → trash icon, red
 *   - 'Approve' → circle-check icon, green
 *   - 'View'    → eye icon, primary color
 *   Usage: Declare each action type you want to show per row.
 *   Example: [{ type: 'Edit' }, { type: 'Approve' }]
 *
 * @property {number} [width]
 *   Optional pixel width allocated to this action button.
 *   Usage: Used to calculate the total Action column width.
 *   Example: 40
 */
export interface DatatableAction {
  type: 'Edit' | 'Delete' | 'Approve' | 'View';
  width?: number;
}
/**
 * Configuration for a single table column.
 *
 * @interface DatatableColumn
 *
 * @property {string | string[]} [field]
 *   The data key(s) from the row object to display.
 *   Usage: Pass an array with separator to combine multiple fields in one cell.
 *   Example: "amount" or ["firstName", "lastName"]
 *
 * @property {string} [label]
 *   The column header text.
 *   Usage: Displayed in the <th> element.
 *   Example: "Amount (THB)"
 *
 * @property {boolean} [sortable]
 *   Whether this column is sortable by clicking the header.
 *   Usage: Set to true to enable server-side sorting on this field.
 *   Example: true
 *
 * @property {string} [separator]
 *   String inserted between combined fields when field is an array.
 *   Usage: Only relevant when field is string[].
 *   Example: " " or ", "
 *
 * @property {'start' | 'center' | 'end'} [align]
 *   Horizontal text alignment for the column cells and header.
 *   Usage: Defaults to 'center' when not specified.
 *   Example: "end"
 *
 * @property {'text' | 'number' | 'date' | 'status' | 'action'} [type]
 *   The display type of the column. Controls formatting behavior.
 *   - 'number' → formatted with toLocaleString using decimal config
 *   - 'date'   → formatted as DD/MM/YYYY in AD or BE
 *   - 'status' → mapped through options array to display text
 *   - 'action' → legacy; use config.action instead
 *   Usage: Determines how formatFieldValue renders the cell value.
 *   Example: "number"
 *
 * @property {number} [decimal]
 *   Number of decimal places for type 'number' columns.
 *   Usage: Defaults to 2 when not specified.
 *   Example: 0
 *
 * @property {'AD' | 'BE'} [dateFormat]
 *   Calendar system for type 'date' columns.
 *   - 'AD' → Gregorian year
 *   - 'BE' → Buddhist Era (Gregorian year + 543)
 *   Usage: Defaults to 'AD' when not specified.
 *   Example: "BE"
 *
 * @property {DatatableStatusOption[]} [options]
 *   List of id→text mappings for type 'status' columns.
 *   Usage: The cell value is matched against id; display text is shown.
 *   Example: [{ id: 'active', text: 'Active' }, { id: 'inactive', text: 'Inactive' }]
 *
 * @property {number} [width]
 *   Column width as a percentage of total table width.
 *   Usage: Applied as both width and min-width on the <th>.
 *   Example: 15
 *
 * @property {boolean} [summary]
 *   Whether to show a sum in the summary row for this column.
 *   Usage: Only applies to type 'number' columns.
 *   Example: true
 *
 * @property {string} [summaryTextLeft]
 *   Static label displayed left-aligned in the summary row cell.
 *   Usage: Use for labeling the summary row (e.g., "Total").
 *   Example: "Total"
 *
 * @property {string} [summaryTextRight]
 *   Static label displayed right-aligned in the summary row cell.
 *   Usage: Use for units or notes beside the summary.
 *   Example: "THB"
 */
export interface DatatableColumn {
  field?: string | string[];
  label?: string;
  sortable?: boolean;
  separator?: string;
  align?: 'start' | 'center' | 'end';
  type?: 'text' | 'number' | 'date' | 'status' | 'action';
  decimal?: number;
  dateFormat?: 'AD' | 'BE';
  options?: DatatableStatusOption[];
  width?: number;
  summary?: boolean;
  summaryTextLeft?: string;
  summaryTextRight?: string;
}

/**
 * Top-level configuration object passed to <app-datatable>.
 *
 * @interface DatatableConfig
 *
 * @property {string} [title]
 *   Header text displayed in the table title bar.
 *   Usage: Shown in the top-left of the header strip.
 *   Example: "Expense List"
 *
 * @property {string} url
 *   API endpoint (POST) used to fetch table data.
 *   Usage: Called with pagination, search, and sort params on every load.
 *   Example: "/api/expenses/list"
 *
 * @property {DatatableColumn[]} columns
 *   Column definitions in display order.
 *   Usage: Each entry maps to one <th>/<td> pair. type 'action' columns are ignored in favor of config.action.
 *   Example: [{ field: 'title', label: 'Title', type: 'text' }]
 *
 * @property {Record<string, any>} [search]
 *   Key-value filter criteria sent in the POST body as JSON.
 *   Usage: Rebuild config and trigger ngOnChanges to apply new filters.
 *   Example: { status: 'active', categoryId: 3 }
 *
 * @property {Record<string, 'asc' | 'desc'>} [orderBy]
 *   Default sort order sent when no column sort is active.
 *   Usage: Overridden by user column-click sorting.
 *   Example: { createdAt: 'desc' }
 *
 * @property {number} [scrollLimitsRow]
 *   Limits the number of rows fetched when using scroll mode (non-paginated).
 *   Usage: Only applied when getAll is false.
 *   Example: 50
 *
 * @property {boolean} [getAll]
 *   When true, fetches all records without pagination.
 *   Usage: Hides the footer pagination controls.
 *   Example: true
 *
 * @property {{ pageSize?: number }} [footer]
 *   Footer configuration for pagination controls.
 *   Usage: Set pageSize to override the default 10 rows per page.
 *   Example: { pageSize: 20 }
 *
 * @property {DatatableAction[]} [action]
 *   Action buttons rendered in the Action column.
 *   Usage: Declare types to show; emits via datatableAction output on click.
 *   Example: [{ type: 'Edit' }, { type: 'Delete' }, { type: 'Approve' }]
 *
 * @property {(row: any) => { edit?: boolean; delete?: boolean; approve?: boolean }} [disabledRow]
 *   Function evaluated per row to disable specific action buttons.
 *   Usage: Return true for an action key to disable that button on the row.
 *   Example: (row) => ({ approve: row.status === 'approved' })
 */
export interface DatatableConfig {
  title?: string;
  url: string;
  columns: DatatableColumn[];
  search?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  scrollLimitsRow?: number;
  getAll?: boolean;
  footer?: {
    pageSize?: number;
  };
  action?: DatatableAction[];
  disabledRow?: (row: any) => { edit?: boolean; delete?: boolean; approve?: boolean; view?: boolean };
}

/**
 * Response shape expected from the datatable API endpoint.
 *
 * @interface DatatableResponse
 *
 * @property {any[]} data
 *   Array of row objects for the current page.
 *   Usage: Mapped directly to table rows.
 *   Example: [{ id: 1, title: 'Lunch', amount: 350 }]
 *
 * @property {number} total
 *   Total number of records across all pages.
 *   Usage: Used to calculate totalPages for pagination.
 *   Example: 128
 */
export interface DatatableResponse {
  data: any[];
  total: number;
}

/**
 * Union type of all supported action button types.
 *
 * @type DatatableActionType
 *
 * Usage: Used as the action field in DatatableActionEvent.
 * Example: 'Edit' | 'Delete' | 'Approve' | 'View'
 */
export type DatatableActionType = 'Edit' | 'Delete' | 'Approve' | 'View';

/**
 * Event payload emitted by the datatableAction output when an action button is clicked.
 *
 * @interface DatatableActionEvent
 *
 * @property {DatatableActionType} action
 *   Which button was clicked.
 *   Usage: Switch on this value in the parent component to handle each action.
 *   Example: 'Approve'
 *
 * @property {any} row
 *   The full data row object for the clicked row.
 *   Usage: Use row.id or any field to identify and process the record.
 *   Example: { id: 42, title: 'Taxi', amount: 120, status: 'pending' }
 */
export interface DatatableActionEvent {
  action: DatatableActionType;
  row: any;
}