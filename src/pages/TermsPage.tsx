function TermsAndConditionsPage() {
    return (
      <div className="terms-container px-6 py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones de Uso de CanchApp</h1>
  
        <p className="mb-4">
          Bienvenido/a a CanchApp. Al registrarte y utilizar nuestros servicios, aceptas los siguientes términos y condiciones:
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Consentimiento y Uso de Datos</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Eres mayor de edad según la legislación de tu país.</li>
          <li>Aceptas que los datos personales proporcionados serán utilizados exclusivamente para la gestión de tu cuenta y reservas.</li>
          <li>CanchApp no comparte tu información personal con terceros sin tu consentimiento, salvo requerimiento legal.</li>
        </ul>
  
        <h3 className="font-semibold mt-4">b) Base de Datos</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Acceso restringido al personal autorizado.</li>
          <li>Copias de seguridad diarias y políticas de retención.</li>
          <li>Eliminación de cuentas bajo solicitud o inactividad.</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Reglas de Uso y Reservas</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>No se permite reservar una cancha por más de <strong>7 horas consecutivas</strong>.</li>
          <li>Si no te presentas en los primeros <strong>10 minutos</strong>, la reserva puede ser cancelada.</li>
          <li>Comportamientos inadecuados pueden generar cancelaciones o bloqueos de cuenta.</li>
          <li>El staff puede cancelar una reserva sin previo aviso si lo considera necesario.</li>
          <li>No se permite suplantar identidades o proporcionar información falsa.</li>
          <li>No se permite revender, transferir o subarrendar las reservas.</li>
          <li>No se permite dañar intencionalmente las instalaciones, interferir con otros usuarios o usar lenguaje ofensivo.</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Modificaciones</h2>
        <p className="mb-4">
          CanchApp se reserva el derecho de modificar estos términos. Se notificará mediante la plataforma.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Aceptación</h2>
        <p className="mb-4">
          Al registrarte o continuar usando CanchApp, confirmas haber leído y aceptado estos términos en su totalidad.
        </p>
      </div>
    );
  }
  
  export default TermsAndConditionsPage;