import {Observable, Subscription} from "rx";
import {NextFunction, Response} from "express";

declare module "express" {
    export interface Request {
        token?: string;
    }
}

declare module "mysql" {
    export interface Connection {
        queryAsObservable(sql: string, values?: any): Observable<any>;
    }
}

declare module "rx" {
    export interface Observable<T> {
        toJSON<TResult>(): Observable<TResult>;

        toJSONList<TResult>(): Observable<TResult>;

        subscribeToJSON(res: Response, next: NextFunction, httpError?: any): Subscription;
    }
}
