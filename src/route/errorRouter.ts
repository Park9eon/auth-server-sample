import {NextFunction, Request, Response} from "express";
import * as createHttpError from "http-errors";
import * as errorHandler from "api-error-handler";

export function notFoundRouter(req: Request,
                               res: Response,
                               next: NextFunction) {
    next(createHttpError(404));
}

export const errorRouter = (err: any,
                            req: Request,
                            res: Response,
                            next: NextFunction) => {
    errorHandler()(err, req, res, next);
};
