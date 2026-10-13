import test from 'node:test';
import assert from 'node:assert/strict';
import { searchArticles, normalizeText } from '../dist/data.js';

const stories = [
  { id: 'city', title: 'La renovación de Plaza España', category: 'La ciudad', excerpt: 'Un nuevo espacio público.' },
  { id: 'culture', title: 'Música en el Teatro Argentino', category: 'Cultura', excerpt: 'Ópera y conciertos.' },
  { id: 'sports', title: 'Un triunfo histórico', category: 'Deportes', excerpt: 'La selección argentina.' },
];

test('normalization removes accents and repeated whitespace', () => {
  assert.equal(normalizeText('  MÚSICA   Pública  '), 'musica publica');
});
test('search matches accents and case insensitively', () => {
  assert.deepEqual(searchArticles(stories, 'RENOVACION').map(item => item.id), ['city']);
});
test('search matches excerpt and category', () => {
  assert.equal(searchArticles(stories, 'opera')[0].id, 'culture');
  assert.equal(searchArticles(stories, 'deportes')[0].id, 'sports');
});
test('query tokens can span different fields', () => {
  assert.equal(searchArticles(stories, '  cultura   musica ')[0].id, 'culture');
});
test('category filters combine with query', () => {
  assert.equal(searchArticles(stories, '', 'Cultura').length, 1);
  assert.equal(searchArticles(stories, 'plaza', 'Cultura').length, 0);
});
test('empty query and all category return all without mutating input', () => {
  assert.deepEqual(searchArticles(stories, '   ', 'Todas'), stories);
  assert.notEqual(searchArticles(stories, ''), stories);
});
test('unknown query returns empty results', () => {
  assert.deepEqual(searchArticles(stories, 'zzzzz'), []);
});
