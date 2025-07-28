import { jsx as _jsx } from "react/jsx-runtime";
function Spinner({ small = false }) {
    return (_jsx("div", { className: `spinner ${small ? "spinner-sm" : ""}` }));
}
export default Spinner;
