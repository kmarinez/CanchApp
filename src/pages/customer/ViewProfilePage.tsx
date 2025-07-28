import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUpdateUser } from "../../hooks/users/useUsers";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/AuthContext";

function ViewProfile() {
    const {setUser, user } = useAuth();

    const [editEmail, setEditEmail] = useState(false);

    const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();

    const location = useLocation();
    const data = location.state;

    const [email, setEmail] = useState("");

    if (!data) {
        return <div>No hay información para del usuario.</div>;
    }

    const onEditEmail = () => {
        setEmail(data.email)
        setEditEmail(!editEmail);
    }

    const initials = `${data?.name?.charAt(0) ?? ""}${data?.lastName?.charAt(0) ?? ""}`.toUpperCase();

    const handleSubmitUser = (formData: FormData) => {
        const updatedEmail = formData.get("email") as string;

        updateUserMutation(
            { id: data.id, data: {email: updatedEmail} },
            {
                onSuccess: () => {
                    toast.success("Correo actualizado correctamente", { duration: 3000 })
                    
                    setEditEmail(!editEmail)

                    setUser(prev => prev ? { ...prev, email: updatedEmail } : null);
                },
                onError: (error) => {
                    console.log("Error al tratar de actualizar usuario", error);
                    toast.error(error.message || "Error al tratar de actualizar usuario");
                }
            }
        )
    }

    return (
        <section className="profile-container">
            <header className="profile-header">
                <div className="profile-avatar">
                    <div className="avatar-circle">{initials}</div>
                </div>
                <div className="profile-info">
                    <h1 className="profile-name">{data.name} {data.lastName}</h1>
                    {editEmail ? (
                        <div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSubmitUser(new FormData(e.currentTarget))
                                }}
                            >
                                <input className="input-edit" type="email" name="email" defaultValue={email} />
                                {isUpdating ? <Spinner small /> : <button type="submit" disabled={isUpdating} className="editAction"><Check size={18} /></button>}
                            </form>

                            <button onClick={onEditEmail} className="editAction"><X size={18} /></button>
                        </div>)
                        : (
                            <div>
                                <p className="profile-email">{data.email}</p>
                                <button onClick={onEditEmail} className="editAction"><Pencil size={18} /></button>
                            </div>)}
                </div>
            </header>

            <div className="profile-body">
                <div className="profile-section">
                    <h2>Información personal</h2>
                    <p><strong>Identificación:</strong> {data.identificationNum || "N/A"}</p>
                    <p><strong>Miembro desde:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </section>
    );
}

export default ViewProfile;