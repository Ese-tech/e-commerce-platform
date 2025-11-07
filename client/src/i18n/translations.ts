// Translation keys and texts for multi-language support
// This will be expanded in the future to support 4 languages

export type Language = 'en' | 'de' | 'fr' | 'es';

export interface TranslationKey {
  // Checkout page
  checkout: {
    shippingInfo: string;
    paymentInfo: string;
    country: string;
    state: string;
    city: string;
    street: string;
    zipCode: string;
    selectCountry: string;
    selectState: string;
    searchCity: string;
    enterStreet: string;
    selectZip: string;
    continueToPayment: string;
    noResults: string;
  };
  // Common
  common: {
    loading: string;
    search: string;
    required: string;
    optional: string;
  };
  // Navigation
  nav: {
    products: string;
    cart: string;
    wishlist: string;
    orders: string;
    account: string;
    logout: string;
  };
}

export const translations: Record<Language, TranslationKey> = {
  en: {
    checkout: {
      shippingInfo: 'Shipping Information',
      paymentInfo: 'Payment Information',
      country: 'Country',
      state: 'State/Region',
      city: 'City',
      street: 'Street Address',
      zipCode: 'ZIP Code',
      selectCountry: 'Select country...',
      selectState: 'Select state/region...',
      searchCity: 'Search city...',
      enterStreet: 'Enter or select street...',
      selectZip: 'Select ZIP code...',
      continueToPayment: 'Continue to Payment',
      noResults: 'No results found'
    },
    common: {
      loading: 'Loading...',
      search: 'Search',
      required: 'Required',
      optional: 'Optional'
    },
    nav: {
      products: 'Products',
      cart: 'Cart',
      wishlist: 'Wishlist',
      orders: 'Orders',
      account: 'Account',
      logout: 'Logout'
    }
  },
  de: {
    checkout: {
      shippingInfo: 'Versandinformationen',
      paymentInfo: 'Zahlungsinformationen',
      country: 'Land',
      state: 'Bundesland/Region',
      city: 'Stadt',
      street: 'Straße und Hausnummer',
      zipCode: 'Postleitzahl',
      selectCountry: 'Land auswählen...',
      selectState: 'Bundesland/Region auswählen...',
      searchCity: 'Stadt suchen...',
      enterStreet: 'Straße eingeben oder auswählen...',
      selectZip: 'Postleitzahl auswählen...',
      continueToPayment: 'Weiter zur Zahlung',
      noResults: 'Keine Ergebnisse gefunden'
    },
    common: {
      loading: 'Lädt...',
      search: 'Suchen',
      required: 'Erforderlich',
      optional: 'Optional'
    },
    nav: {
      products: 'Produkte',
      cart: 'Warenkorb',
      wishlist: 'Wunschliste',
      orders: 'Bestellungen',
      account: 'Konto',
      logout: 'Abmelden'
    }
  },
  fr: {
    checkout: {
      shippingInfo: 'Informations de livraison',
      paymentInfo: 'Informations de paiement',
      country: 'Pays',
      state: 'État/Région',
      city: 'Ville',
      street: 'Adresse',
      zipCode: 'Code postal',
      selectCountry: 'Sélectionner un pays...',
      selectState: 'Sélectionner un état/région...',
      searchCity: 'Rechercher une ville...',
      enterStreet: 'Entrer ou sélectionner une rue...',
      selectZip: 'Sélectionner un code postal...',
      continueToPayment: 'Continuer vers le paiement',
      noResults: 'Aucun résultat trouvé'
    },
    common: {
      loading: 'Chargement...',
      search: 'Rechercher',
      required: 'Requis',
      optional: 'Optionnel'
    },
    nav: {
      products: 'Produits',
      cart: 'Panier',
      wishlist: 'Liste de souhaits',
      orders: 'Commandes',
      account: 'Compte',
      logout: 'Déconnexion'
    }
  },
  es: {
    checkout: {
      shippingInfo: 'Información de envío',
      paymentInfo: 'Información de pago',
      country: 'País',
      state: 'Estado/Región',
      city: 'Ciudad',
      street: 'Dirección',
      zipCode: 'Código postal',
      selectCountry: 'Seleccionar país...',
      selectState: 'Seleccionar estado/región...',
      searchCity: 'Buscar ciudad...',
      enterStreet: 'Introducir o seleccionar calle...',
      selectZip: 'Seleccionar código postal...',
      continueToPayment: 'Continuar al pago',
      noResults: 'No se encontraron resultados'
    },
    common: {
      loading: 'Cargando...',
      search: 'Buscar',
      required: 'Requerido',
      optional: 'Opcional'
    },
    nav: {
      products: 'Productos',
      cart: 'Carrito',
      wishlist: 'Lista de deseos',
      orders: 'Pedidos',
      account: 'Cuenta',
      logout: 'Cerrar sesión'
    }
  }
};

// Hook for future use
export const useTranslation = (language: Language = 'en') => {
  return {
    t: translations[language],
    language
  };
};