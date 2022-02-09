declare module 'local-queue';
declare type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
