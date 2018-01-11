import {Application} from "express";
import {initialize, use} from "passport";
import {BasicStrategy} from "passport-http";
import {Strategy as BearerStrategy} from "passport-http-bearer";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {Strategy as FacebookStrategy} from "passport-facebook";
import {userService} from "../service/userService";
import {Strategy as KakaoStrategy} from "passport-kakao";
import {Strategy as NaverStrategy} from "passport-naver";

export function securityConfig(app: Application) {
    app.use(initialize());
    use(new BasicStrategy((username, password, done: (err?: any, profile?: any) => void) => {
        userService.certification({
            username,
            credentials: password
        }, "password")
            .subscribe((user: any) => {
                done(null, user);
            }, err => {
                done(err);
            });
    }));
    use(new BearerStrategy(process.env.SECRET, (token: any, done: (err?: any, result?: any) => void) => {
        done(null, token);
    }));
    use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            userService.certification(profile, "google")
                .subscribe((user: any) => {
                    done(null, user);
                }, err => {
                    done(err);
                });
        }
    ));
    use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos", "email"]
        },
        (accessToken, refreshToken, profile, done) => {
            userService.certification(profile, "facebook")
                .subscribe((user: any) => {
                    done(null, user);
                }, err => {
                    done(err);
                });
        }
    ));
    use(new KakaoStrategy({
            clientID: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/kakao/callback"
        },
        (accessToken: any, refreshToken: any, profile: any, done: any) => {
            console.log(profile);
            userService.certification(profile, "kakao")
                .subscribe((user: any) => {
                    done(null, user);
                }, err => {
                    done(err);
                });
        }
    ));
    use(new NaverStrategy({
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/naver/callback"
        },
        (accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
            userService.certification(profile, "naver")
                .subscribe((user: any) => {
                    done(null, user);
                }, err => {
                    done(err);
                });
        }
    ));
}
