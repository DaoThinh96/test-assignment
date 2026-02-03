import { getLocale } from "../../../helper/get-locale";

const english = {
    home: "HOME",
    hello: 'Hello'
}

const vietnamese = {

}

export const jobLocale = () => {
    return getLocale(process.env.language, english, vietnamese);
}
