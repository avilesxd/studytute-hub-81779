/**
 * The PrivacyPolicy component in this TypeScript React code defines a privacy policy for a tutoring platform, outlining the collection, use,
 * and sharing of personal information, as well as data security measures and user rights.
 * @returns The `PrivacyPolicy` component is being returned, which contains the JSX structure defining the privacy policy content of a tutoring
 * platform. The content includes sections such as Introduction, Information that we Collect, How we Use your Information, Sharing your
 * Information, Data Security, Your Rights, Changes to this Privacy Policy, and Contact information.
 */
const PrivacyPolicy = () => {
  return (
    <div className='prose dark:prose-invert max-w-none'>
      <h1>Política de Privacidad</h1>
      <p>Última actualización: 4 de noviembre de 2025</p>

      <h2>1. Introducción</h2>
      <p>
        La Universidad Arica ("nosotros", "nuestro") se compromete a proteger la
        privacidad de los usuarios de su plataforma de tutorías (en adelante,
        "la Plataforma"). Esta Política de Privacidad describe cómo recopilamos,
        utilizamos y compartimos su información personal.
      </p>

      <h2>2. Información que Recopilamos</h2>
      <p>Podemos recopilar la siguiente información personal:</p>
      <ul>
        <li>
          Información de registro: Nombre, dirección de correo electrónico,
          contraseña, número de identificación de estudiante.
        </li>
        <li>
          Información de perfil: Información adicional que usted decida
          proporcionar, como su área de estudio, intereses de tutoría,
          experiencia, etc.
        </li>
        <li>
          Información de uso: Datos sobre cómo interactúa con la Plataforma,
          incluyendo las páginas visitadas, el tiempo de permanencia, las
          búsquedas realizadas y las tutorías a las que se inscribe o imparte.
        </li>
        <li>
          Información técnica: Dirección IP, tipo de navegador, sistema
          operativo, identificadores de dispositivos.
        </li>
      </ul>

      <h2>3. Cómo Utilizamos su Información</h2>
      <p>Utilizamos su información personal para:</p>
      <ul>
        <li>Proveer, operar y mantener la Plataforma.</li>
        <li>Personalizar su experiencia en la Plataforma.</li>
        <li>Facilitar la conexión entre estudiantes y tutores.</li>
        <li>Comunicarnos con usted sobre su cuenta o los servicios.</li>
        <li>
          Mejorar nuestros servicios y desarrollar nuevas funcionalidades.
        </li>
        <li>Detectar, prevenir y abordar fraudes o actividades ilegales.</li>
        <li>Cumplir con nuestras obligaciones legales.</li>
      </ul>

      <h2>4. Compartir su Información</h2>
      <p>
        No vendemos ni alquilamos su información personal a terceros. Podemos
        compartir su información con:
      </p>
      <ul>
        <li>
          Proveedores de servicios: Terceros que nos ayudan a operar la
          Plataforma (por ejemplo, alojamiento, análisis de datos, soporte al
          cliente).
        </li>
        <li>
          Tutores/Estudiantes: Información relevante para facilitar las sesiones
          de tutoría (por ejemplo, nombre del tutor al estudiante inscrito).
        </li>
        <li>
          Requisitos legales: Cuando sea necesario para cumplir con la ley,
          responder a procesos legales o proteger nuestros derechos.
        </li>
      </ul>

      <h2>5. Seguridad de los Datos</h2>
      <p>
        Implementamos medidas de seguridad razonables para proteger su
        información personal contra el acceso no autorizado, la alteración, la
        divulgación o la destrucción. Sin embargo, ninguna transmisión por
        Internet o método de almacenamiento electrónico es 100% seguro.
      </p>

      <h2>6. Sus Derechos</h2>
      <p>Usted tiene derecho a:</p>
      <ul>
        <li>Acceder a su información personal y solicitar una copia.</li>
        <li>Solicitar la corrección de información inexacta.</li>
        <li>Solicitar la eliminación de su información personal.</li>
        <li>Oponerse al procesamiento de su información personal.</li>
      </ul>
      <p>
        Para ejercer estos derechos, póngase en contacto con nosotros en [correo
        electrónico de contacto].
      </p>

      <h2>7. Cambios a esta Política de Privacidad</h2>
      <p>
        Podemos actualizar nuestra Política de Privacidad periódicamente. Le
        notificaremos cualquier cambio publicando la nueva Política de
        Privacidad en esta página. Se le aconseja revisar esta Política de
        Privacidad periódicamente para cualquier cambio.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Si tiene alguna pregunta sobre esta Política de Privacidad, póngase en
        contacto con nosotros en director@uarica.cl.
      </p>
    </div>
  )
}

export default PrivacyPolicy
