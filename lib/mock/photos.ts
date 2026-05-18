import type { PhotoLibrary } from "@/lib/types"

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

// Curated Unsplash photo IDs across Jordan, Morocco, Egypt.
// Replace with Ahmed's hand-picked list for production demo.
export const photos: PhotoLibrary = {
  // ─── Jordan ─────────────────────────────────────────────
  petra: {
    hero: [
      u("photo-1539020140153-e479b8c22e70"),
      u("photo-1574236170880-faf57f4ce39c"),
      u("photo-1568846501069-cce5f7e25f95"),
    ],
    gallery: [
      u("photo-1539020140153-e479b8c22e70", 1200),
      u("photo-1574236170880-faf57f4ce39c", 1200),
      u("photo-1568846501069-cce5f7e25f95", 1200),
      u("photo-1565552645632-d725f8bfc19a", 1200),
    ],
  },
  wadiRum: {
    hero: [
      u("photo-1518684079-3c830dcef090"),
      u("photo-1583394838336-acd977736f90"),
      u("photo-1547333101-bf3eb4f5d3ee"),
    ],
    gallery: [
      u("photo-1518684079-3c830dcef090", 1200),
      u("photo-1583394838336-acd977736f90", 1200),
      u("photo-1547333101-bf3eb4f5d3ee", 1200),
    ],
  },
  deadSea: {
    hero: [u("photo-1551817958-d9d86fb29431")],
    gallery: [u("photo-1551817958-d9d86fb29431", 1200)],
  },
  amman: {
    hero: [u("photo-1547333101-bf3eb4f5d3ee")],
    gallery: [u("photo-1547333101-bf3eb4f5d3ee", 1200)],
  },

  // ─── Morocco ────────────────────────────────────────────
  marrakech: {
    hero: [
      u("photo-1597211833712-5e41faa202ea"),
      u("photo-1545167622-3a6ac756afa4"),
      u("photo-1539020140153-e479b8c22e70"),
    ],
    gallery: [
      u("photo-1597211833712-5e41faa202ea", 1200),
      u("photo-1545167622-3a6ac756afa4", 1200),
      u("photo-1539020140153-e479b8c22e70", 1200),
      u("photo-1568846501069-cce5f7e25f95", 1200),
    ],
  },
  fez: {
    hero: [
      u("photo-1542361345-89e58247f2d5"),
      u("photo-1597212618440-806262de4f6b"),
    ],
    gallery: [
      u("photo-1542361345-89e58247f2d5", 1200),
      u("photo-1597212618440-806262de4f6b", 1200),
    ],
  },
  casablanca: {
    hero: [
      u("photo-1518549223834-29ce97b8ff3a"),
      u("photo-1583146908354-7d68d77eacbc"),
    ],
    gallery: [
      u("photo-1518549223834-29ce97b8ff3a", 1200),
      u("photo-1583146908354-7d68d77eacbc", 1200),
    ],
  },
  sahara: {
    hero: [
      u("photo-1489493585363-d69421e0edd3"),
      u("photo-1487412947147-5cebf100ffc2"),
      u("photo-1518684079-3c830dcef090"),
    ],
    gallery: [
      u("photo-1489493585363-d69421e0edd3", 1200),
      u("photo-1487412947147-5cebf100ffc2", 1200),
      u("photo-1518684079-3c830dcef090", 1200),
      u("photo-1583394838336-acd977736f90", 1200),
    ],
  },
  chefchaouen: {
    hero: [
      u("photo-1538652046123-2c8c7e21ec78"),
    ],
    gallery: [
      u("photo-1538652046123-2c8c7e21ec78", 1200),
    ],
  },

  // ─── Egypt ──────────────────────────────────────────────
  cairo: {
    hero: [
      u("photo-1572252009286-268acec5ca0a"),
      u("photo-1539768942893-daf53e448371"),
      u("photo-1551867633-194f125bddfa"),
    ],
    gallery: [
      u("photo-1572252009286-268acec5ca0a", 1200),
      u("photo-1539768942893-daf53e448371", 1200),
      u("photo-1551867633-194f125bddfa", 1200),
      u("photo-1568322445389-f64ac2515020", 1200),
    ],
  },
  luxor: {
    hero: [
      u("photo-1568322445389-f64ac2515020"),
      u("photo-1572252009286-268acec5ca0a"),
    ],
    gallery: [
      u("photo-1568322445389-f64ac2515020", 1200),
      u("photo-1572252009286-268acec5ca0a", 1200),
    ],
  },
  aswan: {
    hero: [
      u("photo-1551867633-194f125bddfa"),
      u("photo-1565552645632-d725f8bfc19a"),
    ],
    gallery: [
      u("photo-1551867633-194f125bddfa", 1200),
      u("photo-1565552645632-d725f8bfc19a", 1200),
    ],
  },
  redSea: {
    hero: [
      u("photo-1551817958-d9d86fb29431"),
    ],
    gallery: [
      u("photo-1551817958-d9d86fb29431", 1200),
    ],
  },
}
