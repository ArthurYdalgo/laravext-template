import { clsx } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';

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