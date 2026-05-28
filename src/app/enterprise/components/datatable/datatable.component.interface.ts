export interface DatatableStatusOption {
	id: string;
	text: string;
}

export interface DatatableAction {
	type: 'Edit' | 'Delete';
	width?: number;
}

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
	disabledRow?: (row: any) => { edit?: boolean; delete?: boolean };
}

export interface DatatableResponse {
	data: any[];
	total: number;
}

export type DatatableActionType = 'Edit' | 'Delete';

export interface DatatableActionEvent {
	action: DatatableActionType;
	row: any;
}