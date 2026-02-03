export default function generateEmail() {
    const alias = `test${Math.floor(Math.random() * 100)}`;
    const defaultEmail = `daonguyenthinh96+${alias}@gmail.com`;
    return defaultEmail;
}