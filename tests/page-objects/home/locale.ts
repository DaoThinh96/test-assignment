import { getLocale } from "../../../helper/get-locale";

const english = {
    home: "HOME",
    hello: 'Hello'
}

const vietnamese = {

}

export const homeLocale = () => {
    return getLocale(process.env.language, english, vietnamese);
}
