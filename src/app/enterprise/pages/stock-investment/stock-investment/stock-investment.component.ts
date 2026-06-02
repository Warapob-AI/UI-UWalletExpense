import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundComponent } from '@components/background/background.component';
import { DatatableComponent } from '@components/datatable/datatable.component';
import { DatatableActionEvent, DatatableConfig } from '@components/datatable/datatable.component.interface';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizStockInvestmentDTO } from 'src/app/enterprise/biz-dto/UWEStock/UWEBizStockInvestmentDTO';
import { environment } from 'src/app/environments/environment';
import { UWEBizStockInvestmentService } from 'src/app/enterprise/biz-service/UWEStock/UWEBizStockInvestmentService';

@Component({
  selector: 'app-stock-investment',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent, DatatableComponent],
  templateUrl: './stock-investment.component.html',
  styleUrls: ['./stock-investment.component.scss'],
})
export class StockInvestmentComponent implements OnInit {
  @ViewChild('dataTable') dataTable!: DatatableComponent;

  public initDynamicField!: DynamicField[];
  public formGroup!: FormGroup;

  public urlSelectStock: string = `${environment.PORT_API_ENTERPRISE_UWESTOCK}/stock-investment/select-for-table-stock-investment`;

  constructor(
    private readonly redirectToService: RedirectToService,
    private readonly uweModalService: UWEModalService,
    private readonly stockService: UWEBizStockInvestmentService,
  ) {}

  ngOnInit(): void {
    this.dynamicField();
  }

  private dynamicField(): void {
    this.initDynamicField = [
      {
        type: 'text',
        field: 'search_value',
        fieldColumn: 3,
        label: 'Search Value',
        placeholder: 'Symbol / Description',
      },
      {
        type: 'radio',
        field: UWEBizStockInvestmentDTO.STOCK_STATUS,
        fieldColumn: 3,
        label: 'Status',
        options: [
          { id: 'A', text: 'Active' },
          { id: 'I', text: 'Inactive' },
          { id: 'All', text: 'All' },
        ],
        defaultValue: 'A',
      },
      {
        type: 'button',
        fieldColumn: 1,
        label: 'Search',
        variant: 'search',
        icon: 'search',
        width: 100,
        onClick: () => this.onSearch(),
      },
      {
        type: 'button',
        fieldColumn: 1,
        label: 'Clear',
        variant: 'clear',
        icon: 'clear',
        width: 100,
        onClick: () => this.onClear(),
      },
    ];
  }

  datatableConfig: DatatableConfig = {
    url: this.urlSelectStock,
    title: 'Stock Investment',
		getAll: true,
    search: {
      stock_status: 'A',
      user_name: sessionStorage.getItem('user_name') || '',
    },
    action: [
      { type: 'Edit' },
      { type: 'Delete' },
    ],
    columns: [
      { type: 'action', width: 80 },
      { type: 'text',   field: UWEBizStockInvestmentDTO.STOCK_SYMBOL,      label: 'Symbol',       sortable: true, width: 10 },
      { type: 'text',   field: UWEBizStockInvestmentDTO.STOCK_TYPE,        label: 'Type',         sortable: true, width: 10 },
      { type: 'text',   field: UWEBizStockInvestmentDTO.STOCK_ACTION,      label: 'Action',       sortable: true, width: 8 },
      { type: 'text',   field: UWEBizStockInvestmentDTO.STOCK_DESCRIPTION, label: 'Description',  sortable: true, width: 20 },
      { type: 'number', field: UWEBizStockInvestmentDTO.STOCK_QUANTITY,    label: 'Quantity',     sortable: true, decimal: 7, align: 'end', width: 8 },
      { type: 'number', field: UWEBizStockInvestmentDTO.STOCK_PRICE,       label: 'Price',        sortable: true, decimal: 4, align: 'end', width: 10, summaryTextRight: 'Total' },
      { type: 'number', field: UWEBizStockInvestmentDTO.STOCK_FUNDING,     label: 'Funding',      sortable: true, decimal: 2, align: 'end', width: 10, summary: true },
      { type: 'date',   field: UWEBizStockInvestmentDTO.STOCK_TRADE_DATE,  label: 'Trade Date',   sortable: true, dateFormat: 'AD', width: 10, summaryTextLeft: 'USD' },
      {
        type: 'status',
        field: UWEBizStockInvestmentDTO.STOCK_STATUS,
        label: 'Status',
        sortable: true,
        options: [
          { id: 'A', text: 'Active' },
          { id: 'I', text: 'Inactive' },
        ],
        width: 8,
      },
    ],
    orderBy: { stock_trade_date: 'desc' },
  };

  public onDatatableAction(event: DatatableActionEvent): void {
    switch (event.action) {
      case 'Edit':
        this.redirectToService.to('/stock/stock-investment/create-stock-investment', { state: { stock: event.row } });
        break;

      case 'Delete':
        this.uweModalService.show({
          type: 'warning',
          title: 'Confirm Delete',
          message: `Are you sure you want to delete "${event.row[UWEBizStockInvestmentDTO.STOCK_SYMBOL]}"?`,
          onConfirm: () => this.onConfirmDelete(event),
          showCancelButton: true,
        });
        break;
    }
  }

  public onConfirmDelete(event: DatatableActionEvent): void {
    const puid = event.row['uwe_puid'];
    this.stockService.deleteStock({ uwe_puid: puid } as any).subscribe({
      next: () => {
        this.uweModalService.show({
          type: 'success',
          title: 'Deleted',
          message: `"${event.row[UWEBizStockInvestmentDTO.STOCK_SYMBOL]}" has been deleted successfully.`,
          confirmButtonText: 'Ok, I got it.',
        });
        this.dataTable.refresh();
      },
      error: () => {
        this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to delete stock.' });
      },
    });
  }

  public onSearch(): void {
    const value = this.formGroup.get('search_value')?.value;
    this.datatableConfig = {
      ...this.datatableConfig,
      search: {
        user_name:    sessionStorage.getItem('user_name') || '',
        search_value: value,
        stock_status: this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_STATUS)?.value || 'A',
      },
    };
    this.dataTable?.refresh();
  }

  private onClear(): void {
    this.formGroup.reset();
    this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_STATUS)?.setValue('A');
  }

  public onAddDataTable(): void {
    this.redirectToService.to('/stock/stock-investment/create-stock-investment');
  }

  public onClearDataTable(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: { search_value: '', stock_status: 'A', user_name: sessionStorage.getItem('user_name') || '' },
    };
    this.onClear();
    this.dataTable?.refresh();
  }

  public formGroupField(formGroup: FormGroup): void {
    this.formGroup = formGroup;
  }
}