import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUpdateUser } from "../../hooks/users/useUsers";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/AuthContext";
function ViewProfile() {
    const { setUser, user } = useAuth();
    const [editEmail, setEditEmail] = useState(false);
    const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();
    const location = useLocation();
    const data = location.state;
    const [email, setEmail] = useState("");
    if (!data) {
        return _jsx("div", { children: "No hay informaci\u00F3n para del usuario." });
    }
    const onEditEmail = () => {
        setEmail(data.email);
        setEditEmail(!editEmail);
    };
    const initials = `${data?.name?.charAt(0) ?? ""}${data?.lastName?.charAt(0) ?? ""}`.toUpperCase();
    const handleSubmitUser = (formData) => {
        const updatedEmail = formData.get("email");
        updateUserMutation({ id: data.id, data: { email: updatedEmail } }, {
            onSuccess: () => {
                toast.success("Correo actualizado correctamente", { duration: 3000 });
                setEditEmail(!editEmail);
                setUser(prev => prev ? { ...prev, email: updatedEmail } : null);
            },
            onError: (error) => {
                console.log("Error al tratar de actualizar usuario", error);
                toast.error(error.message || "Error al tratar de actualizar usuario");
            }
        });
    };
    return (_jsxs("section", { className: "profile-container", children: [_jsxs("header", { className: "profile-header", children: [_jsx("div", { className: "profile-avatar", children: _jsx("div", { className: "avatar-circle", children: initials }) }), _jsxs("div", { className: "profile-info", children: [_jsxs("h1", { className: "profile-name", children: [data.name, " ", data.lastName] }), editEmail ? (_jsxs("div", { children: [_jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            handleSubmitUser(new FormData(e.currentTarget));
                                        }, children: [_jsx("input", { className: "input-edit", type: "email", name: "email", defaultValue: email }), isUpdating ? _jsx(Spinner, { small: true }) : _jsx("button", { type: "submit", disabled: isUpdating, className: "editAction", children: _jsx(Check, { size: 18 }) })] }), _jsx("button", { onClick: onEditEmail, className: "editAction", children: _jsx(X, { size: 18 }) })] }))
                                : (_jsxs("div", { children: [_jsx("p", { className: "profile-email", children: data.email }), _jsx("button", { onClick: onEditEmail, className: "editAction", children: _jsx(Pencil, { size: 18 }) })] }))] })] }), _jsx("div", { className: "profile-body", children: _jsxs("div", { className: "profile-section", children: [_jsx("h2", { children: "Informaci\u00F3n personal" }), _jsxs("p", { children: [_jsx("strong", { children: "Identificaci\u00F3n:" }), " ", data.identificationNum || "N/A"] }), _jsxs("p", { children: [_jsx("strong", { children: "Miembro desde:" }), " ", new Date(data.createdAt).toLocaleDateString()] })] }) })] }));
}
export default ViewProfile;
