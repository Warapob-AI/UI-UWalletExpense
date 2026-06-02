import { UWE } from "../UWEBizDTO";

export class UWEBizIOFileDTO extends UWE {
	public static readonly IO_CREATE_BY      = 'io_create_by';
	public static readonly IO_CREATE_DT      = 'io_create_dt';
	public static readonly IO_MODIFY_BY      = 'io_modify_by';
	public static readonly IO_MODIFY_DT      = 'io_modify_dt';
	public static readonly IO_DESCRIPTION    = 'io_description';
	public static readonly IO_BASE_64        = 'io_base_64';

	public io_create_by?:     string;
	public io_create_dt?:     string;
	public io_modify_by?:     string;
	public io_modify_dt?:     string;
	public io_description?:   string;
	public io_base_64?:       string;
}