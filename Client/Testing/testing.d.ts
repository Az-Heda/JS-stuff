
declare type returnFailure = 0;
declare type returnSuccess = 1;
declare type returnWarning = -1;
declare type returnInfo = 2;

export declare class Testing {
	static failure(title: string, message: string): returnFailure;
	static success(title: string, message: string): returnSuccess;
	static warning(title: string, message: string): returnWarning;
	static info(title: string, message: string): returnInfo;

	static assert(condition: boolean, title: string): void;
	static assertEqual(actual: any, expected: any, title: string): returnFailure | returnSuccess;
	static assertNotEqual(actual: any, expected: any, title: string): returnFailure | returnSuccess;
	static assertLess(actual: string | number, expected: string | number, title: string): returnFailure | returnSuccess;
	static assertLessThan(actual: string | number, expected: string | number, title: string): returnFailure | returnSuccess;
	static assertGreater(actual: string | number, expected: string | number, title: string): returnFailure | returnSuccess;
	static assertGreaterThan(actual: string | number, expected: string | number, title: string): returnFailure | returnSuccess;
	static contains(array: Array<any>, value: any, title: string): returnFailure | returnSuccess;
	static pattern(pattern: RegExp, string: string, title: string): returnFailure | returnSuccess;
	static benchmark(title: string, fn: Function, thisArgs: any | null, ...args: Array<any>): void;
}