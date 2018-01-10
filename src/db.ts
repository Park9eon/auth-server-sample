import {createPool, Pool, PoolConnection} from "mysql";
import {Observable} from "rx";

export let connectionPool: Pool;

export function configDB() {
    connectionPool = createPool({
        connectionLimit: 100,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
        database: process.env.MYSQL_DB
    });
    // 커넥션 생성시 로깅
    connectionPool.on("connection", connection => {
        console.log(`Connection ${connection.threadId} connected`);
    });
    // 릴리즈 성공시 로깅
    connectionPool.on("release", connection => {
        console.log(`Connection ${connection.threadId} released`);
    });
}

export namespace db {
    // 연결성
    export function getConnection(): Observable<PoolConnection> {
        return Observable.fromNodeCallback<PoolConnection>(connectionPool.getConnection, connectionPool)()
            .share();
    }

    // 단순 호출은 SELECT문에서 사용.
    export function query(/* language=MySQL */ sql: string, values?: any, connection?: PoolConnection): Observable<any> {
        if (connection) {
            return Observable.fromNodeCallback<any>(connection.query, connection)(sql, values);
        } else {
            return Observable.fromNodeCallback<any>(connectionPool.query, connectionPool)(sql, values);
        }
    }

    // 여러코드 생성시 사용
    export function beginTransaction(queryObservable: (connection: PoolConnection) => Observable<any>): Observable<any> {
        return getConnection().flatMap((connection: PoolConnection) => {
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