const dot = require('./dot');

module.exports = (json, paths) => {
    let result = [];
    if (typeof json !== 'object' || typeof paths === 'undefined') {
        return result;
    }
    if (typeof paths !== 'object') {
        paths = [paths.toString()];
    }
    paths = paths.map(p => parsePath(p));

    /*
    Get array object all dot-notation params.
     */

    const list = dot.convert(json);

    /*
    Create array {path, name}
     */

    let keys = Object.keys(list).map(path => {
        let format = false;
        for (let i = 0; i < paths.length; i++) {
            let {name, pattern} = paths[i];
            if (pattern.test(path)) {
                format = {path, name};
                break;
            }
        }
        return format;
    }).filter(Boolean);

    /*
    Create array {name1: [ path1, path2, ... ], ...}
     */

    keys = keys.map(current => {
        let level = {};
        let patterns = {};
        let {path, name} = current;
        let coincidences = {[name]: [path]};
        let path_array = path.split('');
        for (let i = 0; i < keys.length; i++) {
            let {path: pattern_path, name: pattern_name} = keys[i];
            if (name === pattern_name) continue;
            let pattern_array = pattern_path.split('');
            let same = '';
            for (let o = 0; o < pattern_array.length; o++) {
                if (pattern_array[o] !== path_array[o]) break;
                same += pattern_array[o];
            }
            if (!level[pattern_name] || level[pattern_name].length < same.length) {
                level[pattern_name] = same;
                patterns[pattern_name] = new RegExp('^' + same
                    .replace(/\./g, '\\.')
                    .replace(/\[/g, '\\['), '');
            }
        }
        let pattern_array = Object.keys(patterns);
        for (let i = 0; i < pattern_array.length; i++) {
            let pattern_reg = patterns[pattern_array[i]];
            let pattern_name = pattern_array[i];
            for (let j = 0; j < keys.length; j++) {
                let {path: key_path, name: key_name} = keys[j];
                if (pattern_name !== key_name) continue;
                if (!coincidences[pattern_name]) coincidences[pattern_name] = [];
                if (pattern_reg.test(key_path)) {
                    coincidences[pattern_name].push(key_path);
                }
            }
        }
        return coincidences;
    });

    /*
    Create array {name1: value, name2: value ...}
     */

    keys = keys.map(d => {
        const unique = Object.values(d)
            .map(v => v.length)
            .reduce((a, b) => a * b);
        const innerRes = [...Array(unique)].map(_ => ({}));
        const keys = Object.keys(d);
        const keyInfo = [];
        for (let i = keys.length - 1; i > -1; --i) {
            keyInfo.unshift({
                k: keys[i],
                v: d[keys[i]],
                switchRate: keyInfo.length
                    ? keyInfo.map(ki => ki.v.length).reduce((a, b) => (a * b))
                    : 1,
            });
        }
        innerRes.forEach((o, i) => {
            keyInfo.forEach(ki => {
                let index = Math.max(0, Math.ceil(i / ki.switchRate));
                while (index >= ki.v.length) { index -= ki.v.length; }
                o[ki.k] = ki.v[index];
            });
        });
        return innerRes;
    }).flat(1);

    /*
    Delete duplicate entries in array {name1: value, name2: value ...}
     */

    let unique = {};
    keys.forEach(r => {
        let ordered = {};
        Object.keys(r).sort().forEach(key => ordered[key] = list[r[key]]);
        unique[Object.values(ordered).join('')] = ordered;
    });
    Object.keys(unique).forEach(k => result.push(unique[k]));

    return result;
};

function parsePath(path) {
    if (typeof path === 'object') {
        return {
            path: path.path.toString().trim(),
            name: path.name.toString().trim(),
            pattern: new RegExp('^' + path.path.toString().trim()
                .replace(/\./g, '\\.')
                .replace(/\[([0-9]+)]/g, '\\[[0-9]+\\]') + '$')
        };
    }
    path = path.toString().trim();
    return {
        path: path,
        name: path,
        pattern: new RegExp('^' + path.path
            .replace(/\./g, '\\.')
            .replace(/\[([0-9]+)]/g, '\\[[0-9]+\\]') + '$')
    };
}