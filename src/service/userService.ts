import {Observable} from "rx";
import {compareSync} from "bcrypt-nodejs";
import {dataSource} from "../dataSource";
import {PoolConnection} from "mysql";

export class UserService {
    private findOne(key: string, value: any, connection?: PoolConnection): Observable<any> {
        // language=MySQL
        return dataSource.query(`SELECT
                           id,
                           username
                         FROM user
                         WHERE ? = ?;`, [key, value], connection)
            .toJSON();
    }

    findById(id: number, connection?: PoolConnection): Observable<any> {
        return this.findOne("id", id, connection);
    }

    findByUsername(username: string, connection?: PoolConnection): Observable<any> {
        return this.findOne("username", username, connection);
    }

    findUserAndCredentials(key: string, value: any, grantType: string): Observable<any> {
        console.log([key, value, grantType]);
        // language=MySQL
        return dataSource.query(`SELECT
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
    findByUsernameAndGrantType(username: string, grantType: string): Observable<any> {
        return this.findUserAndCredentials("username", username, grantType);
    }

    // 인증정보기반으로 유저와 인증정보를 가져옴
    findByCredentialsAndGrantType(credentials: string, grantType: string): Observable<any> {
        return this.findUserAndCredentials("credentials", credentials, grantType);
    }

    certification(profile: any, grantType: string): Observable<any> {
        switch (grantType) {
            case "password": {
                return this.findByUsernameAndGrantType(profile.username, grantType)
                    .flatMap((user: any) => {
                        if (compareSync(profile.password, user.credential)) {
                            return Observable.just(user);
                        } else {
                            return Observable.throw(new Error());
                        }
                    });
            }
            default : {
                return this.findByCredentialsAndGrantType(profile.id, grantType);
            }
        }
    }

    create(user: any, grantType: string): Observable<any> {
        return dataSource.beginTransaction((connection: PoolConnection) => {
            // language=MySQL
            return dataSource.query(`INSERT INTO user (username, created) VALUES (?, NOW());`,
                [user.username],
                connection)
                .flatMap(result => {
                    let userId = result[0].insertId;
                    return dataSource.query(`INSERT INTO user_credentials (user_id, grant_type, credentials) VALUES (?, ?, ?)`,
                        [userId, grantType, user.credentials],
                        connection);
                })
                .flatMap(() => {
                    return this.findByUsername(user.username, connection);
                });
        });
    }
}

export const userService = new UserService();
