'use strict';

const path = require('path');
const fs = require('fs');
const adapt = require('ugly-adapter');
const co = require('co');
const hbs = require('handlebars');
const md = require('marked');

const readdir = adapt.part(fs.readdir);
const read = adapt.part(fs.readFile);
const write = adapt.part(fs.writeFile);
const srcDir = path.resolve(__dirname, path.join('chapters'));
const destDir = path.resolve(__dirname, path.join('..', 'dist'));
const wrapperPath = path.join(__dirname, 'page.html');

const getWrapper = co.wrap(function*() {
  const rawWrapper = yield read(wrapperPath, 'utf8');
  return hbs.compile(rawWrapper);
});

const getInitialData = co.wrap(function*() {
  let fileNames = yield readdir(srcDir);
  return fileNames
  .filter(name => /^\d+\-/.test(name))
  .map(name => ({ name }));
});

const addNoExt = co.wrap(function*(data) {
  for (const d of data) d.noExt = d.name.replace(/\.[a-z]*$/, '');
});

const addDestBase = co.wrap(function*(data) {
  for (const d of data) d.destBase = d.noExt + '.html';
});

const addSource = co.wrap(function*(data) {
  for (const d of data) d.source = path.join(srcDir, d.name);
});

const addRaw = co.wrap(function*(data) {
  for (const d of data) d.raw = yield read(d.source, 'utf8');
});

const addCompiled = co.wrap(function*(data) {
  for (const d of data) d.compiled = hbs.compile(d.raw);
});

const addDest = co.wrap(function*(data) {
  for (const d of data) d.dest = path.join(destDir, d.destBase);
});

const addHeading = co.wrap(function*(data) {
  for (const d of data) d.heading = getheading(d.raw);
});

const addToc = co.wrap(function*(data) {
  data.forEach((d, i) => {
    d.toc = data.map((d2, j) => {
      return i == j
      ? ` * **${d2.heading}**`
      : ` * [${d2.heading}](./${d2.destBase})`
    }).join('\n');
  });
});

const addNext = co.wrap(function*(data) {
  data.forEach((d, i) => {
    if (i < data.length - 1) {
      const next = data[i + 1];
      d.next = `**[Next: ${next.heading}](./${next.destBase}) \u2192**`;
    } else {
      data.next = '**Fin**';
    }
  });
});

const addInnerMd = co.wrap(function*(data) {
  for (const d of data) d.innerMd = d.compiled(d);
});

const addInnerHtml = co.wrap(function*(data) {
  for (const d of data) d.innerHtml = md(d.innerMd);
});

const addWrapped = co.wrap(function*(data, wrapper) {
  for (const d of data) d.wrapped = wrapper(d);
});

const writeAll = co.wrap(function*(data) {
  for (const d of data) {
    console.log(`${d.source} => ${d.dest}`);
    yield write(d.dest, d.wrapped, 'utf8');
  }
});

function getheading(content) {
  const matches = content.match(/# (.*)/);
  if (!matches) {
    const err = new Error('could not find heading in contents');
    throw err;
  } else {
    return matches[1];
  }
}

co(function*() {
  const wrapper = yield getWrapper();
  const data = yield getInitialData();
  yield addNoExt(data);
  yield addDestBase(data);
  yield addSource(data);
  yield addRaw(data);
  yield addCompiled(data);
  yield addDest(data);
  yield addHeading(data);
  yield addToc(data);
  yield addInnerMd(data);
  yield addInnerHtml(data);
  yield addWrapped(data, wrapper);
  yield writeAll(data);
}).then(
  () => console.log('All done!'),
  (err) => console.error(err.stack)
);
