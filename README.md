# [A]ll [D]ot-notation [O]bject [P]ath from multiple items

### Usage

```javascript
const adop = require('adop');

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
                            episode: 1,
                            name: 'Name 1'
                        }, {
                            episode: 2,
                            name: 'Name 2'
                        }
                    ]
                }, {
                    season: 2,
                    series: ['Series 1', 'Series 3'],
                    episodes: [
                        {
                            episode: 1,
                            name: 'Name 1'
                        }
                    ]
                }, {
                    season: 3,
                    series: ['Series 2'],
                    episodes: [
                        {
                            episode: 1,
                            name: 'Name 1'
                        }, {
                            episode: 2,
                            name: 'Name 2'
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
                            episode: 1,
                            name: 'Name 1'
                        }, {
                            episode: 2,
                            name: 'Name 2'
                        }
                    ]
                }
            ]
        }
    ]
};

let paths = [
    {
        name: 'id',
        path: 'results[0].id'
    }, {
        name: 'season',
        path: 'results[0].seasons[0].season'
    }, {
        name: 'episode',
        path: 'results[0].seasons[0].episodes[0].episode'
    }, {
        name: 'series',
        path: 'results[0].seasons[0].series[0]'
    }
];

console.log(adop(json, paths));

/*
[
  { episode: 1, id: 1, season: 1, series: 'Series 1' },
  { episode: 2, id: 1, season: 2, series: 'Series 2' },
  { episode: 1, id: 1, season: 2, series: 'Series 2' },
  { episode: 2, id: 1, season: 2, series: 'Series 3' },
  { episode: 1, id: 1, season: 2, series: 'Series 3' },
  { episode: 2, id: 1, season: 2, series: 'Series 1' },
  { episode: 1, id: 1, season: 2, series: 'Series 1' },
  { episode: 2, id: 1, season: 3, series: 'Series 2' },
  { episode: 1, id: 1, season: 3, series: 'Series 2' },
  { episode: 2, id: 1, season: 3, series: 'Series 3' },
  { episode: 1, id: 1, season: 3, series: 'Series 3' },
  { episode: 2, id: 1, season: 3, series: 'Series 1' },
  { episode: 1, id: 1, season: 3, series: 'Series 1' },
  { episode: 2, id: 1, season: 1, series: 'Series 2' },
  { episode: 1, id: 1, season: 1, series: 'Series 2' },
  { episode: 2, id: 1, season: 1, series: 'Series 3' },
  { episode: 1, id: 1, season: 1, series: 'Series 3' },
  { episode: 2, id: 1, season: 1, series: 'Series 1' },
  { episode: 1, id: 2, season: 1, series: 'Series 3' },
  { episode: 2, id: 2, season: 1, series: 'Series 4' },
  { episode: 1, id: 2, season: 1, series: 'Series 4' },
  { episode: 2, id: 2, season: 1, series: 'Series 3' }
]
*/
```