import * as express from "express";
import {Server} from "http";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import {config as configENV} from "dotenv";
import {configDB} from "./db";
import {userRouter} from "./controller/userRouter";
import {notFoundRouter, errorRouter} from "./controller/errorRouter";
import {configPassport} from "./passport";
import {configExtensions} from "./extension";

class Application {

    public app: express.Application;
    public server: Server;

    constructor() {
        this.app = express();
        // 기초 설정
        this.config();
        // 라우팅 설정
        this.configRouter();
    }

    // 기초 설정
    private config() {
        configExtensions();
        configENV();
        configDB();
        configPassport(this.app);
        this.app.set("port", process.env.PORT || 3000);
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

    // 라이팅 설정
    private configRouter() {
        this.app.use(userRouter);
        this.app.use(notFoundRouter);
        this.app.use(errorRouter);
    }

    public start() {
        this.server = this.app.listen(this.app.get("port"), () => {
            console.log(("  App is running at http://localhost:%d in %s mode"), this.app.get("port"), this.app.get("env"));
            console.log("  Press CTRL-C to stop\n");
        });
        return this;
    }
}

export = new Application().start();

