import { getLocale } from "../../../helper/get-locale";

const english = {
    practice: 'Practice',
    testLoginPage: 'Test Login Page',
    testExceptions: 'Test Exceptions',
    submit: 'Submit',
    loginSuccessfulMessage: 'You logged into a secure area!',
}

const vietnamese = {

}

export const loginLocale = () => {
    return getLocale(process.env.language, english, vietnamese);
}
