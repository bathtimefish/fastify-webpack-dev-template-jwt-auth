declare namespace IServer {
  interface user {
    id: number,
    name: string,
    address: string,
    birthday: string,
    sex: 'man'|'woman',
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_AUTH_CLIENT_ID: string;
    GOOGLE_AUTH_SECRET: string;
    GOOGLE_AUTH_CALLBACK_URL: string;
    APPSERVER_AUTH_SECRET: string;
    APPSERVER_AUTH_EXPIRED_IN: string;
    APPSERVER_PORT: string;
    UI_AUTH_URL: string;
  }
}