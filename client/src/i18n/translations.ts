// Translation keys and texts for multi-language support
// This will be expanded in the future to support 4 languages

export type Language = 'en' | 'de' | 'fr' | 'es';

export interface TranslationKey {
  // Navigation
  nav: {
    home: string;
    products: string;
    cart: string;
    profile: string;
    orders: string;
    wishlist: string;
    login: string;
    register: string;
    logout: string;
    search: string;
    account: string;
  };
  
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    update: string;
    create: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    close: string;
    search: string;
    required: string;
    optional: string;
  };
  
  // Profile
  profile: {
    myProfile: string;
    personalInformation: string;
    addressInformation: string;
    preferences: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    language: string;
    currency: string;
    notifications: string;
    uploadImage: string;
    changeProfilePicture: string;
    removeImage: string;
  };
  
  // Admin
  admin: {
    adminPanel: string;
    dashboard: string;
    users: string;
    analytics: string;
    settings: string;
    totalUsers: string;
    totalOrders: string;
    totalRevenue: string;
  };
  
  // Messages
  messages: {
    profileUpdated: string;
    profileUpdateFailed: string;
    loginSuccessful: string;
    logoutSuccessful: string;
    registrationSuccessful: string;
  };
  
  // Form Labels
  form: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
  };
  
  // Languages
  languages: {
    english: string;
    german: string;
    french: string;
    spanish: string;
  };
  
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
}

export const translations: Record<Language, TranslationKey> = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      profile: 'Profile',
      orders: 'Orders',
      wishlist: 'Wishlist',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      search: 'Search',
      account: 'Account',
    },
    
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      update: 'Update',
      create: 'Create',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      close: 'Close',
      search: 'Search',
      required: 'Required',
      optional: 'Optional',
    },
    
    profile: {
      myProfile: 'My Profile',
      personalInformation: 'Personal Information',
      addressInformation: 'Address Information',
      preferences: 'Preferences',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      streetAddress: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      country: 'Country',
      language: 'Language',
      currency: 'Currency',
      notifications: 'Email Notifications',
      uploadImage: 'Upload Image',
      changeProfilePicture: 'Change Profile Picture',
      removeImage: 'Remove Image',
    },
    
    admin: {
      adminPanel: 'Admin Panel',
      dashboard: 'Dashboard',
      users: 'Users',
      analytics: 'Analytics',
      settings: 'Settings',
      totalUsers: 'Total Users',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
    },
    
    messages: {
      profileUpdated: 'Profile updated successfully!',
      profileUpdateFailed: 'Failed to update profile',
      loginSuccessful: 'Login successful!',
      logoutSuccessful: 'Logged out successfully',
      registrationSuccessful: 'Registration successful',
    },
    
    form: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone',
      address: 'Address',
    },
    
    languages: {
      english: 'English',
      german: 'German',
      french: 'French',
      spanish: 'Spanish',
    },
    
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
    }
  },
  de: {
    nav: {
      home: 'Startseite',
      products: 'Produkte',
      cart: 'Warenkorb',
      profile: 'Profil',
      orders: 'Bestellungen',
      wishlist: 'Wunschliste',
      login: 'Anmelden',
      register: 'Registrieren',
      logout: 'Abmelden',
      search: 'Suchen',
      account: 'Konto',
    },
    
    common: {
      loading: 'Lädt...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      update: 'Aktualisieren',
      create: 'Erstellen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Vorherige',
      submit: 'Absenden',
      close: 'Schließen',
      search: 'Suchen',
      required: 'Erforderlich',
      optional: 'Optional',
    },
    
    profile: {
      myProfile: 'Mein Profil',
      personalInformation: 'Persönliche Informationen',
      addressInformation: 'Adressinformationen',
      preferences: 'Einstellungen',
      fullName: 'Vollständiger Name',
      emailAddress: 'E-Mail-Adresse',
      phoneNumber: 'Telefonnummer',
      streetAddress: 'Straßenadresse',
      city: 'Stadt',
      state: 'Bundesland',
      zipCode: 'Postleitzahl',
      country: 'Land',
      language: 'Sprache',
      currency: 'Währung',
      notifications: 'E-Mail-Benachrichtigungen',
      uploadImage: 'Bild hochladen',
      changeProfilePicture: 'Profilbild ändern',
      removeImage: 'Bild entfernen',
    },
    
    admin: {
      adminPanel: 'Admin-Panel',
      dashboard: 'Dashboard',
      users: 'Benutzer',
      analytics: 'Analytik',
      settings: 'Einstellungen',
      totalUsers: 'Gesamte Benutzer',
      totalOrders: 'Gesamte Bestellungen',
      totalRevenue: 'Gesamtumsatz',
    },
    
    messages: {
      profileUpdated: 'Profil erfolgreich aktualisiert!',
      profileUpdateFailed: 'Profil-Update fehlgeschlagen',
      loginSuccessful: 'Anmeldung erfolgreich!',
      logoutSuccessful: 'Erfolgreich abgemeldet',
      registrationSuccessful: 'Registrierung erfolgreich',
    },
    
    form: {
      name: 'Name',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      phone: 'Telefon',
      address: 'Adresse',
    },
    
    languages: {
      english: 'Englisch',
      german: 'Deutsch',
      french: 'Französisch',
      spanish: 'Spanisch',
    },
    
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
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      products: 'Produits',
      cart: 'Panier',
      profile: 'Profil',
      orders: 'Commandes',
      wishlist: 'Liste de souhaits',
      login: 'Connexion',
      register: 'S\'inscrire',
      logout: 'Déconnexion',
      search: 'Rechercher',
      account: 'Compte',
    },
    
    common: {
      loading: 'Chargement...',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      update: 'Mettre à jour',
      create: 'Créer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      submit: 'Soumettre',
      close: 'Fermer',
      search: 'Rechercher',
      required: 'Requis',
      optional: 'Optionnel',
    },
    
    profile: {
      myProfile: 'Mon Profil',
      personalInformation: 'Informations personnelles',
      addressInformation: 'Informations d\'adresse',
      preferences: 'Préférences',
      fullName: 'Nom complet',
      emailAddress: 'Adresse e-mail',
      phoneNumber: 'Numéro de téléphone',
      streetAddress: 'Adresse de rue',
      city: 'Ville',
      state: 'État',
      zipCode: 'Code postal',
      country: 'Pays',
      language: 'Langue',
      currency: 'Devise',
      notifications: 'Notifications par e-mail',
      uploadImage: 'Télécharger une image',
      changeProfilePicture: 'Changer la photo de profil',
      removeImage: 'Supprimer l\'image',
    },
    
    admin: {
      adminPanel: 'Panneau d\'administration',
      dashboard: 'Tableau de bord',
      users: 'Utilisateurs',
      analytics: 'Analytique',
      settings: 'Paramètres',
      totalUsers: 'Total des utilisateurs',
      totalOrders: 'Total des commandes',
      totalRevenue: 'Revenus totaux',
    },
    
    messages: {
      profileUpdated: 'Profil mis à jour avec succès !',
      profileUpdateFailed: 'Échec de la mise à jour du profil',
      loginSuccessful: 'Connexion réussie !',
      logoutSuccessful: 'Déconnexion réussie',
      registrationSuccessful: 'Inscription réussie',
    },
    
    form: {
      name: 'Nom',
      email: 'E-mail',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      phone: 'Téléphone',
      address: 'Adresse',
    },
    
    languages: {
      english: 'Anglais',
      german: 'Allemand',
      french: 'Français',
      spanish: 'Espagnol',
    },
    
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
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      products: 'Productos',
      cart: 'Carrito',
      profile: 'Perfil',
      orders: 'Pedidos',
      wishlist: 'Lista de deseos',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      logout: 'Cerrar sesión',
      search: 'Buscar',
      account: 'Cuenta',
    },
    
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      update: 'Actualizar',
      create: 'Crear',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Enviar',
      close: 'Cerrar',
      search: 'Buscar',
      required: 'Requerido',
      optional: 'Opcional',
    },
    
    profile: {
      myProfile: 'Mi Perfil',
      personalInformation: 'Información personal',
      addressInformation: 'Información de dirección',
      preferences: 'Preferencias',
      fullName: 'Nombre completo',
      emailAddress: 'Dirección de correo electrónico',
      phoneNumber: 'Número de teléfono',
      streetAddress: 'Dirección de la calle',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: 'Código postal',
      country: 'País',
      language: 'Idioma',
      currency: 'Moneda',
      notifications: 'Notificaciones por correo electrónico',
      uploadImage: 'Subir imagen',
      changeProfilePicture: 'Cambiar foto de perfil',
      removeImage: 'Eliminar imagen',
    },
    
    admin: {
      adminPanel: 'Panel de administración',
      dashboard: 'Panel de control',
      users: 'Usuarios',
      analytics: 'Análisis',
      settings: 'Configuración',
      totalUsers: 'Total de usuarios',
      totalOrders: 'Total de pedidos',
      totalRevenue: 'Ingresos totales',
    },
    
    messages: {
      profileUpdated: '¡Perfil actualizado exitosamente!',
      profileUpdateFailed: 'Error al actualizar el perfil',
      loginSuccessful: '¡Inicio de sesión exitoso!',
      logoutSuccessful: 'Sesión cerrada exitosamente',
      registrationSuccessful: 'Registro exitoso',
    },
    
    form: {
      name: 'Nombre',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      phone: 'Teléfono',
      address: 'Dirección',
    },
    
    languages: {
      english: 'Inglés',
      german: 'Alemán',
      french: 'Francés',
      spanish: 'Español',
    },
    
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