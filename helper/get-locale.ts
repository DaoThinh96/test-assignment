export const getLocale = (
    language: string,
    english: object,
    vietnamese: object
) => {
    let fn;
    const locale = {
        english: function () {
            return english;
        },
        vietnamese: function () {
            return vietnamese;
        },
    };
    if (locale[language]) {
        fn = locale[language];
    } else {
        fn = locale["english"];
    }
    return fn();
}