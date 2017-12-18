import {Observable} from "rx";
import {NextFunction, Request, Response} from "express";
import {userService} from "../service/userService";
import * as createHttpError from "http-errors";

export namespace userController {

    export function me(req: Request, res: Response, next: NextFunction) {
        userService.findById(req.user.id)
            .subscribeToJSON(res, next);
    }

    export function login(req: Request, res: Response, next: NextFunction) {
        // 기본 언어 설정
        res.send({
            access_token: req.token,
            token_type: "Bearer",
            expires_in: req.user.exp,
            scope: "read write"
        });
    }

    // 인증방식
    export function auth(req: Request, res: Response, next: NextFunction) {
        res.send(req.user);
    }

}