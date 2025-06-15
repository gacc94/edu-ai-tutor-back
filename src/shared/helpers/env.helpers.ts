import { isObject } from 'class-validator';

export const deepMerge = (...objects: any[]) => {
    const merge = (target: any, source: any) => {
        if (isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (isObject(source[key])) {
                    if (!target[key] || !isObject(target[key])) {
                        target[key] = {};
                    }
                    merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            });
        }
        return target;
    };

    return objects.reduce((result: any, current: any) => merge(result, current), {});
};

export const removeUndefinedValues = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    const newObj: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        const value = removeUndefinedValues(obj[key]);
        if (value !== undefined && value !== null && (typeof value !== 'object' || Object.keys(value).length > 0)) {
            newObj[key] = value;
        }
    }
    return newObj;
};

export const getRequiredEnv = <T>(key: string): T => {
    return process.env[key] as T;
};
