import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Impressum = () => {
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
          Impressum
        </h1>
      </div>

      <div className="card space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Angaben gemäß § 5 TMG
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Ese-tech GmbH</strong></p>
            <p>Musterstraße 123</p>
            <p>12345 Musterstadt</p>
            <p>Deutschland</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Kontakt
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Telefon:</strong> +49 (0) 123 456789</p>
            <p><strong>E-Mail:</strong> info@ese-tech.de</p>
            <p><strong>Website:</strong> www.ese-tech.de</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Registereintrag
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Registergericht:</strong> Amtsgericht Musterstadt</p>
            <p><strong>Registernummer:</strong> HRB 12345</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Umsatzsteuer-ID
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</strong></p>
            <p>DE123456789</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Geschäftsführung
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Max Mustermann</p>
            <p>Erika Musterfrau</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Max Mustermann</p>
            <p>Musterstraße 123</p>
            <p>12345 Musterstadt</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Haftungsausschluss
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Haftung für Inhalte</h3>
              <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Haftung für Links</h3>
              <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Urheberrecht</h3>
              <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
            </div>
          </div>
        </section>

        <section className="pt-6 border-t" style={{ borderColor: 'var(--color-gold-light)' }}>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Erstellt mit:</strong> ShopHub E-Commerce Platform by Ese-tech<br />
            <strong>Stand:</strong> November 2025
          </p>
        </section>
      </div>
    </div>
  );
};

export default Impressum;