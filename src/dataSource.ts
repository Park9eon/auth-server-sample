import {PoolConnection} from "mysql";
import {Observable} from "rx";
import {connectionPool} from "./config/dbConfig";

class DataSource {
    getConnection(): Observable<PoolConnection> {
        return Observable.fromNodeCallback<PoolConnection>(connectionPool.getConnection, connectionPool)()
            .share();
    }

    query(sql: string, values?: any, connection?: PoolConnection): Observable<any> {
        if (connection) {
            return Observable.fromNodeCallback<any>(connection.query, connection)(sql, values);
        } else {
            return Observable.fromNodeCallback<any>(connectionPool.query, connectionPool)(sql, values);
        }
    }

    beginTransaction(queryObservable: (connection: PoolConnection) => Observable<any>): Observable<any> {
        return this.getConnection().flatMap((connection: PoolConnection) => {
            return Observable.fromNodeCallback<any>(connection.beginTransaction, connection)()
                .flatMap(() => {
                    return queryObservable(connection)
                        .doOnCompleted(() => {
                            connection.commit(err => {
                                if (err) {
                                    throw err;
                                }
                                connection.release();
                            });
                        }, connection)
                        .doOnError(err => {
                            connection.rollback(() => {
                                throw err;
                            });
                        }, connection);
                });
        });
    }
}

export const dataSource = new DataSource();
