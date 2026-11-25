const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Читаем index.html и загружаем только функцию formatSec
const html = fs.readFileSync('./index.html', 'utf8');
const fnMatch = html.match(/function formatSec\s*\([\s\S]*?\n\s*\}/);
const context = vm.createContext({});
vm.runInContext(fnMatch[0], context);
const { formatSec } = context;

// 1. Основной случай
test('formatSec: переводит секунды в формат ММ:СС', () => {
    assert.equal(formatSec(125), '02:05');
});

// 2. Граничный случай
test('formatSec: корректно обрабатывает 0 и ровно 60 секунд', () => {
    assert.equal(formatSec(0), '00:00');
    assert.equal(formatSec(60), '01:00');
});

// 3. Ошибочный случай (воспроизведение дефекта)
test('formatSec: при отрицательном числе или NaN возвращает 00:00', () => {
    assert.equal(formatSec(-10), '00:00');
    assert.equal(formatSec(NaN), '00:00');
});
