import { products } from "./products-data"

export interface Product {
  id: number
  sku: string
  name: string
  slug: string
  brand: string
  collection: string
  product_type: string
  format: string
  surface: string
  color: string
  material_type: string
  application: string
  rooms: string[]
  thickness: string
  pieces_per_box: number
  sqm_per_box: number
  country: string
  price_retail: number
  price_official: number | null
  currency: string
  stock_yanino: number
  stock_factory: number
  description: string
  images: string[]
  main_image: string
  interior_image: string | null
  is_new: boolean
  is_bestseller: boolean
  is_discount: boolean
  rating: number
  reviews_count: number
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string
  count: number
}

export interface Collection {
  id: number
  name: string
  slug: string
  image: string
  product_count: number
}

// Calculate actual product counts by type
const plitkaCount = products.filter(p => p.product_type === "Плитка").length
const keramoglanitCount = products.filter(p => p.product_type === "Керамогранит").length
const mozaikaCount = products.filter(p => p.product_type === "Мозаика на сетке").length
const stupenCount = products.filter(p => p.product_type === "Ступень").length

export const categories: Category[] = [
  { id: 1, name: "Плитка", slug: "keramicheskaya-plitka", image: "/images/categories/ceramic.jpg", count: plitkaCount },
  { id: 2, name: "Керамогранит", slug: "keramogranit", image: "/images/categories/porcelain.jpg", count: keramoglanitCount },
  { id: 3, name: "Мозаика на сетке", slug: "mozaika", image: "/images/categories/mosaic.jpg", count: mozaikaCount },
  { id: 4, name: "Ступень", slug: "stupeni", image: "/images/categories/steps.jpg", count: stupenCount },
]

export const collections: Collection[] = [
  { id: 1, name: "Calacatta", slug: "calacatta", image: "https://pvi.cersanit.ru/upload/uf/1e0/Calacatta_Large_1_2.jpg", product_count: 5 },
  { id: 2, name: "Wood Concept Natural", slug: "wood-concept-natural", image: "https://pvi.cersanit.ru/upload/uf/02e/Interior_WN4T013_1.jpg", product_count: 6 },
  { id: 3, name: "Wood Concept Prime", slug: "wood-concept-prime", image: "https://pvi.cersanit.ru/upload/uf/8e6/Interior_WP4T523_1.jpg", product_count: 3 },
  { id: 4, name: "Wood Concept Rustic", slug: "wood-concept-rustic", image: "https://pvi.cersanit.ru/upload/uf/581/Interior_WR4T013_1.jpg", product_count: 1 },
  { id: 5, name: "Lofthouse", slug: "lofthouse", image: "https://pvi.cersanit.ru/upload/uf/0db/INT_LOFTHOUSE_5_1.jpg", product_count: 6 },
  { id: 6, name: "Woodhouse", slug: "woodhouse", image: "https://pvi.cersanit.ru/upload/uf/f0c/INT_Woodhouse_WS4O112_3_1.jpg", product_count: 5 },
  { id: 7, name: "Royal Stone", slug: "royal-stone", image: "https://pvi.cersanit.ru/upload/uf/cb8/INT_Royal_stone_2_1.jpg", product_count: 3 },
  { id: 8, name: "Deco", slug: "deco", image: "https://pvi.cersanit.ru/upload/uf/3a2/Deco_Large_1_2.jpg", product_count: 2 },
  { id: 9, name: "Effecta", slug: "effecta", image: "https://pvi.cersanit.ru/upload/uf/8b9/INT_Effecta_2_1.jpg", product_count: 2 },
  { id: 10, name: "Galaxy", slug: "galaxy", image: "https://pvi.cersanit.ru/upload/uf/279/Int_Galaxy_012_1_1.jpg", product_count: 2 },
  { id: 11, name: "Infinity", slug: "infinity", image: "https://pvi.cersanit.ru/upload/uf/672/INT_Infinity_092_1_1.jpg", product_count: 2 },
  { id: 12, name: "Coliseum", slug: "coliseum", image: "https://pvi.cersanit.ru/upload/uf/93e/INT_Coliseum_012_2_1.jpg", product_count: 1 },
  { id: 13, name: "Northwood", slug: "northwood", image: "https://pvi.cersanit.ru/upload/uf/f6c/Northwood_1.jpg", product_count: 1 },
  { id: 14, name: "Amberwood", slug: "amberwood", image: "https://pvi.cersanit.ru/upload/uf/img/amberwood.jpg", product_count: 4 },
  { id: 15, name: "Carpet", slug: "carpet", image: "https://pvi.cersanit.ru/upload/uf/img/carpet.jpg", product_count: 3 },
  { id: 16, name: "Interio", slug: "interio", image: "https://pvi.cersanit.ru/upload/uf/img/interio.jpg", product_count: 2 },
  { id: 17, name: "Aspen", slug: "aspen", image: "https://pvi.cersanit.ru/upload/uf/img/aspen.jpg", product_count: 3 },
  { id: 18, name: "Limestone", slug: "limestone", image: "https://pvi.cersanit.ru/upload/uf/img/limestone.jpg", product_count: 2 },
  { id: 19, name: "Sandwood", slug: "sandwood", image: "https://pvi.cersanit.ru/upload/uf/img/sandwood.jpg", product_count: 2 },
  { id: 20, name: "Teakwood", slug: "teakwood", image: "https://pvi.cersanit.ru/upload/uf/img/teakwood.jpg", product_count: 2 },
  { id: 21, name: "Oakwood", slug: "oakwood", image: "https://pvi.cersanit.ru/upload/uf/img/oakwood.jpg", product_count: 2 },
  { id: 22, name: "Maplewood", slug: "maplewood", image: "https://pvi.cersanit.ru/upload/uf/img/maplewood.jpg", product_count: 1 },
  { id: 23, name: "Harbourwood", slug: "harbourwood", image: "https://pvi.cersanit.ru/upload/uf/img/harbourwood.jpg", product_count: 1 },
  { id: 24, name: "Starwood", slug: "starwood", image: "https://pvi.cersanit.ru/upload/uf/img/starwood.jpg", product_count: 1 },
  { id: 25, name: "Stonehouse", slug: "stonehouse", image: "https://pvi.cersanit.ru/upload/uf/img/stonehouse.jpg", product_count: 1 },
  { id: 26, name: "Coastline", slug: "coastline", image: "https://pvi.cersanit.ru/upload/uf/img/coastline.jpg", product_count: 1 },
  { id: 27, name: "Marina", slug: "marina", image: "https://pvi.cersanit.ru/upload/uf/img/marina.jpg", product_count: 1 },
  { id: 28, name: "Desert", slug: "desert", image: "https://pvi.cersanit.ru/upload/uf/img/desert.jpg", product_count: 1 },
  { id: 29, name: "Artstudio", slug: "artstudio", image: "https://pvi.cersanit.ru/upload/uf/img/artstudio.jpg", product_count: 1 },
  { id: 30, name: "Slate", slug: "slate", image: "https://pvi.cersanit.ru/upload/uf/img/slate.jpg", product_count: 1 },
  { id: 31, name: "Ultra", slug: "ultra", image: "https://pvi.cersanit.ru/upload/uf/img/ultra.jpg", product_count: 1 },
  { id: 32, name: "Blend", slug: "blend", image: "https://pvi.cersanit.ru/upload/uf/img/blend.jpg", product_count: 1 },
  { id: 33, name: "Tiffany", slug: "tiffany", image: "https://pvi.cersanit.ru/upload/uf/img/tiffany.jpg", product_count: 1 },
  { id: 34, name: "Lina", slug: "lina", image: "https://pvi.cersanit.ru/upload/uf/img/lina.jpg", product_count: 1 },
  { id: 35, name: "Luna", slug: "luna", image: "https://pvi.cersanit.ru/upload/uf/img/luna.jpg", product_count: 1 },
  { id: 36, name: "Sonata", slug: "sonata", image: "https://pvi.cersanit.ru/upload/uf/img/sonata.jpg", product_count: 1 },
  { id: 37, name: "Palette", slug: "palette", image: "https://pvi.cersanit.ru/upload/uf/img/palette.jpg", product_count: 1 },
  { id: 38, name: "Navi", slug: "navi", image: "https://pvi.cersanit.ru/upload/uf/img/navi.jpg", product_count: 1 },
  { id: 39, name: "Aurora", slug: "aurora", image: "https://pvi.cersanit.ru/upload/uf/img/aurora.jpg", product_count: 1 },
  { id: 40, name: "Pacific", slug: "pacific", image: "https://pvi.cersanit.ru/upload/uf/img/pacific.jpg", product_count: 1 },
  { id: 41, name: "Raven", slug: "raven", image: "https://pvi.cersanit.ru/upload/uf/img/raven.jpg", product_count: 1 },
  { id: 42, name: "Nero", slug: "nero", image: "https://pvi.cersanit.ru/upload/uf/img/nero.jpg", product_count: 1 },
  { id: 43, name: "Space", slug: "space", image: "https://pvi.cersanit.ru/upload/uf/img/space.jpg", product_count: 1 },
  { id: 44, name: "Spark", slug: "spark", image: "https://pvi.cersanit.ru/upload/uf/img/spark.jpg", product_count: 1 },
  { id: 45, name: "Stream", slug: "stream", image: "https://pvi.cersanit.ru/upload/uf/img/stream.jpg", product_count: 1 },
  { id: 46, name: "Stilo", slug: "stilo", image: "https://pvi.cersanit.ru/upload/uf/img/stilo.jpg", product_count: 1 },
  { id: 47, name: "Motley", slug: "motley", image: "https://pvi.cersanit.ru/upload/uf/img/motley.jpg", product_count: 1 },
  { id: 48, name: "Modis", slug: "modis", image: "https://pvi.cersanit.ru/upload/uf/img/modis.jpg", product_count: 1 },
  { id: 49, name: "Ritmo", slug: "ritmo", image: "https://pvi.cersanit.ru/upload/uf/img/ritmo.jpg", product_count: 1 },
  { id: 50, name: "Inverno", slug: "inverno", image: "https://pvi.cersanit.ru/upload/uf/img/inverno.jpg", product_count: 1 },
  { id: 51, name: "Sherbrooke", slug: "sherbrooke", image: "https://pvi.cersanit.ru/upload/uf/img/sherbrooke.jpg", product_count: 1 },
  { id: 52, name: "Mont Blanc", slug: "mont-blanc", image: "https://pvi.cersanit.ru/upload/uf/img/mont-blanc.jpg", product_count: 1 },
  { id: 53, name: "Grigio Nuovalato", slug: "grigio-nuovalato", image: "https://pvi.cersanit.ru/upload/uf/img/grigio-nuovalato.jpg", product_count: 1 },
  { id: 54, name: "Siena", slug: "siena", image: "https://pvi.cersanit.ru/upload/uf/img/siena.jpg", product_count: 1 },
  { id: 55, name: "Sevilla", slug: "sevilla", image: "https://pvi.cersanit.ru/upload/uf/img/sevilla.jpg", product_count: 1 },
  { id: 56, name: "Silvia", slug: "silvia", image: "https://pvi.cersanit.ru/upload/uf/img/silvia.jpg", product_count: 1 },
  { id: 57, name: "Kauri Wood", slug: "kauri-wood", image: "https://pvi.cersanit.ru/upload/uf/img/kauri-wood.jpg", product_count: 1 },
  { id: 58, name: "Gold Venice", slug: "gold-venice", image: "https://pvi.cersanit.ru/upload/uf/img/gold-venice.jpg", product_count: 1 },
  { id: 59, name: "Silver Roots", slug: "silver-roots", image: "https://pvi.cersanit.ru/upload/uf/img/silver-roots.jpg", product_count: 1 },
  { id: 60, name: "Classy Marble", slug: "classy-marble", image: "https://pvi.cersanit.ru/upload/uf/img/classy-marble.jpg", product_count: 1 },
  { id: 61, name: "Residence", slug: "residence", image: "https://pvi.cersanit.ru/upload/uf/img/residence.jpg", product_count: 1 },
  { id: 62, name: "Rustico", slug: "rustico", image: "https://pvi.cersanit.ru/upload/uf/img/rustico.jpg", product_count: 1 },
  { id: 63, name: "Oriental", slug: "oriental", image: "https://pvi.cersanit.ru/upload/uf/img/oriental.jpg", product_count: 1 },
  { id: 64, name: "Loft", slug: "loft", image: "https://pvi.cersanit.ru/upload/uf/img/loft.jpg", product_count: 1 },
  { id: 65, name: "Soft Concrete", slug: "soft-concrete", image: "https://pvi.cersanit.ru/upload/uf/img/soft-concrete.jpg", product_count: 1 },
  { id: 66, name: "Sandstone", slug: "sandstone", image: "https://pvi.cersanit.ru/upload/uf/img/sandstone.jpg", product_count: 1 },
  { id: 67, name: "Finwood", slug: "finwood", image: "https://pvi.cersanit.ru/upload/uf/img/finwood.jpg", product_count: 1 },
  { id: 68, name: "Patinawood", slug: "patinawood", image: "https://pvi.cersanit.ru/upload/uf/img/patinawood.jpg", product_count: 1 },
  { id: 69, name: "Timber Land", slug: "timber-land", image: "https://pvi.cersanit.ru/upload/uf/img/timber-land.jpg", product_count: 1 },
  { id: 70, name: "Greenhouse", slug: "greenhouse", image: "https://pvi.cersanit.ru/upload/uf/img/greenhouse.jpg", product_count: 1 },
  { id: 71, name: "Exterio", slug: "exterio", image: "https://pvi.cersanit.ru/upload/uf/img/exterio.jpg", product_count: 1 },
  { id: 72, name: "Pudra", slug: "pudra", image: "https://pvi.cersanit.ru/upload/uf/img/pudra.jpg", product_count: 1 },
  { id: 73, name: "Bonsai Tree", slug: "bonsai-tree", image: "https://pvi.cersanit.ru/upload/uf/img/bonsai-tree.jpg", product_count: 1 },
  { id: 74, name: "Daisy", slug: "daisy", image: "https://pvi.cersanit.ru/upload/uf/img/daisy.jpg", product_count: 1 },
  { id: 75, name: "Cambio", slug: "cambio", image: "https://pvi.cersanit.ru/upload/uf/img/cambio.jpg", product_count: 1 },
  { id: 76, name: "Atria", slug: "atria", image: "https://pvi.cersanit.ru/upload/uf/img/atria.jpg", product_count: 1 },
  { id: 77, name: "Landscape", slug: "landscape", image: "https://pvi.cersanit.ru/upload/uf/img/landscape.jpg", product_count: 1 },
  { id: 78, name: "Ceramill", slug: "ceramill", image: "https://pvi.cersanit.ru/upload/uf/img/ceramill.jpg", product_count: 1 },
  { id: 79, name: "Chesterwood", slug: "chesterwood", image: "https://pvi.cersanit.ru/upload/uf/img/chesterwood.jpg", product_count: 1 },
  { id: 80, name: "Colorwood", slug: "colorwood", image: "https://pvi.cersanit.ru/upload/uf/img/colorwood.jpg", product_count: 1 },
  { id: 81, name: "Concretehouse", slug: "concretehouse", image: "https://pvi.cersanit.ru/upload/uf/img/concretehouse.jpg", product_count: 1 },
]
