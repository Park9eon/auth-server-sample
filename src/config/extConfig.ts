import {Observable, Subscription} from "rx";
import {NextFunction, Response} from "express";
import {dataSource} from "../dataSource";

export function extConfig() {
    const Connection = require("mysql/lib/Connection");
    Connection.prototype.queryAsObservable = function(sql: string, values?: any) {
        return dataSource.query(sql, values, this);
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
