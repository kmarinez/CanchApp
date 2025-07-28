const dominicanIDValidation = (cedula) => {
    if (cedula.length !== 11)
        return false;
    const digits = cedula.split("").map(Number);
    const verifier = digits.pop();
    const multipliers = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    const total = digits.reduce((acc, d, i) => {
        const res = d * multipliers[i];
        return acc + (res > 9 ? res - 9 : res);
    }, 0);
    const calculated = (10 - (total % 10)) % 10;
    return verifier === calculated;
};
export default dominicanIDValidation;
