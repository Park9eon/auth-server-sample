import {Observable} from "rx";
import {compareSync, hashSync} from "bcrypt-nodejs";
import {db} from "../db";
import {sign, verify} from "jsonwebtoken";
import {PoolConnection} from "mysql";

export namespace userService {

    function findOne(key: string, value: any, connection?: PoolConnection): Observable<any> {
        // language=MySQL
        return db.query(`SELECT
                           id,
                           username
                         FROM user
                         WHERE ? = ?;`, [key, value], connection)
            .toJSON();
    }

    export function findById(id: number, connection?: PoolConnection): Observable<any> {
        return findOne("id", id, connection);
    }

    export function findByUsername(username: string, connection?: PoolConnection): Observable<any> {
        return findOne("username", username, connection);
    }

    function findUserAndCredentials(key: string, value: any, grantType: string): Observable<any> {
        console.log([key, value, grantType]);
        // language=MySQL
        return db.query(`SELECT
                           u.id,
                           u.username,
                           uc.grant_type,
                           uc.credentials AS credentials
                         FROM user u, user_credentials uc
                         WHERE ${key} = ? AND
                               uc.grant_type = ? AND
                               u.id = uc.user_id;`,
            [value, grantType])
            .doOnNext(result => {
                console.log(result);
            })
            .toJSON();
    }

    // 유저정보 기반 유저와 인증정보를 가져옴
    export function findByUsernameAndGrantType(username: string, grantType: string): Observable<any> {
        return findUserAndCredentials("username", username, grantType);
    }

    // 인증정보기반으로 유저와 인증정보를 가져옴
    export function findByCredentialsAndGrantType(credentials: string, grantType: string): Observable<any> {
        return findUserAndCredentials("credentials", credentials, grantType);
    }

    export function certification(profile: any, grantType: string): Observable<any> {
        switch (grantType) {
            case "password": {
                return findByUsernameAndGrantType(profile.username, grantType)
                    .flatMap((user: any) => {
                        if (compareSync(profile.password, user.credential)) {
                            return Observable.just(user);
                        } else {
                            return Observable.throw(new Error());
                        }
                    });
            }
            default : {
                return findByCredentialsAndGrantType(profile.id, grantType);
            }
        }
    }

    export function create(user: any, grantType: string): Observable<any> {
        return db.beginTransaction((connection: PoolConnection) => {
            // language=MySQL
            return db.query(`INSERT INTO user (username, created) VALUES (?, NOW());`,
                [user.username],
                connection)
                .flatMap(result => {
                    let userId = result[0].insertId;
                    return db.query(`INSERT INTO user_credentials (user_id, grant_type, credentials) VALUES (?, ?, ?)`,
                        [userId, grantType, user.credentials],
                        connection);
                })
                .flatMap(() => {
                    return findByUsername(user.username, connection);
                });
        });
    }
}
