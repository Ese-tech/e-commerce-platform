import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Datenschutz = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Startseite</span>
        </Link>
        
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-gold-dark)' }}>
          Datenschutzerklärung
        </h1>
      </div>

      <div className="card space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            1. Datenschutz auf einen Blick
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Allgemeine Hinweise</h3>
              <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Datenerfassung auf dieser Website</h3>
              <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
              <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            2. Hosting und Content Delivery Networks (CDN)
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Externes Hosting</h3>
              <p>Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            3. Allgemeine Hinweise und Pflichtinformationen
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Datenschutz</h3>
              <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Hinweis zur verantwortlichen Stelle</h3>
              <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p><strong>Ese-tech GmbH</strong></p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
                <p>Telefon: +49 (0) 123 456789</p>
                <p>E-Mail: info@ese-tech.de</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            4. Datenerfassung auf dieser Website
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Cookies</h3>
              <p>Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (dauerhafte Cookies) auf Ihrem Endgerät gespeichert.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Server-Log-Dateien</h3>
              <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Kontaktformular</h3>
              <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Registrierung auf dieser Website</h3>
              <p>Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen der Seite zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            5. Ihre Rechte
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Sie haben jederzeit das Recht:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten und deren Verarbeitung zu verlangen</li>
              <li>Berichtigung unrichtiger personenbezogener Daten zu verlangen</li>
              <li>Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
              <li>Einschränkung der Datenverarbeitung zu verlangen</li>
              <li>Widerspruch gegen die Verarbeitung Ihrer Daten zu erheben</li>
              <li>Datenübertragbarkeit zu verlangen</li>
            </ul>
            <p className="mt-4">Bei Fragen zum Datenschutz wenden Sie sich bitte an: <strong>datenschutz@ese-tech.de</strong></p>
          </div>
        </section>

        <section className="pt-6 border-t" style={{ borderColor: 'var(--color-gold-light)' }}>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Erstellt mit:</strong> ShopHub E-Commerce Platform by Ese-tech<br />
            <strong>Stand:</strong> November 2025<br />
            <strong>DSGVO-konform</strong> nach deutschem Recht
          </p>
        </section>
      </div>
    </div>
  );
};

export default Datenschutz;