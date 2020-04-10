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
    'results[0].seasons[0].season' +
    '<> season' +
    '<>' +
    '<>' +
    '<> Season _VALUE_ ~' +
    'results[0].seasons[0].episodes[0].SxEx' +
    '<> episode ' +
    '<> number ' +
    '<> S[0-9]{1,3}E([0-9]{1,3})';

// From string params: path <> name <> type <> regex <> constructor
console.log(adop(json, str));

/*
    [
      { episode: 1, season: 'Season 1', 'results[0].id': 1 },
      { episode: 2, season: 'Season 1', 'results[0].id': 1 },
      { episode: 1, season: 'Season 2', 'results[0].id': 1 },
      { episode: 1, season: 'Season 3', 'results[0].id': 1 },
      { episode: 2, season: 'Season 3', 'results[0].id': 1 },
      { episode: 3, season: 'Season 3', 'results[0].id': 1 },
      { episode: 1, season: 'Season 1', 'results[0].id': 2 },
      { episode: 2, season: 'Season 1', 'results[0].id': 2 }
    ]
*/

// From object params
console.log(adop(json, obj));

/*
    [
      { series: 'Series 1', episode: 1, season: 1, id: 1 },
      { series: 'Series 1', episode: 2, season: 1, id: 1 },
      { series: 'Series 2', episode: 1, season: 1, id: 1 },
      { series: 'Series 2', episode: 2, season: 1, id: 1 },
      { series: 'Series 3', episode: 1, season: 1, id: 1 },
      { series: 'Series 3', episode: 2, season: 1, id: 1 },
      { series: 'Series 1', episode: 1, season: 2, id: 1 },
      { series: 'Series 3', episode: 1, season: 2, id: 1 },
      { series: 'Series 2', episode: 1, season: 3, id: 1 },
      { series: 'Series 2', episode: 2, season: 3, id: 1 },
      { series: 'Series 2', episode: 3, season: 3, id: 1 },
      { series: 'Series 3', episode: 1, season: 1, id: 2 },
      { series: 'Series 3', episode: 2, season: 1, id: 2 },
      { series: 'Series 4', episode: 1, season: 1, id: 2 },
      { series: 'Series 4', episode: 2, season: 1, id: 2 }
    ]
*/

// Group by series
console.log(JSON.stringify(adop(json, obj, 'series'), null, 2));

/*
    {
      "Series 1": [
        {
          "series": "Series 1",
          "episode": 1,
          "season": 1,
          "id": 1
        },
        {
          "series": "Series 1",
          "episode": 2,
          "season": 1,
          "id": 1
        },
        {
          "series": "Series 1",
          "episode": 1,
          "season": 2,
          "id": 1
        }
      ],
      "Series 2": [
        {
          "series": "Series 2",
          "episode": 1,
          "season": 1,
          "id": 1
        },
        {
          "series": "Series 2",
          "episode": 2,
          "season": 1,
          "id": 1
        },
        {
          "series": "Series 2",
          "episode": 1,
          "season": 3,
          "id": 1
        },
        {
          "series": "Series 2",
          "episode": 2,
          "season": 3,
          "id": 1
        },
        {
          "series": "Series 2",
          "episode": 3,
          "season": 3,
          "id": 1
        }
      ],
      "Series 3": [
        {
          "series": "Series 3",
          "episode": 1,
          "season": 1,
          "id": 1
        },
        {
          "series": "Series 3",
          "episode": 2,
          "season": 1,
          "id": 1
        },
        {
          "series": "Series 3",
          "episode": 1,
          "season": 2,
          "id": 1
        },
        {
          "series": "Series 3",
          "episode": 1,
          "season": 1,
          "id": 2
        },
        {
          "series": "Series 3",
          "episode": 2,
          "season": 1,
          "id": 2
        }
      ],
      "Series 4": [
        {
          "series": "Series 4",
          "episode": 1,
          "season": 1,
          "id": 2
        },
        {
          "series": "Series 4",
          "episode": 2,
          "season": 1,
          "id": 2
        }
      ]
    }
*/

// Group by id.series.season.episode
console.log(JSON.stringify(adop(json, obj, 'id.series.season.episode'), null, 2));

/*
    {
      "1": {
        "Series 1": {
          "1": {
            "1": [
              {
                "series": "Series 1",
                "episode": 1,
                "season": 1,
                "id": 1
              }
            ],
            "2": [
              {
                "series": "Series 1",
                "episode": 2,
                "season": 1,
                "id": 1
              }
            ]
          },
          "2": {
            "1": [
              {
                "series": "Series 1",
                "episode": 1,
                "season": 2,
                "id": 1
              }
            ]
          }
        },
        "Series 2": {
          "1": {
            "1": [
              {
                "series": "Series 2",
                "episode": 1,
                "season": 1,
                "id": 1
              }
            ],
            "2": [
              {
                "series": "Series 2",
                "episode": 2,
                "season": 1,
                "id": 1
              }
            ]
          },
          "3": {
            "1": [
              {
                "series": "Series 2",
                "episode": 1,
                "season": 3,
                "id": 1
              }
            ],
            "2": [
              {
                "series": "Series 2",
                "episode": 2,
                "season": 3,
                "id": 1
              }
            ],
            "3": [
              {
                "series": "Series 2",
                "episode": 3,
                "season": 3,
                "id": 1
              }
            ]
          }
        },
        "Series 3": {
          "1": {
            "1": [
              {
                "series": "Series 3",
                "episode": 1,
                "season": 1,
                "id": 1
              }
            ],
            "2": [
              {
                "series": "Series 3",
                "episode": 2,
                "season": 1,
                "id": 1
              }
            ]
          },
          "2": {
            "1": [
              {
                "series": "Series 3",
                "episode": 1,
                "season": 2,
                "id": 1
              }
            ]
          }
        }
      },
      "2": {
        "Series 3": {
          "1": {
            "1": [
              {
                "series": "Series 3",
                "episode": 1,
                "season": 1,
                "id": 2
              }
            ],
            "2": [
              {
                "series": "Series 3",
                "episode": 2,
                "season": 1,
                "id": 2
              }
            ]
          }
        },
        "Series 4": {
          "1": {
            "1": [
              {
                "series": "Series 4",
                "episode": 1,
                "season": 1,
                "id": 2
              }
            ],
            "2": [
              {
                "series": "Series 4",
                "episode": 2,
                "season": 1,
                "id": 2
              }
            ]
          }
        }
      }
    }
*/
```

##### 2020 ExtensionsApp