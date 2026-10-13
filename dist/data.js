export const articles = [
  {
    id: 'diagonales',
    category: 'La ciudad',
    tag: 'IDENTIDAD PLATENSE',
    title: 'La Plata de noche: un recorrido por el corazón de la ciudad',
    excerpt: 'La Catedral, las diagonales y la Plaza Moreno. Una mirada a esos lugares que hacen de nuestra ciudad un lugar único.',
    image: 'assets/la-plata-aerial.jpg',
    alt: 'Vista nocturna de la Catedral, Plaza Moreno y Palacio Municipal de La Plata',
    credit: 'La Plata · Fotografía de archivo de INFOLAPLATA',
    source: 'https://infolaplata.com/',
    sourceLabel: 'Visitar INFOLAPLATA',
    note: 'Propuesta de especial fotográfico creada para esta demostración. La imagen pertenece al archivo del medio; no representa una noticia de última hora.',
    reading: 'Especial visual',
  },
  {
    id: 'plaza',
    category: 'Política',
    tag: 'ESPACIO PÚBLICO',
    title: 'Alak y el embajador de España inauguraron la nueva Plaza España',
    excerpt: 'La renovación de un espacio emblemático de La Plata, con la participación de autoridades y representantes de la comunidad española.',
    image: 'assets/plaza-espana.jpg',
    alt: 'Autoridades y representantes de la comunidad española en la inauguración',
    source: 'https://infolaplata.com/alak-y-el-embajador-de-espana-inauguraron-la-nueva-plaza-espana-en-la-plata/',
    reading: 'Actualidad local',
  },
  {
    id: 'corea',
    category: 'Cultura',
    tag: 'AGENDA CULTURAL',
    title: 'La ciudad ya palpita la Semana de la Cultura Coreana',
    excerpt: 'Tradiciones, encuentros y expresiones artísticas para descubrir una cultura que también forma parte de la identidad platense.',
    image: 'assets/cultura-coreana.jpg',
    alt: 'Actividad cultural vinculada con la Semana de la Cultura Coreana',
    source: 'https://infolaplata.com/la-ciudad-de-la-plata-ya-palpita-la-semana-de-la-cultura-coreana/',
    reading: 'Cultura y comunidad',
  },
  {
    id: 'mercado',
    category: 'La ciudad',
    tag: 'DESARROLLO LOCAL',
    title: 'El Mercado Regional se prepara para renovar su predio',
    excerpt: 'El municipio encara la renovación del espacio que alberga al Mercado Regional y Bonaerense Fijo.',
    image: 'assets/mercado-regional.jpg',
    alt: 'Predio del Mercado Regional de La Plata',
    source: 'https://infolaplata.com/el-municipio-encara-la-renovacion-del-predio-que-alberga-al-mercado-regional-y-bonaerense-fijo-en-la-plata/',
    reading: 'Economía regional',
  },
  {
    id: 'bosque',
    category: 'Región',
    tag: 'UNA CIUDAD PARA TODOS',
    title: 'El Paseo del Bosque será sede de un encuentro regional por la inclusión',
    excerpt: 'Una iniciativa municipal para generar espacios de participación y encuentro en uno de los parques más queridos de la ciudad.',
    image: 'assets/paseo-del-bosque.jpg',
    alt: 'Participante de una actividad inclusiva con una identificación que dice Mateo',
    source: 'https://infolaplata.com/la-municipalidad-de-la-plata-impulsa-el-primer-encuentro-regional-por-la-inclusion-en-el-paseo-del-bosque/',
    reading: 'Comunidad',
  },
  {
    id: 'deporte',
    category: 'Deportes',
    tag: 'PASIÓN SIN FRONTERAS',
    title: 'El deporte argentino, protagonista dentro y fuera de la cancha',
    excerpt: 'Una propuesta de sección para seguir a nuestros deportistas, sus historias y los desafíos que vienen.',
    image: 'assets/deporte.jpg',
    alt: 'Jugadores de Boca Juniors durante un partido de fútbol',
    source: 'https://infolaplata.com/',
    sourceLabel: 'Visitar INFOLAPLATA',
    note: 'Contenido editorial de ejemplo para mostrar la sección Deportes. No corresponde a una crónica ni a un resultado deportivo en tiempo real.',
    reading: 'Contenido de ejemplo',
  },
  {
    id: 'teatro',
    category: 'Cultura',
    tag: 'TEATRO ARGENTINO',
    title: 'La emoción de la ópera vuelve a encontrarse con La Plata',
    excerpt: 'El Teatro Argentino presenta Il trovatore, de Giuseppe Verdi. Una invitación a redescubrir la música y uno de los grandes escenarios de nuestra ciudad.',
    image: 'assets/orquesta.jpg',
    alt: 'Presentación musical en un escenario de teatro',
    source: 'https://infolaplata.com/el-teatro-argentino-ofrece-la-opera-il-trovatore-de-giuseppe-verdi/',
    reading: 'Agenda cultural',
  },
];

export const categories = ['Todas', 'La ciudad', 'Política', 'Región', 'Cultura', 'Deportes'];

export function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/\s+/g, ' ');
}

export function searchArticles(items, query = '', category = 'Todas') {
  const terms = normalizeText(query).split(' ').filter(Boolean);
  return items.filter(article => {
    const categoryMatches = category === 'Todas' || normalizeText(article.category) === normalizeText(category);
    const content = normalizeText(`${article.title} ${article.category} ${article.excerpt}`);
    return categoryMatches && terms.every(term => content.includes(term));
  });
}
