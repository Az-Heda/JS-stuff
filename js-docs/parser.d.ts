export declare type code = {
	id?: string;
	name?: string;
	type?: string;
	paramnames?: Array<string>;
}

export declare type meta = {
	range?: Array<number>;
	filename?: string;
	lineno?: number;
	columnno?: number;
	path?: string;
	code?: code;
};

export declare type item = {
	comment?: string,
	meta?: meta,
	undocumented?: boolean;
	name?: string;
	longname?: string;
	kind?: string;
	scope?: string;
	memberOf?: string;
	access?: string;
};

export declare type InputObject = {
	_items?: Array<item>;
	_selectedIndexes?: Array<numbers>;
	_selectedItems?: Array<item>;
}

export declare type itemData = {
	path: string;
}

export declare function parser(data: InputObject): void;

export declare function itemParser(data: item): itemData;