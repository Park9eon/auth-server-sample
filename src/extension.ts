import {Response, NextFunction} from "express";
import {Observable, Subscription} from "rx";
import {db} from "./db";
import * as createHttpError from "http-errors";

const Connection = require("mysql/lib/Connection");

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

export function configExtensions() {

    Connection.prototype.queryAsObservable = function (sql: string, values?: any) {
        return db.query(sql, values, this);
    };

    Observable.prototype.toJSON = function <T>(): Observable<T> {
        return this.map((value: any) => {
            if (value instanceof Array && value[0] instanceof Array) {
                return value[0][0];
            } else {
                return null;
            }
        });
    };

    Observable.prototype.toJSONList = function <T>(): Observable<T> {
        return this.map((value: any) => {
            if (value instanceof Array) {
                return value[0];
            } else {
                return null;
            }
        });
    };

    Observable.prototype.subscribeToJSON = function (res: Response, next: NextFunction, httpError?: any): Subscription {
        return this.subscribe((result: any) => {
            res.send(result);
        }, (err: Error) => {
            if (httpError) {
                next(err);
            } else {
                next(err);
            }
        });
    };
}
