import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundComponent } from '@components/background/background.component';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizStockInvestmentDTO } from 'src/app/enterprise/biz-dto/UWEStock/UWEBizStockInvestmentDTO';
import { UWEBizStockInvestmentService } from 'src/app/enterprise/biz-service/UWEStock/UWEBizStockInvestmentService';

@Component({
  selector: 'app-create-stock-investment',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent],
  templateUrl: './create-stock-investment.component.html',
  styleUrls: ['./create-stock-investment.component.scss'],
})
export class CreateStockInvestmentComponent implements OnInit {
  public initDynamicField!: DynamicField[];
  public formGroup!: FormGroup;

  private editStockData: any = null;
  public isEditMode: boolean = false;
  private hasSetInitialValues: boolean = false;

  constructor(
    private readonly redirectToService: RedirectToService,
    private readonly uweModalService: UWEModalService,
    private readonly stockService: UWEBizStockInvestmentService,
  ) {
    const state = history.state;
    if (state && state.stock) {
      this.isEditMode = true;
      this.editStockData = state.stock;
    }
  }

  ngOnInit(): void {
    this.dynamicField();
  }

  private dynamicField(): void {
    this.initDynamicField = [
      {
        type: 'text',
        field: UWEBizStockInvestmentDTO.STOCK_SYMBOL,
        fieldColumn: 3,
        label: 'Symbol',
        placeholder: 'e.g. NVDA, RKLB, AOT',
        validator: { required: true, maxLength: 20 },
      },
      {
        type: 'radio',
        field: UWEBizStockInvestmentDTO.STOCK_TYPE,
        fieldColumn: 3,
        label: 'Type',
        options: [
          { id: 'growth',   text: 'Growth' },
          { id: 'dividend', text: 'Dividend' },
          { id: 'yield',    text: 'Yield (Bond)' },
        ],
        defaultValue: 'growth',
        validator: { required: true },
      },
      {
        type: 'radio',
        field: UWEBizStockInvestmentDTO.STOCK_ACTION,
        fieldColumn: 3,
        label: 'Action',
        options: [
          { id: 'buy',  text: 'Buy' },
          { id: 'sell', text: 'Sell' },
        ],
        defaultValue: 'buy',
        validator: { required: true },
      },
      {
        type: 'text',
        field: UWEBizStockInvestmentDTO.STOCK_DESCRIPTION,
        fieldColumn: 6,
        label: 'Description',
        placeholder: 'Remark',
      },
      {
        type: 'text',
        field: UWEBizStockInvestmentDTO.STOCK_QUANTITY,
        fieldColumn: 3,
        label: 'Quantity',
        placeholder: '0',
        align: 'end',
        validator: { required: true, number: true, decimal: 7 },
      },
      {
        type: 'text',
        field: UWEBizStockInvestmentDTO.STOCK_PRICE,
        fieldColumn: 3,
        label: 'Price / Share',
        placeholder: '0.00',
        align: 'end',
        validator: { required: true, number: true, decimal: 4 },
      },
      {
        type: 'text',
        field: UWEBizStockInvestmentDTO.STOCK_FUNDING,
        fieldColumn: 3,
        label: 'Funding (Total Cost)',
        placeholder: '0.00',
        align: 'end',
        disabled: true,
        validator: { number: true, decimal: 2 },
      },
      {
        type: 'date',
        field: UWEBizStockInvestmentDTO.STOCK_TRADE_DATE,
        fieldColumn: 3,
        label: 'Trade Date',
        validator: { required: true },
      },
      {
        type: 'text',
        field: UWEBizStockInvestmentDTO.STOCK_USER_NAME,
        fieldColumn: 2,
        label: 'User Name',
				placeholder: 'User Name',
        disabled: true,
      },
      {
        type: 'radio',
        field: UWEBizStockInvestmentDTO.STOCK_STATUS,
        fieldColumn: 3,
        label: 'Status',
        options: [
          { id: 'A', text: 'Active' },
          { id: 'I', text: 'Inactive' },
        ],
        defaultValue: 'A',
        validator: { required: true },
        disabled: !this.isEditMode,
      },
      {
        type: 'empty',
        fieldColumn: 9,
      },
      {
        type: 'button',
        fieldColumn: 1,
        positionX: 'end',
        label: 'Save',
        variant: 'save',
        icon: 'save',
        onClick: () => this.onSave(),
      },
      {
        type: 'button',
        fieldColumn: 1,
        positionX: 'end',
        label: 'Clear',
        variant: 'clear',
        icon: 'clear',
        onClick: () => this.onClear(),
      },
      {
        type: 'button',
        fieldColumn: 1,
        positionX: 'end',
        label: 'Back',
        variant: 'clear',
        icon: 'clear',
        onClick: () => this.onBack(),
      },
    ];
  }

  private calcFunding(): void {
    const qty   = parseFloat(this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_QUANTITY)?.value) || 0;
    const price = parseFloat(this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_PRICE)?.value) || 0;
    const funding = parseFloat((qty * price).toFixed(2));
    this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_FUNDING)?.setValue(funding, { emitEvent: false });
  }

  private onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      Object.keys(this.formGroup.controls).forEach(key => this.formGroup.get(key)?.markAsDirty());
      return;
    }

    if (this.isEditMode) {
      const updatePayload: UWEBizStockInvestmentDTO = {
        uwe_puid:         this.editStockData.uwe_puid,
        stock_symbol:     this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_SYMBOL)?.value,
        stock_type:       this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_TYPE)?.value,
        stock_action:     this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_ACTION)?.value,
        stock_description:this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_DESCRIPTION)?.value,
        stock_status:     this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_STATUS)?.value,
				stock_trade_date:   this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_TRADE_DATE)?.value,
        stock_modify_by:  sessionStorage.getItem('user_name') ?? 'SYSTEM',
        stock_modify_dt:  new Date().toISOString(),
      } as any;

      this.stockService.updateStock(updatePayload).subscribe({
        next: () => {
          this.uweModalService.show({
            type: 'success',
            title: 'Success',
            message: 'Stock updated successfully',
            onConfirm: () => this.onStockPage(),
          });
        },
        error: (err) => {
					console.log('Update stock error:', err);
          this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to update stock' });
        },
      });
    } else {
      const payload: any = {
        stock_symbol:      this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_SYMBOL)?.value,
        stock_type:        this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_TYPE)?.value,
        stock_action:      this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_ACTION)?.value,
        stock_description: this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_DESCRIPTION)?.value,
        stock_quantity:    this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_QUANTITY)?.value,
        stock_price:       this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_PRICE)?.value,
        stock_funding:     this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_FUNDING)?.value,
        stock_trade_date:  this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_TRADE_DATE)?.value,
        stock_status:      this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_STATUS)?.value,
        stock_user_name:   this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_USER_NAME)?.value,
        stock_create_by:   sessionStorage.getItem('user_name') ?? 'SYSTEM',
        stock_create_dt:   new Date().toISOString(),
        stock_modify_by:   sessionStorage.getItem('user_name') ?? 'SYSTEM',
        stock_modify_dt:   new Date().toISOString(),
      };

      this.stockService.createStock(payload).subscribe({
        next: () => {
          this.uweModalService.show({
            type: 'success',
            title: 'Success',
            message: 'Stock created successfully',
            onConfirm: () => this.onStockPage(),
          });
        },
        error: (err) => {
          console.log('Create stock error:', err);
          this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to create stock' });
        },
      });
    }
  }

  private onClear(): void {
    if (this.isEditMode) {
      this.setFormValues(this.editStockData);
    } else {
      this.formGroup.reset();
      this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_STATUS)?.setValue('A');
      this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_TYPE)?.setValue('growth');
      this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_ACTION)?.setValue('buy');
    }
  }

  private setFormValues(stock: any): void {
    this.formGroup.patchValue({
      [UWEBizStockInvestmentDTO.STOCK_SYMBOL]:      stock.stock_symbol,
      [UWEBizStockInvestmentDTO.STOCK_TYPE]:        stock.stock_type,
      [UWEBizStockInvestmentDTO.STOCK_ACTION]:      stock.stock_action,
      [UWEBizStockInvestmentDTO.STOCK_DESCRIPTION]: stock.stock_description,
      [UWEBizStockInvestmentDTO.STOCK_QUANTITY]:    stock.stock_quantity,
      [UWEBizStockInvestmentDTO.STOCK_PRICE]:       stock.stock_price,
      [UWEBizStockInvestmentDTO.STOCK_FUNDING]:     stock.stock_funding,
      [UWEBizStockInvestmentDTO.STOCK_TRADE_DATE]:  stock.stock_trade_date,
      [UWEBizStockInvestmentDTO.STOCK_STATUS]:      stock.stock_status,
      [UWEBizStockInvestmentDTO.STOCK_USER_NAME]:   stock.stock_user_name,
    });
  }

  private onBack(): void {
    this.onStockPage();
  }

  private onStockPage(): void {
    this.redirectToService.to('/stock/stock-investment');
  }

  public formGroupField(formGroup: FormGroup): void {
    this.formGroup = formGroup;

    if (this.isEditMode && this.editStockData && !this.hasSetInitialValues) {
      this.setFormValues(this.editStockData);
      this.hasSetInitialValues = true;
    }

    this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_USER_NAME)?.setValue(
      sessionStorage.getItem('user_name') ?? 'SYSTEM'
    );

    this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_QUANTITY)?.valueChanges.subscribe(() => this.calcFunding());
    this.formGroup.get(UWEBizStockInvestmentDTO.STOCK_PRICE)?.valueChanges.subscribe(() => this.calcFunding());
  }
}