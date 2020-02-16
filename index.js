const dot = require('./dot');

module.exports = (json, paths, group, time = false) => {
    let result = [];

    if (typeof json !== 'object' || typeof paths === 'undefined') {
        return result;
    }

    if (typeof paths === 'string') {
        paths = paths.split('~').map(p => p.trim()).filter(Boolean);
    }

    if (typeof paths !== 'object') {
        return result;
    }

    if (time) console.time('TIME');

    const dots = dot.convert(json);
    const keys = Object.keys(dots);

    paths = paths.map(p => parsePath(p))
        .sort((a,b) =>
            (a.path.split(/\[[0-9]]/).length > b.path.split(/\[[0-9]]/).length)
                ? 1
                : ((b.path.split(/\[[0-9]]/).length > a.path.split(/\[[0-9]]/).length)
                ? -1
                : 0))
        .reverse()
        .map((p, i) => ({...p, main: !i}));

    let type = {}, regex = {};
    for (let i = 0; i < paths.length; i++) {
        type[paths[i].name] = paths[i].type || '';
        regex[paths[i].name] = paths[i].regex || '';
        let level1 = paths[i].path.split(']');
        paths[i].level = {};
        paths[i].double = paths[i].double || '';
        for (let j = 0; j < paths.length; j++) {
            if (paths[i].name === paths[j].name) continue;
            if (paths[i].path === paths[j].path && !paths[i].main && !paths[j].double) {
                paths[i].double = paths[j].name;
                paths[j].double = '';
            }
            let level2 = paths[j].path.split(']');
            for (let k = 0; k < level1.length; k++) {
                if (level1[k] !== level2[k]) break;
                paths[i].level[paths[j].name] = k + 1;
            }
        }
    }

    let iteration = [], finding = [];
    for (let i = 0, l = keys.length; i < l; i++) {
        let path = keys[i];
        for (let j = 0; j < paths.length; j++) {
            let {name, pattern, main, level, double} = paths[j];
            if (pattern.test(path)) {
                let l = {};
                let levels = Object.keys(level);
                for (let i2 = 0, l2 = levels.length; i2 < l2; i2++) {
                    let string = path.split(']').slice(0, level[levels[i2]]).join(']');
                    if (/\[[0-9]*$/.test(string)) {string = string + ']';}
                    l[levels[i2]] = string;
                }
                if (main) {
                    iteration.push({[name]: path, ...l});
                } else {
                    finding.push({[name]: path});
                    if (double) finding.push({[double]: path});
                }
                break;
            }
        }
    }

    for (let i = 0, l = iteration.length; i < l; i++) {
        let item = iteration[i];
        if (Object.keys(item).length <= 1) continue;
        let resultObject = {};
        let resultMulti = [];
        let item_keys = Object.keys(item);
        for (let i2 = 0, l2 = item_keys.length; i2 < l2; i2++) {
            let key = item_keys[i2];
            if (!i2) {
                resultObject[key] = formatOut(dots[item[key]], type[key], regex[key]);
                continue;
            }
            let same = item[key];
            for (let i3 = 0, l3 = finding.length; i3 < l3; i3++) {
                let path = finding[i3][key];
                if (path && same === path.slice(0, same.length)) {
                    if (typeof resultObject[key] === 'undefined') {
                        resultObject[key] = formatOut(dots[path], type[key], regex[key]);
                    } else {
                        resultMulti.push({[key]: formatOut(dots[path], type[key], regex[key])});
                    }
                }
            }
        }
        result.push(resultObject);
        if (resultMulti.length) {
            for (let m = 0, l = resultMulti.length; m < l; m++) {
                result.push({...resultObject, ...resultMulti[m]});
            }
        }
    }

    if (time) console.timeEnd('TIME');

    if (group) {
        let g = group.split('.');
        return result.reduce((r, a) => {
            switch (g.length) {
                case 1:
                    r[a[g[0]]] = r[a[g[0]]] || [];
                    r[a[g[0]]].push(a);
                    break;
                case 2:
                    r[a[g[0]]] = r[a[g[0]]] || {};
                    r[a[g[0]]][a[g[1]]] = r[a[g[0]]][a[g[1]]] || [];
                    r[a[g[0]]][a[g[1]]].push(a);
                    break;
                case 3:
                    r[a[g[0]]] = r[a[g[0]]] || {};
                    r[a[g[0]]][a[g[1]]] = r[a[g[0]]][a[g[1]]] || {};
                    r[a[g[0]]][a[g[1]]][a[g[2]]] = r[a[g[0]]][a[g[1]]][a[g[2]]] || [];
                    r[a[g[0]]][a[g[1]]][a[g[2]]].push(a);
                    break;
                case 4:
                    r[a[g[0]]] = r[a[g[0]]] || {};
                    r[a[g[0]]][a[g[1]]] = r[a[g[0]]][a[g[1]]] || {};
                    r[a[g[0]]][a[g[1]]][a[g[2]]] = r[a[g[0]]][a[g[1]]][a[g[2]]] || {};
                    r[a[g[0]]][a[g[1]]][a[g[2]]][a[g[3]]] = r[a[g[0]]][a[g[1]]][a[g[2]]][a[g[3]]] || [];
                    r[a[g[0]]][a[g[1]]][a[g[2]]][a[g[3]]].push(a);
                    break;
            }
            return r;
        }, {});
    }

    return result;
};

function parsePath(path) {
    if (typeof path === 'object') {
        let [p, n, t, r] = path.path.split('<>').map(p => p.trim());
        p = p
            .replace(/^([0-9]*)\./g, '[$1].')
            .replace(/\.([0-9]*)$/g, '[$1]')
            .replace(/\.([0-9]*)\./g, '[$1].');
        return {
            path: p,
            name: (n || path.name || p || '').toString().trim(),
            type: (t || path.type || '').toString().trim(),
            regex: (r || path.regex || ''),
            pattern: new RegExp('^' + p
                .replace(/\./g, '\\.')
                .replace(/\[([0-9]+)]/g, '\\[[0-9]+\\]') + '$')
        };
    }
    let [p, n, t, r] = path.split('<>').map(p => p.trim());
    p = p
        .replace(/^([0-9]*)\./g, '[$1].')
        .replace(/\.([0-9]*)$/g, '[$1]')
        .replace(/\.([0-9]*)\./g, '[$1].');
    return {
        path: (p || ''),
        name: (n || p || ''),
        type: t || '',
        regex: r ? new RegExp(r) : '',
        pattern: new RegExp('^' + p
            .replace(/\./g, '\\.')
            .replace(/\[([0-9]+)]/g, '\\[[0-9]+\\]') + '$')
    };
}

function formatOut(value, type, regex) {
    let result = value;
    if (regex) {
        let reg = ('' + result).match(regex);
        if (reg && reg[1]) {result = reg[1];}
    }
    if (type === 'number') {
        result = parseInt(('' + result).replace(/[^0-9]/g, ''));
    } else if (type === 'boolean') {
        result = !!result;
    } else if (type === 'string') {
        result = ('' + result);
    }
    return result;
}