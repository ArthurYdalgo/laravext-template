import { clsx } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';
import { locales } from '@/lib/locale';
import { routeName } from '@laravext/react';
import i18n from 'i18next';
import { route as routeFn } from 'ziggy-js';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const dateToForm = (date, keepNullDatesAsNull = true) => {
    if ((date === null || date === undefined) && keepNullDatesAsNull) return null;

    if(typeof date === "string") {
        return new Date(date);
    }

    return date;
}

export const currentRouteIs = (name) => {
    if (name == null) {
        return false;
    }

    let laravext_current_route_name = routeName();

    // try to look for a route with the prefix of the language keys
    const localeKeys = Object.keys(locales);

    if (typeof name == "string") {
        for(const localeKey of localeKeys) {
            let prefixedName = `${localeKey}.${name}`;
            if ((route().has(prefixedName) && route().current(prefixedName)) || laravext_current_route_name === prefixedName) {
                return true;
            }
        }

        return (route().has(name) && route().current(name)) || laravext_current_route_name === name;
    }

    if (Array.isArray(name)) {
        for(const localeKey of localeKeys) {
            const prefixedNames = name.map((n) => `${locale}.${n}`);
            if (prefixedNames.some((n) => (route().has(n) && route().current(n)) || laravext_current_route_name === n)) {
                return true;
            }
        }

        return name.some((n) => (route().has(n) && route().current(n)) || laravext_current_route_name === n);
    }

    return false;
};

export const localizedRoute = (name, params = {}, absolute = undefined, config = undefined) => {
    // get current i18n locale
    const locale = i18n.language || 'pt';

    // check if the route exists with the locale prefix
    const prefixedName = `${locale}.${name}`;
    
    if (routeFn().has(prefixedName)) {
        return routeFn(prefixedName, params, absolute, config);
    }

    // if not, return the route without the locale prefix
    return routeFn(name, params, absolute, config);
}

export const dateToDateTimeString = (date, time = null) => {
    if (!date) return null;

    if (typeof date === "string") {
        date = new Date(date);
    }

    if (time) {
        if(typeof time === "string") {
            const [hours, minutes] = time.split(":");
            date.setHours(hours);
            date.setMinutes(minutes);
        }else if (time instanceof Date) {
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());
        }
    }

    return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

export const dateToTimeString = (date) => {
    if (!date) return null;

    if (typeof date === "string") {
        date = new Date(date);
    }   

    return moment(date).format("HH:mm");
}

export const dateToDateString = (date, time = null) => {
    if (!date) return null;

    if (typeof date === "string") {
        date = new Date(date);
    }

    if (time) {
        if(typeof time === "string") {
            const [hours, minutes] = time.split(":");
            date.setHours(hours);
            date.setMinutes(minutes);
        }else if (time instanceof Date) {
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());
        }
    }

    return moment(date).format("YYYY-MM-DD");
};

export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";  

    if(!(phoneNumber instanceof String)) {
        phoneNumber = String(phoneNumber);
    }

    if(phoneNumber.length== 0) {
        return "";
    }

    phoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters

    if (phoneNumber.length === 10) {
        return phoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (phoneNumber.length === 11) {
        return phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
        return phoneNumber; // Return as is if not 10 or 11 digits
    }
};

export const formatZipCode = (zipCode) => {
    if (!zipCode) return "";

    if(!(zipCode instanceof String)) {
        zipCode = String(zipCode);
    }

    // format zip code to "12345-678"

    zipCode = zipCode.replace(/\D/g, ""); // Remove non-digit characters
    if (zipCode.length === 8) {
        return zipCode.replace(/(\d{5})(\d{3})/, "$1-$2");
    } else {
        return zipCode; // Return as is if not 8 digits
    }
};

export const env = (key) => {
    return import.meta.env[key];
}

export const appEnv = (key) => {
    return env('VITE_APP_ENV') ?? 'production';
}

export const viteEnv = (key, prefix = 'VITE_') => {
    return env(`${prefix}${key}`);
}

export const isEnvLocal = () => {
    return appEnv() === 'local';
}

export const isEnvProduction = () => {
    return appEnv() === 'production';
}