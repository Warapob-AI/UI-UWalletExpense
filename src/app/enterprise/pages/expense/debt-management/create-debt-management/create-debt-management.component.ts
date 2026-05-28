import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundComponent } from '@components/background/background.component';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizExpDebtManagementDTO } from 'src/app/enterprise/biz-dto/UWEExpense/UWEBizExpDebtManagementDTO';
// 🟢 เพิ่มการ Import DTO ของตัวลูกเข้ามาใช้งานโดยตรง
import { UWEBizExpDebtPeriodManagementDTO } from 'src/app/enterprise/biz-dto/UWEExpense/UWEBizExpDebtPeriodManagementDTO'; 
import { UWEBizExpDebtManagementService } from 'src/app/enterprise/biz-service/UWEExpense/UWEBizExpDebtManagementService';
import { UWEBizExpDebtPeriodManagementService } from 'src/app/enterprise/biz-service/UWEExpense/UWEBizExpDebtPeriodManagementService';

@Component({
  selector: 'app-create-debt-management',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent],
  templateUrl: './create-debt-management.component.html',
  styleUrls: ['./create-debt-management.component.scss']
})
export class CreateDebtManagementComponent implements OnInit {
  public initDynamicField!: DynamicField[];
  public formGroup!: FormGroup;
  public isEditMode: boolean = false;
  private editDebtData: any = null;
  private hasSetInitialValues: boolean = false;

  constructor(
    private readonly redirectToService: RedirectToService,
    private readonly uweModalService: UWEModalService,
    private readonly debtService: UWEBizExpDebtManagementService,
    private readonly debtPeriodService: UWEBizExpDebtPeriodManagementService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    const state = history.state;
    if (state && state.debt) {
      this.isEditMode = true;
      this.editDebtData = state.debt;
    }
  }

  ngOnInit(): void {
    this.dynamicField();
  }

  private dynamicField(): void {
    this.initDynamicField = [
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_NAME,
        fieldColumn: 3,
        label: 'Debt Name',
        placeholder: 'e.g. SPaylater, Krungthai',
        validator: { required: true, maxLength: 100 },
      },
      {
        type: 'radio',
        field: UWEBizExpDebtManagementDTO.DEBT_TYPE,
        fieldColumn: 3,
        label: 'Type',
        options: [
          { id: 'paylater', text: 'Paylater' },
          { id: 'loan', text: 'Personal Loan' },
        ],
        defaultValue: 'paylater',
        validator: { required: true },
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_DESCRIPTION,
        fieldColumn: 6,
        label: 'Description',
        placeholder: 'Remark',
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_PRINCIPAL,
        fieldColumn: 3,
        label: 'Principal Amount',
        placeholder: '0.00',
        align: 'end',
        validator: { 
          required: true, 
          number: true,
          decimal: 2
        },
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_INTEREST_YEAR,
        fieldColumn: 3,
        label: 'Interest Rate (%/year)',
        placeholder: '0.00',
        align: 'end',
        validator: { 
          required: true, 
          number: true,
          decimal: 2
        },
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_FEE,
        fieldColumn: 3,
        label: 'Fee',
        placeholder: '0.00',
        align: 'end',
        validator: { 
          number: true,
          decimal: 2
        },
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_INS_AMT,
        fieldColumn: 3,
        label: 'Installment Amount / Month',
        placeholder: '0.00',
        align: 'end',
        validator: { 
          required: true, 
          number: true,
          decimal: 2
        },
      },
      {
        type: 'date',
        field: UWEBizExpDebtManagementDTO.DEBT_START_DATE,
        fieldColumn: 3,
        label: 'Start Date',
        validator: { required: true },
      },
      {
        type: 'empty',
        fieldColumn: 9,
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL,
        fieldColumn: 2,
        label: 'Total Installments',
        placeholder: '',
        align: 'end',
        disabled: true,
        validator: { 
          required: true, 
          number: true,
          decimal: 2
        },
      },
      {
        type: 'date',
        field: UWEBizExpDebtManagementDTO.DEBT_END_DATE,
        fieldColumn: 2,
        label: 'End Date',
        disabled: true,
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL_ALL,
        fieldColumn: 2,
        label: 'Installment Amount Total All',
        placeholder: '',
        align: 'end',
        disabled: true,
        validator: { 
          number: true,
          decimal: 2
        },
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_USER_NAME,
        fieldColumn: 2,
        label: 'User Name',
        placeholder: '',
        disabled: true,
      },
      {
        type: 'radio',
        field: UWEBizExpDebtManagementDTO.DEBT_STATUS,
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

  private parseDateString(val: any): Date | null {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val === 'string') {
      const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (match) {
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
      }
      const matchIso = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (matchIso) {
        return new Date(parseInt(matchIso[1]), parseInt(matchIso[2]) - 1, parseInt(matchIso[3]));
      }
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  }

  private onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsDirty();
      });
      return;
    }

    const payload: any = {
      debt_name:          this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_NAME)?.value,
      debt_type:          this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_TYPE)?.value,
      debt_description:   this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_DESCRIPTION)?.value,
      debt_principal:     this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_PRINCIPAL)?.value,
      debt_interest_year: this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INTEREST_YEAR)?.value,
      debt_fee:           this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_FEE)?.value,
      debt_ins_amt:       this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_AMT)?.value,
      debt_ins_total:     this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL)?.value,
      debt_start_date:    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_START_DATE)?.value,
      debt_end_date:      this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_END_DATE)?.value,
      debt_status:        this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_STATUS)?.value,
      debt_ins_paid:      this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_PAID)?.value,
      debt_ins_total_all: this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL_ALL)?.value,
      debt_user_name:     this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_USER_NAME)?.value,
    };

    if (this.isEditMode) {
      payload.uwe_puid       = this.editDebtData.uwe_puid;
      payload.debt_modify_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
      payload.debt_modify_dt = new Date().toISOString();

      this.debtService.updateDebt(payload).subscribe({
        next: () => {
          const puid   = this.editDebtData.uwe_puid;
          const n      = parseInt(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL)?.value) || 0;
          const insAmt = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_AMT)?.value;
          const start  = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_START_DATE)?.value;

          this.debtPeriodService.deleteByDebtPuid(puid).subscribe({
            next: () => {
              if (n > 0) {
                const periods = this.buildDebtPeriods(puid, n, insAmt, start);
                this.debtPeriodService.createDebtPeriod(periods).subscribe();
              }
              this.uweModalService.show({
                type: 'success',
                title: 'Success',
                message: 'Debt updated successfully',
                onConfirm: () => this.onDebtPage(),
              });
            },
            error: () => {
              this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to update debt periods' });
            }
          });
        },
        error: () => {
          this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to update debt' });
        }
      });
    } else {
      payload.debt_create_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
      payload.debt_create_dt = new Date().toISOString();
      payload.debt_modify_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
      payload.debt_modify_dt = new Date().toISOString();

      this.debtService.createDebt(payload).subscribe({
        next: (res) => {
          const debtPuid = res?.uwe_puid;
          const n        = parseInt(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL)?.value) || 0;
          const insAmt   = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_AMT)?.value;
          const start    = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_START_DATE)?.value;

          if (debtPuid && n > 0) {
            const periods = this.buildDebtPeriods(debtPuid, n, insAmt, start) as UWEBizExpDebtPeriodManagementDTO[];
            this.debtPeriodService.createDebtPeriod(periods).subscribe();
          }

          this.uweModalService.show({
            type: 'success',
            title: 'Success',
            message: 'Debt created successfully',
            onConfirm: () => this.onDebtPage(),
          });
        },
        error: () => {
          this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to create debt' });
        }
      });
    }
  }

  private onClear(): void {
    if (this.isEditMode) {
      this.setFormValues(this.editDebtData);
    } else {
      this.formGroup.reset();
      this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_STATUS)?.setValue('A');
      this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_TYPE)?.setValue('paylater');
    }
  }

  private setFormValues(debt: any): void {
    this.formGroup.patchValue({
      [UWEBizExpDebtManagementDTO.DEBT_NAME]:          debt.debt_name,
      [UWEBizExpDebtManagementDTO.DEBT_TYPE]:          debt.debt_type,
      [UWEBizExpDebtManagementDTO.DEBT_DESCRIPTION]:   debt.debt_description,
      [UWEBizExpDebtManagementDTO.DEBT_PRINCIPAL]:     debt.debt_principal,
      [UWEBizExpDebtManagementDTO.DEBT_INTEREST_YEAR]: debt.debt_interest_year,
      [UWEBizExpDebtManagementDTO.DEBT_FEE]:           debt.debt_fee,
      [UWEBizExpDebtManagementDTO.DEBT_INS_AMT]:       debt.debt_ins_amt,
      [UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL]:     debt.debt_ins_total,
      [UWEBizExpDebtManagementDTO.DEBT_START_DATE]:    debt.debt_start_date,
      [UWEBizExpDebtManagementDTO.DEBT_END_DATE]:      debt.debt_end_date,
      [UWEBizExpDebtManagementDTO.DEBT_STATUS]:        debt.debt_status,
      [UWEBizExpDebtManagementDTO.DEBT_INS_PAID]:      debt.debt_ins_paid,
      [UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL_ALL]: debt.debt_ins_total_all,
      [UWEBizExpDebtManagementDTO.DEBT_USER_NAME]:     debt.debt_user_name,
    });
  }

  private onBack(): void {
    this.onDebtPage();
  }

  private onDebtPage(): void {
    this.redirectToService.to('/expense/debt-management');
  }

  public formGroupField(formGroup: FormGroup): void {
    this.formGroup = formGroup;
    if (this.isEditMode && this.editDebtData && !this.hasSetInitialValues) {
      this.setFormValues(this.editDebtData);
      this.hasSetInitialValues = true;
    }

    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_USER_NAME)?.setValue(
      sessionStorage.getItem('user_name') ?? 'SYSTEM'
    );

    const calcTotal = () => {
      const amt   = parseFloat(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_AMT)?.value)   || 0;
      const total = parseFloat(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL)?.value) || 0;
      const result = parseFloat((amt * total).toFixed(2));
      this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL_ALL)?.setValue(
        result, { emitEvent: false }
      );
    };
    
    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_AMT)?.valueChanges.subscribe(() => calcTotal());
    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL)?.valueChanges.subscribe(() => calcTotal());

    const calcInstallments = () => {
      const principal = parseFloat(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_PRINCIPAL)?.value) || 0;
      const interestYear = parseFloat(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INTEREST_YEAR)?.value) || 0;
      const fee = parseFloat(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_FEE)?.value) || 0;
      const insAmt = parseFloat(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_AMT)?.value) || 0;

      if (principal <= 0 || insAmt <= 0) return;

      const totalPrincipal = principal + fee;
      let n: number;

      if (interestYear === 0) {
        const raw = totalPrincipal / insAmt;
        n = (raw % 1 < 0.01) ? Math.floor(raw) : Math.ceil(raw);
      } else {
        const r = interestYear / 100 / 12;
        n = Math.ceil(Math.log(insAmt / (insAmt - totalPrincipal * r)) / Math.log(1 + r));
      }

      this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL)?.setValue(
        n, { emitEvent: false }
      );

      calcEndDate(n);
    };

    const calcEndDate = (n?: number) => {
      const startDateVal = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_START_DATE)?.value;
      const total = n ?? (parseInt(this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL)?.value) || 0);

      if (!startDateVal || total <= 0) return;

      const start = this.parseDateString(startDateVal);
      if (!start) return;

      const dueDay = start.getDate(); 
      const endMonth = start.getMonth() + (total - 1);
      const endYear = start.getFullYear() + Math.floor(endMonth / 12);
      const endDate = new Date(endYear, endMonth % 12, dueDay);

      const y = endDate.getFullYear();
      const m = String(endDate.getMonth() + 1).padStart(2, '0');
      const d = String(endDate.getDate()).padStart(2, '0');
      
      this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_END_DATE)?.setValue(
        `${y}-${m}-${d}`
      );
    };

    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_PRINCIPAL)?.valueChanges.subscribe(() => calcInstallments());
    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INTEREST_YEAR)?.valueChanges.subscribe(() => calcInstallments());
    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_FEE)?.valueChanges.subscribe(() => calcInstallments());
    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_INS_AMT)?.valueChanges.subscribe(() => calcInstallments());
    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_START_DATE)?.valueChanges.subscribe(() => calcEndDate());
  }

  private buildDebtPeriods(debtPuid: string, n: number, insAmt: string, startDate: string): any[] {
    const userName = sessionStorage.getItem('user_name') ?? 'SYSTEM';
    const now = new Date().toISOString();
    const periods = [];
    
    const startObj = this.parseDateString(startDate);
    if (!startObj) return [];

    const dueDay = startObj.getDate();

    const debtName = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_NAME)?.value;
    const debtType = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_TYPE)?.value;
    const debtDesc = this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_DESCRIPTION)?.value;

    for (let i = 1; i <= n; i++) {
      const month  = startObj.getMonth() + (i - 1);
      const year   = startObj.getFullYear() + Math.floor(month / 12);
      const due    = new Date(year, month % 12, dueDay);
      const d      = String(due.getDate()).padStart(2, '0');
      const m      = String(due.getMonth() + 1).padStart(2, '0');
      const y      = due.getFullYear();

      periods.push({
        [UWEBizExpDebtPeriodManagementDTO.DEBT_PUID_MANAGEMENT]: debtPuid,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_PERIOD]:          String(i),
        [UWEBizExpDebtPeriodManagementDTO.DEBT_INS_AMT]:         insAmt,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_DUE_DATE]:        `${d}/${m}/${y}`,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS]:          'P',
        [UWEBizExpDebtPeriodManagementDTO.DEBT_NAME]:            debtName,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_TYPE]:            debtType,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_DESCRIPTION]:     debtDesc,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_USER_NAME]:       userName,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_CREATE_BY]:       userName,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_CREATE_DT]:       now,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_MODIFY_BY]:       userName,
        [UWEBizExpDebtPeriodManagementDTO.DEBT_MODIFY_DT]:       now,
      });
    }
    return periods;
  }

}