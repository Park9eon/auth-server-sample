// database models
interface User {
    id: number;
    username: string;
    created: Date;
}

interface UserCretials {
    id: number; // userId
    userId: number;
    grantType: string; // password, facebook, line, kakao, google
    value: string;
}