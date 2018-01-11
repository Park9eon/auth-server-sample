import {NextFunction, Request, Response} from "express";
import {authenticate} from "passport";
import * as createHttpError from "http-errors";

export const basicAuthorize = (req: Request,
                               res: Response,
                               next: NextFunction) => {
    return authenticate("basic", (err: any, user: any, authInfo: any) => {
        if (err || user === false) {
            next(createHttpError(401));
        } else {
            req.authInfo = authInfo;
            req.user = user;
            next();
        }
    })(req, res, next);
};

export const bearAuthorize = (req: Request,
                              res: Response,
                              next: NextFunction) => {
    return authenticate("bearer", (err: any, user: any, authInfo: any) => {
        if (err || user === false) {
            next(createHttpError(401));
        } else {
            req.authInfo = authInfo;
            req.user = user;
            next();
        }
    })(req, res, next);
};

export const googleBasicAuthorize = authenticate("google", {scope: ["profile", "email"]});

export const googleBearerAuthorize = (req: Request,
                                      res: Response,
                                      next: NextFunction) => {
    return authenticate("google", (err: any, user: any, authInfo: any) => {
        if (err || user === false) {
            next(createHttpError(401));
        } else {
            req.authInfo = authInfo;
            req.user = user;
            next();
        }
    })(req, res, next);
};

export const facebookBasicAuthorize = authenticate("facebook", {scope: ["email"]});

export const facebookBearerAuthorize = (req: Request,
                                        res: Response,
                                        next: NextFunction) => {
    return authenticate("facebook", (err: any, user: any, authInfo: any) => {
        if (err || user === false) {
            next(createHttpError(401));
        } else {
            req.authInfo = authInfo;
            req.user = user;
            next();
        }
    })(req, res, next);
};

export const kakaoBasicAuthorize = authenticate("kakao", {scope: [""]});

export const kakaoBearerAuthorize = (req: Request,
                                     res: Response,
                                     next: NextFunction) => {
    return authenticate("kakao", (err: any, user: any, authInfo: any) => {
        if (err || user === false) {
            next(createHttpError(401));
        } else {
            req.authInfo = authInfo;
            req.user = user;
            next();
        }
    })(req, res, next);
};

export const naverBasicAuthorize = authenticate("naver");

export const naverBearerAuthorize = (req: Request,
                                     res: Response,
                                     next: NextFunction) => {
    return authenticate("naver", (err: any, user: any, authInfo: any) => {
        if (err || user === false) {
            next(createHttpError(401));
        } else {
            req.authInfo = authInfo;
            req.user = user;
            next();
        }
    })(req, res, next);
};
