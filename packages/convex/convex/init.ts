import { mutation } from "./_generated/server";

const seedLocations = mutation({
  args: {},
  handler: async (ctx) => {
    const locationsData = [
      {
        location: {
          name: "Plaza de Armas",
          description:
            "The historic main square of Cusco, surrounded by colonial arcades and the magnificent Cusco Cathedral. A UNESCO World Heritage site and the heart of the ancient Inca capital.",
          rating: 4.8,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Portal de Panes 123, Cusco",
            coordinates: {
              latitude: -13.5165,
              longitude: -71.9787,
            },
          },
          imageUrl: "/stylized-illustration-of-cusco-peru-historic-plaza.jpg",
          highlights: [
            {
              title: "UNESCO Heritage",
              description: "Part of the UNESCO World Heritage site",
            },
            {
              title: "Colonial Architecture",
              description: "Beautiful colonial arcades and buildings",
            },
          ],
          category: {
            type: "Attraction" as const,
            kind: {
              subtype: "Historical Site" as const,
            },
          },
        },
        collectible: {
          name: "Plaza de Armas Postcard",
          description: "Commemorative postcard of the historic Plaza de Armas",
          imageUrl: "/stylized-illustration-of-cusco-peru-historic-plaza.jpg",
          pointsValue: 50,
        },
      },
      {
        location: {
          name: "Qorikancha Temple",
          description:
            "The Temple of the Sun, once the most important temple in the Inca Empire. Its walls were covered in gold, and it housed the mummies of previous Inca rulers.",
          rating: 4.7,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Plazoleta Santo Domingo, Cusco",
            coordinates: {
              latitude: -13.5187,
              longitude: -71.9751,
            },
          },
          imageUrl: "/flat-vector-illustration-of-machu-picchu-peru-with.jpg",
          highlights: [
            {
              title: "Temple of the Sun",
              description: "Most important temple in the Inca Empire",
            },
            {
              title: "Gold-Covered Walls",
              description: "Walls were once covered in gold sheets",
            },
          ],
          category: {
            type: "Attraction" as const,
            kind: {
              subtype: "Archaeological Site" as const,
            },
          },
        },
        collectible: {
          name: "Qorikancha Temple Postcard",
          description: "Commemorative postcard of the Temple of the Sun",
          imageUrl: "/flat-vector-illustration-of-machu-picchu-peru-with.jpg",
          pointsValue: 75,
        },
      },
      {
        location: {
          name: "Chicha por Gastón Acurio",
          description:
            "Contemporary Peruvian cuisine by renowned chef Gastón Acurio. Experience traditional flavors with a modern twist in a beautiful colonial setting.",
          rating: 4.6,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Plaza Regocijo 261, Cusco",
            coordinates: {
              latitude: -13.5147,
              longitude: -71.9812,
            },
          },
          imageUrl: "/peruvian-cuisine-dining-authentic-food.jpg",
          highlights: [
            {
              title: "Celebrity Chef",
              description: "Restaurant by renowned chef Gastón Acurio",
            },
            {
              title: "Modern Peruvian",
              description: "Traditional flavors with modern twist",
            },
          ],
          category: {
            type: "Business" as const,
            kind: {
              subtype: "Restaurant" as const,
            },
          },
        },
        collectible: {
          name: "Chicha Restaurant Postcard",
          description: "Commemorative postcard of Chicha por Gastón Acurio",
          imageUrl: "/peruvian-cuisine-dining-authentic-food.jpg",
          pointsValue: 30,
        },
      },
      {
        location: {
          name: "Belmond Hotel Monasterio",
          description:
            "A luxury hotel set in a 16th-century monastery. Features beautiful courtyards, colonial architecture, and world-class amenities.",
          rating: 4.9,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Calle Palacio 136, Cusco",
            coordinates: {
              latitude: -13.5172,
              longitude: -71.9794,
            },
          },
          imageUrl: "/andean-lodge-mountain-accommodation-peru.jpg",
          highlights: [
            {
              title: "Historic Monastery",
              description: "Set in a 16th-century monastery",
            },
            {
              title: "Luxury Amenities",
              description: "World-class facilities and service",
            },
          ],
          category: {
            type: "Business" as const,
            kind: {
              subtype: "Hotel" as const,
            },
          },
        },
        collectible: {
          name: "Belmond Hotel Postcard",
          description: "Commemorative postcard of Belmond Hotel Monasterio",
          imageUrl: "/andean-lodge-mountain-accommodation-peru.jpg",
          pointsValue: 40,
        },
      },
      {
        location: {
          name: "San Pedro Market",
          description:
            "The largest and most vibrant market in Cusco. Find fresh produce, local crafts, traditional foods, and experience authentic Peruvian culture.",
          rating: 4.5,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Calle Santa Clara, Cusco",
            coordinates: {
              latitude: -13.5197,
              longitude: -71.9842,
            },
          },
          imageUrl: "/san-pedro-market.jpg",
          highlights: [
            {
              title: "Local Market",
              description: "Largest market in Cusco",
            },
            {
              title: "Authentic Culture",
              description: "Experience traditional Peruvian life",
            },
          ],
          category: {
            type: "Business" as const,
            kind: {
              subtype: "Artisan Shop" as const,
            },
          },
        },
        collectible: {
          name: "San Pedro Market Postcard",
          description: "Commemorative postcard of San Pedro Market",
          imageUrl: "/san-pedro-market.jpg",
          pointsValue: 25,
        },
      },
      {
        location: {
          name: "Sacsayhuamán",
          description:
            "Impressive Inca fortress with massive stone walls. The precision of the stonework is remarkable, with some stones weighing over 100 tons.",
          rating: 4.8,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Sacsayhuamán, Cusco",
            coordinates: {
              latitude: -13.5088,
              longitude: -71.9816,
            },
          },
          imageUrl: "/flat-vector-illustration-of-nazca-lines-peru-deser.jpg",
          highlights: [
            {
              title: "Massive Stones",
              description: "Some stones weigh over 100 tons",
            },
            {
              title: "Precision Masonry",
              description: "Remarkable Inca engineering",
            },
          ],
          category: {
            type: "Attraction" as const,
            kind: {
              subtype: "Archaeological Site" as const,
            },
          },
        },
        collectible: {
          name: "Sacsayhuamán Postcard",
          description: "Commemorative postcard of Sacsayhuamán fortress",
          imageUrl: "/flat-vector-illustration-of-nazca-lines-peru-deser.jpg",
          pointsValue: 100,
        },
      },
      {
        location: {
          name: "Museo Inka",
          description:
            "Comprehensive museum showcasing Inca artifacts, textiles, ceramics, and mummies. Learn about the rich history and culture of the Inca civilization.",
          rating: 4.6,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Cuesta del Almirante 103, Cusco",
            coordinates: {
              latitude: -13.5156,
              longitude: -71.9801,
            },
          },
          imageUrl: "/museo-inka.jpg",
          highlights: [
            {
              title: "Inca Artifacts",
              description: "Extensive collection of artifacts",
            },
            {
              title: "Cultural History",
              description: "Learn about Inca civilization",
            },
          ],
          category: {
            type: "Attraction" as const,
            kind: {
              subtype: "Museum" as const,
            },
          },
        },
        collectible: {
          name: "Museo Inka Postcard",
          description: "Commemorative postcard of Museo Inka",
          imageUrl: "/museo-inka.jpg",
          pointsValue: 60,
        },
      },
      {
        location: {
          name: "Limo Cocina Peruana",
          description:
            "Upscale restaurant offering innovative Peruvian-Japanese fusion cuisine with stunning views of Plaza de Armas.",
          rating: 4.7,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Portal de Carnes 236, Cusco",
            coordinates: {
              latitude: -13.5163,
              longitude: -71.9789,
            },
          },
          imageUrl: "/limo-restaurant.jpg",
          highlights: [
            {
              title: "Fusion Cuisine",
              description: "Peruvian-Japanese fusion",
            },
            {
              title: "Plaza Views",
              description: "Stunning views of Plaza de Armas",
            },
          ],
          category: {
            type: "Business" as const,
            kind: {
              subtype: "Restaurant" as const,
            },
          },
        },
        collectible: {
          name: "Limo Restaurant Postcard",
          description: "Commemorative postcard of Limo Cocina Peruana",
          imageUrl: "/limo-restaurant.jpg",
          pointsValue: 35,
        },
      },
      {
        location: {
          name: "Centro Artesanal Cusco",
          description:
            "Artisan market featuring high-quality handmade crafts, textiles, jewelry, and souvenirs from local Peruvian artisans.",
          rating: 4.4,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Av. El Sol 603, Cusco",
            coordinates: {
              latitude: -13.5142,
              longitude: -71.9823,
            },
          },
          imageUrl: "/artisan-market.jpg",
          highlights: [
            {
              title: "Local Artisans",
              description: "Handmade crafts by local makers",
            },
            {
              title: "Quality Souvenirs",
              description: "Authentic Peruvian crafts",
            },
          ],
          category: {
            type: "Business" as const,
            kind: {
              subtype: "Artisan Shop" as const,
            },
          },
        },
        collectible: {
          name: "Centro Artesanal Postcard",
          description: "Commemorative postcard of Centro Artesanal Cusco",
          imageUrl: "/artisan-market.jpg",
          pointsValue: 20,
        },
      },
      {
        location: {
          name: "Twelve-Angled Stone",
          description:
            "Famous Inca stone with twelve angles, showcasing the incredible precision of Inca masonry. A popular photo spot and testament to Inca engineering.",
          rating: 4.5,
          address: {
            country: "Peru",
            state: "Cusco",
            city: "Cusco",
            name: "Hatun Rumiyoc, Cusco",
            coordinates: {
              latitude: -13.5161,
              longitude: -71.9803,
            },
          },
          imageUrl: "/twelve-angled-stone.jpg",
          highlights: [
            {
              title: "Twelve Angles",
              description: "Famous stone with perfect angles",
            },
            {
              title: "Inca Masonry",
              description: "Testament to Inca engineering",
            },
          ],
          category: {
            type: "Attraction" as const,
            kind: {
              subtype: "Historical Site" as const,
            },
          },
        },
        collectible: {
          name: "Twelve-Angled Stone Postcard",
          description: "Commemorative postcard of Twelve-Angled Stone",
          imageUrl: "/twelve-angled-stone.jpg",
          pointsValue: 40,
        },
      },
    ];

    for (const { location, collectible } of locationsData) {
      const locationId = await ctx.db.insert("locations", location);
      await ctx.db.insert("collectibles", {
        ...collectible,
        locationId,
      });
    }

    return { inserted: locationsData.length };
  },
});

export default seedLocations;
