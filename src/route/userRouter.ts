import {Router} from "express";
import {
    basicAuthorize, bearAuthorize, facebookBasicAuthorize, facebookBearerAuthorize, googleBasicAuthorize,
    googleBearerAuthorize, kakaoBasicAuthorize, kakaoBearerAuthorize, naverBasicAuthorize, naverBearerAuthorize
} from "./middleware";
import {userController} from "../controller/userController";

export let userRouter = Router();

userRouter.all(["/", "/me"], bearAuthorize, userController.me);
userRouter.get("/auth", basicAuthorize, userController.login);
userRouter.get("/auth/callback", basicAuthorize, userController.auth);

userRouter.get("/auth/google", googleBasicAuthorize);
userRouter.get("/auth/google/callback", googleBearerAuthorize, userController.auth);

userRouter.get("/auth/facebook", facebookBasicAuthorize);
userRouter.get("/auth/facebook/callback", facebookBearerAuthorize, userController.auth);

userRouter.get("/auth/kakao", kakaoBasicAuthorize);
userRouter.get("/auth/kakao/callback", kakaoBearerAuthorize, userController.auth);

userRouter.get("/auth/naver", naverBasicAuthorize);
userRouter.get("/auth/naver/callback", naverBearerAuthorize, userController.auth);
