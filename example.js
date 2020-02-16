const adop = require('./');

let json = {
    results: [
        {
            id: 1,
            main_title: "Title 1",
            seasons: [
                {
                    season: 1,
                    series: ['Series 1', 'Series 2', 'Series 3'],
                    episodes: [
                        {
                            SxEx: 'S01E01',
                            episode: 1,
                            name: 'Name 1'
                        }, {
                            SxEx: 'S01E02',
                            episode: 2,
                            name: 'Name 2'
                        }
                    ]
                }, {
                    season: 2,
                    series: ['Series 1', 'Series 3'],
                    episodes: [
                        {
                            SxEx: 'S02E01',
                            episode: 1,
                            name: 'Name 1'
                        }
                    ]
                }, {
                    season: 3,
                    series: ['Series 2'],
                    episodes: [
                        {
                            SxEx: 'S03E01',
                            episode: 1,
                            name: 'Name 1'
                        }, {
                            SxEx: 'S03E02',
                            episode: 2,
                            name: 'Name 2'
                        }, {
                            SxEx: 'S03E03',
                            episode: 3,
                            name: 'Name 3'
                        }
                    ]
                }
            ]
        }, {
            id: 2,
            main_title: "Title 2",
            seasons: [
                {
                    season: 1,
                    series: ['Series 3', 'Series 4'],
                    episodes: [
                        {
                            SxEx: 'S01E01',
                            episode: 1,
                            name: 'Name 1'
                        }, {
                            SxEx: 'S01E02',
                            episode: 2,
                            name: 'Name 2'
                        }
                    ]
                }
            ]
        }
    ]
};

let obj = [
    {
        name: 'id',
        path: 'results[0].id',
        type: 'number'
    }, {
        name: 'season',
        path: 'results[0].seasons[0].season',
    }, {
        name: 'episode',
        path: 'results[0].seasons[0].episodes[0].SxEx',
        type: 'number',
        regex: /S[0-9]{1,3}E([0-9]{1,3})/
    }, {
        name: 'series',
        path: 'results[0].seasons[0].series[0]',
        type: 'string'
    }
];

let str = '' +
    'results[0].id ~' +
    'results[0].seasons[0].season <> season ~' +
    'results[0].seasons[0].episodes[0].SxEx' +
    '<> episode ' +
    '<> number ' +
    '<> S[0-9]{1,3}E([0-9]{1,3})';

// From string params: path <> name <> type <> regex
console.log(adop(json, str));

// From object params
console.log(adop(json, obj));

// Group by series
console.log(JSON.stringify(adop(json, obj, 'series'), null, 2));

// Group by id.series.season.episode
console.log(JSON.stringify(adop(json, obj, 'id.series.season.episode'), null, 2));