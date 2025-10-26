import { mutation } from "./_generated/server";

const seedCompaniesAndTours = mutation({
  args: {},
  handler: async (ctx) => {
    // Obtener las ubicaciones existentes
    const locations = await ctx.db.query("locations").collect();

    // Crear un mapa de ubicaciones por slug para facilitar la referencia
    const locationMap = new Map(locations.map((loc) => [loc.slug, loc._id]));

    // Datos de compañías turísticas en Cusco
    const companiesData = [
      {
        name: "Peru Grand Travel",
        slug: "peru-grand-travel",
        logoUrl: "/companies/peru-grand-travel.jpg",
      },
      {
        name: "Inca Trail Expeditions",
        slug: "inca-trail-expeditions",
        logoUrl: "/companies/inca-trail-expeditions.jpg",
      },
      {
        name: "Cusco Explorer Tours",
        slug: "cusco-explorer-tours",
        logoUrl: "/companies/cusco-explorer-tours.jpg",
      },
      {
        name: "Andean Adventures Peru",
        slug: "andean-adventures-peru",
        logoUrl: "/companies/andean-adventures-peru.jpg",
      },
      {
        name: "Sacred Valley Tours",
        slug: "sacred-valley-tours",
        logoUrl: "/companies/sacred-valley-tours.jpg",
      },
      {
        name: "Machu Picchu Journey",
        slug: "machu-picchu-journey",
        logoUrl: "/companies/machu-picchu-journey.jpg",
      },
    ];

    // Insertar compañías y guardar sus IDs
    const companyIds: { [key: string]: any } = {};
    for (const company of companiesData) {
      const id = await ctx.db.insert("companies", company);
      companyIds[company.slug] = id;
    }

    // Datos de paquetes turísticos en español
    const tourPackagesData = [
      // Tours para Plaza de Armas
      {
        name: "City Tour Cusco Histórico",
        description:
          "Explora el corazón histórico de Cusco con un guía experto. Visita la Plaza de Armas, la Catedral del Cusco y conoce la fascinante historia de la capital del Imperio Inca. Incluye explicaciones detalladas sobre la arquitectura colonial y las tradiciones andinas.",
        basePricePerPerson: 45,
        taxesAndFees: 5.5,
        currency: "USDC" as const,
        whatIsIncluded: [
          "Guía turístico profesional bilingüe",
          "Entrada a la Catedral del Cusco",
          "Recorrido por la Plaza de Armas",
          "Transporte desde tu hotel",
          "Agua embotellada",
        ],
        guarantees: [
          "Cancelación gratuita hasta 24 horas antes",
          "Grupos pequeños (máximo 15 personas)",
          "Garantía de devolución del dinero",
        ],
        locationSlug: "plaza-de-armas",
        companySlug: "peru-grand-travel",
        availableTickets: 50,
      },
      {
        name: "Tour Fotográfico Plaza de Armas al Atardecer",
        description:
          "Captura la magia de la Plaza de Armas durante la hora dorada. Un tour especializado para amantes de la fotografía que incluye los mejores ángulos y consejos profesionales para capturar la belleza arquitectónica e histórica del lugar.",
        basePricePerPerson: 35,
        taxesAndFees: 4.2,
        currency: "USX" as const,
        whatIsIncluded: [
          "Guía fotógrafo profesional",
          "Acceso a miradores exclusivos",
          "Sesión de fotos de 2 horas",
          "Consejos de fotografía",
        ],
        guarantees: [
          "Reembolso completo si llueve",
          "Máximo 8 personas por grupo",
          "Satisfacción garantizada",
        ],
        locationSlug: "plaza-de-armas",
        companySlug: "cusco-explorer-tours",
        availableTickets: 20,
      },

      // Tours para Qorikancha
      {
        name: "Qorikancha: El Templo del Sol",
        description:
          "Descubre los secretos del templo más importante del Imperio Inca. Aprende sobre la ingeniería inca, la astronomía andina y la fusión arquitectónica entre el templo inca y el convento colonial de Santo Domingo.",
        basePricePerPerson: 55,
        taxesAndFees: 6.6,
        currency: "USDC" as const,
        whatIsIncluded: [
          "Entrada al Qorikancha",
          "Guía especializado en historia inca",
          "Explicación de astronomía andina",
          "Material educativo ilustrado",
          "Auriculares para mejor audio",
        ],
        guarantees: [
          "Cancelación gratuita 48 horas antes",
          "Grupos reducidos de 12 personas",
          "Guía certificado por el Ministerio de Cultura",
        ],
        locationSlug: "qorikancha-temple",
        companySlug: "inca-trail-expeditions",
        availableTickets: 40,
      },

      // Tours para Sacsayhuamán
      {
        name: "Sacsayhuamán y Sitios Arqueológicos",
        description:
          "Tour completo por Sacsayhuamán, Q'enqo, Puca Pucara y Tambomachay. Explora las impresionantes construcciones incas y aprende sobre las técnicas de construcción que desafían la explicación moderna. Incluye tiempo libre para fotografías en cada sitio.",
        basePricePerPerson: 75,
        taxesAndFees: 9,
        currency: "USDC" as const,
        whatIsIncluded: [
          "Transporte turístico privado",
          "Boleto Turístico parcial",
          "Guía profesional certificado",
          "Visita a 4 sitios arqueológicos",
          "Box lunch",
          "Seguro de viaje",
        ],
        guarantees: [
          "Cancelación gratuita hasta 24 horas antes",
          "Precio más bajo garantizado",
          "Grupos máximo de 15 personas",
        ],
        locationSlug: "sacsayhuaman",
        companySlug: "andean-adventures-peru",
        availableTickets: 60,
      },
      {
        name: "Sacsayhuamán: Experiencia al Amanecer",
        description:
          "Vive la magia de Sacsayhuamán al amanecer, antes de que lleguen las multitudes. Disfruta de vistas panorámicas de Cusco mientras el sol ilumina las murallas megalíticas. Incluye desayuno andino tradicional.",
        basePricePerPerson: 85,
        taxesAndFees: 10.2,
        currency: "USX" as const,
        whatIsIncluded: [
          "Recojo a las 5:00 AM",
          "Entrada a Sacsayhuamán",
          "Guía experto en arqueoastronomía",
          "Desayuno andino tradicional",
          "Bebidas calientes (coca, mate, café)",
          "Fotografías profesionales incluidas",
        ],
        guarantees: [
          "Reembolso total si el clima impide el amanecer",
          "Grupos VIP de máximo 10 personas",
          "Satisfacción 100% garantizada",
        ],
        locationSlug: "sacsayhuaman",
        companySlug: "sacred-valley-tours",
        availableTickets: 25,
      },

      // Tours para Museo Inka
      {
        name: "Tour Guiado Museo Inka",
        description:
          "Recorrido especializado por el Museo Inka con arqueólogos profesionales. Explora las colecciones de cerámica, textiles, momias y objetos de oro que narran la historia de la civilización inca desde sus orígenes hasta la conquista española.",
        basePricePerPerson: 40,
        taxesAndFees: 4.8,
        currency: "USDC" as const,
        whatIsIncluded: [
          "Entrada al Museo Inka",
          "Guía arqueólogo especializado",
          "Tour de 2 horas",
          "Material informativo",
          "Demostración de técnicas textiles",
        ],
        guarantees: [
          "Cancelación gratuita 24 horas antes",
          "Grupos pequeños de 12 personas",
          "Acceso prioritario sin filas",
        ],
        locationSlug: "museo-inka",
        companySlug: "peru-grand-travel",
        availableTickets: 35,
      },

      // Tours para la Piedra de los 12 Ángulos
      {
        name: "Recorrido de Piedras Incas y Arquitectura",
        description:
          "Camina por las calles históricas de Cusco para descubrir los secretos de la arquitectura inca. Visita la famosa Piedra de los 12 Ángulos, aprende sobre técnicas de construcción antisísmica y descubre otros ejemplos de mampostería inca en el centro histórico.",
        basePricePerPerson: 30,
        taxesAndFees: 3.6,
        currency: "USX" as const,
        whatIsIncluded: [
          "Guía especializado en arquitectura",
          "Recorrido a pie de 2 horas",
          "Visita a 8 muros incas históricos",
          "Explicación de técnicas de construcción",
          "Mapa ilustrado de la ruta",
        ],
        guarantees: [
          "Cancelación gratuita hasta 12 horas antes",
          "Grupos máximo 15 personas",
          "Atención personalizada garantizada",
        ],
        locationSlug: "twelve-angled-stone",
        companySlug: "cusco-explorer-tours",
        availableTickets: 45,
      },

      // Tours gastronómicos para restaurantes
      {
        name: "Experiencia Gastronómica Chicha by Gastón Acurio",
        description:
          "Disfruta de una experiencia culinaria única en el restaurante del chef más famoso de Perú. Menú degustación de 5 tiempos que combina técnicas modernas con sabores tradicionales andinos. Incluye maridaje con pisco y bebidas locales.",
        basePricePerPerson: 120,
        taxesAndFees: 14.4,
        currency: "USDC" as const,
        whatIsIncluded: [
          "Menú degustación de 5 tiempos",
          "Maridaje con pisco y bebidas",
          "Recorrido por la cocina con el chef",
          "Explicación de cada plato",
          "Propinas incluidas",
          "Reserva garantizada",
        ],
        guarantees: [
          "Cancelación gratuita 48 horas antes",
          "Atención VIP",
          "Adaptación para vegetarianos y veganos",
        ],
        locationSlug: "chicha-por-gaston-acurio",
        companySlug: "peru-grand-travel",
        availableTickets: 15,
      },
      {
        name: "Tour Gastronómico Fusión Nikkei en Limo",
        description:
          "Experimenta la fusión única de cocina peruana y japonesa en Limo. Menú degustación de 6 platos que incluye ceviches, tiraditos y makis peruanos con vista panorámica a la Plaza de Armas. Una experiencia culinaria inolvidable.",
        basePricePerPerson: 110,
        taxesAndFees: 13.2,
        currency: "USX" as const,
        whatIsIncluded: [
          "Menú degustación Nikkei de 6 platos",
          "Cóctel de bienvenida",
          "Mesa con vista a la Plaza de Armas",
          "Sommelier para maridaje",
          "Clase express de preparación de ceviche",
          "Propinas incluidas",
        ],
        guarantees: [
          "Cancelación gratuita 48 horas antes",
          "Mesa garantizada con vista",
          "Opciones para restricciones alimentarias",
        ],
        locationSlug: "limo-cocina-peruana",
        companySlug: "cusco-explorer-tours",
        availableTickets: 20,
      },

      // Tours para mercados
      {
        name: "Tour Culinario Mercado San Pedro",
        description:
          "Explora el mercado más auténtico de Cusco con un chef local. Prueba frutas exóticas, jugos naturales, panes tradicionales y platos típicos. Aprende sobre ingredientes andinos y lleva recetas a casa. Incluye degustación de al menos 15 productos locales.",
        basePricePerPerson: 50,
        taxesAndFees: 6,
        currency: "USDC" as const,
        whatIsIncluded: [
          "Guía chef profesional",
          "Degustación de 15+ productos locales",
          "Jugo de frutas exóticas",
          "Desayuno tradicional en el mercado",
          "Recetario digital de cocina peruana",
          "Bolsa de tela reutilizable de recuerdo",
        ],
        guarantees: [
          "Cancelación gratuita 24 horas antes",
          "Grupos pequeños de 8 personas",
          "Higiene y seguridad alimentaria garantizada",
        ],
        locationSlug: "san-pedro-market",
        companySlug: "andean-adventures-peru",
        availableTickets: 30,
      },

      // Tours para artesanía
      {
        name: "Taller de Artesanía Textil Andina",
        description:
          "Visita el Centro Artesanal y participa en un taller práctico de tejido andino. Aprende técnicas ancestrales directamente de artesanas locales. Crea tu propia pieza textil para llevar a casa mientras conoces sobre simbología y tradiciones textiles andinas.",
        basePricePerPerson: 65,
        taxesAndFees: 7.8,
        currency: "USX" as const,
        whatIsIncluded: [
          "Taller práctico de 3 horas",
          "Materiales incluidos (lana, telar)",
          "Instructora artesana local",
          "Tu propia creación para llevar",
          "Certificado de participación",
          "Mate de coca de bienvenida",
        ],
        guarantees: [
          "Cancelación gratuita 48 horas antes",
          "Grupos íntimos de 6 personas",
          "Soporte directo a artesanas locales",
        ],
        locationSlug: "centro-artesanal-cusco",
        companySlug: "sacred-valley-tours",
        availableTickets: 18,
      },

      // Tour combinado premium
      {
        name: "Tour Premium: Cusco Místico y Arqueológico",
        description:
          "Experiencia de día completo que combina lo mejor de Cusco: Plaza de Armas, Qorikancha, Sacsayhuamán y sitios arqueológicos. Incluye almuerzo gourmet en restaurante con vista panorámica. Tour privado con guía experto y transporte VIP.",
        basePricePerPerson: 180,
        taxesAndFees: 21.6,
        currency: "USDC" as const,
        whatIsIncluded: [
          "Tour privado de día completo (8 horas)",
          "Transporte VIP con WiFi",
          "Todas las entradas y boletos turísticos",
          "Almuerzo gourmet de 3 tiempos",
          "Guía privado certificado bilingüe",
          "Agua y snacks durante el tour",
          "Fotografías profesionales del grupo",
          "Seguro de viaje incluido",
        ],
        guarantees: [
          "Cancelación gratuita 72 horas antes",
          "Precio con todo incluido, sin sorpresas",
          "Atención personalizada VIP",
          "Satisfacción 100% garantizada o reembolso total",
        ],
        locationSlug: "plaza-de-armas",
        companySlug: "machu-picchu-journey",
        availableTickets: 10,
      },

      // Tour nocturno
      {
        name: "Cusco Nocturno: Leyendas y Misterios",
        description:
          "Descubre el lado místico de Cusco en este tour nocturno único. Camina por calles iluminadas mientras escuchas leyendas incas y coloniales. Visita lugares históricos bajo las estrellas y aprende sobre rituales andinos, astronomía inca y eventos sobrenaturales.",
        basePricePerPerson: 42,
        taxesAndFees: 5,
        currency: "USX" as const,
        whatIsIncluded: [
          "Tour nocturno de 2.5 horas",
          "Guía contador de historias",
          "Bebida caliente tradicional",
          "Linterna de mano",
          "Mapa de Cusco místico",
          "Entrada a mirador nocturno",
        ],
        guarantees: [
          "Cancelación gratuita 24 horas antes",
          "Grupos pequeños de 12 personas",
          "Rutas seguras y bien iluminadas",
        ],
        locationSlug: "twelve-angled-stone",
        companySlug: "inca-trail-expeditions",
        availableTickets: 40,
      },
    ];

    // Insertar paquetes turísticos
    let insertedCount = 0;
    for (const packageData of tourPackagesData) {
      const { locationSlug, companySlug, ...packageFields } = packageData;

      const locationId = locationMap.get(locationSlug);
      const companyId = companyIds[companySlug];

      if (locationId && companyId) {
        await ctx.db.insert("tourPackages", {
          ...packageFields,
          locationId,
          companyId,
        });
        insertedCount++;
      }
    }

    return {
      companiesInserted: companiesData.length,
      tourPackagesInserted: insertedCount,
    };
  },
});

export default seedCompaniesAndTours;
