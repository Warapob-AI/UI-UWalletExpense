import { UWE } from "../UWEBizDTO";

export class UWEBizStockInvestmentDTO extends UWE {
  public static readonly STOCK_CREATE_BY    = 'stock_create_by';
  public static readonly STOCK_CREATE_DT    = 'stock_create_dt';
  public static readonly STOCK_MODIFY_BY    = 'stock_modify_by';
  public static readonly STOCK_MODIFY_DT    = 'stock_modify_dt';
  public static readonly STOCK_SYMBOL       = 'stock_symbol';
  public static readonly STOCK_TYPE         = 'stock_type';
  public static readonly STOCK_DESCRIPTION  = 'stock_description';
  public static readonly STOCK_ACTION       = 'stock_action';
  public static readonly STOCK_QUANTITY     = 'stock_quantity';
  public static readonly STOCK_PRICE        = 'stock_price';
  public static readonly STOCK_FUNDING      = 'stock_funding';
  public static readonly STOCK_STATUS       = 'stock_status';
  public static readonly STOCK_USER_NAME    = 'stock_user_name';
  public static readonly STOCK_TRADE_DATE   = 'stock_trade_date';

  public stock_create_by?:   string;
  public stock_create_dt?:   string;
  public stock_modify_by?:   string;
  public stock_modify_dt?:   string;
  public stock_symbol?:      string;
  public stock_type?:        string;
  public stock_description?: string;
  public stock_action?:      string;
  public stock_quantity?:    number;
  public stock_price?:       number;
  public stock_funding?:     number;
  public stock_status?:      string;
  public stock_user_name?:   string;
  public stock_trade_date?:  string;
}