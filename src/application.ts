import {config as envConfig} from "dotenv";
import * as express from "express";
import {Server} from "http";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import {userRouter} from "./route/userRouter";
import {errorRouter, notFoundRouter} from "./route/errorRouter";
import {securityConfig} from "./config/securityConfig";
import {dbConfig} from "./config/dbConfig";
import {extConfig} from "./config/extConfig";

export class Application {
    private app: express.Application;
    private server: Server;

    constructor() {
        this.app = express();
        // 기초 설정
        this.config();
        // 라우팅 설정
        this.routeConfig();
    }

    // 기초 설정
    private config() {
        envConfig();
        extConfig();
        dbConfig();
        securityConfig(this.app);
    }

    // 라이팅 설정
    private routeConfig() {
        this.app.set("port", process.env.PORT || 3000);
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(userRouter);
        this.app.use(notFoundRouter);
        this.app.use(errorRouter);
    }

    start() {
        this.server = this.app.listen(this.app.get("port"), () => {
            console.log(("  App is running at http://localhost:%d in %s mode"), this.app.get("port"), this.app.get("env"));
            console.log("  Press CTRL-C to stop\n");
        });
        return this;
    }
}

let application = new Application();
application.start();
