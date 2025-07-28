import LogoLoading from "../components/LogoLoading";
import "../styles/LogoLoading.css";

export default function LoadingOverlay({ text = "Cargando..." }) {
  return (
    <div className="loading-modal">
      <LogoLoading />
      <p className="text-white mt-4">{text}</p>
    </div>
  );
}