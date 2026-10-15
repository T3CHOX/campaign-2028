/* Auto-compiled empirical county faction affinities from OpenElections primary results
   Refined with candidate home-state deflation and dropout timeline adjustments */
const COUNTY_FACTIONS_DATA = {
  "10001": {
    "progShare": 0.255,
    "estabShare": 0.745,
    "magaShare": 0.802,
    "relShare": 0.112,
    "modShare": 0.086,
    "demTurnoutBasis": 6242,
    "repTurnoutBasis": 6354
  },
  "10003": {
    "progShare": 0.269,
    "estabShare": 0.731,
    "magaShare": 0.704,
    "relShare": 0.117,
    "modShare": 0.179,
    "demTurnoutBasis": 32413,
    "repTurnoutBasis": 16077
  },
  "10005": {
    "progShare": 0.362,
    "estabShare": 0.638,
    "magaShare": 0.686,
    "relShare": 0.138,
    "modShare": 0.176,
    "demTurnoutBasis": 54986,
    "repTurnoutBasis": 47462
  },
  "13001": {
    "progShare": 0.226,
    "estabShare": 0.774,
    "magaShare": 0.415,
    "relShare": 0.394,
    "modShare": 0.191,
    "demTurnoutBasis": 650,
    "repTurnoutBasis": 3113
  },
  "13003": {
    "progShare": 0.196,
    "estabShare": 0.804,
    "magaShare": 0.657,
    "relShare": 0.243,
    "modShare": 0.1,
    "demTurnoutBasis": 252,
    "repTurnoutBasis": 945
  },
  "13005": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.541,
    "relShare": 0.269,
    "modShare": 0.19,
    "demTurnoutBasis": 177,
    "repTurnoutBasis": 1680
  },
  "13007": {
    "progShare": 0.136,
    "estabShare": 0.864,
    "magaShare": 0.603,
    "relShare": 0.264,
    "modShare": 0.133,
    "demTurnoutBasis": 357,
    "repTurnoutBasis": 435
  },
  "13009": {
    "progShare": 0.201,
    "estabShare": 0.799,
    "magaShare": 0.456,
    "relShare": 0.275,
    "modShare": 0.269,
    "demTurnoutBasis": 3825,
    "repTurnoutBasis": 4527
  },
  "13011": {
    "progShare": 0.496,
    "estabShare": 0.504,
    "magaShare": 0.491,
    "relShare": 0.356,
    "modShare": 0.153,
    "demTurnoutBasis": 351,
    "repTurnoutBasis": 3700
  },
  "13013": {
    "progShare": 0.376,
    "estabShare": 0.624,
    "magaShare": 0.408,
    "relShare": 0.373,
    "modShare": 0.219,
    "demTurnoutBasis": 2362,
    "repTurnoutBasis": 11421
  },
  "13015": {
    "progShare": 0.403,
    "estabShare": 0.597,
    "magaShare": 0.462,
    "relShare": 0.319,
    "modShare": 0.219,
    "demTurnoutBasis": 3763,
    "repTurnoutBasis": 17977
  },
  "13017": {
    "progShare": 0.188,
    "estabShare": 0.812,
    "magaShare": 0.557,
    "relShare": 0.288,
    "modShare": 0.155,
    "demTurnoutBasis": 973,
    "repTurnoutBasis": 1834
  },
  "13019": {
    "progShare": 0.309,
    "estabShare": 0.691,
    "magaShare": 0.554,
    "relShare": 0.32,
    "modShare": 0.126,
    "demTurnoutBasis": 488,
    "repTurnoutBasis": 2840
  },
  "13021": {
    "progShare": 0.169,
    "estabShare": 0.831,
    "magaShare": 0.387,
    "relShare": 0.3,
    "modShare": 0.313,
    "demTurnoutBasis": 15731,
    "repTurnoutBasis": 15379
  },
  "13023": {
    "progShare": 0.209,
    "estabShare": 0.791,
    "magaShare": 0.435,
    "relShare": 0.316,
    "modShare": 0.249,
    "demTurnoutBasis": 476,
    "repTurnoutBasis": 2144
  },
  "13025": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.49,
    "relShare": 0.343,
    "modShare": 0.167,
    "demTurnoutBasis": 281,
    "repTurnoutBasis": 2383
  },
  "13027": {
    "progShare": 0.214,
    "estabShare": 0.786,
    "magaShare": 0.52,
    "relShare": 0.305,
    "modShare": 0.175,
    "demTurnoutBasis": 932,
    "repTurnoutBasis": 1955
  },
  "13029": {
    "progShare": 0.359,
    "estabShare": 0.641,
    "magaShare": 0.39,
    "relShare": 0.322,
    "modShare": 0.288,
    "demTurnoutBasis": 1413,
    "repTurnoutBasis": 5672
  },
  "13031": {
    "progShare": 0.39,
    "estabShare": 0.61,
    "magaShare": 0.377,
    "relShare": 0.342,
    "modShare": 0.281,
    "demTurnoutBasis": 3159,
    "repTurnoutBasis": 8253
  },
  "13033": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.451,
    "relShare": 0.371,
    "modShare": 0.178,
    "demTurnoutBasis": 1855,
    "repTurnoutBasis": 2617
  },
  "13035": {
    "progShare": 0.172,
    "estabShare": 0.828,
    "magaShare": 0.488,
    "relShare": 0.324,
    "modShare": 0.188,
    "demTurnoutBasis": 1128,
    "repTurnoutBasis": 3863
  },
  "13037": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.507,
    "relShare": 0.3,
    "modShare": 0.193,
    "demTurnoutBasis": 561,
    "repTurnoutBasis": 448
  },
  "13039": {
    "progShare": 0.329,
    "estabShare": 0.671,
    "magaShare": 0.485,
    "relShare": 0.263,
    "modShare": 0.252,
    "demTurnoutBasis": 2111,
    "repTurnoutBasis": 6329
  },
  "13043": {
    "progShare": 0.203,
    "estabShare": 0.797,
    "magaShare": 0.486,
    "relShare": 0.259,
    "modShare": 0.255,
    "demTurnoutBasis": 556,
    "repTurnoutBasis": 1835
  },
  "13045": {
    "progShare": 0.379,
    "estabShare": 0.621,
    "magaShare": 0.417,
    "relShare": 0.352,
    "modShare": 0.231,
    "demTurnoutBasis": 5160,
    "repTurnoutBasis": 18031
  },
  "13047": {
    "progShare": 0.486,
    "estabShare": 0.514,
    "magaShare": 0.402,
    "relShare": 0.331,
    "modShare": 0.267,
    "demTurnoutBasis": 2139,
    "repTurnoutBasis": 11115
  },
  "13049": {
    "progShare": 0.234,
    "estabShare": 0.766,
    "magaShare": 0.473,
    "relShare": 0.324,
    "modShare": 0.203,
    "demTurnoutBasis": 373,
    "repTurnoutBasis": 1274
  },
  "13051": {
    "progShare": 0.274,
    "estabShare": 0.726,
    "magaShare": 0.349,
    "relShare": 0.282,
    "modShare": 0.369,
    "demTurnoutBasis": 27546,
    "repTurnoutBasis": 30671
  },
  "13053": {
    "progShare": 0.18,
    "estabShare": 0.82,
    "magaShare": 0.542,
    "relShare": 0.323,
    "modShare": 0.135,
    "demTurnoutBasis": 224,
    "repTurnoutBasis": 321
  },
  "13055": {
    "progShare": 0.347,
    "estabShare": 0.653,
    "magaShare": 0.517,
    "relShare": 0.288,
    "modShare": 0.195,
    "demTurnoutBasis": 891,
    "repTurnoutBasis": 3244
  },
  "13057": {
    "progShare": 0.478,
    "estabShare": 0.522,
    "magaShare": 0.367,
    "relShare": 0.31,
    "modShare": 0.323,
    "demTurnoutBasis": 9340,
    "repTurnoutBasis": 50327
  },
  "13059": {
    "progShare": 0.492,
    "estabShare": 0.508,
    "magaShare": 0.267,
    "relShare": 0.268,
    "modShare": 0.465,
    "demTurnoutBasis": 14027,
    "repTurnoutBasis": 8839
  },
  "13061": {
    "progShare": 0.129,
    "estabShare": 0.871,
    "magaShare": 0.518,
    "relShare": 0.251,
    "modShare": 0.231,
    "demTurnoutBasis": 347,
    "repTurnoutBasis": 346
  },
  "13063": {
    "progShare": 0.181,
    "estabShare": 0.819,
    "magaShare": 0.42,
    "relShare": 0.311,
    "modShare": 0.269,
    "demTurnoutBasis": 30806,
    "repTurnoutBasis": 7770
  },
  "13065": {
    "progShare": 0.185,
    "estabShare": 0.815,
    "magaShare": 0.507,
    "relShare": 0.312,
    "modShare": 0.181,
    "demTurnoutBasis": 210,
    "repTurnoutBasis": 812
  },
  "13067": {
    "progShare": 0.363,
    "estabShare": 0.637,
    "magaShare": 0.31,
    "relShare": 0.261,
    "modShare": 0.429,
    "demTurnoutBasis": 62252,
    "repTurnoutBasis": 112197
  },
  "13069": {
    "progShare": 0.22,
    "estabShare": 0.78,
    "magaShare": 0.548,
    "relShare": 0.285,
    "modShare": 0.167,
    "demTurnoutBasis": 1421,
    "repTurnoutBasis": 4519
  },
  "13071": {
    "progShare": 0.226,
    "estabShare": 0.774,
    "magaShare": 0.495,
    "relShare": 0.32,
    "modShare": 0.185,
    "demTurnoutBasis": 1360,
    "repTurnoutBasis": 5982
  },
  "13073": {
    "progShare": 0.327,
    "estabShare": 0.673,
    "magaShare": 0.346,
    "relShare": 0.387,
    "modShare": 0.267,
    "demTurnoutBasis": 7191,
    "repTurnoutBasis": 26505
  },
  "13075": {
    "progShare": 0.228,
    "estabShare": 0.772,
    "magaShare": 0.547,
    "relShare": 0.312,
    "modShare": 0.141,
    "demTurnoutBasis": 761,
    "repTurnoutBasis": 2248
  },
  "13077": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.379,
    "relShare": 0.329,
    "modShare": 0.292,
    "demTurnoutBasis": 6649,
    "repTurnoutBasis": 25333
  },
  "13079": {
    "progShare": 0.196,
    "estabShare": 0.804,
    "magaShare": 0.521,
    "relShare": 0.3,
    "modShare": 0.179,
    "demTurnoutBasis": 623,
    "repTurnoutBasis": 1796
  },
  "13081": {
    "progShare": 0.19,
    "estabShare": 0.81,
    "magaShare": 0.504,
    "relShare": 0.286,
    "modShare": 0.21,
    "demTurnoutBasis": 912,
    "repTurnoutBasis": 2399
  },
  "13083": {
    "progShare": 0.488,
    "estabShare": 0.512,
    "magaShare": 0.412,
    "relShare": 0.302,
    "modShare": 0.286,
    "demTurnoutBasis": 481,
    "repTurnoutBasis": 2795
  },
  "13085": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.454,
    "relShare": 0.306,
    "modShare": 0.24,
    "demTurnoutBasis": 590,
    "repTurnoutBasis": 5838
  },
  "13087": {
    "progShare": 0.203,
    "estabShare": 0.797,
    "magaShare": 0.485,
    "relShare": 0.29,
    "modShare": 0.225,
    "demTurnoutBasis": 1679,
    "repTurnoutBasis": 3161
  },
  "13089": {
    "progShare": 0.284,
    "estabShare": 0.716,
    "magaShare": 0.251,
    "relShare": 0.198,
    "modShare": 0.551,
    "demTurnoutBasis": 115573,
    "repTurnoutBasis": 44450
  },
  "13091": {
    "progShare": 0.196,
    "estabShare": 0.804,
    "magaShare": 0.507,
    "relShare": 0.274,
    "modShare": 0.219,
    "demTurnoutBasis": 728,
    "repTurnoutBasis": 2696
  },
  "13093": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.557,
    "relShare": 0.256,
    "modShare": 0.187,
    "demTurnoutBasis": 837,
    "repTurnoutBasis": 1053
  },
  "13095": {
    "progShare": 0.139,
    "estabShare": 0.861,
    "magaShare": 0.468,
    "relShare": 0.283,
    "modShare": 0.249,
    "demTurnoutBasis": 10406,
    "repTurnoutBasis": 6579
  },
  "13097": {
    "progShare": 0.251,
    "estabShare": 0.749,
    "magaShare": 0.428,
    "relShare": 0.314,
    "modShare": 0.258,
    "demTurnoutBasis": 12591,
    "repTurnoutBasis": 16322
  },
  "13099": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.562,
    "relShare": 0.223,
    "modShare": 0.215,
    "demTurnoutBasis": 754,
    "repTurnoutBasis": 1354
  },
  "13101": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.584,
    "relShare": 0.313,
    "modShare": 0.103,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 460
  },
  "13103": {
    "progShare": 0.345,
    "estabShare": 0.655,
    "magaShare": 0.393,
    "relShare": 0.404,
    "modShare": 0.203,
    "demTurnoutBasis": 1829,
    "repTurnoutBasis": 9282
  },
  "13105": {
    "progShare": 0.24,
    "estabShare": 0.76,
    "magaShare": 0.459,
    "relShare": 0.294,
    "modShare": 0.247,
    "demTurnoutBasis": 1087,
    "repTurnoutBasis": 3056
  },
  "13107": {
    "progShare": 0.161,
    "estabShare": 0.839,
    "magaShare": 0.504,
    "relShare": 0.303,
    "modShare": 0.193,
    "demTurnoutBasis": 912,
    "repTurnoutBasis": 2977
  },
  "13109": {
    "progShare": 0.197,
    "estabShare": 0.803,
    "magaShare": 0.378,
    "relShare": 0.323,
    "modShare": 0.299,
    "demTurnoutBasis": 442,
    "repTurnoutBasis": 1268
  },
  "13111": {
    "progShare": 0.394,
    "estabShare": 0.606,
    "magaShare": 0.533,
    "relShare": 0.266,
    "modShare": 0.201,
    "demTurnoutBasis": 912,
    "repTurnoutBasis": 5650
  },
  "13113": {
    "progShare": 0.287,
    "estabShare": 0.713,
    "magaShare": 0.327,
    "relShare": 0.299,
    "modShare": 0.374,
    "demTurnoutBasis": 10229,
    "repTurnoutBasis": 24662
  },
  "13115": {
    "progShare": 0.348,
    "estabShare": 0.652,
    "magaShare": 0.423,
    "relShare": 0.286,
    "modShare": 0.291,
    "demTurnoutBasis": 3988,
    "repTurnoutBasis": 14142
  },
  "13117": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.371,
    "relShare": 0.281,
    "modShare": 0.348,
    "demTurnoutBasis": 6896,
    "repTurnoutBasis": 42318
  },
  "13119": {
    "progShare": 0.368,
    "estabShare": 0.632,
    "magaShare": 0.46,
    "relShare": 0.325,
    "modShare": 0.215,
    "demTurnoutBasis": 563,
    "repTurnoutBasis": 4350
  },
  "13121": {
    "progShare": 0.288,
    "estabShare": 0.712,
    "magaShare": 0.266,
    "relShare": 0.183,
    "modShare": 0.551,
    "demTurnoutBasis": 117551,
    "repTurnoutBasis": 84794
  },
  "13123": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.516,
    "relShare": 0.259,
    "modShare": 0.225,
    "demTurnoutBasis": 925,
    "repTurnoutBasis": 6467
  },
  "13125": {
    "progShare": 0.333,
    "estabShare": 0.667,
    "magaShare": 0.583,
    "relShare": 0.248,
    "modShare": 0.169,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 691
  },
  "13127": {
    "progShare": 0.308,
    "estabShare": 0.692,
    "magaShare": 0.437,
    "relShare": 0.274,
    "modShare": 0.289,
    "demTurnoutBasis": 4196,
    "repTurnoutBasis": 12642
  },
  "13129": {
    "progShare": 0.416,
    "estabShare": 0.584,
    "magaShare": 0.506,
    "relShare": 0.276,
    "modShare": 0.218,
    "demTurnoutBasis": 1352,
    "repTurnoutBasis": 8598
  },
  "13131": {
    "progShare": 0.228,
    "estabShare": 0.772,
    "magaShare": 0.444,
    "relShare": 0.334,
    "modShare": 0.222,
    "demTurnoutBasis": 1169,
    "repTurnoutBasis": 3201
  },
  "13133": {
    "progShare": 0.136,
    "estabShare": 0.864,
    "magaShare": 0.412,
    "relShare": 0.217,
    "modShare": 0.371,
    "demTurnoutBasis": 1255,
    "repTurnoutBasis": 3774
  },
  "13135": {
    "progShare": 0.335,
    "estabShare": 0.665,
    "magaShare": 0.325,
    "relShare": 0.311,
    "modShare": 0.364,
    "demTurnoutBasis": 57186,
    "repTurnoutBasis": 98949
  },
  "13137": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.419,
    "relShare": 0.342,
    "modShare": 0.239,
    "demTurnoutBasis": 1174,
    "repTurnoutBasis": 7885
  },
  "13139": {
    "progShare": 0.392,
    "estabShare": 0.608,
    "magaShare": 0.385,
    "relShare": 0.351,
    "modShare": 0.264,
    "demTurnoutBasis": 5801,
    "repTurnoutBasis": 32623
  },
  "13141": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.562,
    "relShare": 0.226,
    "modShare": 0.212,
    "demTurnoutBasis": 1284,
    "repTurnoutBasis": 416
  },
  "13143": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.496,
    "relShare": 0.336,
    "modShare": 0.168,
    "demTurnoutBasis": 751,
    "repTurnoutBasis": 5707
  },
  "13145": {
    "progShare": 0.246,
    "estabShare": 0.754,
    "magaShare": 0.368,
    "relShare": 0.384,
    "modShare": 0.248,
    "demTurnoutBasis": 1829,
    "repTurnoutBasis": 6898
  },
  "13147": {
    "progShare": 0.272,
    "estabShare": 0.728,
    "magaShare": 0.442,
    "relShare": 0.315,
    "modShare": 0.243,
    "demTurnoutBasis": 1024,
    "repTurnoutBasis": 4208
  },
  "13149": {
    "progShare": 0.286,
    "estabShare": 0.714,
    "magaShare": 0.551,
    "relShare": 0.274,
    "modShare": 0.175,
    "demTurnoutBasis": 395,
    "repTurnoutBasis": 1940
  },
  "13151": {
    "progShare": 0.221,
    "estabShare": 0.779,
    "magaShare": 0.402,
    "relShare": 0.353,
    "modShare": 0.245,
    "demTurnoutBasis": 20336,
    "repTurnoutBasis": 28289
  },
  "13153": {
    "progShare": 0.237,
    "estabShare": 0.763,
    "magaShare": 0.37,
    "relShare": 0.359,
    "modShare": 0.271,
    "demTurnoutBasis": 8307,
    "repTurnoutBasis": 19210
  },
  "13155": {
    "progShare": 0.189,
    "estabShare": 0.811,
    "magaShare": 0.578,
    "relShare": 0.291,
    "modShare": 0.131,
    "demTurnoutBasis": 410,
    "repTurnoutBasis": 1530
  },
  "13157": {
    "progShare": 0.381,
    "estabShare": 0.619,
    "magaShare": 0.429,
    "relShare": 0.345,
    "modShare": 0.226,
    "demTurnoutBasis": 1948,
    "repTurnoutBasis": 12791
  },
  "13159": {
    "progShare": 0.173,
    "estabShare": 0.827,
    "magaShare": 0.484,
    "relShare": 0.328,
    "modShare": 0.188,
    "demTurnoutBasis": 778,
    "repTurnoutBasis": 2499
  },
  "13161": {
    "progShare": 0.211,
    "estabShare": 0.789,
    "magaShare": 0.471,
    "relShare": 0.324,
    "modShare": 0.205,
    "demTurnoutBasis": 523,
    "repTurnoutBasis": 2287
  },
  "13163": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.476,
    "relShare": 0.339,
    "modShare": 0.185,
    "demTurnoutBasis": 1834,
    "repTurnoutBasis": 1804
  },
  "13165": {
    "progShare": 0.152,
    "estabShare": 0.848,
    "magaShare": 0.519,
    "relShare": 0.278,
    "modShare": 0.203,
    "demTurnoutBasis": 423,
    "repTurnoutBasis": 992
  },
  "13167": {
    "progShare": 0.141,
    "estabShare": 0.859,
    "magaShare": 0.537,
    "relShare": 0.302,
    "modShare": 0.161,
    "demTurnoutBasis": 457,
    "repTurnoutBasis": 1280
  },
  "13169": {
    "progShare": 0.189,
    "estabShare": 0.811,
    "magaShare": 0.489,
    "relShare": 0.311,
    "modShare": 0.2,
    "demTurnoutBasis": 1978,
    "repTurnoutBasis": 4740
  },
  "13171": {
    "progShare": 0.193,
    "estabShare": 0.807,
    "magaShare": 0.455,
    "relShare": 0.355,
    "modShare": 0.19,
    "demTurnoutBasis": 1090,
    "repTurnoutBasis": 3075
  },
  "13173": {
    "progShare": 0.23,
    "estabShare": 0.77,
    "magaShare": 0.568,
    "relShare": 0.274,
    "modShare": 0.158,
    "demTurnoutBasis": 307,
    "repTurnoutBasis": 906
  },
  "13175": {
    "progShare": 0.165,
    "estabShare": 0.835,
    "magaShare": 0.444,
    "relShare": 0.327,
    "modShare": 0.229,
    "demTurnoutBasis": 2792,
    "repTurnoutBasis": 6968
  },
  "13177": {
    "progShare": 0.25,
    "estabShare": 0.75,
    "magaShare": 0.513,
    "relShare": 0.306,
    "modShare": 0.181,
    "demTurnoutBasis": 1362,
    "repTurnoutBasis": 5967
  },
  "13179": {
    "progShare": 0.196,
    "estabShare": 0.804,
    "magaShare": 0.457,
    "relShare": 0.291,
    "modShare": 0.252,
    "demTurnoutBasis": 3495,
    "repTurnoutBasis": 2907
  },
  "13181": {
    "progShare": 0.147,
    "estabShare": 0.853,
    "magaShare": 0.442,
    "relShare": 0.376,
    "modShare": 0.182,
    "demTurnoutBasis": 637,
    "repTurnoutBasis": 1678
  },
  "13183": {
    "progShare": 0.3,
    "estabShare": 0.7,
    "magaShare": 0.553,
    "relShare": 0.288,
    "modShare": 0.159,
    "demTurnoutBasis": 386,
    "repTurnoutBasis": 1152
  },
  "13185": {
    "progShare": 0.321,
    "estabShare": 0.679,
    "magaShare": 0.442,
    "relShare": 0.349,
    "modShare": 0.209,
    "demTurnoutBasis": 5958,
    "repTurnoutBasis": 12052
  },
  "13187": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.416,
    "relShare": 0.352,
    "modShare": 0.232,
    "demTurnoutBasis": 1111,
    "repTurnoutBasis": 5932
  },
  "13189": {
    "progShare": 0.149,
    "estabShare": 0.851,
    "magaShare": 0.406,
    "relShare": 0.395,
    "modShare": 0.199,
    "demTurnoutBasis": 1505,
    "repTurnoutBasis": 3168
  },
  "13191": {
    "progShare": 0.147,
    "estabShare": 0.853,
    "magaShare": 0.54,
    "relShare": 0.242,
    "modShare": 0.218,
    "demTurnoutBasis": 1025,
    "repTurnoutBasis": 1999
  },
  "13193": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.502,
    "relShare": 0.282,
    "modShare": 0.216,
    "demTurnoutBasis": 1087,
    "repTurnoutBasis": 824
  },
  "13195": {
    "progShare": 0.435,
    "estabShare": 0.565,
    "magaShare": 0.445,
    "relShare": 0.361,
    "modShare": 0.194,
    "demTurnoutBasis": 1178,
    "repTurnoutBasis": 5530
  },
  "13197": {
    "progShare": 0.218,
    "estabShare": 0.782,
    "magaShare": 0.539,
    "relShare": 0.326,
    "modShare": 0.135,
    "demTurnoutBasis": 563,
    "repTurnoutBasis": 882
  },
  "13199": {
    "progShare": 0.139,
    "estabShare": 0.861,
    "magaShare": 0.481,
    "relShare": 0.315,
    "modShare": 0.204,
    "demTurnoutBasis": 1713,
    "repTurnoutBasis": 2983
  },
  "13201": {
    "progShare": 0.189,
    "estabShare": 0.811,
    "magaShare": 0.602,
    "relShare": 0.213,
    "modShare": 0.185,
    "demTurnoutBasis": 205,
    "repTurnoutBasis": 921
  },
  "13205": {
    "progShare": 0.131,
    "estabShare": 0.869,
    "magaShare": 0.547,
    "relShare": 0.266,
    "modShare": 0.187,
    "demTurnoutBasis": 1564,
    "repTurnoutBasis": 2279
  },
  "13207": {
    "progShare": 0.194,
    "estabShare": 0.806,
    "magaShare": 0.409,
    "relShare": 0.352,
    "modShare": 0.239,
    "demTurnoutBasis": 1563,
    "repTurnoutBasis": 5541
  },
  "13209": {
    "progShare": 0.201,
    "estabShare": 0.799,
    "magaShare": 0.489,
    "relShare": 0.343,
    "modShare": 0.168,
    "demTurnoutBasis": 367,
    "repTurnoutBasis": 1455
  },
  "13211": {
    "progShare": 0.222,
    "estabShare": 0.778,
    "magaShare": 0.4,
    "relShare": 0.336,
    "modShare": 0.264,
    "demTurnoutBasis": 1174,
    "repTurnoutBasis": 4151
  },
  "13213": {
    "progShare": 0.478,
    "estabShare": 0.522,
    "magaShare": 0.573,
    "relShare": 0.271,
    "modShare": 0.156,
    "demTurnoutBasis": 868,
    "repTurnoutBasis": 5388
  },
  "13215": {
    "progShare": 0.206,
    "estabShare": 0.794,
    "magaShare": 0.343,
    "relShare": 0.348,
    "modShare": 0.309,
    "demTurnoutBasis": 16264,
    "repTurnoutBasis": 15517
  },
  "13217": {
    "progShare": 0.216,
    "estabShare": 0.784,
    "magaShare": 0.439,
    "relShare": 0.333,
    "modShare": 0.228,
    "demTurnoutBasis": 9321,
    "repTurnoutBasis": 12796
  },
  "13219": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.313,
    "relShare": 0.323,
    "modShare": 0.364,
    "demTurnoutBasis": 2337,
    "repTurnoutBasis": 9161
  },
  "13221": {
    "progShare": 0.389,
    "estabShare": 0.611,
    "magaShare": 0.438,
    "relShare": 0.347,
    "modShare": 0.215,
    "demTurnoutBasis": 928,
    "repTurnoutBasis": 2803
  },
  "13223": {
    "progShare": 0.34,
    "estabShare": 0.66,
    "magaShare": 0.414,
    "relShare": 0.342,
    "modShare": 0.244,
    "demTurnoutBasis": 6287,
    "repTurnoutBasis": 24177
  },
  "13225": {
    "progShare": 0.159,
    "estabShare": 0.841,
    "magaShare": 0.435,
    "relShare": 0.348,
    "modShare": 0.217,
    "demTurnoutBasis": 2003,
    "repTurnoutBasis": 3052
  },
  "13227": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.481,
    "relShare": 0.277,
    "modShare": 0.242,
    "demTurnoutBasis": 811,
    "repTurnoutBasis": 6987
  },
  "13229": {
    "progShare": 0.322,
    "estabShare": 0.678,
    "magaShare": 0.403,
    "relShare": 0.382,
    "modShare": 0.215,
    "demTurnoutBasis": 327,
    "repTurnoutBasis": 3333
  },
  "13231": {
    "progShare": 0.31,
    "estabShare": 0.69,
    "magaShare": 0.437,
    "relShare": 0.376,
    "modShare": 0.187,
    "demTurnoutBasis": 612,
    "repTurnoutBasis": 4413
  },
  "13233": {
    "progShare": 0.299,
    "estabShare": 0.701,
    "magaShare": 0.557,
    "relShare": 0.248,
    "modShare": 0.195,
    "demTurnoutBasis": 1377,
    "repTurnoutBasis": 6050
  },
  "13235": {
    "progShare": 0.138,
    "estabShare": 0.862,
    "magaShare": 0.505,
    "relShare": 0.247,
    "modShare": 0.248,
    "demTurnoutBasis": 437,
    "repTurnoutBasis": 1339
  },
  "13237": {
    "progShare": 0.191,
    "estabShare": 0.809,
    "magaShare": 0.492,
    "relShare": 0.248,
    "modShare": 0.26,
    "demTurnoutBasis": 1086,
    "repTurnoutBasis": 4034
  },
  "13239": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.569,
    "relShare": 0.213,
    "modShare": 0.218,
    "demTurnoutBasis": 212,
    "repTurnoutBasis": 304
  },
  "13241": {
    "progShare": 0.45,
    "estabShare": 0.55,
    "magaShare": 0.458,
    "relShare": 0.265,
    "modShare": 0.277,
    "demTurnoutBasis": 735,
    "repTurnoutBasis": 3776
  },
  "13243": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.586,
    "relShare": 0.249,
    "modShare": 0.165,
    "demTurnoutBasis": 774,
    "repTurnoutBasis": 701
  },
  "13245": {
    "progShare": 0.18,
    "estabShare": 0.82,
    "magaShare": 0.368,
    "relShare": 0.363,
    "modShare": 0.269,
    "demTurnoutBasis": 19975,
    "repTurnoutBasis": 15065
  },
  "13247": {
    "progShare": 0.219,
    "estabShare": 0.781,
    "magaShare": 0.411,
    "relShare": 0.307,
    "modShare": 0.282,
    "demTurnoutBasis": 10230,
    "repTurnoutBasis": 9247
  },
  "13249": {
    "progShare": 0.145,
    "estabShare": 0.855,
    "magaShare": 0.429,
    "relShare": 0.385,
    "modShare": 0.186,
    "demTurnoutBasis": 176,
    "repTurnoutBasis": 773
  },
  "13251": {
    "progShare": 0.179,
    "estabShare": 0.821,
    "magaShare": 0.457,
    "relShare": 0.3,
    "modShare": 0.243,
    "demTurnoutBasis": 955,
    "repTurnoutBasis": 1751
  },
  "13253": {
    "progShare": 0.146,
    "estabShare": 0.854,
    "magaShare": 0.538,
    "relShare": 0.248,
    "modShare": 0.214,
    "demTurnoutBasis": 562,
    "repTurnoutBasis": 1408
  },
  "13255": {
    "progShare": 0.207,
    "estabShare": 0.793,
    "magaShare": 0.427,
    "relShare": 0.325,
    "modShare": 0.248,
    "demTurnoutBasis": 3983,
    "repTurnoutBasis": 9964
  },
  "13257": {
    "progShare": 0.382,
    "estabShare": 0.618,
    "magaShare": 0.413,
    "relShare": 0.302,
    "modShare": 0.285,
    "demTurnoutBasis": 758,
    "repTurnoutBasis": 4172
  },
  "13259": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.56,
    "relShare": 0.296,
    "modShare": 0.144,
    "demTurnoutBasis": 511,
    "repTurnoutBasis": 381
  },
  "13261": {
    "progShare": 0.171,
    "estabShare": 0.829,
    "magaShare": 0.459,
    "relShare": 0.31,
    "modShare": 0.231,
    "demTurnoutBasis": 2379,
    "repTurnoutBasis": 3010
  },
  "13263": {
    "progShare": 0.123,
    "estabShare": 0.877,
    "magaShare": 0.534,
    "relShare": 0.321,
    "modShare": 0.145,
    "demTurnoutBasis": 983,
    "repTurnoutBasis": 688
  },
  "13265": {
    "progShare": 0.129,
    "estabShare": 0.871,
    "magaShare": 0.513,
    "relShare": 0.281,
    "modShare": 0.206,
    "demTurnoutBasis": 273,
    "repTurnoutBasis": 197
  },
  "13267": {
    "progShare": 0.229,
    "estabShare": 0.771,
    "magaShare": 0.426,
    "relShare": 0.349,
    "modShare": 0.225,
    "demTurnoutBasis": 682,
    "repTurnoutBasis": 2558
  },
  "13269": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.518,
    "relShare": 0.307,
    "modShare": 0.175,
    "demTurnoutBasis": 545,
    "repTurnoutBasis": 1064
  },
  "13271": {
    "progShare": 0.176,
    "estabShare": 0.824,
    "magaShare": 0.518,
    "relShare": 0.286,
    "modShare": 0.196,
    "demTurnoutBasis": 525,
    "repTurnoutBasis": 1215
  },
  "13273": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.561,
    "relShare": 0.281,
    "modShare": 0.158,
    "demTurnoutBasis": 914,
    "repTurnoutBasis": 1161
  },
  "13275": {
    "progShare": 0.212,
    "estabShare": 0.788,
    "magaShare": 0.4,
    "relShare": 0.338,
    "modShare": 0.262,
    "demTurnoutBasis": 2625,
    "repTurnoutBasis": 6623
  },
  "13277": {
    "progShare": 0.23,
    "estabShare": 0.77,
    "magaShare": 0.478,
    "relShare": 0.306,
    "modShare": 0.216,
    "demTurnoutBasis": 1525,
    "repTurnoutBasis": 5666
  },
  "13279": {
    "progShare": 0.227,
    "estabShare": 0.773,
    "magaShare": 0.418,
    "relShare": 0.335,
    "modShare": 0.247,
    "demTurnoutBasis": 740,
    "repTurnoutBasis": 3630
  },
  "13281": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.46,
    "relShare": 0.27,
    "modShare": 0.27,
    "demTurnoutBasis": 599,
    "repTurnoutBasis": 2969
  },
  "13283": {
    "progShare": 0.161,
    "estabShare": 0.839,
    "magaShare": 0.543,
    "relShare": 0.313,
    "modShare": 0.144,
    "demTurnoutBasis": 367,
    "repTurnoutBasis": 811
  },
  "13285": {
    "progShare": 0.203,
    "estabShare": 0.797,
    "magaShare": 0.435,
    "relShare": 0.324,
    "modShare": 0.241,
    "demTurnoutBasis": 4289,
    "repTurnoutBasis": 9580
  },
  "13287": {
    "progShare": 0.197,
    "estabShare": 0.803,
    "magaShare": 0.569,
    "relShare": 0.292,
    "modShare": 0.139,
    "demTurnoutBasis": 418,
    "repTurnoutBasis": 1147
  },
  "13289": {
    "progShare": 0.126,
    "estabShare": 0.874,
    "magaShare": 0.55,
    "relShare": 0.296,
    "modShare": 0.154,
    "demTurnoutBasis": 948,
    "repTurnoutBasis": 1079
  },
  "13291": {
    "progShare": 0.421,
    "estabShare": 0.579,
    "magaShare": 0.455,
    "relShare": 0.312,
    "modShare": 0.233,
    "demTurnoutBasis": 1019,
    "repTurnoutBasis": 5908
  },
  "13293": {
    "progShare": 0.185,
    "estabShare": 0.815,
    "magaShare": 0.488,
    "relShare": 0.315,
    "modShare": 0.197,
    "demTurnoutBasis": 1529,
    "repTurnoutBasis": 3927
  },
  "13295": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.422,
    "relShare": 0.311,
    "modShare": 0.267,
    "demTurnoutBasis": 1906,
    "repTurnoutBasis": 9989
  },
  "13297": {
    "progShare": 0.295,
    "estabShare": 0.705,
    "magaShare": 0.416,
    "relShare": 0.368,
    "modShare": 0.216,
    "demTurnoutBasis": 3309,
    "repTurnoutBasis": 19052
  },
  "13299": {
    "progShare": 0.236,
    "estabShare": 0.764,
    "magaShare": 0.434,
    "relShare": 0.379,
    "modShare": 0.187,
    "demTurnoutBasis": 1226,
    "repTurnoutBasis": 4603
  },
  "13301": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.47,
    "relShare": 0.348,
    "modShare": 0.182,
    "demTurnoutBasis": 523,
    "repTurnoutBasis": 631
  },
  "13303": {
    "progShare": 0.129,
    "estabShare": 0.871,
    "magaShare": 0.442,
    "relShare": 0.293,
    "modShare": 0.265,
    "demTurnoutBasis": 2025,
    "repTurnoutBasis": 2302
  },
  "13305": {
    "progShare": 0.252,
    "estabShare": 0.748,
    "magaShare": 0.458,
    "relShare": 0.34,
    "modShare": 0.202,
    "demTurnoutBasis": 958,
    "repTurnoutBasis": 4448
  },
  "13307": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.301,
    "modShare": 0.179,
    "demTurnoutBasis": 190,
    "repTurnoutBasis": 369
  },
  "13309": {
    "progShare": 0.128,
    "estabShare": 0.872,
    "magaShare": 0.503,
    "relShare": 0.317,
    "modShare": 0.18,
    "demTurnoutBasis": 206,
    "repTurnoutBasis": 565
  },
  "13311": {
    "progShare": 0.469,
    "estabShare": 0.531,
    "magaShare": 0.453,
    "relShare": 0.325,
    "modShare": 0.222,
    "demTurnoutBasis": 951,
    "repTurnoutBasis": 6007
  },
  "13313": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.466,
    "relShare": 0.272,
    "modShare": 0.262,
    "demTurnoutBasis": 2888,
    "repTurnoutBasis": 12778
  },
  "13315": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.553,
    "relShare": 0.324,
    "modShare": 0.123,
    "demTurnoutBasis": 349,
    "repTurnoutBasis": 1092
  },
  "13317": {
    "progShare": 0.167,
    "estabShare": 0.833,
    "magaShare": 0.486,
    "relShare": 0.285,
    "modShare": 0.229,
    "demTurnoutBasis": 855,
    "repTurnoutBasis": 1511
  },
  "13319": {
    "progShare": 0.157,
    "estabShare": 0.843,
    "magaShare": 0.477,
    "relShare": 0.354,
    "modShare": 0.169,
    "demTurnoutBasis": 999,
    "repTurnoutBasis": 1284
  },
  "13321": {
    "progShare": 0.195,
    "estabShare": 0.805,
    "magaShare": 0.552,
    "relShare": 0.309,
    "modShare": 0.139,
    "demTurnoutBasis": 863,
    "repTurnoutBasis": 3431
  },
  "16001": {
    "progShare": 0.483,
    "estabShare": 0.517,
    "magaShare": 0.417,
    "relShare": 0.355,
    "modShare": 0.228,
    "demTurnoutBasis": 23760,
    "repTurnoutBasis": 60695
  },
  "16003": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.425,
    "relShare": 0.368,
    "modShare": 0.207,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 829
  },
  "16005": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.356,
    "relShare": 0.414,
    "modShare": 0.23,
    "demTurnoutBasis": 3165,
    "repTurnoutBasis": 11342
  },
  "16007": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.239,
    "relShare": 0.467,
    "modShare": 0.294,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1507
  },
  "16009": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.326,
    "relShare": 0.535,
    "modShare": 0.139,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1305
  },
  "16011": {
    "progShare": 0.426,
    "estabShare": 0.574,
    "magaShare": 0.323,
    "relShare": 0.428,
    "modShare": 0.249,
    "demTurnoutBasis": 593,
    "repTurnoutBasis": 8667
  },
  "16013": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.451,
    "relShare": 0.22,
    "modShare": 0.329,
    "demTurnoutBasis": 1933,
    "repTurnoutBasis": 1893
  },
  "16015": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.428,
    "relShare": 0.369,
    "modShare": 0.203,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1580
  },
  "16017": {
    "progShare": 0.447,
    "estabShare": 0.553,
    "magaShare": 0.501,
    "relShare": 0.371,
    "modShare": 0.128,
    "demTurnoutBasis": 1694,
    "repTurnoutBasis": 9075
  },
  "16019": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.272,
    "relShare": 0.418,
    "modShare": 0.31,
    "demTurnoutBasis": 2139,
    "repTurnoutBasis": 19740
  },
  "16021": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.393,
    "relShare": 0.482,
    "modShare": 0.125,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1990
  },
  "16023": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.239,
    "relShare": 0.497,
    "modShare": 0.264,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 574
  },
  "16025": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.417,
    "relShare": 0.303,
    "modShare": 0.28,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 311
  },
  "16027": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.477,
    "relShare": 0.378,
    "modShare": 0.145,
    "demTurnoutBasis": 4223,
    "repTurnoutBasis": 31592
  },
  "16029": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.221,
    "relShare": 0.482,
    "modShare": 0.297,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1354
  },
  "16031": {
    "progShare": 0.416,
    "estabShare": 0.584,
    "magaShare": 0.382,
    "relShare": 0.411,
    "modShare": 0.207,
    "demTurnoutBasis": 231,
    "repTurnoutBasis": 5671
  },
  "16033": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.249,
    "relShare": 0.39,
    "modShare": 0.361,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 176
  },
  "16035": {
    "progShare": 0.386,
    "estabShare": 0.614,
    "magaShare": 0.601,
    "relShare": 0.268,
    "modShare": 0.131,
    "demTurnoutBasis": 197,
    "repTurnoutBasis": 1963
  },
  "16037": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.407,
    "relShare": 0.314,
    "modShare": 0.279,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1014
  },
  "16039": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.442,
    "relShare": 0.338,
    "modShare": 0.22,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 2818
  },
  "16041": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.194,
    "relShare": 0.531,
    "modShare": 0.275,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 2321
  },
  "16043": {
    "progShare": 0.353,
    "estabShare": 0.647,
    "magaShare": 0.335,
    "relShare": 0.44,
    "modShare": 0.225,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 3464
  },
  "16045": {
    "progShare": 0.336,
    "estabShare": 0.664,
    "magaShare": 0.531,
    "relShare": 0.344,
    "modShare": 0.125,
    "demTurnoutBasis": 311,
    "repTurnoutBasis": 4302
  },
  "16047": {
    "progShare": 0.402,
    "estabShare": 0.598,
    "magaShare": 0.484,
    "relShare": 0.371,
    "modShare": 0.145,
    "demTurnoutBasis": 188,
    "repTurnoutBasis": 2497
  },
  "16049": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.408,
    "relShare": 0.422,
    "modShare": 0.17,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 4033
  },
  "16051": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.195,
    "relShare": 0.537,
    "modShare": 0.268,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 5578
  },
  "16053": {
    "progShare": 0.425,
    "estabShare": 0.575,
    "magaShare": 0.435,
    "relShare": 0.415,
    "modShare": 0.15,
    "demTurnoutBasis": 238,
    "repTurnoutBasis": 2961
  },
  "16055": {
    "progShare": 0.388,
    "estabShare": 0.612,
    "magaShare": 0.441,
    "relShare": 0.436,
    "modShare": 0.123,
    "demTurnoutBasis": 4487,
    "repTurnoutBasis": 28814
  },
  "16057": {
    "progShare": 0.596,
    "estabShare": 0.404,
    "magaShare": 0.376,
    "relShare": 0.462,
    "modShare": 0.162,
    "demTurnoutBasis": 2511,
    "repTurnoutBasis": 4916
  },
  "16059": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.38,
    "relShare": 0.344,
    "modShare": 0.276,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1977
  },
  "16061": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.402,
    "relShare": 0.411,
    "modShare": 0.187,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 709
  },
  "16063": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.363,
    "relShare": 0.443,
    "modShare": 0.194,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 678
  },
  "16065": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.186,
    "relShare": 0.512,
    "modShare": 0.302,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 7102
  },
  "16067": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.428,
    "relShare": 0.398,
    "modShare": 0.174,
    "demTurnoutBasis": 179,
    "repTurnoutBasis": 3091
  },
  "16069": {
    "progShare": 0.374,
    "estabShare": 0.626,
    "magaShare": 0.503,
    "relShare": 0.338,
    "modShare": 0.159,
    "demTurnoutBasis": 1259,
    "repTurnoutBasis": 5177
  },
  "16071": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.431,
    "relShare": 0.436,
    "modShare": 0.133,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1172
  },
  "16073": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.423,
    "relShare": 0.445,
    "modShare": 0.132,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1670
  },
  "16075": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.503,
    "relShare": 0.346,
    "modShare": 0.151,
    "demTurnoutBasis": 332,
    "repTurnoutBasis": 4228
  },
  "16077": {
    "progShare": 0.337,
    "estabShare": 0.663,
    "magaShare": 0.417,
    "relShare": 0.375,
    "modShare": 0.208,
    "demTurnoutBasis": 157,
    "repTurnoutBasis": 1215
  },
  "16079": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.411,
    "relShare": 0.423,
    "modShare": 0.166,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1524
  },
  "16081": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.23,
    "relShare": 0.477,
    "modShare": 0.293,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1029
  },
  "16083": {
    "progShare": 0.435,
    "estabShare": 0.565,
    "magaShare": 0.431,
    "relShare": 0.409,
    "modShare": 0.16,
    "demTurnoutBasis": 1476,
    "repTurnoutBasis": 12281
  },
  "16085": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.384,
    "relShare": 0.344,
    "modShare": 0.272,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1483
  },
  "16087": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.362,
    "relShare": 0.427,
    "modShare": 0.211,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 2061
  },
  "17001": {
    "progShare": 0.481,
    "estabShare": 0.519,
    "magaShare": 0.403,
    "relShare": 0.398,
    "modShare": 0.199,
    "demTurnoutBasis": 1757,
    "repTurnoutBasis": 7008
  },
  "17003": {
    "progShare": 0.36,
    "estabShare": 0.64,
    "magaShare": 0.519,
    "relShare": 0.401,
    "modShare": 0.08,
    "demTurnoutBasis": 642,
    "repTurnoutBasis": 269
  },
  "17005": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.409,
    "relShare": 0.405,
    "modShare": 0.186,
    "demTurnoutBasis": 800,
    "repTurnoutBasis": 1339
  },
  "17007": {
    "progShare": 0.586,
    "estabShare": 0.414,
    "magaShare": 0.391,
    "relShare": 0.356,
    "modShare": 0.253,
    "demTurnoutBasis": 2382,
    "repTurnoutBasis": 4852
  },
  "17009": {
    "progShare": 0.494,
    "estabShare": 0.506,
    "magaShare": 0.505,
    "relShare": 0.317,
    "modShare": 0.178,
    "demTurnoutBasis": 163,
    "repTurnoutBasis": 495
  },
  "17011": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.392,
    "relShare": 0.327,
    "modShare": 0.281,
    "demTurnoutBasis": 1714,
    "repTurnoutBasis": 2770
  },
  "17013": {
    "progShare": 0.53,
    "estabShare": 0.47,
    "magaShare": 0.483,
    "relShare": 0.377,
    "modShare": 0.14,
    "demTurnoutBasis": 498,
    "repTurnoutBasis": 340
  },
  "17015": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.361,
    "relShare": 0.319,
    "modShare": 0.32,
    "demTurnoutBasis": 641,
    "repTurnoutBasis": 1745
  },
  "17017": {
    "progShare": 0.517,
    "estabShare": 0.483,
    "magaShare": 0.425,
    "relShare": 0.364,
    "modShare": 0.211,
    "demTurnoutBasis": 537,
    "repTurnoutBasis": 797
  },
  "17019": {
    "progShare": 0.667,
    "estabShare": 0.333,
    "magaShare": 0.289,
    "relShare": 0.386,
    "modShare": 0.325,
    "demTurnoutBasis": 16126,
    "repTurnoutBasis": 13226
  },
  "17021": {
    "progShare": 0.522,
    "estabShare": 0.478,
    "magaShare": 0.439,
    "relShare": 0.385,
    "modShare": 0.176,
    "demTurnoutBasis": 1495,
    "repTurnoutBasis": 2709
  },
  "17023": {
    "progShare": 0.542,
    "estabShare": 0.458,
    "magaShare": 0.411,
    "relShare": 0.365,
    "modShare": 0.224,
    "demTurnoutBasis": 628,
    "repTurnoutBasis": 1794
  },
  "17025": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.478,
    "relShare": 0.386,
    "modShare": 0.136,
    "demTurnoutBasis": 421,
    "repTurnoutBasis": 1346
  },
  "17027": {
    "progShare": 0.583,
    "estabShare": 0.417,
    "magaShare": 0.434,
    "relShare": 0.384,
    "modShare": 0.182,
    "demTurnoutBasis": 1104,
    "repTurnoutBasis": 2892
  },
  "17029": {
    "progShare": 0.596,
    "estabShare": 0.404,
    "magaShare": 0.369,
    "relShare": 0.38,
    "modShare": 0.251,
    "demTurnoutBasis": 2145,
    "repTurnoutBasis": 4252
  },
  "17031": {
    "progShare": 0.459,
    "estabShare": 0.541,
    "magaShare": 0.404,
    "relShare": 0.234,
    "modShare": 0.362,
    "demTurnoutBasis": 590065,
    "repTurnoutBasis": 156101
  },
  "17033": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.415,
    "relShare": 0.358,
    "modShare": 0.227,
    "demTurnoutBasis": 610,
    "repTurnoutBasis": 1812
  },
  "17035": {
    "progShare": 0.587,
    "estabShare": 0.413,
    "magaShare": 0.398,
    "relShare": 0.431,
    "modShare": 0.171,
    "demTurnoutBasis": 460,
    "repTurnoutBasis": 1345
  },
  "17037": {
    "progShare": 0.668,
    "estabShare": 0.332,
    "magaShare": 0.369,
    "relShare": 0.326,
    "modShare": 0.305,
    "demTurnoutBasis": 6264,
    "repTurnoutBasis": 6929
  },
  "17039": {
    "progShare": 0.541,
    "estabShare": 0.459,
    "magaShare": 0.404,
    "relShare": 0.405,
    "modShare": 0.191,
    "demTurnoutBasis": 619,
    "repTurnoutBasis": 1934
  },
  "17041": {
    "progShare": 0.571,
    "estabShare": 0.429,
    "magaShare": 0.337,
    "relShare": 0.446,
    "modShare": 0.217,
    "demTurnoutBasis": 573,
    "repTurnoutBasis": 2054
  },
  "17043": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.343,
    "relShare": 0.258,
    "modShare": 0.399,
    "demTurnoutBasis": 63188,
    "repTurnoutBasis": 71788
  },
  "17045": {
    "progShare": 0.512,
    "estabShare": 0.488,
    "magaShare": 0.418,
    "relShare": 0.347,
    "modShare": 0.235,
    "demTurnoutBasis": 471,
    "repTurnoutBasis": 1852
  },
  "17047": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.447,
    "relShare": 0.357,
    "modShare": 0.196,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 968
  },
  "17049": {
    "progShare": 0.59,
    "estabShare": 0.41,
    "magaShare": 0.362,
    "relShare": 0.45,
    "modShare": 0.188,
    "demTurnoutBasis": 1076,
    "repTurnoutBasis": 3980
  },
  "17051": {
    "progShare": 0.511,
    "estabShare": 0.489,
    "magaShare": 0.481,
    "relShare": 0.379,
    "modShare": 0.14,
    "demTurnoutBasis": 643,
    "repTurnoutBasis": 2003
  },
  "17053": {
    "progShare": 0.603,
    "estabShare": 0.397,
    "magaShare": 0.364,
    "relShare": 0.4,
    "modShare": 0.236,
    "demTurnoutBasis": 369,
    "repTurnoutBasis": 1695
  },
  "17055": {
    "progShare": 0.561,
    "estabShare": 0.439,
    "magaShare": 0.53,
    "relShare": 0.343,
    "modShare": 0.127,
    "demTurnoutBasis": 2586,
    "repTurnoutBasis": 2936
  },
  "17057": {
    "progShare": 0.541,
    "estabShare": 0.459,
    "magaShare": 0.404,
    "relShare": 0.385,
    "modShare": 0.211,
    "demTurnoutBasis": 2385,
    "repTurnoutBasis": 2291
  },
  "17059": {
    "progShare": 0.555,
    "estabShare": 0.445,
    "magaShare": 0.546,
    "relShare": 0.333,
    "modShare": 0.121,
    "demTurnoutBasis": 658,
    "repTurnoutBasis": 283
  },
  "17061": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.463,
    "relShare": 0.39,
    "modShare": 0.147,
    "demTurnoutBasis": 541,
    "repTurnoutBasis": 1089
  },
  "17063": {
    "progShare": 0.602,
    "estabShare": 0.398,
    "magaShare": 0.466,
    "relShare": 0.289,
    "modShare": 0.245,
    "demTurnoutBasis": 2603,
    "repTurnoutBasis": 3873
  },
  "17065": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.464,
    "relShare": 0.383,
    "modShare": 0.153,
    "demTurnoutBasis": 488,
    "repTurnoutBasis": 827
  },
  "17067": {
    "progShare": 0.426,
    "estabShare": 0.574,
    "magaShare": 0.425,
    "relShare": 0.371,
    "modShare": 0.204,
    "demTurnoutBasis": 560,
    "repTurnoutBasis": 1810
  },
  "17069": {
    "progShare": 0.578,
    "estabShare": 0.422,
    "magaShare": 0.529,
    "relShare": 0.352,
    "modShare": 0.119,
    "demTurnoutBasis": 201,
    "repTurnoutBasis": 470
  },
  "17071": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.424,
    "relShare": 0.35,
    "modShare": 0.226,
    "demTurnoutBasis": 326,
    "repTurnoutBasis": 609
  },
  "17073": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.35,
    "relShare": 0.343,
    "modShare": 0.307,
    "demTurnoutBasis": 2132,
    "repTurnoutBasis": 4286
  },
  "17075": {
    "progShare": 0.618,
    "estabShare": 0.382,
    "magaShare": 0.422,
    "relShare": 0.354,
    "modShare": 0.224,
    "demTurnoutBasis": 726,
    "repTurnoutBasis": 3334
  },
  "17077": {
    "progShare": 0.624,
    "estabShare": 0.376,
    "magaShare": 0.379,
    "relShare": 0.373,
    "modShare": 0.248,
    "demTurnoutBasis": 3799,
    "repTurnoutBasis": 2924
  },
  "17079": {
    "progShare": 0.57,
    "estabShare": 0.43,
    "magaShare": 0.374,
    "relShare": 0.444,
    "modShare": 0.182,
    "demTurnoutBasis": 405,
    "repTurnoutBasis": 1097
  },
  "17081": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.457,
    "relShare": 0.377,
    "modShare": 0.166,
    "demTurnoutBasis": 1780,
    "repTurnoutBasis": 3578
  },
  "17083": {
    "progShare": 0.555,
    "estabShare": 0.445,
    "magaShare": 0.474,
    "relShare": 0.381,
    "modShare": 0.145,
    "demTurnoutBasis": 983,
    "repTurnoutBasis": 2002
  },
  "17085": {
    "progShare": 0.482,
    "estabShare": 0.518,
    "magaShare": 0.398,
    "relShare": 0.29,
    "modShare": 0.312,
    "demTurnoutBasis": 1283,
    "repTurnoutBasis": 2091
  },
  "17087": {
    "progShare": 0.538,
    "estabShare": 0.462,
    "magaShare": 0.435,
    "relShare": 0.41,
    "modShare": 0.155,
    "demTurnoutBasis": 400,
    "repTurnoutBasis": 1577
  },
  "17089": {
    "progShare": 0.564,
    "estabShare": 0.436,
    "magaShare": 0.359,
    "relShare": 0.293,
    "modShare": 0.348,
    "demTurnoutBasis": 27074,
    "repTurnoutBasis": 29543
  },
  "17091": {
    "progShare": 0.54,
    "estabShare": 0.46,
    "magaShare": 0.424,
    "relShare": 0.331,
    "modShare": 0.245,
    "demTurnoutBasis": 5367,
    "repTurnoutBasis": 7506
  },
  "17093": {
    "progShare": 0.583,
    "estabShare": 0.417,
    "magaShare": 0.395,
    "relShare": 0.311,
    "modShare": 0.294,
    "demTurnoutBasis": 6755,
    "repTurnoutBasis": 8703
  },
  "17095": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.356,
    "relShare": 0.362,
    "modShare": 0.282,
    "demTurnoutBasis": 3128,
    "repTurnoutBasis": 3441
  },
  "17097": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.359,
    "relShare": 0.253,
    "modShare": 0.388,
    "demTurnoutBasis": 47718,
    "repTurnoutBasis": 42955
  },
  "17099": {
    "progShare": 0.561,
    "estabShare": 0.439,
    "magaShare": 0.454,
    "relShare": 0.306,
    "modShare": 0.24,
    "demTurnoutBasis": 6072,
    "repTurnoutBasis": 7617
  },
  "17101": {
    "progShare": 0.508,
    "estabShare": 0.492,
    "magaShare": 0.495,
    "relShare": 0.308,
    "modShare": 0.197,
    "demTurnoutBasis": 445,
    "repTurnoutBasis": 1331
  },
  "17103": {
    "progShare": 0.602,
    "estabShare": 0.398,
    "magaShare": 0.345,
    "relShare": 0.359,
    "modShare": 0.296,
    "demTurnoutBasis": 1641,
    "repTurnoutBasis": 3101
  },
  "17105": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.338,
    "relShare": 0.402,
    "modShare": 0.26,
    "demTurnoutBasis": 957,
    "repTurnoutBasis": 4451
  },
  "17107": {
    "progShare": 0.569,
    "estabShare": 0.431,
    "magaShare": 0.357,
    "relShare": 0.4,
    "modShare": 0.243,
    "demTurnoutBasis": 864,
    "repTurnoutBasis": 3046
  },
  "17109": {
    "progShare": 0.583,
    "estabShare": 0.417,
    "magaShare": 0.363,
    "relShare": 0.356,
    "modShare": 0.281,
    "demTurnoutBasis": 1272,
    "repTurnoutBasis": 2186
  },
  "17111": {
    "progShare": 0.61,
    "estabShare": 0.39,
    "magaShare": 0.403,
    "relShare": 0.274,
    "modShare": 0.323,
    "demTurnoutBasis": 17031,
    "repTurnoutBasis": 27096
  },
  "17113": {
    "progShare": 0.627,
    "estabShare": 0.373,
    "magaShare": 0.274,
    "relShare": 0.429,
    "modShare": 0.297,
    "demTurnoutBasis": 10411,
    "repTurnoutBasis": 15792
  },
  "17115": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.401,
    "relShare": 0.412,
    "modShare": 0.187,
    "demTurnoutBasis": 5532,
    "repTurnoutBasis": 8264
  },
  "17117": {
    "progShare": 0.56,
    "estabShare": 0.44,
    "magaShare": 0.475,
    "relShare": 0.356,
    "modShare": 0.169,
    "demTurnoutBasis": 3229,
    "repTurnoutBasis": 3702
  },
  "17119": {
    "progShare": 0.556,
    "estabShare": 0.444,
    "magaShare": 0.43,
    "relShare": 0.382,
    "modShare": 0.188,
    "demTurnoutBasis": 17680,
    "repTurnoutBasis": 18382
  },
  "17121": {
    "progShare": 0.512,
    "estabShare": 0.488,
    "magaShare": 0.454,
    "relShare": 0.383,
    "modShare": 0.163,
    "demTurnoutBasis": 1711,
    "repTurnoutBasis": 3048
  },
  "17123": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.368,
    "relShare": 0.402,
    "modShare": 0.23,
    "demTurnoutBasis": 581,
    "repTurnoutBasis": 1395
  },
  "17125": {
    "progShare": 0.499,
    "estabShare": 0.501,
    "magaShare": 0.409,
    "relShare": 0.376,
    "modShare": 0.215,
    "demTurnoutBasis": 693,
    "repTurnoutBasis": 1087
  },
  "17127": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.443,
    "relShare": 0.416,
    "modShare": 0.141,
    "demTurnoutBasis": 526,
    "repTurnoutBasis": 1510
  },
  "17129": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.348,
    "relShare": 0.391,
    "modShare": 0.261,
    "demTurnoutBasis": 449,
    "repTurnoutBasis": 1409
  },
  "17131": {
    "progShare": 0.476,
    "estabShare": 0.524,
    "magaShare": 0.341,
    "relShare": 0.418,
    "modShare": 0.241,
    "demTurnoutBasis": 923,
    "repTurnoutBasis": 1344
  },
  "17133": {
    "progShare": 0.553,
    "estabShare": 0.447,
    "magaShare": 0.426,
    "relShare": 0.36,
    "modShare": 0.214,
    "demTurnoutBasis": 1627,
    "repTurnoutBasis": 3817
  },
  "17135": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.435,
    "relShare": 0.37,
    "modShare": 0.195,
    "demTurnoutBasis": 1295,
    "repTurnoutBasis": 2619
  },
  "17137": {
    "progShare": 0.579,
    "estabShare": 0.421,
    "magaShare": 0.375,
    "relShare": 0.345,
    "modShare": 0.28,
    "demTurnoutBasis": 1127,
    "repTurnoutBasis": 3187
  },
  "17139": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.332,
    "relShare": 0.503,
    "modShare": 0.165,
    "demTurnoutBasis": 528,
    "repTurnoutBasis": 1367
  },
  "17141": {
    "progShare": 0.596,
    "estabShare": 0.404,
    "magaShare": 0.359,
    "relShare": 0.402,
    "modShare": 0.239,
    "demTurnoutBasis": 2232,
    "repTurnoutBasis": 5576
  },
  "17143": {
    "progShare": 0.476,
    "estabShare": 0.524,
    "magaShare": 0.298,
    "relShare": 0.417,
    "modShare": 0.285,
    "demTurnoutBasis": 11002,
    "repTurnoutBasis": 12761
  },
  "17145": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.457,
    "relShare": 0.374,
    "modShare": 0.169,
    "demTurnoutBasis": 913,
    "repTurnoutBasis": 1592
  },
  "17147": {
    "progShare": 0.563,
    "estabShare": 0.437,
    "magaShare": 0.32,
    "relShare": 0.42,
    "modShare": 0.26,
    "demTurnoutBasis": 916,
    "repTurnoutBasis": 2328
  },
  "17149": {
    "progShare": 0.476,
    "estabShare": 0.524,
    "magaShare": 0.479,
    "relShare": 0.361,
    "modShare": 0.16,
    "demTurnoutBasis": 488,
    "repTurnoutBasis": 1665
  },
  "17151": {
    "progShare": 0.618,
    "estabShare": 0.382,
    "magaShare": 0.5,
    "relShare": 0.369,
    "modShare": 0.131,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 508
  },
  "17153": {
    "progShare": 0.36,
    "estabShare": 0.64,
    "magaShare": 0.533,
    "relShare": 0.377,
    "modShare": 0.09,
    "demTurnoutBasis": 312,
    "repTurnoutBasis": 493
  },
  "17155": {
    "progShare": 0.526,
    "estabShare": 0.474,
    "magaShare": 0.482,
    "relShare": 0.305,
    "modShare": 0.213,
    "demTurnoutBasis": 487,
    "repTurnoutBasis": 426
  },
  "17157": {
    "progShare": 0.542,
    "estabShare": 0.458,
    "magaShare": 0.466,
    "relShare": 0.387,
    "modShare": 0.147,
    "demTurnoutBasis": 1474,
    "repTurnoutBasis": 2059
  },
  "17159": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.48,
    "relShare": 0.311,
    "modShare": 0.209,
    "demTurnoutBasis": 512,
    "repTurnoutBasis": 1522
  },
  "17161": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.359,
    "relShare": 0.372,
    "modShare": 0.269,
    "demTurnoutBasis": 9919,
    "repTurnoutBasis": 7180
  },
  "17163": {
    "progShare": 0.395,
    "estabShare": 0.605,
    "magaShare": 0.406,
    "relShare": 0.384,
    "modShare": 0.21,
    "demTurnoutBasis": 20198,
    "repTurnoutBasis": 14320
  },
  "17165": {
    "progShare": 0.524,
    "estabShare": 0.476,
    "magaShare": 0.495,
    "relShare": 0.358,
    "modShare": 0.147,
    "demTurnoutBasis": 1147,
    "repTurnoutBasis": 2119
  },
  "17167": {
    "progShare": 0.528,
    "estabShare": 0.472,
    "magaShare": 0.336,
    "relShare": 0.365,
    "modShare": 0.299,
    "demTurnoutBasis": 9907,
    "repTurnoutBasis": 17669
  },
  "17169": {
    "progShare": 0.444,
    "estabShare": 0.556,
    "magaShare": 0.441,
    "relShare": 0.33,
    "modShare": 0.229,
    "demTurnoutBasis": 339,
    "repTurnoutBasis": 786
  },
  "17171": {
    "progShare": 0.518,
    "estabShare": 0.482,
    "magaShare": 0.449,
    "relShare": 0.355,
    "modShare": 0.196,
    "demTurnoutBasis": 161,
    "repTurnoutBasis": 565
  },
  "17173": {
    "progShare": 0.546,
    "estabShare": 0.454,
    "magaShare": 0.397,
    "relShare": 0.444,
    "modShare": 0.159,
    "demTurnoutBasis": 888,
    "repTurnoutBasis": 2429
  },
  "17175": {
    "progShare": 0.522,
    "estabShare": 0.478,
    "magaShare": 0.338,
    "relShare": 0.4,
    "modShare": 0.262,
    "demTurnoutBasis": 209,
    "repTurnoutBasis": 585
  },
  "17177": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.333,
    "relShare": 0.382,
    "modShare": 0.285,
    "demTurnoutBasis": 2030,
    "repTurnoutBasis": 4305
  },
  "17179": {
    "progShare": 0.549,
    "estabShare": 0.451,
    "magaShare": 0.31,
    "relShare": 0.461,
    "modShare": 0.229,
    "demTurnoutBasis": 6604,
    "repTurnoutBasis": 13593
  },
  "17181": {
    "progShare": 0.556,
    "estabShare": 0.444,
    "magaShare": 0.434,
    "relShare": 0.406,
    "modShare": 0.16,
    "demTurnoutBasis": 1063,
    "repTurnoutBasis": 1535
  },
  "17183": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.442,
    "relShare": 0.352,
    "modShare": 0.206,
    "demTurnoutBasis": 2974,
    "repTurnoutBasis": 5646
  },
  "17185": {
    "progShare": 0.492,
    "estabShare": 0.508,
    "magaShare": 0.422,
    "relShare": 0.355,
    "modShare": 0.223,
    "demTurnoutBasis": 358,
    "repTurnoutBasis": 1153
  },
  "17187": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.33,
    "relShare": 0.341,
    "modShare": 0.329,
    "demTurnoutBasis": 741,
    "repTurnoutBasis": 1527
  },
  "17189": {
    "progShare": 0.593,
    "estabShare": 0.407,
    "magaShare": 0.419,
    "relShare": 0.39,
    "modShare": 0.191,
    "demTurnoutBasis": 516,
    "repTurnoutBasis": 1628
  },
  "17191": {
    "progShare": 0.568,
    "estabShare": 0.432,
    "magaShare": 0.492,
    "relShare": 0.334,
    "modShare": 0.174,
    "demTurnoutBasis": 387,
    "repTurnoutBasis": 2369
  },
  "17193": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.506,
    "relShare": 0.308,
    "modShare": 0.186,
    "demTurnoutBasis": 577,
    "repTurnoutBasis": 1396
  },
  "17195": {
    "progShare": 0.517,
    "estabShare": 0.483,
    "magaShare": 0.354,
    "relShare": 0.366,
    "modShare": 0.28,
    "demTurnoutBasis": 3024,
    "repTurnoutBasis": 3476
  },
  "17197": {
    "progShare": 0.527,
    "estabShare": 0.473,
    "magaShare": 0.46,
    "relShare": 0.269,
    "modShare": 0.271,
    "demTurnoutBasis": 45473,
    "repTurnoutBasis": 42507
  },
  "17199": {
    "progShare": 0.567,
    "estabShare": 0.433,
    "magaShare": 0.451,
    "relShare": 0.382,
    "modShare": 0.167,
    "demTurnoutBasis": 3535,
    "repTurnoutBasis": 5448
  },
  "17201": {
    "progShare": 0.526,
    "estabShare": 0.474,
    "magaShare": 0.349,
    "relShare": 0.42,
    "modShare": 0.231,
    "demTurnoutBasis": 16025,
    "repTurnoutBasis": 19176
  },
  "17203": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.263,
    "relShare": 0.495,
    "modShare": 0.242,
    "demTurnoutBasis": 1460,
    "repTurnoutBasis": 5287
  },
  "18001": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.434,
    "relShare": 0.487,
    "modShare": 0.079,
    "demTurnoutBasis": 1011,
    "repTurnoutBasis": 3433
  },
  "18003": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.496,
    "relShare": 0.424,
    "modShare": 0.08,
    "demTurnoutBasis": 15751,
    "repTurnoutBasis": 32975
  },
  "18005": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.545,
    "relShare": 0.356,
    "modShare": 0.099,
    "demTurnoutBasis": 2981,
    "repTurnoutBasis": 8102
  },
  "18007": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.612,
    "relShare": 0.298,
    "modShare": 0.09,
    "demTurnoutBasis": 213,
    "repTurnoutBasis": 1075
  },
  "18009": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.566,
    "relShare": 0.356,
    "modShare": 0.078,
    "demTurnoutBasis": 504,
    "repTurnoutBasis": 984
  },
  "18011": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.51,
    "relShare": 0.373,
    "modShare": 0.117,
    "demTurnoutBasis": 2315,
    "repTurnoutBasis": 7677
  },
  "18013": {
    "progShare": 0.558,
    "estabShare": 0.442,
    "magaShare": 0.594,
    "relShare": 0.327,
    "modShare": 0.079,
    "demTurnoutBasis": 1038,
    "repTurnoutBasis": 1943
  },
  "18015": {
    "progShare": 0.504,
    "estabShare": 0.496,
    "magaShare": 0.576,
    "relShare": 0.344,
    "modShare": 0.08,
    "demTurnoutBasis": 578,
    "repTurnoutBasis": 2301
  },
  "18017": {
    "progShare": 0.54,
    "estabShare": 0.46,
    "magaShare": 0.61,
    "relShare": 0.311,
    "modShare": 0.079,
    "demTurnoutBasis": 1397,
    "repTurnoutBasis": 3464
  },
  "18019": {
    "progShare": 0.225,
    "estabShare": 0.775,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3415,
    "repTurnoutBasis": 3537
  },
  "18021": {
    "progShare": 0.483,
    "estabShare": 0.517,
    "magaShare": 0.639,
    "relShare": 0.283,
    "modShare": 0.078,
    "demTurnoutBasis": 990,
    "repTurnoutBasis": 2878
  },
  "18023": {
    "progShare": 0.544,
    "estabShare": 0.456,
    "magaShare": 0.543,
    "relShare": 0.369,
    "modShare": 0.088,
    "demTurnoutBasis": 885,
    "repTurnoutBasis": 3307
  },
  "18025": {
    "progShare": 0.438,
    "estabShare": 0.562,
    "magaShare": 0.621,
    "relShare": 0.301,
    "modShare": 0.078,
    "demTurnoutBasis": 650,
    "repTurnoutBasis": 966
  },
  "18027": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.646,
    "relShare": 0.274,
    "modShare": 0.08,
    "demTurnoutBasis": 620,
    "repTurnoutBasis": 3208
  },
  "18029": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.677,
    "relShare": 0.219,
    "modShare": 0.104,
    "demTurnoutBasis": 1319,
    "repTurnoutBasis": 5133
  },
  "18031": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.607,
    "relShare": 0.314,
    "modShare": 0.079,
    "demTurnoutBasis": 682,
    "repTurnoutBasis": 2940
  },
  "18033": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.53,
    "relShare": 0.39,
    "modShare": 0.08,
    "demTurnoutBasis": 1205,
    "repTurnoutBasis": 4411
  },
  "18035": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.575,
    "relShare": 0.341,
    "modShare": 0.084,
    "demTurnoutBasis": 6934,
    "repTurnoutBasis": 8324
  },
  "18037": {
    "progShare": 0.457,
    "estabShare": 0.543,
    "magaShare": 0.609,
    "relShare": 0.3,
    "modShare": 0.091,
    "demTurnoutBasis": 2299,
    "repTurnoutBasis": 4011
  },
  "18039": {
    "progShare": 0.512,
    "estabShare": 0.488,
    "magaShare": 0.477,
    "relShare": 0.442,
    "modShare": 0.081,
    "demTurnoutBasis": 5616,
    "repTurnoutBasis": 16989
  },
  "18041": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.689,
    "relShare": 0.232,
    "modShare": 0.079,
    "demTurnoutBasis": 1041,
    "repTurnoutBasis": 2074
  },
  "18043": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.601,
    "relShare": 0.311,
    "modShare": 0.088,
    "demTurnoutBasis": 4348,
    "repTurnoutBasis": 6698
  },
  "18045": {
    "progShare": 0.478,
    "estabShare": 0.522,
    "magaShare": 0.642,
    "relShare": 0.279,
    "modShare": 0.079,
    "demTurnoutBasis": 438,
    "repTurnoutBasis": 2230
  },
  "18047": {
    "progShare": 0.411,
    "estabShare": 0.589,
    "magaShare": 0.675,
    "relShare": 0.228,
    "modShare": 0.097,
    "demTurnoutBasis": 610,
    "repTurnoutBasis": 2720
  },
  "18049": {
    "progShare": 0.488,
    "estabShare": 0.512,
    "magaShare": 0.611,
    "relShare": 0.309,
    "modShare": 0.08,
    "demTurnoutBasis": 639,
    "repTurnoutBasis": 2196
  },
  "18051": {
    "progShare": 0.454,
    "estabShare": 0.546,
    "magaShare": 0.632,
    "relShare": 0.29,
    "modShare": 0.078,
    "demTurnoutBasis": 1469,
    "repTurnoutBasis": 3523
  },
  "18053": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.525,
    "relShare": 0.396,
    "modShare": 0.079,
    "demTurnoutBasis": 2331,
    "repTurnoutBasis": 6371
  },
  "18055": {
    "progShare": 0.52,
    "estabShare": 0.48,
    "magaShare": 0.662,
    "relShare": 0.26,
    "modShare": 0.078,
    "demTurnoutBasis": 1276,
    "repTurnoutBasis": 3477
  },
  "18057": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.515,
    "relShare": 0.356,
    "modShare": 0.129,
    "demTurnoutBasis": 13431,
    "repTurnoutBasis": 37919
  },
  "18059": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.576,
    "relShare": 0.344,
    "modShare": 0.08,
    "demTurnoutBasis": 2210,
    "repTurnoutBasis": 8872
  },
  "18061": {
    "progShare": 0.424,
    "estabShare": 0.576,
    "magaShare": 0.619,
    "relShare": 0.302,
    "modShare": 0.079,
    "demTurnoutBasis": 1794,
    "repTurnoutBasis": 3859
  },
  "18063": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.535,
    "relShare": 0.379,
    "modShare": 0.086,
    "demTurnoutBasis": 5888,
    "repTurnoutBasis": 18598
  },
  "18065": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.613,
    "relShare": 0.309,
    "modShare": 0.078,
    "demTurnoutBasis": 1964,
    "repTurnoutBasis": 4892
  },
  "18067": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.577,
    "relShare": 0.344,
    "modShare": 0.079,
    "demTurnoutBasis": 3631,
    "repTurnoutBasis": 7835
  },
  "18069": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.538,
    "relShare": 0.383,
    "modShare": 0.079,
    "demTurnoutBasis": 1032,
    "repTurnoutBasis": 4289
  },
  "18071": {
    "progShare": 0.443,
    "estabShare": 0.557,
    "magaShare": 0.641,
    "relShare": 0.28,
    "modShare": 0.079,
    "demTurnoutBasis": 1424,
    "repTurnoutBasis": 4425
  },
  "18073": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.625,
    "relShare": 0.291,
    "modShare": 0.084,
    "demTurnoutBasis": 1117,
    "repTurnoutBasis": 3370
  },
  "18075": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.595,
    "relShare": 0.325,
    "modShare": 0.08,
    "demTurnoutBasis": 698,
    "repTurnoutBasis": 2045
  },
  "18077": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.632,
    "relShare": 0.287,
    "modShare": 0.081,
    "demTurnoutBasis": 1557,
    "repTurnoutBasis": 2590
  },
  "18079": {
    "progShare": 0.483,
    "estabShare": 0.517,
    "magaShare": 0.662,
    "relShare": 0.26,
    "modShare": 0.078,
    "demTurnoutBasis": 879,
    "repTurnoutBasis": 2601
  },
  "18081": {
    "progShare": 0.535,
    "estabShare": 0.465,
    "magaShare": 0.577,
    "relShare": 0.344,
    "modShare": 0.079,
    "demTurnoutBasis": 4583,
    "repTurnoutBasis": 15980
  },
  "18083": {
    "progShare": 0.459,
    "estabShare": 0.541,
    "magaShare": 0.688,
    "relShare": 0.234,
    "modShare": 0.078,
    "demTurnoutBasis": 1758,
    "repTurnoutBasis": 3688
  },
  "18085": {
    "progShare": 0.556,
    "estabShare": 0.444,
    "magaShare": 0.532,
    "relShare": 0.389,
    "modShare": 0.079,
    "demTurnoutBasis": 1747,
    "repTurnoutBasis": 9024
  },
  "18087": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.522,
    "relShare": 0.398,
    "modShare": 0.08,
    "demTurnoutBasis": 550,
    "repTurnoutBasis": 2735
  },
  "18089": {
    "progShare": 0.401,
    "estabShare": 0.599,
    "magaShare": 0.665,
    "relShare": 0.256,
    "modShare": 0.079,
    "demTurnoutBasis": 38017,
    "repTurnoutBasis": 22287
  },
  "18091": {
    "progShare": 0.195,
    "estabShare": 0.805,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3323,
    "repTurnoutBasis": 2125
  },
  "18093": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.632,
    "relShare": 0.289,
    "modShare": 0.079,
    "demTurnoutBasis": 1355,
    "repTurnoutBasis": 4969
  },
  "18095": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.601,
    "relShare": 0.32,
    "modShare": 0.079,
    "demTurnoutBasis": 6904,
    "repTurnoutBasis": 11139
  },
  "18097": {
    "progShare": 0.446,
    "estabShare": 0.554,
    "magaShare": 0.529,
    "relShare": 0.368,
    "modShare": 0.103,
    "demTurnoutBasis": 59234,
    "repTurnoutBasis": 50758
  },
  "18099": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.552,
    "relShare": 0.369,
    "modShare": 0.079,
    "demTurnoutBasis": 1454,
    "repTurnoutBasis": 4620
  },
  "18101": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.634,
    "relShare": 0.288,
    "modShare": 0.078,
    "demTurnoutBasis": 447,
    "repTurnoutBasis": 1138
  },
  "18103": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.568,
    "relShare": 0.354,
    "modShare": 0.078,
    "demTurnoutBasis": 854,
    "repTurnoutBasis": 3090
  },
  "18105": {
    "progShare": 0.598,
    "estabShare": 0.402,
    "magaShare": 0.532,
    "relShare": 0.348,
    "modShare": 0.12,
    "demTurnoutBasis": 11615,
    "repTurnoutBasis": 7427
  },
  "18107": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.59,
    "relShare": 0.322,
    "modShare": 0.088,
    "demTurnoutBasis": 841,
    "repTurnoutBasis": 4121
  },
  "18109": {
    "progShare": 0.522,
    "estabShare": 0.478,
    "magaShare": 0.61,
    "relShare": 0.312,
    "modShare": 0.078,
    "demTurnoutBasis": 1879,
    "repTurnoutBasis": 8742
  },
  "18111": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.684,
    "relShare": 0.232,
    "modShare": 0.084,
    "demTurnoutBasis": 478,
    "repTurnoutBasis": 1417
  },
  "18113": {
    "progShare": 0.481,
    "estabShare": 0.519,
    "magaShare": 0.539,
    "relShare": 0.381,
    "modShare": 0.08,
    "demTurnoutBasis": 1204,
    "repTurnoutBasis": 4482
  },
  "18115": {
    "progShare": 0.387,
    "estabShare": 0.613,
    "magaShare": 0.678,
    "relShare": 0.238,
    "modShare": 0.084,
    "demTurnoutBasis": 213,
    "repTurnoutBasis": 600
  },
  "18117": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.637,
    "relShare": 0.279,
    "modShare": 0.084,
    "demTurnoutBasis": 632,
    "repTurnoutBasis": 2127
  },
  "18119": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.661,
    "relShare": 0.262,
    "modShare": 0.077,
    "demTurnoutBasis": 844,
    "repTurnoutBasis": 2084
  },
  "18121": {
    "progShare": 0.492,
    "estabShare": 0.508,
    "magaShare": 0.66,
    "relShare": 0.261,
    "modShare": 0.079,
    "demTurnoutBasis": 548,
    "repTurnoutBasis": 1870
  },
  "18123": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.677,
    "relShare": 0.239,
    "modShare": 0.084,
    "demTurnoutBasis": 1236,
    "repTurnoutBasis": 1243
  },
  "18125": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.633,
    "relShare": 0.289,
    "modShare": 0.078,
    "demTurnoutBasis": 576,
    "repTurnoutBasis": 1328
  },
  "18127": {
    "progShare": 0.519,
    "estabShare": 0.481,
    "magaShare": 0.652,
    "relShare": 0.253,
    "modShare": 0.095,
    "demTurnoutBasis": 11424,
    "repTurnoutBasis": 13120
  },
  "18129": {
    "progShare": 0.499,
    "estabShare": 0.501,
    "magaShare": 0.622,
    "relShare": 0.299,
    "modShare": 0.079,
    "demTurnoutBasis": 1248,
    "repTurnoutBasis": 2643
  },
  "18131": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.598,
    "relShare": 0.319,
    "modShare": 0.083,
    "demTurnoutBasis": 412,
    "repTurnoutBasis": 1510
  },
  "18133": {
    "progShare": 0.502,
    "estabShare": 0.498,
    "magaShare": 0.583,
    "relShare": 0.339,
    "modShare": 0.078,
    "demTurnoutBasis": 1082,
    "repTurnoutBasis": 3646
  },
  "18135": {
    "progShare": 0.511,
    "estabShare": 0.489,
    "magaShare": 0.598,
    "relShare": 0.322,
    "modShare": 0.08,
    "demTurnoutBasis": 796,
    "repTurnoutBasis": 2644
  },
  "18137": {
    "progShare": 0.448,
    "estabShare": 0.552,
    "magaShare": 0.659,
    "relShare": 0.228,
    "modShare": 0.113,
    "demTurnoutBasis": 752,
    "repTurnoutBasis": 3270
  },
  "18139": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.606,
    "relShare": 0.314,
    "modShare": 0.08,
    "demTurnoutBasis": 489,
    "repTurnoutBasis": 2102
  },
  "18141": {
    "progShare": 0.166,
    "estabShare": 0.834,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8352,
    "repTurnoutBasis": 3716
  },
  "18143": {
    "progShare": 0.411,
    "estabShare": 0.589,
    "magaShare": 0.663,
    "relShare": 0.261,
    "modShare": 0.076,
    "demTurnoutBasis": 1438,
    "repTurnoutBasis": 1483
  },
  "18145": {
    "progShare": 0.508,
    "estabShare": 0.492,
    "magaShare": 0.596,
    "relShare": 0.325,
    "modShare": 0.079,
    "demTurnoutBasis": 1356,
    "repTurnoutBasis": 4455
  },
  "18147": {
    "progShare": 0.442,
    "estabShare": 0.558,
    "magaShare": 0.602,
    "relShare": 0.318,
    "modShare": 0.08,
    "demTurnoutBasis": 1045,
    "repTurnoutBasis": 2067
  },
  "18149": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.667,
    "relShare": 0.256,
    "modShare": 0.077,
    "demTurnoutBasis": 1166,
    "repTurnoutBasis": 1850
  },
  "18151": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.594,
    "relShare": 0.314,
    "modShare": 0.092,
    "demTurnoutBasis": 1051,
    "repTurnoutBasis": 3645
  },
  "18153": {
    "progShare": 0.526,
    "estabShare": 0.474,
    "magaShare": 0.69,
    "relShare": 0.234,
    "modShare": 0.076,
    "demTurnoutBasis": 1257,
    "repTurnoutBasis": 1742
  },
  "18155": {
    "progShare": 0.449,
    "estabShare": 0.551,
    "magaShare": 0.703,
    "relShare": 0.193,
    "modShare": 0.104,
    "demTurnoutBasis": 420,
    "repTurnoutBasis": 649
  },
  "18157": {
    "progShare": 0.56,
    "estabShare": 0.44,
    "magaShare": 0.488,
    "relShare": 0.387,
    "modShare": 0.125,
    "demTurnoutBasis": 7799,
    "repTurnoutBasis": 11564
  },
  "18159": {
    "progShare": 0.527,
    "estabShare": 0.473,
    "magaShare": 0.58,
    "relShare": 0.34,
    "modShare": 0.08,
    "demTurnoutBasis": 522,
    "repTurnoutBasis": 2151
  },
  "18161": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.632,
    "relShare": 0.234,
    "modShare": 0.134,
    "demTurnoutBasis": 205,
    "repTurnoutBasis": 738
  },
  "18163": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.571,
    "relShare": 0.339,
    "modShare": 0.09,
    "demTurnoutBasis": 8412,
    "repTurnoutBasis": 13296
  },
  "18165": {
    "progShare": 0.497,
    "estabShare": 0.503,
    "magaShare": 0.707,
    "relShare": 0.215,
    "modShare": 0.078,
    "demTurnoutBasis": 1192,
    "repTurnoutBasis": 1251
  },
  "18167": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.657,
    "relShare": 0.264,
    "modShare": 0.079,
    "demTurnoutBasis": 6740,
    "repTurnoutBasis": 6719
  },
  "18169": {
    "progShare": 0.497,
    "estabShare": 0.503,
    "magaShare": 0.555,
    "relShare": 0.366,
    "modShare": 0.079,
    "demTurnoutBasis": 993,
    "repTurnoutBasis": 3781
  },
  "18171": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.668,
    "relShare": 0.253,
    "modShare": 0.079,
    "demTurnoutBasis": 265,
    "repTurnoutBasis": 1041
  },
  "18173": {
    "progShare": 0.488,
    "estabShare": 0.512,
    "magaShare": 0.59,
    "relShare": 0.331,
    "modShare": 0.079,
    "demTurnoutBasis": 2908,
    "repTurnoutBasis": 6709
  },
  "18175": {
    "progShare": 0.44,
    "estabShare": 0.56,
    "magaShare": 0.642,
    "relShare": 0.28,
    "modShare": 0.078,
    "demTurnoutBasis": 966,
    "repTurnoutBasis": 2537
  },
  "18177": {
    "progShare": 0.492,
    "estabShare": 0.508,
    "magaShare": 0.636,
    "relShare": 0.262,
    "modShare": 0.102,
    "demTurnoutBasis": 2220,
    "repTurnoutBasis": 5163
  },
  "18179": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.447,
    "relShare": 0.475,
    "modShare": 0.078,
    "demTurnoutBasis": 780,
    "repTurnoutBasis": 3550
  },
  "18181": {
    "progShare": 0.511,
    "estabShare": 0.489,
    "magaShare": 0.62,
    "relShare": 0.297,
    "modShare": 0.083,
    "demTurnoutBasis": 811,
    "repTurnoutBasis": 2662
  },
  "18183": {
    "progShare": 0.51,
    "estabShare": 0.49,
    "magaShare": 0.499,
    "relShare": 0.421,
    "modShare": 0.08,
    "demTurnoutBasis": 1013,
    "repTurnoutBasis": 4421
  },
  "21001": {
    "progShare": 0.443,
    "estabShare": 0.557,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 470,
    "repTurnoutBasis": 554
  },
  "21003": {
    "progShare": 0.485,
    "estabShare": 0.515,
    "magaShare": 0.836,
    "relShare": 0.082,
    "modShare": 0.082,
    "demTurnoutBasis": 464,
    "repTurnoutBasis": 476
  },
  "21005": {
    "progShare": 0.544,
    "estabShare": 0.456,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1572,
    "repTurnoutBasis": 1135
  },
  "21007": {
    "progShare": 0.599,
    "estabShare": 0.401,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 634,
    "repTurnoutBasis": 150
  },
  "21009": {
    "progShare": 0.551,
    "estabShare": 0.449,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2660,
    "repTurnoutBasis": 732
  },
  "21011": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 689,
    "repTurnoutBasis": 150
  },
  "21013": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 634,
    "repTurnoutBasis": 787
  },
  "21015": {
    "progShare": 0.424,
    "estabShare": 0.576,
    "magaShare": 0.806,
    "relShare": 0.079,
    "modShare": 0.115,
    "demTurnoutBasis": 2829,
    "repTurnoutBasis": 3913
  },
  "21017": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.795,
    "relShare": 0.078,
    "modShare": 0.127,
    "demTurnoutBasis": 1193,
    "repTurnoutBasis": 304
  },
  "21019": {
    "progShare": 0.473,
    "estabShare": 0.527,
    "magaShare": 0.828,
    "relShare": 0.081,
    "modShare": 0.091,
    "demTurnoutBasis": 2454,
    "repTurnoutBasis": 818
  },
  "21021": {
    "progShare": 0.442,
    "estabShare": 0.558,
    "magaShare": 0.794,
    "relShare": 0.077,
    "modShare": 0.129,
    "demTurnoutBasis": 1652,
    "repTurnoutBasis": 513
  },
  "21023": {
    "progShare": 0.599,
    "estabShare": 0.401,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 386,
    "repTurnoutBasis": 162
  },
  "21025": {
    "progShare": 0.594,
    "estabShare": 0.406,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1657,
    "repTurnoutBasis": 150
  },
  "21027": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 955,
    "repTurnoutBasis": 626
  },
  "21029": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3272,
    "repTurnoutBasis": 1509
  },
  "21031": {
    "progShare": 0.424,
    "estabShare": 0.576,
    "magaShare": 0.829,
    "relShare": 0.081,
    "modShare": 0.09,
    "demTurnoutBasis": 233,
    "repTurnoutBasis": 389
  },
  "21033": {
    "progShare": 0.58,
    "estabShare": 0.42,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 831,
    "repTurnoutBasis": 242
  },
  "21035": {
    "progShare": 0.578,
    "estabShare": 0.422,
    "magaShare": 0.79,
    "relShare": 0.077,
    "modShare": 0.133,
    "demTurnoutBasis": 2037,
    "repTurnoutBasis": 593
  },
  "21037": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.781,
    "relShare": 0.076,
    "modShare": 0.143,
    "demTurnoutBasis": 3295,
    "repTurnoutBasis": 1814
  },
  "21039": {
    "progShare": 0.668,
    "estabShare": 0.332,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 402,
    "repTurnoutBasis": 150
  },
  "21041": {
    "progShare": 0.515,
    "estabShare": 0.485,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 580,
    "repTurnoutBasis": 150
  },
  "21043": {
    "progShare": 0.538,
    "estabShare": 0.462,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1022,
    "repTurnoutBasis": 539
  },
  "21045": {
    "progShare": 0.44,
    "estabShare": 0.56,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 207,
    "repTurnoutBasis": 459
  },
  "21047": {
    "progShare": 0.419,
    "estabShare": 0.581,
    "magaShare": 0.822,
    "relShare": 0.08,
    "modShare": 0.098,
    "demTurnoutBasis": 2429,
    "repTurnoutBasis": 568
  },
  "21049": {
    "progShare": 0.482,
    "estabShare": 0.518,
    "magaShare": 0.827,
    "relShare": 0.081,
    "modShare": 0.092,
    "demTurnoutBasis": 1988,
    "repTurnoutBasis": 500
  },
  "21051": {
    "progShare": 0.44,
    "estabShare": 0.56,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 190,
    "repTurnoutBasis": 880
  },
  "21053": {
    "progShare": 0.363,
    "estabShare": 0.637,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 302
  },
  "21055": {
    "progShare": 0.563,
    "estabShare": 0.437,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 337,
    "repTurnoutBasis": 278
  },
  "21057": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.829,
    "relShare": 0.081,
    "modShare": 0.09,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 168
  },
  "21059": {
    "progShare": 0.469,
    "estabShare": 0.531,
    "magaShare": 0.771,
    "relShare": 0.075,
    "modShare": 0.154,
    "demTurnoutBasis": 5568,
    "repTurnoutBasis": 1523
  },
  "21061": {
    "progShare": 0.453,
    "estabShare": 0.547,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 278,
    "repTurnoutBasis": 638
  },
  "21063": {
    "progShare": 0.585,
    "estabShare": 0.415,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 411,
    "repTurnoutBasis": 150
  },
  "21065": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 469,
    "repTurnoutBasis": 491
  },
  "21067": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.707,
    "relShare": 0.074,
    "modShare": 0.219,
    "demTurnoutBasis": 18953,
    "repTurnoutBasis": 3709
  },
  "21069": {
    "progShare": 0.536,
    "estabShare": 0.464,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 771,
    "repTurnoutBasis": 311
  },
  "21071": {
    "progShare": 0.616,
    "estabShare": 0.384,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3710,
    "repTurnoutBasis": 389
  },
  "21073": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.784,
    "relShare": 0.076,
    "modShare": 0.14,
    "demTurnoutBasis": 5790,
    "repTurnoutBasis": 1109
  },
  "21075": {
    "progShare": 0.416,
    "estabShare": 0.584,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 338,
    "repTurnoutBasis": 150
  },
  "21077": {
    "progShare": 0.541,
    "estabShare": 0.459,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 330,
    "repTurnoutBasis": 150
  },
  "21079": {
    "progShare": 0.442,
    "estabShare": 0.558,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 430,
    "repTurnoutBasis": 498
  },
  "21081": {
    "progShare": 0.519,
    "estabShare": 0.481,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 726,
    "repTurnoutBasis": 620
  },
  "21083": {
    "progShare": 0.599,
    "estabShare": 0.401,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2563,
    "repTurnoutBasis": 964
  },
  "21085": {
    "progShare": 0.448,
    "estabShare": 0.552,
    "magaShare": 0.829,
    "relShare": 0.081,
    "modShare": 0.09,
    "demTurnoutBasis": 707,
    "repTurnoutBasis": 704
  },
  "21087": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 352,
    "repTurnoutBasis": 417
  },
  "21089": {
    "progShare": 0.485,
    "estabShare": 0.515,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1734,
    "repTurnoutBasis": 1051
  },
  "21091": {
    "progShare": 0.511,
    "estabShare": 0.489,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 577,
    "repTurnoutBasis": 177
  },
  "21093": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.822,
    "relShare": 0.08,
    "modShare": 0.098,
    "demTurnoutBasis": 4558,
    "repTurnoutBasis": 1592
  },
  "21095": {
    "progShare": 0.684,
    "estabShare": 0.316,
    "magaShare": 0.756,
    "relShare": 0.074,
    "modShare": 0.17,
    "demTurnoutBasis": 869,
    "repTurnoutBasis": 150
  },
  "21097": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.832,
    "relShare": 0.081,
    "modShare": 0.087,
    "demTurnoutBasis": 1070,
    "repTurnoutBasis": 294
  },
  "21099": {
    "progShare": 0.539,
    "estabShare": 0.461,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1029,
    "repTurnoutBasis": 421
  },
  "21101": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.819,
    "relShare": 0.08,
    "modShare": 0.101,
    "demTurnoutBasis": 3324,
    "repTurnoutBasis": 463
  },
  "21103": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 962,
    "repTurnoutBasis": 538
  },
  "21105": {
    "progShare": 0.569,
    "estabShare": 0.431,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 322,
    "repTurnoutBasis": 150
  },
  "21107": {
    "progShare": 0.582,
    "estabShare": 0.418,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2584,
    "repTurnoutBasis": 658
  },
  "21109": {
    "progShare": 0.596,
    "estabShare": 0.404,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 588
  },
  "21111": {
    "progShare": 0.374,
    "estabShare": 0.626,
    "magaShare": 0.766,
    "relShare": 0.075,
    "modShare": 0.159,
    "demTurnoutBasis": 55881,
    "repTurnoutBasis": 8641
  },
  "21113": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.786,
    "relShare": 0.077,
    "modShare": 0.137,
    "demTurnoutBasis": 2123,
    "repTurnoutBasis": 1007
  },
  "21115": {
    "progShare": 0.606,
    "estabShare": 0.394,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 675,
    "repTurnoutBasis": 656
  },
  "21117": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.784,
    "relShare": 0.076,
    "modShare": 0.14,
    "demTurnoutBasis": 5252,
    "repTurnoutBasis": 3161
  },
  "21119": {
    "progShare": 0.616,
    "estabShare": 0.384,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 947,
    "repTurnoutBasis": 244
  },
  "21121": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 543,
    "repTurnoutBasis": 1248
  },
  "21123": {
    "progShare": 0.578,
    "estabShare": 0.422,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 882,
    "repTurnoutBasis": 362
  },
  "21125": {
    "progShare": 0.458,
    "estabShare": 0.542,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 861,
    "repTurnoutBasis": 1734
  },
  "21127": {
    "progShare": 0.574,
    "estabShare": 0.426,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 629,
    "repTurnoutBasis": 303
  },
  "21129": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 232,
    "repTurnoutBasis": 187
  },
  "21131": {
    "progShare": 0.518,
    "estabShare": 0.482,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 370
  },
  "21133": {
    "progShare": 0.66,
    "estabShare": 0.34,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1572,
    "repTurnoutBasis": 313
  },
  "21135": {
    "progShare": 0.399,
    "estabShare": 0.601,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 204,
    "repTurnoutBasis": 414
  },
  "21137": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 816,
    "repTurnoutBasis": 644
  },
  "21139": {
    "progShare": 0.578,
    "estabShare": 0.422,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 582,
    "repTurnoutBasis": 238
  },
  "21141": {
    "progShare": 0.487,
    "estabShare": 0.513,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1231,
    "repTurnoutBasis": 412
  },
  "21143": {
    "progShare": 0.502,
    "estabShare": 0.498,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 614,
    "repTurnoutBasis": 217
  },
  "21145": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.805,
    "relShare": 0.079,
    "modShare": 0.116,
    "demTurnoutBasis": 3808,
    "repTurnoutBasis": 1564
  },
  "21147": {
    "progShare": 0.526,
    "estabShare": 0.474,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 202,
    "repTurnoutBasis": 329
  },
  "21149": {
    "progShare": 0.547,
    "estabShare": 0.453,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 627,
    "repTurnoutBasis": 150
  },
  "21151": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.819,
    "relShare": 0.08,
    "modShare": 0.101,
    "demTurnoutBasis": 4136,
    "repTurnoutBasis": 1422
  },
  "21153": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 598,
    "repTurnoutBasis": 209
  },
  "21155": {
    "progShare": 0.416,
    "estabShare": 0.584,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1155,
    "repTurnoutBasis": 206
  },
  "21157": {
    "progShare": 0.576,
    "estabShare": 0.424,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2270,
    "repTurnoutBasis": 515
  },
  "21159": {
    "progShare": 0.624,
    "estabShare": 0.376,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 167,
    "repTurnoutBasis": 276
  },
  "21161": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.835,
    "relShare": 0.081,
    "modShare": 0.084,
    "demTurnoutBasis": 824,
    "repTurnoutBasis": 259
  },
  "21163": {
    "progShare": 0.516,
    "estabShare": 0.484,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1566,
    "repTurnoutBasis": 558
  },
  "21165": {
    "progShare": 0.486,
    "estabShare": 0.514,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 347,
    "repTurnoutBasis": 150
  },
  "21167": {
    "progShare": 0.546,
    "estabShare": 0.454,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1265,
    "repTurnoutBasis": 467
  },
  "21169": {
    "progShare": 0.518,
    "estabShare": 0.482,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 607,
    "repTurnoutBasis": 212
  },
  "21171": {
    "progShare": 0.444,
    "estabShare": 0.556,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 337
  },
  "21173": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1406,
    "repTurnoutBasis": 609
  },
  "21175": {
    "progShare": 0.629,
    "estabShare": 0.371,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 862,
    "repTurnoutBasis": 150
  },
  "21177": {
    "progShare": 0.486,
    "estabShare": 0.514,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1784,
    "repTurnoutBasis": 383
  },
  "21179": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.831,
    "relShare": 0.081,
    "modShare": 0.088,
    "demTurnoutBasis": 2514,
    "repTurnoutBasis": 1170
  },
  "21181": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 419,
    "repTurnoutBasis": 150
  },
  "21183": {
    "progShare": 0.519,
    "estabShare": 0.481,
    "magaShare": 0.835,
    "relShare": 0.081,
    "modShare": 0.084,
    "demTurnoutBasis": 943,
    "repTurnoutBasis": 637
  },
  "21185": {
    "progShare": 0.422,
    "estabShare": 0.578,
    "magaShare": 0.757,
    "relShare": 0.074,
    "modShare": 0.169,
    "demTurnoutBasis": 2606,
    "repTurnoutBasis": 1613
  },
  "21187": {
    "progShare": 0.59,
    "estabShare": 0.41,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 655,
    "repTurnoutBasis": 330
  },
  "21189": {
    "progShare": 0.527,
    "estabShare": 0.473,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "21191": {
    "progShare": 0.562,
    "estabShare": 0.438,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 531,
    "repTurnoutBasis": 274
  },
  "21193": {
    "progShare": 0.643,
    "estabShare": 0.357,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1397,
    "repTurnoutBasis": 313
  },
  "21195": {
    "progShare": 0.66,
    "estabShare": 0.34,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4467,
    "repTurnoutBasis": 736
  },
  "21197": {
    "progShare": 0.516,
    "estabShare": 0.484,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 734,
    "repTurnoutBasis": 344
  },
  "21199": {
    "progShare": 0.469,
    "estabShare": 0.531,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1232,
    "repTurnoutBasis": 1855
  },
  "21201": {
    "progShare": 0.628,
    "estabShare": 0.372,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "21203": {
    "progShare": 0.497,
    "estabShare": 0.503,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 261,
    "repTurnoutBasis": 514
  },
  "21205": {
    "progShare": 0.508,
    "estabShare": 0.492,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1331,
    "repTurnoutBasis": 246
  },
  "21207": {
    "progShare": 0.468,
    "estabShare": 0.532,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 356,
    "repTurnoutBasis": 828
  },
  "21209": {
    "progShare": 0.433,
    "estabShare": 0.567,
    "magaShare": 0.795,
    "relShare": 0.078,
    "modShare": 0.127,
    "demTurnoutBasis": 2580,
    "repTurnoutBasis": 1784
  },
  "21211": {
    "progShare": 0.448,
    "estabShare": 0.552,
    "magaShare": 0.818,
    "relShare": 0.08,
    "modShare": 0.102,
    "demTurnoutBasis": 2295,
    "repTurnoutBasis": 1785
  },
  "21213": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.825,
    "relShare": 0.08,
    "modShare": 0.095,
    "demTurnoutBasis": 771,
    "repTurnoutBasis": 303
  },
  "21215": {
    "progShare": 0.523,
    "estabShare": 0.477,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 788,
    "repTurnoutBasis": 517
  },
  "21217": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 943,
    "repTurnoutBasis": 455
  },
  "21219": {
    "progShare": 0.586,
    "estabShare": 0.414,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 474,
    "repTurnoutBasis": 150
  },
  "21221": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 740,
    "repTurnoutBasis": 337
  },
  "21223": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 542,
    "repTurnoutBasis": 193
  },
  "21225": {
    "progShare": 0.598,
    "estabShare": 0.402,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1123,
    "repTurnoutBasis": 357
  },
  "21227": {
    "progShare": 0.485,
    "estabShare": 0.515,
    "magaShare": 0.797,
    "relShare": 0.078,
    "modShare": 0.125,
    "demTurnoutBasis": 5376,
    "repTurnoutBasis": 2599
  },
  "21229": {
    "progShare": 0.464,
    "estabShare": 0.536,
    "magaShare": 0.831,
    "relShare": 0.081,
    "modShare": 0.088,
    "demTurnoutBasis": 640,
    "repTurnoutBasis": 250
  },
  "21231": {
    "progShare": 0.396,
    "estabShare": 0.604,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 452,
    "repTurnoutBasis": 552
  },
  "21233": {
    "progShare": 0.611,
    "estabShare": 0.389,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1206,
    "repTurnoutBasis": 152
  },
  "21235": {
    "progShare": 0.419,
    "estabShare": 0.581,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 497,
    "repTurnoutBasis": 846
  },
  "21237": {
    "progShare": 0.528,
    "estabShare": 0.472,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 497,
    "repTurnoutBasis": 150
  },
  "21239": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.749,
    "relShare": 0.074,
    "modShare": 0.177,
    "demTurnoutBasis": 2012,
    "repTurnoutBasis": 658
  },
  "22001": {
    "progShare": 0.207,
    "estabShare": 0.793,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 522,
    "repTurnoutBasis": 150
  },
  "22003": {
    "progShare": 0.191,
    "estabShare": 0.809,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 262,
    "repTurnoutBasis": 150
  },
  "22005": {
    "progShare": 0.133,
    "estabShare": 0.867,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1815,
    "repTurnoutBasis": 150
  },
  "22007": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 410,
    "repTurnoutBasis": 150
  },
  "22009": {
    "progShare": 0.16,
    "estabShare": 0.84,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 406,
    "repTurnoutBasis": 150
  },
  "22011": {
    "progShare": 0.22,
    "estabShare": 0.78,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 336,
    "repTurnoutBasis": 150
  },
  "22013": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 371,
    "repTurnoutBasis": 150
  },
  "22015": {
    "progShare": 0.139,
    "estabShare": 0.861,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1215,
    "repTurnoutBasis": 150
  },
  "22017": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 4959,
    "repTurnoutBasis": 150
  },
  "22019": {
    "progShare": 0.152,
    "estabShare": 0.848,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 3070,
    "repTurnoutBasis": 150
  },
  "22021": {
    "progShare": 0.176,
    "estabShare": 0.824,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "22023": {
    "progShare": 0.348,
    "estabShare": 0.652,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "22025": {
    "progShare": 0.142,
    "estabShare": 0.858,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "22027": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 221,
    "repTurnoutBasis": 150
  },
  "22029": {
    "progShare": 0.16,
    "estabShare": 0.84,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 547,
    "repTurnoutBasis": 150
  },
  "22031": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 469,
    "repTurnoutBasis": 150
  },
  "22033": {
    "progShare": 0.144,
    "estabShare": 0.856,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 13892,
    "repTurnoutBasis": 150
  },
  "22035": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "22037": {
    "progShare": 0.135,
    "estabShare": 0.865,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 632,
    "repTurnoutBasis": 150
  },
  "22039": {
    "progShare": 0.197,
    "estabShare": 0.803,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 660,
    "repTurnoutBasis": 150
  },
  "22041": {
    "progShare": 0.141,
    "estabShare": 0.859,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 221,
    "repTurnoutBasis": 150
  },
  "22043": {
    "progShare": 0.218,
    "estabShare": 0.782,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "22045": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 943,
    "repTurnoutBasis": 150
  },
  "22047": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 840,
    "repTurnoutBasis": 150
  },
  "22049": {
    "progShare": 0.134,
    "estabShare": 0.866,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 283,
    "repTurnoutBasis": 150
  },
  "22051": {
    "progShare": 0.16,
    "estabShare": 0.84,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 7041,
    "repTurnoutBasis": 150
  },
  "22053": {
    "progShare": 0.176,
    "estabShare": 0.824,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 361,
    "repTurnoutBasis": 150
  },
  "22055": {
    "progShare": 0.18,
    "estabShare": 0.82,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 2860,
    "repTurnoutBasis": 150
  },
  "22057": {
    "progShare": 0.304,
    "estabShare": 0.696,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1094,
    "repTurnoutBasis": 150
  },
  "22059": {
    "progShare": 0.213,
    "estabShare": 0.787,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "22061": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 653,
    "repTurnoutBasis": 150
  },
  "22063": {
    "progShare": 0.25,
    "estabShare": 0.75,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 988,
    "repTurnoutBasis": 150
  },
  "22065": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 236,
    "repTurnoutBasis": 150
  },
  "22067": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 478,
    "repTurnoutBasis": 150
  },
  "22069": {
    "progShare": 0.163,
    "estabShare": 0.837,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1133,
    "repTurnoutBasis": 150
  },
  "22071": {
    "progShare": 0.21,
    "estabShare": 0.79,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 18009,
    "repTurnoutBasis": 150
  },
  "22073": {
    "progShare": 0.14,
    "estabShare": 0.86,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 3409,
    "repTurnoutBasis": 150
  },
  "22075": {
    "progShare": 0.151,
    "estabShare": 0.849,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 313,
    "repTurnoutBasis": 150
  },
  "22077": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 461,
    "repTurnoutBasis": 150
  },
  "22079": {
    "progShare": 0.121,
    "estabShare": 0.879,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1826,
    "repTurnoutBasis": 150
  },
  "22081": {
    "progShare": 0.144,
    "estabShare": 0.856,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 157,
    "repTurnoutBasis": 150
  },
  "22083": {
    "progShare": 0.139,
    "estabShare": 0.861,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 366,
    "repTurnoutBasis": 150
  },
  "22085": {
    "progShare": 0.249,
    "estabShare": 0.751,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 169,
    "repTurnoutBasis": 150
  },
  "22087": {
    "progShare": 0.228,
    "estabShare": 0.772,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 453,
    "repTurnoutBasis": 150
  },
  "22089": {
    "progShare": 0.134,
    "estabShare": 0.866,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1017,
    "repTurnoutBasis": 150
  },
  "22091": {
    "progShare": 0.131,
    "estabShare": 0.869,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 427,
    "repTurnoutBasis": 150
  },
  "22093": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 732,
    "repTurnoutBasis": 150
  },
  "22095": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1164,
    "repTurnoutBasis": 150
  },
  "22097": {
    "progShare": 0.121,
    "estabShare": 0.879,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1576,
    "repTurnoutBasis": 150
  },
  "22099": {
    "progShare": 0.154,
    "estabShare": 0.846,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 697,
    "repTurnoutBasis": 150
  },
  "22101": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 824,
    "repTurnoutBasis": 150
  },
  "22103": {
    "progShare": 0.17,
    "estabShare": 0.83,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 3446,
    "repTurnoutBasis": 150
  },
  "22105": {
    "progShare": 0.159,
    "estabShare": 0.841,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1731,
    "repTurnoutBasis": 150
  },
  "22107": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 152,
    "repTurnoutBasis": 150
  },
  "22109": {
    "progShare": 0.149,
    "estabShare": 0.851,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 962,
    "repTurnoutBasis": 150
  },
  "22111": {
    "progShare": 0.128,
    "estabShare": 0.872,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 297,
    "repTurnoutBasis": 150
  },
  "22113": {
    "progShare": 0.236,
    "estabShare": 0.764,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 488,
    "repTurnoutBasis": 150
  },
  "22115": {
    "progShare": 0.208,
    "estabShare": 0.792,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 311,
    "repTurnoutBasis": 150
  },
  "22117": {
    "progShare": 0.142,
    "estabShare": 0.858,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 633,
    "repTurnoutBasis": 150
  },
  "22119": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 593,
    "repTurnoutBasis": 150
  },
  "22121": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 684,
    "repTurnoutBasis": 150
  },
  "22123": {
    "progShare": 0.196,
    "estabShare": 0.804,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "22125": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 345,
    "repTurnoutBasis": 150
  },
  "22127": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 173,
    "repTurnoutBasis": 150
  },
  "25001": {
    "progShare": 0.564,
    "estabShare": 0.436,
    "magaShare": 0.699,
    "relShare": 0.08,
    "modShare": 0.221,
    "demTurnoutBasis": 6753,
    "repTurnoutBasis": 5503
  },
  "25009": {
    "progShare": 0.603,
    "estabShare": 0.397,
    "magaShare": 0.581,
    "relShare": 0.08,
    "modShare": 0.339,
    "demTurnoutBasis": 742,
    "repTurnoutBasis": 458
  },
  "25011": {
    "progShare": 0.556,
    "estabShare": 0.444,
    "magaShare": 0.579,
    "relShare": 0.084,
    "modShare": 0.337,
    "demTurnoutBasis": 4841,
    "repTurnoutBasis": 3094
  },
  "25013": {
    "progShare": 0.59,
    "estabShare": 0.41,
    "magaShare": 0.604,
    "relShare": 0.127,
    "modShare": 0.269,
    "demTurnoutBasis": 582,
    "repTurnoutBasis": 580
  },
  "25019": {
    "progShare": 0.568,
    "estabShare": 0.432,
    "magaShare": 0.63,
    "relShare": 0.101,
    "modShare": 0.269,
    "demTurnoutBasis": 1801,
    "repTurnoutBasis": 718
  },
  "25021": {
    "progShare": 0.574,
    "estabShare": 0.426,
    "magaShare": 0.593,
    "relShare": 0.081,
    "modShare": 0.326,
    "demTurnoutBasis": 1678,
    "repTurnoutBasis": 1333
  },
  "25023": {
    "progShare": 0.577,
    "estabShare": 0.423,
    "magaShare": 0.689,
    "relShare": 0.08,
    "modShare": 0.231,
    "demTurnoutBasis": 8521,
    "repTurnoutBasis": 6544
  },
  "25027": {
    "progShare": 0.602,
    "estabShare": 0.398,
    "magaShare": 0.638,
    "relShare": 0.117,
    "modShare": 0.245,
    "demTurnoutBasis": 20755,
    "repTurnoutBasis": 6412
  },
  "26001": {
    "progShare": 0.284,
    "estabShare": 0.716,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 586,
    "repTurnoutBasis": 605
  },
  "26003": {
    "progShare": 0.365,
    "estabShare": 0.635,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 664,
    "repTurnoutBasis": 373
  },
  "26005": {
    "progShare": 0.37,
    "estabShare": 0.63,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 6899,
    "repTurnoutBasis": 4881
  },
  "26007": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2057,
    "repTurnoutBasis": 1969
  },
  "26009": {
    "progShare": 0.376,
    "estabShare": 0.624,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1736,
    "repTurnoutBasis": 1211
  },
  "26011": {
    "progShare": 0.314,
    "estabShare": 0.686,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 789,
    "repTurnoutBasis": 611
  },
  "26013": {
    "progShare": 0.38,
    "estabShare": 0.62,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 399,
    "repTurnoutBasis": 337
  },
  "26015": {
    "progShare": 0.378,
    "estabShare": 0.622,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3260,
    "repTurnoutBasis": 2613
  },
  "26017": {
    "progShare": 0.351,
    "estabShare": 0.649,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 7662,
    "repTurnoutBasis": 3547
  },
  "26019": {
    "progShare": 0.39,
    "estabShare": 0.61,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1710,
    "repTurnoutBasis": 990
  },
  "26021": {
    "progShare": 0.315,
    "estabShare": 0.685,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 9523,
    "repTurnoutBasis": 5661
  },
  "26023": {
    "progShare": 0.349,
    "estabShare": 0.651,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1528,
    "repTurnoutBasis": 1521
  },
  "26025": {
    "progShare": 0.376,
    "estabShare": 0.624,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 7010,
    "repTurnoutBasis": 3775
  },
  "26027": {
    "progShare": 0.287,
    "estabShare": 0.713,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2290,
    "repTurnoutBasis": 1600
  },
  "26029": {
    "progShare": 0.361,
    "estabShare": 0.639,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1975,
    "repTurnoutBasis": 1189
  },
  "26031": {
    "progShare": 0.323,
    "estabShare": 0.677,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1468,
    "repTurnoutBasis": 1187
  },
  "26033": {
    "progShare": 0.404,
    "estabShare": 0.596,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1769,
    "repTurnoutBasis": 1197
  },
  "26035": {
    "progShare": 0.349,
    "estabShare": 0.651,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1445,
    "repTurnoutBasis": 1462
  },
  "26037": {
    "progShare": 0.351,
    "estabShare": 0.649,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 6001,
    "repTurnoutBasis": 3059
  },
  "26039": {
    "progShare": 0.33,
    "estabShare": 0.67,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 798,
    "repTurnoutBasis": 794
  },
  "26041": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2069,
    "repTurnoutBasis": 1268
  },
  "26043": {
    "progShare": 0.345,
    "estabShare": 0.655,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1343,
    "repTurnoutBasis": 1204
  },
  "26045": {
    "progShare": 0.365,
    "estabShare": 0.635,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8942,
    "repTurnoutBasis": 4234
  },
  "26047": {
    "progShare": 0.394,
    "estabShare": 0.606,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2858,
    "repTurnoutBasis": 1712
  },
  "26049": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 32079,
    "repTurnoutBasis": 10958
  },
  "26051": {
    "progShare": 0.287,
    "estabShare": 0.713,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1248,
    "repTurnoutBasis": 1173
  },
  "26053": {
    "progShare": 0.321,
    "estabShare": 0.679,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1028,
    "repTurnoutBasis": 476
  },
  "26055": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8744,
    "repTurnoutBasis": 4291
  },
  "26057": {
    "progShare": 0.367,
    "estabShare": 0.633,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1820,
    "repTurnoutBasis": 1219
  },
  "26059": {
    "progShare": 0.355,
    "estabShare": 0.645,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1614,
    "repTurnoutBasis": 2036
  },
  "26061": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2266,
    "repTurnoutBasis": 969
  },
  "26063": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1490,
    "repTurnoutBasis": 1499
  },
  "26065": {
    "progShare": 0.458,
    "estabShare": 0.542,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 29276,
    "repTurnoutBasis": 7125
  },
  "26067": {
    "progShare": 0.401,
    "estabShare": 0.599,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2799,
    "repTurnoutBasis": 1907
  },
  "26069": {
    "progShare": 0.28,
    "estabShare": 0.72,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1456,
    "repTurnoutBasis": 1132
  },
  "26071": {
    "progShare": 0.334,
    "estabShare": 0.666,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 747,
    "repTurnoutBasis": 568
  },
  "26073": {
    "progShare": 0.47,
    "estabShare": 0.53,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3846,
    "repTurnoutBasis": 1585
  },
  "26075": {
    "progShare": 0.385,
    "estabShare": 0.615,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8007,
    "repTurnoutBasis": 4754
  },
  "26077": {
    "progShare": 0.455,
    "estabShare": 0.545,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 24105,
    "repTurnoutBasis": 7221
  },
  "26079": {
    "progShare": 0.387,
    "estabShare": 0.613,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 896,
    "repTurnoutBasis": 919
  },
  "26081": {
    "progShare": 0.465,
    "estabShare": 0.535,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 52327,
    "repTurnoutBasis": 21241
  },
  "26083": {
    "progShare": 0.354,
    "estabShare": 0.646,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 225,
    "repTurnoutBasis": 150
  },
  "26085": {
    "progShare": 0.292,
    "estabShare": 0.708,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 596,
    "repTurnoutBasis": 490
  },
  "26087": {
    "progShare": 0.363,
    "estabShare": 0.637,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4618,
    "repTurnoutBasis": 4202
  },
  "26089": {
    "progShare": 0.364,
    "estabShare": 0.636,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2812,
    "repTurnoutBasis": 1178
  },
  "26091": {
    "progShare": 0.381,
    "estabShare": 0.619,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5366,
    "repTurnoutBasis": 3204
  },
  "26093": {
    "progShare": 0.378,
    "estabShare": 0.622,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 13729,
    "repTurnoutBasis": 9491
  },
  "26095": {
    "progShare": 0.344,
    "estabShare": 0.656,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 247,
    "repTurnoutBasis": 277
  },
  "26097": {
    "progShare": 0.351,
    "estabShare": 0.649,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 739,
    "repTurnoutBasis": 552
  },
  "26099": {
    "progShare": 0.362,
    "estabShare": 0.638,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 64922,
    "repTurnoutBasis": 41193
  },
  "26101": {
    "progShare": 0.355,
    "estabShare": 0.645,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1819,
    "repTurnoutBasis": 1128
  },
  "26103": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5974,
    "repTurnoutBasis": 1699
  },
  "26105": {
    "progShare": 0.351,
    "estabShare": 0.649,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1993,
    "repTurnoutBasis": 1242
  },
  "26107": {
    "progShare": 0.406,
    "estabShare": 0.594,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2125,
    "repTurnoutBasis": 1935
  },
  "26109": {
    "progShare": 0.307,
    "estabShare": 0.693,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1081,
    "repTurnoutBasis": 759
  },
  "26111": {
    "progShare": 0.372,
    "estabShare": 0.628,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5594,
    "repTurnoutBasis": 2931
  },
  "26113": {
    "progShare": 0.324,
    "estabShare": 0.676,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 565,
    "repTurnoutBasis": 970
  },
  "26115": {
    "progShare": 0.348,
    "estabShare": 0.652,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8929,
    "repTurnoutBasis": 5548
  },
  "26117": {
    "progShare": 0.373,
    "estabShare": 0.627,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2907,
    "repTurnoutBasis": 3045
  },
  "26119": {
    "progShare": 0.285,
    "estabShare": 0.715,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 481,
    "repTurnoutBasis": 673
  },
  "26121": {
    "progShare": 0.371,
    "estabShare": 0.629,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 12158,
    "repTurnoutBasis": 5111
  },
  "26123": {
    "progShare": 0.367,
    "estabShare": 0.633,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2185,
    "repTurnoutBasis": 2234
  },
  "26125": {
    "progShare": 0.354,
    "estabShare": 0.646,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 130639,
    "repTurnoutBasis": 45660
  },
  "26127": {
    "progShare": 0.34,
    "estabShare": 0.66,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1363,
    "repTurnoutBasis": 1108
  },
  "26129": {
    "progShare": 0.318,
    "estabShare": 0.682,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1052,
    "repTurnoutBasis": 1069
  },
  "26131": {
    "progShare": 0.345,
    "estabShare": 0.655,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 430,
    "repTurnoutBasis": 313
  },
  "26133": {
    "progShare": 0.346,
    "estabShare": 0.654,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 867,
    "repTurnoutBasis": 1123
  },
  "26135": {
    "progShare": 0.284,
    "estabShare": 0.716,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 372,
    "repTurnoutBasis": 516
  },
  "26137": {
    "progShare": 0.381,
    "estabShare": 0.619,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1377,
    "repTurnoutBasis": 1170
  },
  "26139": {
    "progShare": 0.415,
    "estabShare": 0.585,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 17328,
    "repTurnoutBasis": 13121
  },
  "26141": {
    "progShare": 0.269,
    "estabShare": 0.731,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 864,
    "repTurnoutBasis": 674
  },
  "26143": {
    "progShare": 0.298,
    "estabShare": 0.702,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1477,
    "repTurnoutBasis": 1481
  },
  "26145": {
    "progShare": 0.325,
    "estabShare": 0.675,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 13848,
    "repTurnoutBasis": 7034
  },
  "26147": {
    "progShare": 0.375,
    "estabShare": 0.625,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 9480,
    "repTurnoutBasis": 8142
  },
  "26149": {
    "progShare": 0.377,
    "estabShare": 0.623,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2402,
    "repTurnoutBasis": 2301
  },
  "26151": {
    "progShare": 0.34,
    "estabShare": 0.66,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1626,
    "repTurnoutBasis": 2274
  },
  "26153": {
    "progShare": 0.321,
    "estabShare": 0.679,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 462,
    "repTurnoutBasis": 256
  },
  "26155": {
    "progShare": 0.368,
    "estabShare": 0.632,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4413,
    "repTurnoutBasis": 2702
  },
  "26157": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2428,
    "repTurnoutBasis": 2353
  },
  "26159": {
    "progShare": 0.379,
    "estabShare": 0.621,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4476,
    "repTurnoutBasis": 2633
  },
  "26161": {
    "progShare": 0.481,
    "estabShare": 0.519,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 51225,
    "repTurnoutBasis": 6682
  },
  "26163": {
    "progShare": 0.376,
    "estabShare": 0.624,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 158430,
    "repTurnoutBasis": 35496
  },
  "26165": {
    "progShare": 0.402,
    "estabShare": 0.598,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1709,
    "repTurnoutBasis": 1591
  },
  "28001": {
    "progShare": 0.124,
    "estabShare": 0.876,
    "magaShare": 0.551,
    "relShare": 0.296,
    "modShare": 0.153,
    "demTurnoutBasis": 7624,
    "repTurnoutBasis": 5554
  },
  "28003": {
    "progShare": 0.246,
    "estabShare": 0.754,
    "magaShare": 0.569,
    "relShare": 0.315,
    "modShare": 0.116,
    "demTurnoutBasis": 2431,
    "repTurnoutBasis": 10352
  },
  "28005": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.611,
    "relShare": 0.306,
    "modShare": 0.083,
    "demTurnoutBasis": 2929,
    "repTurnoutBasis": 4466
  },
  "28007": {
    "progShare": 0.128,
    "estabShare": 0.872,
    "magaShare": 0.584,
    "relShare": 0.311,
    "modShare": 0.105,
    "demTurnoutBasis": 3726,
    "repTurnoutBasis": 4969
  },
  "28009": {
    "progShare": 0.139,
    "estabShare": 0.861,
    "magaShare": 0.608,
    "relShare": 0.313,
    "modShare": 0.079,
    "demTurnoutBasis": 1443,
    "repTurnoutBasis": 1999
  },
  "28011": {
    "progShare": 0.141,
    "estabShare": 0.859,
    "magaShare": 0.588,
    "relShare": 0.226,
    "modShare": 0.186,
    "demTurnoutBasis": 7773,
    "repTurnoutBasis": 4539
  },
  "28013": {
    "progShare": 0.144,
    "estabShare": 0.856,
    "magaShare": 0.628,
    "relShare": 0.292,
    "modShare": 0.08,
    "demTurnoutBasis": 1781,
    "repTurnoutBasis": 4480
  },
  "28015": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.617,
    "relShare": 0.282,
    "modShare": 0.101,
    "demTurnoutBasis": 1876,
    "repTurnoutBasis": 3653
  },
  "28017": {
    "progShare": 0.148,
    "estabShare": 0.852,
    "magaShare": 0.594,
    "relShare": 0.319,
    "modShare": 0.087,
    "demTurnoutBasis": 3607,
    "repTurnoutBasis": 3790
  },
  "28019": {
    "progShare": 0.159,
    "estabShare": 0.841,
    "magaShare": 0.556,
    "relShare": 0.347,
    "modShare": 0.097,
    "demTurnoutBasis": 1193,
    "repTurnoutBasis": 2967
  },
  "28021": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.624,
    "relShare": 0.264,
    "modShare": 0.112,
    "demTurnoutBasis": 3860,
    "repTurnoutBasis": 441
  },
  "28023": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.587,
    "relShare": 0.327,
    "modShare": 0.086,
    "demTurnoutBasis": 2702,
    "repTurnoutBasis": 5583
  },
  "28025": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.539,
    "relShare": 0.343,
    "modShare": 0.118,
    "demTurnoutBasis": 5878,
    "repTurnoutBasis": 4172
  },
  "28027": {
    "progShare": 0.169,
    "estabShare": 0.831,
    "magaShare": 0.569,
    "relShare": 0.252,
    "modShare": 0.179,
    "demTurnoutBasis": 5935,
    "repTurnoutBasis": 1832
  },
  "28029": {
    "progShare": 0.13,
    "estabShare": 0.87,
    "magaShare": 0.62,
    "relShare": 0.279,
    "modShare": 0.101,
    "demTurnoutBasis": 7761,
    "repTurnoutBasis": 6426
  },
  "28031": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.628,
    "relShare": 0.294,
    "modShare": 0.078,
    "demTurnoutBasis": 3217,
    "repTurnoutBasis": 5746
  },
  "28033": {
    "progShare": 0.248,
    "estabShare": 0.752,
    "magaShare": 0.466,
    "relShare": 0.43,
    "modShare": 0.104,
    "demTurnoutBasis": 17141,
    "repTurnoutBasis": 44811
  },
  "28035": {
    "progShare": 0.256,
    "estabShare": 0.744,
    "magaShare": 0.531,
    "relShare": 0.324,
    "modShare": 0.145,
    "demTurnoutBasis": 11101,
    "repTurnoutBasis": 18154
  },
  "28037": {
    "progShare": 0.203,
    "estabShare": 0.797,
    "magaShare": 0.573,
    "relShare": 0.346,
    "modShare": 0.081,
    "demTurnoutBasis": 1796,
    "repTurnoutBasis": 3039
  },
  "28039": {
    "progShare": 0.243,
    "estabShare": 0.757,
    "magaShare": 0.58,
    "relShare": 0.341,
    "modShare": 0.079,
    "demTurnoutBasis": 1048,
    "repTurnoutBasis": 9073
  },
  "28041": {
    "progShare": 0.129,
    "estabShare": 0.871,
    "magaShare": 0.606,
    "relShare": 0.315,
    "modShare": 0.079,
    "demTurnoutBasis": 887,
    "repTurnoutBasis": 4137
  },
  "28043": {
    "progShare": 0.122,
    "estabShare": 0.878,
    "magaShare": 0.613,
    "relShare": 0.298,
    "modShare": 0.089,
    "demTurnoutBasis": 2648,
    "repTurnoutBasis": 4694
  },
  "28045": {
    "progShare": 0.337,
    "estabShare": 0.663,
    "magaShare": 0.65,
    "relShare": 0.237,
    "modShare": 0.113,
    "demTurnoutBasis": 3331,
    "repTurnoutBasis": 13813
  },
  "28047": {
    "progShare": 0.237,
    "estabShare": 0.763,
    "magaShare": 0.625,
    "relShare": 0.291,
    "modShare": 0.084,
    "demTurnoutBasis": 20379,
    "repTurnoutBasis": 45524
  },
  "28049": {
    "progShare": 0.153,
    "estabShare": 0.847,
    "magaShare": 0.523,
    "relShare": 0.329,
    "modShare": 0.148,
    "demTurnoutBasis": 75600,
    "repTurnoutBasis": 26748
  },
  "28051": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.63,
    "relShare": 0.246,
    "modShare": 0.124,
    "demTurnoutBasis": 7596,
    "repTurnoutBasis": 1316
  },
  "28053": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.668,
    "relShare": 0.185,
    "modShare": 0.147,
    "demTurnoutBasis": 1774,
    "repTurnoutBasis": 935
  },
  "28055": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.735,
    "relShare": 0.132,
    "modShare": 0.133,
    "demTurnoutBasis": 407,
    "repTurnoutBasis": 308
  },
  "28057": {
    "progShare": 0.27,
    "estabShare": 0.73,
    "magaShare": 0.559,
    "relShare": 0.356,
    "modShare": 0.085,
    "demTurnoutBasis": 1158,
    "repTurnoutBasis": 7974
  },
  "28059": {
    "progShare": 0.217,
    "estabShare": 0.783,
    "magaShare": 0.577,
    "relShare": 0.301,
    "modShare": 0.122,
    "demTurnoutBasis": 14120,
    "repTurnoutBasis": 37711
  },
  "28061": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.622,
    "relShare": 0.3,
    "modShare": 0.078,
    "demTurnoutBasis": 4663,
    "repTurnoutBasis": 4338
  },
  "28063": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.565,
    "relShare": 0.305,
    "modShare": 0.13,
    "demTurnoutBasis": 3478,
    "repTurnoutBasis": 432
  },
  "28065": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.568,
    "relShare": 0.336,
    "modShare": 0.096,
    "demTurnoutBasis": 3038,
    "repTurnoutBasis": 2007
  },
  "28067": {
    "progShare": 0.152,
    "estabShare": 0.848,
    "magaShare": 0.604,
    "relShare": 0.318,
    "modShare": 0.078,
    "demTurnoutBasis": 6984,
    "repTurnoutBasis": 22471
  },
  "28069": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.69,
    "relShare": 0.231,
    "modShare": 0.079,
    "demTurnoutBasis": 1302,
    "repTurnoutBasis": 823
  },
  "28071": {
    "progShare": 0.338,
    "estabShare": 0.662,
    "magaShare": 0.419,
    "relShare": 0.331,
    "modShare": 0.25,
    "demTurnoutBasis": 7989,
    "repTurnoutBasis": 11924
  },
  "28073": {
    "progShare": 0.254,
    "estabShare": 0.746,
    "magaShare": 0.547,
    "relShare": 0.333,
    "modShare": 0.12,
    "demTurnoutBasis": 4799,
    "repTurnoutBasis": 21336
  },
  "28075": {
    "progShare": 0.136,
    "estabShare": 0.864,
    "magaShare": 0.529,
    "relShare": 0.337,
    "modShare": 0.134,
    "demTurnoutBasis": 7366,
    "repTurnoutBasis": 19919
  },
  "28077": {
    "progShare": 0.134,
    "estabShare": 0.866,
    "magaShare": 0.645,
    "relShare": 0.272,
    "modShare": 0.083,
    "demTurnoutBasis": 2736,
    "repTurnoutBasis": 4271
  },
  "28079": {
    "progShare": 0.145,
    "estabShare": 0.855,
    "magaShare": 0.624,
    "relShare": 0.294,
    "modShare": 0.082,
    "demTurnoutBasis": 4079,
    "repTurnoutBasis": 5084
  },
  "28081": {
    "progShare": 0.211,
    "estabShare": 0.789,
    "magaShare": 0.47,
    "relShare": 0.398,
    "modShare": 0.132,
    "demTurnoutBasis": 8878,
    "repTurnoutBasis": 23725
  },
  "28083": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.532,
    "relShare": 0.24,
    "modShare": 0.228,
    "demTurnoutBasis": 5248,
    "repTurnoutBasis": 2756
  },
  "28085": {
    "progShare": 0.15,
    "estabShare": 0.85,
    "magaShare": 0.566,
    "relShare": 0.314,
    "modShare": 0.12,
    "demTurnoutBasis": 4631,
    "repTurnoutBasis": 11361
  },
  "28087": {
    "progShare": 0.161,
    "estabShare": 0.839,
    "magaShare": 0.499,
    "relShare": 0.366,
    "modShare": 0.135,
    "demTurnoutBasis": 10300,
    "repTurnoutBasis": 13765
  },
  "28089": {
    "progShare": 0.163,
    "estabShare": 0.837,
    "magaShare": 0.498,
    "relShare": 0.27,
    "modShare": 0.232,
    "demTurnoutBasis": 20648,
    "repTurnoutBasis": 33718
  },
  "28091": {
    "progShare": 0.128,
    "estabShare": 0.872,
    "magaShare": 0.613,
    "relShare": 0.308,
    "modShare": 0.079,
    "demTurnoutBasis": 3655,
    "repTurnoutBasis": 8851
  },
  "28093": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.526,
    "relShare": 0.395,
    "modShare": 0.079,
    "demTurnoutBasis": 7919,
    "repTurnoutBasis": 6747
  },
  "28095": {
    "progShare": 0.134,
    "estabShare": 0.866,
    "magaShare": 0.578,
    "relShare": 0.311,
    "modShare": 0.111,
    "demTurnoutBasis": 4815,
    "repTurnoutBasis": 9360
  },
  "28097": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.575,
    "relShare": 0.315,
    "modShare": 0.11,
    "demTurnoutBasis": 2419,
    "repTurnoutBasis": 2752
  },
  "28099": {
    "progShare": 0.189,
    "estabShare": 0.811,
    "magaShare": 0.589,
    "relShare": 0.297,
    "modShare": 0.114,
    "demTurnoutBasis": 2454,
    "repTurnoutBasis": 8268
  },
  "28101": {
    "progShare": 0.14,
    "estabShare": 0.86,
    "magaShare": 0.557,
    "relShare": 0.341,
    "modShare": 0.102,
    "demTurnoutBasis": 2648,
    "repTurnoutBasis": 7353
  },
  "28103": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.478,
    "relShare": 0.409,
    "modShare": 0.113,
    "demTurnoutBasis": 3242,
    "repTurnoutBasis": 1072
  },
  "28105": {
    "progShare": 0.23,
    "estabShare": 0.77,
    "magaShare": 0.403,
    "relShare": 0.363,
    "modShare": 0.234,
    "demTurnoutBasis": 7315,
    "repTurnoutBasis": 8936
  },
  "28107": {
    "progShare": 0.134,
    "estabShare": 0.866,
    "magaShare": 0.605,
    "relShare": 0.308,
    "modShare": 0.087,
    "demTurnoutBasis": 7228,
    "repTurnoutBasis": 7268
  },
  "28109": {
    "progShare": 0.251,
    "estabShare": 0.749,
    "magaShare": 0.601,
    "relShare": 0.319,
    "modShare": 0.08,
    "demTurnoutBasis": 2987,
    "repTurnoutBasis": 17827
  },
  "28111": {
    "progShare": 0.155,
    "estabShare": 0.845,
    "magaShare": 0.61,
    "relShare": 0.312,
    "modShare": 0.078,
    "demTurnoutBasis": 1224,
    "repTurnoutBasis": 4286
  },
  "28113": {
    "progShare": 0.134,
    "estabShare": 0.866,
    "magaShare": 0.592,
    "relShare": 0.281,
    "modShare": 0.127,
    "demTurnoutBasis": 7361,
    "repTurnoutBasis": 8477
  },
  "28115": {
    "progShare": 0.247,
    "estabShare": 0.753,
    "magaShare": 0.523,
    "relShare": 0.391,
    "modShare": 0.086,
    "demTurnoutBasis": 2181,
    "repTurnoutBasis": 10278
  },
  "28117": {
    "progShare": 0.236,
    "estabShare": 0.764,
    "magaShare": 0.561,
    "relShare": 0.347,
    "modShare": 0.092,
    "demTurnoutBasis": 2039,
    "repTurnoutBasis": 6308
  },
  "28119": {
    "progShare": 0.13,
    "estabShare": 0.87,
    "magaShare": 0.568,
    "relShare": 0.307,
    "modShare": 0.125,
    "demTurnoutBasis": 2320,
    "repTurnoutBasis": 653
  },
  "28121": {
    "progShare": 0.213,
    "estabShare": 0.787,
    "magaShare": 0.56,
    "relShare": 0.302,
    "modShare": 0.138,
    "demTurnoutBasis": 14236,
    "repTurnoutBasis": 54177
  },
  "28123": {
    "progShare": 0.137,
    "estabShare": 0.863,
    "magaShare": 0.608,
    "relShare": 0.3,
    "modShare": 0.092,
    "demTurnoutBasis": 4940,
    "repTurnoutBasis": 6474
  },
  "28125": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.613,
    "relShare": 0.24,
    "modShare": 0.147,
    "demTurnoutBasis": 1558,
    "repTurnoutBasis": 712
  },
  "28127": {
    "progShare": 0.14,
    "estabShare": 0.86,
    "magaShare": 0.612,
    "relShare": 0.289,
    "modShare": 0.099,
    "demTurnoutBasis": 4504,
    "repTurnoutBasis": 9047
  },
  "28129": {
    "progShare": 0.162,
    "estabShare": 0.838,
    "magaShare": 0.625,
    "relShare": 0.296,
    "modShare": 0.079,
    "demTurnoutBasis": 1832,
    "repTurnoutBasis": 6287
  },
  "28131": {
    "progShare": 0.198,
    "estabShare": 0.802,
    "magaShare": 0.549,
    "relShare": 0.371,
    "modShare": 0.08,
    "demTurnoutBasis": 1501,
    "repTurnoutBasis": 6183
  },
  "28133": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.646,
    "relShare": 0.194,
    "modShare": 0.16,
    "demTurnoutBasis": 5770,
    "repTurnoutBasis": 2542
  },
  "28135": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.679,
    "relShare": 0.24,
    "modShare": 0.081,
    "demTurnoutBasis": 3214,
    "repTurnoutBasis": 2200
  },
  "28137": {
    "progShare": 0.146,
    "estabShare": 0.854,
    "magaShare": 0.509,
    "relShare": 0.411,
    "modShare": 0.08,
    "demTurnoutBasis": 3517,
    "repTurnoutBasis": 8003
  },
  "28139": {
    "progShare": 0.209,
    "estabShare": 0.791,
    "magaShare": 0.58,
    "relShare": 0.334,
    "modShare": 0.086,
    "demTurnoutBasis": 1589,
    "repTurnoutBasis": 7277
  },
  "28141": {
    "progShare": 0.326,
    "estabShare": 0.674,
    "magaShare": 0.606,
    "relShare": 0.3,
    "modShare": 0.094,
    "demTurnoutBasis": 1235,
    "repTurnoutBasis": 6672
  },
  "28143": {
    "progShare": 0.184,
    "estabShare": 0.816,
    "magaShare": 0.611,
    "relShare": 0.304,
    "modShare": 0.085,
    "demTurnoutBasis": 2241,
    "repTurnoutBasis": 465
  },
  "28145": {
    "progShare": 0.245,
    "estabShare": 0.755,
    "magaShare": 0.526,
    "relShare": 0.376,
    "modShare": 0.098,
    "demTurnoutBasis": 1758,
    "repTurnoutBasis": 9039
  },
  "28147": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.662,
    "relShare": 0.249,
    "modShare": 0.089,
    "demTurnoutBasis": 2540,
    "repTurnoutBasis": 3926
  },
  "28149": {
    "progShare": 0.152,
    "estabShare": 0.848,
    "magaShare": 0.575,
    "relShare": 0.273,
    "modShare": 0.152,
    "demTurnoutBasis": 9284,
    "repTurnoutBasis": 11133
  },
  "28151": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.604,
    "relShare": 0.237,
    "modShare": 0.159,
    "demTurnoutBasis": 8834,
    "repTurnoutBasis": 4418
  },
  "28153": {
    "progShare": 0.138,
    "estabShare": 0.862,
    "magaShare": 0.647,
    "relShare": 0.275,
    "modShare": 0.078,
    "demTurnoutBasis": 3596,
    "repTurnoutBasis": 7323
  },
  "28155": {
    "progShare": 0.157,
    "estabShare": 0.843,
    "magaShare": 0.588,
    "relShare": 0.326,
    "modShare": 0.086,
    "demTurnoutBasis": 1017,
    "repTurnoutBasis": 4376
  },
  "28157": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.613,
    "relShare": 0.308,
    "modShare": 0.079,
    "demTurnoutBasis": 2671,
    "repTurnoutBasis": 1195
  },
  "28159": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.654,
    "relShare": 0.249,
    "modShare": 0.097,
    "demTurnoutBasis": 1955,
    "repTurnoutBasis": 2081
  },
  "28161": {
    "progShare": 0.153,
    "estabShare": 0.847,
    "magaShare": 0.635,
    "relShare": 0.286,
    "modShare": 0.079,
    "demTurnoutBasis": 2966,
    "repTurnoutBasis": 3447
  },
  "28163": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.613,
    "relShare": 0.268,
    "modShare": 0.119,
    "demTurnoutBasis": 5346,
    "repTurnoutBasis": 5057
  },
  "29001": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.551,
    "relShare": 0.266,
    "modShare": 0.183,
    "demTurnoutBasis": 1998,
    "repTurnoutBasis": 2332
  },
  "29003": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.568,
    "relShare": 0.289,
    "modShare": 0.143,
    "demTurnoutBasis": 1280,
    "repTurnoutBasis": 2373
  },
  "29005": {
    "progShare": 0.422,
    "estabShare": 0.578,
    "magaShare": 0.599,
    "relShare": 0.233,
    "modShare": 0.168,
    "demTurnoutBasis": 316,
    "repTurnoutBasis": 789
  },
  "29007": {
    "progShare": 0.35,
    "estabShare": 0.65,
    "magaShare": 0.648,
    "relShare": 0.25,
    "modShare": 0.102,
    "demTurnoutBasis": 2370,
    "repTurnoutBasis": 3473
  },
  "29009": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.432,
    "relShare": 0.469,
    "modShare": 0.099,
    "demTurnoutBasis": 847,
    "repTurnoutBasis": 3516
  },
  "29011": {
    "progShare": 0.448,
    "estabShare": 0.552,
    "magaShare": 0.539,
    "relShare": 0.382,
    "modShare": 0.079,
    "demTurnoutBasis": 424,
    "repTurnoutBasis": 2099
  },
  "29013": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.462,
    "relShare": 0.405,
    "modShare": 0.133,
    "demTurnoutBasis": 595,
    "repTurnoutBasis": 1419
  },
  "29015": {
    "progShare": 0.459,
    "estabShare": 0.541,
    "magaShare": 0.553,
    "relShare": 0.337,
    "modShare": 0.11,
    "demTurnoutBasis": 628,
    "repTurnoutBasis": 2056
  },
  "29017": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.476,
    "relShare": 0.426,
    "modShare": 0.098,
    "demTurnoutBasis": 225,
    "repTurnoutBasis": 1336
  },
  "29019": {
    "progShare": 0.611,
    "estabShare": 0.389,
    "magaShare": 0.309,
    "relShare": 0.455,
    "modShare": 0.236,
    "demTurnoutBasis": 12469,
    "repTurnoutBasis": 12805
  },
  "29021": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.555,
    "relShare": 0.28,
    "modShare": 0.165,
    "demTurnoutBasis": 7493,
    "repTurnoutBasis": 7449
  },
  "29023": {
    "progShare": 0.416,
    "estabShare": 0.584,
    "magaShare": 0.647,
    "relShare": 0.273,
    "modShare": 0.08,
    "demTurnoutBasis": 1664,
    "repTurnoutBasis": 5138
  },
  "29025": {
    "progShare": 0.563,
    "estabShare": 0.437,
    "magaShare": 0.44,
    "relShare": 0.41,
    "modShare": 0.15,
    "demTurnoutBasis": 283,
    "repTurnoutBasis": 893
  },
  "29027": {
    "progShare": 0.549,
    "estabShare": 0.451,
    "magaShare": 0.415,
    "relShare": 0.451,
    "modShare": 0.134,
    "demTurnoutBasis": 1548,
    "repTurnoutBasis": 3774
  },
  "29029": {
    "progShare": 0.506,
    "estabShare": 0.494,
    "magaShare": 0.55,
    "relShare": 0.312,
    "modShare": 0.138,
    "demTurnoutBasis": 1421,
    "repTurnoutBasis": 4981
  },
  "29031": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.542,
    "relShare": 0.36,
    "modShare": 0.098,
    "demTurnoutBasis": 4948,
    "repTurnoutBasis": 10633
  },
  "29033": {
    "progShare": 0.523,
    "estabShare": 0.477,
    "magaShare": 0.515,
    "relShare": 0.352,
    "modShare": 0.133,
    "demTurnoutBasis": 252,
    "repTurnoutBasis": 979
  },
  "29035": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.539,
    "relShare": 0.359,
    "modShare": 0.102,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 582
  },
  "29037": {
    "progShare": 0.527,
    "estabShare": 0.473,
    "magaShare": 0.39,
    "relShare": 0.449,
    "modShare": 0.161,
    "demTurnoutBasis": 4021,
    "repTurnoutBasis": 8840
  },
  "29039": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.429,
    "relShare": 0.472,
    "modShare": 0.099,
    "demTurnoutBasis": 353,
    "repTurnoutBasis": 1579
  },
  "29041": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.424,
    "relShare": 0.423,
    "modShare": 0.153,
    "demTurnoutBasis": 308,
    "repTurnoutBasis": 705
  },
  "29043": {
    "progShare": 0.589,
    "estabShare": 0.411,
    "magaShare": 0.348,
    "relShare": 0.546,
    "modShare": 0.106,
    "demTurnoutBasis": 2632,
    "repTurnoutBasis": 9935
  },
  "29045": {
    "progShare": 0.468,
    "estabShare": 0.532,
    "magaShare": 0.46,
    "relShare": 0.419,
    "modShare": 0.121,
    "demTurnoutBasis": 197,
    "repTurnoutBasis": 591
  },
  "29047": {
    "progShare": 0.542,
    "estabShare": 0.458,
    "magaShare": 0.375,
    "relShare": 0.427,
    "modShare": 0.198,
    "demTurnoutBasis": 11701,
    "repTurnoutBasis": 16414
  },
  "29049": {
    "progShare": 0.527,
    "estabShare": 0.473,
    "magaShare": 0.451,
    "relShare": 0.406,
    "modShare": 0.143,
    "demTurnoutBasis": 829,
    "repTurnoutBasis": 1816
  },
  "29051": {
    "progShare": 0.542,
    "estabShare": 0.458,
    "magaShare": 0.376,
    "relShare": 0.435,
    "modShare": 0.189,
    "demTurnoutBasis": 3090,
    "repTurnoutBasis": 7375
  },
  "29053": {
    "progShare": 0.493,
    "estabShare": 0.507,
    "magaShare": 0.404,
    "relShare": 0.46,
    "modShare": 0.136,
    "demTurnoutBasis": 515,
    "repTurnoutBasis": 1540
  },
  "29055": {
    "progShare": 0.577,
    "estabShare": 0.423,
    "magaShare": 0.531,
    "relShare": 0.384,
    "modShare": 0.085,
    "demTurnoutBasis": 634,
    "repTurnoutBasis": 2066
  },
  "29057": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.392,
    "relShare": 0.511,
    "modShare": 0.097,
    "demTurnoutBasis": 209,
    "repTurnoutBasis": 1007
  },
  "29059": {
    "progShare": 0.564,
    "estabShare": 0.436,
    "magaShare": 0.457,
    "relShare": 0.454,
    "modShare": 0.089,
    "demTurnoutBasis": 463,
    "repTurnoutBasis": 1828
  },
  "29061": {
    "progShare": 0.48,
    "estabShare": 0.52,
    "magaShare": 0.507,
    "relShare": 0.342,
    "modShare": 0.151,
    "demTurnoutBasis": 235,
    "repTurnoutBasis": 631
  },
  "29063": {
    "progShare": 0.595,
    "estabShare": 0.405,
    "magaShare": 0.44,
    "relShare": 0.426,
    "modShare": 0.134,
    "demTurnoutBasis": 285,
    "repTurnoutBasis": 910
  },
  "29065": {
    "progShare": 0.579,
    "estabShare": 0.421,
    "magaShare": 0.516,
    "relShare": 0.382,
    "modShare": 0.102,
    "demTurnoutBasis": 404,
    "repTurnoutBasis": 1641
  },
  "29067": {
    "progShare": 0.589,
    "estabShare": 0.411,
    "magaShare": 0.53,
    "relShare": 0.39,
    "modShare": 0.08,
    "demTurnoutBasis": 331,
    "repTurnoutBasis": 1570
  },
  "29069": {
    "progShare": 0.382,
    "estabShare": 0.618,
    "magaShare": 0.555,
    "relShare": 0.346,
    "modShare": 0.099,
    "demTurnoutBasis": 596,
    "repTurnoutBasis": 1795
  },
  "29071": {
    "progShare": 0.47,
    "estabShare": 0.53,
    "magaShare": 0.577,
    "relShare": 0.315,
    "modShare": 0.108,
    "demTurnoutBasis": 8409,
    "repTurnoutBasis": 13470
  },
  "29073": {
    "progShare": 0.558,
    "estabShare": 0.442,
    "magaShare": 0.455,
    "relShare": 0.427,
    "modShare": 0.118,
    "demTurnoutBasis": 458,
    "repTurnoutBasis": 1572
  },
  "29075": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.409,
    "relShare": 0.41,
    "modShare": 0.181,
    "demTurnoutBasis": 178,
    "repTurnoutBasis": 535
  },
  "29077": {
    "progShare": 0.615,
    "estabShare": 0.385,
    "magaShare": 0.321,
    "relShare": 0.532,
    "modShare": 0.147,
    "demTurnoutBasis": 14249,
    "repTurnoutBasis": 25920
  },
  "29079": {
    "progShare": 0.545,
    "estabShare": 0.455,
    "magaShare": 0.503,
    "relShare": 0.366,
    "modShare": 0.131,
    "demTurnoutBasis": 246,
    "repTurnoutBasis": 976
  },
  "29081": {
    "progShare": 0.508,
    "estabShare": 0.492,
    "magaShare": 0.465,
    "relShare": 0.383,
    "modShare": 0.152,
    "demTurnoutBasis": 163,
    "repTurnoutBasis": 812
  },
  "29083": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.447,
    "relShare": 0.398,
    "modShare": 0.155,
    "demTurnoutBasis": 755,
    "repTurnoutBasis": 1841
  },
  "29085": {
    "progShare": 0.455,
    "estabShare": 0.545,
    "magaShare": 0.506,
    "relShare": 0.38,
    "modShare": 0.114,
    "demTurnoutBasis": 342,
    "repTurnoutBasis": 1074
  },
  "29087": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.474,
    "relShare": 0.373,
    "modShare": 0.153,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 535
  },
  "29089": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.399,
    "relShare": 0.469,
    "modShare": 0.132,
    "demTurnoutBasis": 424,
    "repTurnoutBasis": 871
  },
  "29091": {
    "progShare": 0.592,
    "estabShare": 0.408,
    "magaShare": 0.502,
    "relShare": 0.393,
    "modShare": 0.105,
    "demTurnoutBasis": 1036,
    "repTurnoutBasis": 4228
  },
  "29093": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.488,
    "relShare": 0.413,
    "modShare": 0.099,
    "demTurnoutBasis": 399,
    "repTurnoutBasis": 819
  },
  "29095": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.388,
    "relShare": 0.428,
    "modShare": 0.184,
    "demTurnoutBasis": 20823,
    "repTurnoutBasis": 27888
  },
  "29097": {
    "progShare": 0.626,
    "estabShare": 0.374,
    "magaShare": 0.325,
    "relShare": 0.551,
    "modShare": 0.124,
    "demTurnoutBasis": 3087,
    "repTurnoutBasis": 10353
  },
  "29099": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.485,
    "relShare": 0.393,
    "modShare": 0.122,
    "demTurnoutBasis": 10946,
    "repTurnoutBasis": 18451
  },
  "29101": {
    "progShare": 0.569,
    "estabShare": 0.431,
    "magaShare": 0.407,
    "relShare": 0.422,
    "modShare": 0.171,
    "demTurnoutBasis": 1731,
    "repTurnoutBasis": 3728
  },
  "29103": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.481,
    "relShare": 0.379,
    "modShare": 0.14,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 359
  },
  "29105": {
    "progShare": 0.557,
    "estabShare": 0.443,
    "magaShare": 0.455,
    "relShare": 0.437,
    "modShare": 0.108,
    "demTurnoutBasis": 846,
    "repTurnoutBasis": 3844
  },
  "29107": {
    "progShare": 0.53,
    "estabShare": 0.47,
    "magaShare": 0.422,
    "relShare": 0.41,
    "modShare": 0.168,
    "demTurnoutBasis": 1269,
    "repTurnoutBasis": 2981
  },
  "29109": {
    "progShare": 0.541,
    "estabShare": 0.459,
    "magaShare": 0.379,
    "relShare": 0.528,
    "modShare": 0.093,
    "demTurnoutBasis": 962,
    "repTurnoutBasis": 4134
  },
  "29111": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.499,
    "relShare": 0.395,
    "modShare": 0.106,
    "demTurnoutBasis": 248,
    "repTurnoutBasis": 803
  },
  "29113": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.47,
    "relShare": 0.438,
    "modShare": 0.092,
    "demTurnoutBasis": 1812,
    "repTurnoutBasis": 4415
  },
  "29115": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.448,
    "relShare": 0.421,
    "modShare": 0.131,
    "demTurnoutBasis": 432,
    "repTurnoutBasis": 1067
  },
  "29117": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.462,
    "relShare": 0.365,
    "modShare": 0.173,
    "demTurnoutBasis": 410,
    "repTurnoutBasis": 1293
  },
  "29119": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.444,
    "relShare": 0.459,
    "modShare": 0.097,
    "demTurnoutBasis": 383,
    "repTurnoutBasis": 1785
  },
  "29121": {
    "progShare": 0.545,
    "estabShare": 0.455,
    "magaShare": 0.464,
    "relShare": 0.406,
    "modShare": 0.13,
    "demTurnoutBasis": 482,
    "repTurnoutBasis": 1606
  },
  "29123": {
    "progShare": 0.491,
    "estabShare": 0.509,
    "magaShare": 0.464,
    "relShare": 0.43,
    "modShare": 0.106,
    "demTurnoutBasis": 351,
    "repTurnoutBasis": 984
  },
  "29125": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.503,
    "relShare": 0.41,
    "modShare": 0.087,
    "demTurnoutBasis": 305,
    "repTurnoutBasis": 952
  },
  "29127": {
    "progShare": 0.433,
    "estabShare": 0.567,
    "magaShare": 0.408,
    "relShare": 0.466,
    "modShare": 0.126,
    "demTurnoutBasis": 845,
    "repTurnoutBasis": 2538
  },
  "29129": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.601,
    "relShare": 0.291,
    "modShare": 0.108,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 379
  },
  "29131": {
    "progShare": 0.526,
    "estabShare": 0.474,
    "magaShare": 0.49,
    "relShare": 0.393,
    "modShare": 0.117,
    "demTurnoutBasis": 465,
    "repTurnoutBasis": 2528
  },
  "29133": {
    "progShare": 0.301,
    "estabShare": 0.699,
    "magaShare": 0.531,
    "relShare": 0.372,
    "modShare": 0.097,
    "demTurnoutBasis": 362,
    "repTurnoutBasis": 916
  },
  "29135": {
    "progShare": 0.546,
    "estabShare": 0.454,
    "magaShare": 0.386,
    "relShare": 0.482,
    "modShare": 0.132,
    "demTurnoutBasis": 381,
    "repTurnoutBasis": 1481
  },
  "29137": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.432,
    "relShare": 0.444,
    "modShare": 0.124,
    "demTurnoutBasis": 249,
    "repTurnoutBasis": 808
  },
  "29139": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.497,
    "relShare": 0.39,
    "modShare": 0.113,
    "demTurnoutBasis": 335,
    "repTurnoutBasis": 1204
  },
  "29141": {
    "progShare": 0.478,
    "estabShare": 0.522,
    "magaShare": 0.519,
    "relShare": 0.368,
    "modShare": 0.113,
    "demTurnoutBasis": 538,
    "repTurnoutBasis": 1908
  },
  "29143": {
    "progShare": 0.343,
    "estabShare": 0.657,
    "magaShare": 0.553,
    "relShare": 0.359,
    "modShare": 0.088,
    "demTurnoutBasis": 538,
    "repTurnoutBasis": 1250
  },
  "29145": {
    "progShare": 0.556,
    "estabShare": 0.444,
    "magaShare": 0.351,
    "relShare": 0.539,
    "modShare": 0.11,
    "demTurnoutBasis": 1412,
    "repTurnoutBasis": 6131
  },
  "29147": {
    "progShare": 0.574,
    "estabShare": 0.426,
    "magaShare": 0.37,
    "relShare": 0.397,
    "modShare": 0.233,
    "demTurnoutBasis": 741,
    "repTurnoutBasis": 1711
  },
  "29149": {
    "progShare": 0.382,
    "estabShare": 0.618,
    "magaShare": 0.646,
    "relShare": 0.275,
    "modShare": 0.079,
    "demTurnoutBasis": 541,
    "repTurnoutBasis": 1278
  },
  "29151": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.448,
    "relShare": 0.43,
    "modShare": 0.122,
    "demTurnoutBasis": 329,
    "repTurnoutBasis": 1463
  },
  "29153": {
    "progShare": 0.575,
    "estabShare": 0.425,
    "magaShare": 0.503,
    "relShare": 0.4,
    "modShare": 0.097,
    "demTurnoutBasis": 258,
    "repTurnoutBasis": 1095
  },
  "29155": {
    "progShare": 0.293,
    "estabShare": 0.707,
    "magaShare": 0.576,
    "relShare": 0.332,
    "modShare": 0.092,
    "demTurnoutBasis": 434,
    "repTurnoutBasis": 1014
  },
  "29157": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.427,
    "relShare": 0.431,
    "modShare": 0.142,
    "demTurnoutBasis": 443,
    "repTurnoutBasis": 1833
  },
  "29159": {
    "progShare": 0.544,
    "estabShare": 0.456,
    "magaShare": 0.453,
    "relShare": 0.387,
    "modShare": 0.16,
    "demTurnoutBasis": 1412,
    "repTurnoutBasis": 3692
  },
  "29161": {
    "progShare": 0.605,
    "estabShare": 0.395,
    "magaShare": 0.452,
    "relShare": 0.412,
    "modShare": 0.136,
    "demTurnoutBasis": 1482,
    "repTurnoutBasis": 3785
  },
  "29163": {
    "progShare": 0.418,
    "estabShare": 0.582,
    "magaShare": 0.461,
    "relShare": 0.428,
    "modShare": 0.111,
    "demTurnoutBasis": 580,
    "repTurnoutBasis": 1342
  },
  "29165": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.372,
    "relShare": 0.405,
    "modShare": 0.223,
    "demTurnoutBasis": 4937,
    "repTurnoutBasis": 7400
  },
  "29167": {
    "progShare": 0.534,
    "estabShare": 0.466,
    "magaShare": 0.345,
    "relShare": 0.542,
    "modShare": 0.113,
    "demTurnoutBasis": 807,
    "repTurnoutBasis": 3255
  },
  "29169": {
    "progShare": 0.453,
    "estabShare": 0.547,
    "magaShare": 0.644,
    "relShare": 0.262,
    "modShare": 0.094,
    "demTurnoutBasis": 1733,
    "repTurnoutBasis": 3778
  },
  "29171": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.529,
    "relShare": 0.316,
    "modShare": 0.155,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 532
  },
  "29173": {
    "progShare": 0.428,
    "estabShare": 0.572,
    "magaShare": 0.47,
    "relShare": 0.423,
    "modShare": 0.107,
    "demTurnoutBasis": 381,
    "repTurnoutBasis": 1027
  },
  "29175": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.455,
    "relShare": 0.419,
    "modShare": 0.126,
    "demTurnoutBasis": 721,
    "repTurnoutBasis": 2075
  },
  "29177": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.442,
    "relShare": 0.432,
    "modShare": 0.126,
    "demTurnoutBasis": 979,
    "repTurnoutBasis": 1771
  },
  "29179": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.586,
    "relShare": 0.334,
    "modShare": 0.08,
    "demTurnoutBasis": 244,
    "repTurnoutBasis": 553
  },
  "29181": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.482,
    "relShare": 0.403,
    "modShare": 0.115,
    "demTurnoutBasis": 265,
    "repTurnoutBasis": 1142
  },
  "29183": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.415,
    "relShare": 0.4,
    "modShare": 0.185,
    "demTurnoutBasis": 19877,
    "repTurnoutBasis": 36742
  },
  "29185": {
    "progShare": 0.485,
    "estabShare": 0.515,
    "magaShare": 0.493,
    "relShare": 0.406,
    "modShare": 0.101,
    "demTurnoutBasis": 341,
    "repTurnoutBasis": 980
  },
  "29186": {
    "progShare": 0.397,
    "estabShare": 0.603,
    "magaShare": 0.59,
    "relShare": 0.312,
    "modShare": 0.098,
    "demTurnoutBasis": 1570,
    "repTurnoutBasis": 1657
  },
  "29187": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.625,
    "relShare": 0.295,
    "modShare": 0.08,
    "demTurnoutBasis": 4108,
    "repTurnoutBasis": 5998
  },
  "29189": {
    "progShare": 0.443,
    "estabShare": 0.557,
    "magaShare": 0.358,
    "relShare": 0.366,
    "modShare": 0.276,
    "demTurnoutBasis": 80975,
    "repTurnoutBasis": 67142
  },
  "29195": {
    "progShare": 0.469,
    "estabShare": 0.531,
    "magaShare": 0.448,
    "relShare": 0.409,
    "modShare": 0.143,
    "demTurnoutBasis": 886,
    "repTurnoutBasis": 1582
  },
  "29197": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.576,
    "relShare": 0.316,
    "modShare": 0.108,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 373
  },
  "29199": {
    "progShare": 0.554,
    "estabShare": 0.446,
    "magaShare": 0.485,
    "relShare": 0.4,
    "modShare": 0.115,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 410
  },
  "29201": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.495,
    "relShare": 0.405,
    "modShare": 0.1,
    "demTurnoutBasis": 971,
    "repTurnoutBasis": 3403
  },
  "29203": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.533,
    "relShare": 0.387,
    "modShare": 0.08,
    "demTurnoutBasis": 313,
    "repTurnoutBasis": 760
  },
  "29205": {
    "progShare": 0.455,
    "estabShare": 0.545,
    "magaShare": 0.425,
    "relShare": 0.424,
    "modShare": 0.151,
    "demTurnoutBasis": 235,
    "repTurnoutBasis": 683
  },
  "29207": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.521,
    "relShare": 0.383,
    "modShare": 0.096,
    "demTurnoutBasis": 595,
    "repTurnoutBasis": 2909
  },
  "29209": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.481,
    "relShare": 0.405,
    "modShare": 0.114,
    "demTurnoutBasis": 866,
    "repTurnoutBasis": 4125
  },
  "29211": {
    "progShare": 0.39,
    "estabShare": 0.61,
    "magaShare": 0.513,
    "relShare": 0.35,
    "modShare": 0.137,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 499
  },
  "29213": {
    "progShare": 0.534,
    "estabShare": 0.466,
    "magaShare": 0.475,
    "relShare": 0.409,
    "modShare": 0.116,
    "demTurnoutBasis": 1304,
    "repTurnoutBasis": 5369
  },
  "29215": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.511,
    "relShare": 0.399,
    "modShare": 0.09,
    "demTurnoutBasis": 651,
    "repTurnoutBasis": 2607
  },
  "29217": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.484,
    "relShare": 0.388,
    "modShare": 0.128,
    "demTurnoutBasis": 514,
    "repTurnoutBasis": 1584
  },
  "29219": {
    "progShare": 0.553,
    "estabShare": 0.447,
    "magaShare": 0.46,
    "relShare": 0.421,
    "modShare": 0.119,
    "demTurnoutBasis": 1121,
    "repTurnoutBasis": 2959
  },
  "29221": {
    "progShare": 0.468,
    "estabShare": 0.532,
    "magaShare": 0.505,
    "relShare": 0.416,
    "modShare": 0.079,
    "demTurnoutBasis": 733,
    "repTurnoutBasis": 1639
  },
  "29223": {
    "progShare": 0.402,
    "estabShare": 0.598,
    "magaShare": 0.546,
    "relShare": 0.361,
    "modShare": 0.093,
    "demTurnoutBasis": 340,
    "repTurnoutBasis": 1267
  },
  "29225": {
    "progShare": 0.457,
    "estabShare": 0.543,
    "magaShare": 0.526,
    "relShare": 0.395,
    "modShare": 0.079,
    "demTurnoutBasis": 1961,
    "repTurnoutBasis": 5367
  },
  "29227": {
    "progShare": 0.563,
    "estabShare": 0.437,
    "magaShare": 0.475,
    "relShare": 0.378,
    "modShare": 0.147,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 238
  },
  "29229": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.463,
    "relShare": 0.458,
    "modShare": 0.079,
    "demTurnoutBasis": 398,
    "repTurnoutBasis": 2030
  },
  "29510": {
    "progShare": 0.446,
    "estabShare": 0.554,
    "magaShare": 0.365,
    "relShare": 0.337,
    "modShare": 0.298,
    "demTurnoutBasis": 31879,
    "repTurnoutBasis": 7008
  },
  "30001": {
    "progShare": 0.57,
    "estabShare": 0.43,
    "magaShare": 0.667,
    "relShare": 0.112,
    "modShare": 0.221,
    "demTurnoutBasis": 295,
    "repTurnoutBasis": 828
  },
  "30003": {
    "progShare": 0.54,
    "estabShare": 0.46,
    "magaShare": 0.78,
    "relShare": 0.121,
    "modShare": 0.099,
    "demTurnoutBasis": 465,
    "repTurnoutBasis": 291
  },
  "30005": {
    "progShare": 0.592,
    "estabShare": 0.408,
    "magaShare": 0.755,
    "relShare": 0.113,
    "modShare": 0.132,
    "demTurnoutBasis": 370,
    "repTurnoutBasis": 209
  },
  "30007": {
    "progShare": 0.575,
    "estabShare": 0.425,
    "magaShare": 0.715,
    "relShare": 0.143,
    "modShare": 0.142,
    "demTurnoutBasis": 248,
    "repTurnoutBasis": 450
  },
  "30009": {
    "progShare": 0.528,
    "estabShare": 0.472,
    "magaShare": 0.747,
    "relShare": 0.119,
    "modShare": 0.134,
    "demTurnoutBasis": 677,
    "repTurnoutBasis": 648
  },
  "30011": {
    "progShare": 0.553,
    "estabShare": 0.447,
    "magaShare": 0.684,
    "relShare": 0.187,
    "modShare": 0.129,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 167
  },
  "30013": {
    "progShare": 0.436,
    "estabShare": 0.564,
    "magaShare": 0.727,
    "relShare": 0.105,
    "modShare": 0.168,
    "demTurnoutBasis": 4625,
    "repTurnoutBasis": 3665
  },
  "30015": {
    "progShare": 0.405,
    "estabShare": 0.595,
    "magaShare": 0.702,
    "relShare": 0.108,
    "modShare": 0.19,
    "demTurnoutBasis": 236,
    "repTurnoutBasis": 405
  },
  "30017": {
    "progShare": 0.449,
    "estabShare": 0.551,
    "magaShare": 0.753,
    "relShare": 0.096,
    "modShare": 0.151,
    "demTurnoutBasis": 469,
    "repTurnoutBasis": 583
  },
  "30019": {
    "progShare": 0.404,
    "estabShare": 0.596,
    "magaShare": 0.731,
    "relShare": 0.079,
    "modShare": 0.19,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "30021": {
    "progShare": 0.506,
    "estabShare": 0.494,
    "magaShare": 0.742,
    "relShare": 0.097,
    "modShare": 0.161,
    "demTurnoutBasis": 247,
    "repTurnoutBasis": 753
  },
  "30023": {
    "progShare": 0.446,
    "estabShare": 0.554,
    "magaShare": 0.785,
    "relShare": 0.109,
    "modShare": 0.106,
    "demTurnoutBasis": 970,
    "repTurnoutBasis": 305
  },
  "30025": {
    "progShare": 0.382,
    "estabShare": 0.618,
    "magaShare": 0.746,
    "relShare": 0.115,
    "modShare": 0.139,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 324
  },
  "30027": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.699,
    "relShare": 0.126,
    "modShare": 0.175,
    "demTurnoutBasis": 409,
    "repTurnoutBasis": 905
  },
  "30029": {
    "progShare": 0.577,
    "estabShare": 0.423,
    "magaShare": 0.741,
    "relShare": 0.105,
    "modShare": 0.154,
    "demTurnoutBasis": 3983,
    "repTurnoutBasis": 5087
  },
  "30031": {
    "progShare": 0.587,
    "estabShare": 0.413,
    "magaShare": 0.625,
    "relShare": 0.163,
    "modShare": 0.212,
    "demTurnoutBasis": 7419,
    "repTurnoutBasis": 4177
  },
  "30033": {
    "progShare": 0.654,
    "estabShare": 0.346,
    "magaShare": 0.773,
    "relShare": 0.121,
    "modShare": 0.106,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "30035": {
    "progShare": 0.539,
    "estabShare": 0.461,
    "magaShare": 0.781,
    "relShare": 0.113,
    "modShare": 0.106,
    "demTurnoutBasis": 1133,
    "repTurnoutBasis": 179
  },
  "30037": {
    "progShare": 0.518,
    "estabShare": 0.482,
    "magaShare": 0.767,
    "relShare": 0.122,
    "modShare": 0.111,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "30039": {
    "progShare": 0.61,
    "estabShare": 0.39,
    "magaShare": 0.715,
    "relShare": 0.121,
    "modShare": 0.164,
    "demTurnoutBasis": 184,
    "repTurnoutBasis": 219
  },
  "30041": {
    "progShare": 0.502,
    "estabShare": 0.498,
    "magaShare": 0.743,
    "relShare": 0.093,
    "modShare": 0.164,
    "demTurnoutBasis": 942,
    "repTurnoutBasis": 590
  },
  "30043": {
    "progShare": 0.524,
    "estabShare": 0.476,
    "magaShare": 0.711,
    "relShare": 0.146,
    "modShare": 0.143,
    "demTurnoutBasis": 786,
    "repTurnoutBasis": 738
  },
  "30045": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.667,
    "relShare": 0.12,
    "modShare": 0.213,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 209
  },
  "30047": {
    "progShare": 0.547,
    "estabShare": 0.453,
    "magaShare": 0.735,
    "relShare": 0.109,
    "modShare": 0.156,
    "demTurnoutBasis": 1528,
    "repTurnoutBasis": 1281
  },
  "30051": {
    "progShare": 0.487,
    "estabShare": 0.513,
    "magaShare": 0.714,
    "relShare": 0.108,
    "modShare": 0.178,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 178
  },
  "30053": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.814,
    "relShare": 0.086,
    "modShare": 0.1,
    "demTurnoutBasis": 791,
    "repTurnoutBasis": 1224
  },
  "30055": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.815,
    "relShare": 0.106,
    "modShare": 0.079,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 165
  },
  "30057": {
    "progShare": 0.536,
    "estabShare": 0.464,
    "magaShare": 0.678,
    "relShare": 0.113,
    "modShare": 0.209,
    "demTurnoutBasis": 350,
    "repTurnoutBasis": 658
  },
  "30059": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.763,
    "relShare": 0.094,
    "modShare": 0.143,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 167
  },
  "30061": {
    "progShare": 0.554,
    "estabShare": 0.446,
    "magaShare": 0.71,
    "relShare": 0.116,
    "modShare": 0.174,
    "demTurnoutBasis": 202,
    "repTurnoutBasis": 297
  },
  "30063": {
    "progShare": 0.628,
    "estabShare": 0.372,
    "magaShare": 0.697,
    "relShare": 0.132,
    "modShare": 0.171,
    "demTurnoutBasis": 11365,
    "repTurnoutBasis": 3498
  },
  "30065": {
    "progShare": 0.558,
    "estabShare": 0.442,
    "magaShare": 0.776,
    "relShare": 0.128,
    "modShare": 0.096,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 443
  },
  "30067": {
    "progShare": 0.624,
    "estabShare": 0.376,
    "magaShare": 0.727,
    "relShare": 0.122,
    "modShare": 0.151,
    "demTurnoutBasis": 1244,
    "repTurnoutBasis": 856
  },
  "30069": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.801,
    "relShare": 0.079,
    "modShare": 0.12,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "30071": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.795,
    "relShare": 0.085,
    "modShare": 0.12,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 468
  },
  "30073": {
    "progShare": 0.48,
    "estabShare": 0.52,
    "magaShare": 0.724,
    "relShare": 0.11,
    "modShare": 0.166,
    "demTurnoutBasis": 259,
    "repTurnoutBasis": 426
  },
  "30075": {
    "progShare": 0.586,
    "estabShare": 0.414,
    "magaShare": 0.761,
    "relShare": 0.099,
    "modShare": 0.14,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 220
  },
  "30077": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.736,
    "relShare": 0.131,
    "modShare": 0.133,
    "demTurnoutBasis": 245,
    "repTurnoutBasis": 356
  },
  "30079": {
    "progShare": 0.478,
    "estabShare": 0.522,
    "magaShare": 0.723,
    "relShare": 0.135,
    "modShare": 0.142,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "30081": {
    "progShare": 0.538,
    "estabShare": 0.462,
    "magaShare": 0.67,
    "relShare": 0.169,
    "modShare": 0.161,
    "demTurnoutBasis": 2075,
    "repTurnoutBasis": 2984
  },
  "30083": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.742,
    "relShare": 0.11,
    "modShare": 0.148,
    "demTurnoutBasis": 200,
    "repTurnoutBasis": 629
  },
  "30085": {
    "progShare": 0.557,
    "estabShare": 0.443,
    "magaShare": 0.8,
    "relShare": 0.104,
    "modShare": 0.096,
    "demTurnoutBasis": 384,
    "repTurnoutBasis": 294
  },
  "30087": {
    "progShare": 0.592,
    "estabShare": 0.408,
    "magaShare": 0.795,
    "relShare": 0.104,
    "modShare": 0.101,
    "demTurnoutBasis": 331,
    "repTurnoutBasis": 393
  },
  "30089": {
    "progShare": 0.594,
    "estabShare": 0.406,
    "magaShare": 0.756,
    "relShare": 0.113,
    "modShare": 0.131,
    "demTurnoutBasis": 530,
    "repTurnoutBasis": 851
  },
  "30091": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.738,
    "relShare": 0.08,
    "modShare": 0.182,
    "demTurnoutBasis": 179,
    "repTurnoutBasis": 222
  },
  "30093": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.722,
    "relShare": 0.116,
    "modShare": 0.162,
    "demTurnoutBasis": 4065,
    "repTurnoutBasis": 1202
  },
  "30095": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.728,
    "relShare": 0.132,
    "modShare": 0.14,
    "demTurnoutBasis": 314,
    "repTurnoutBasis": 733
  },
  "30097": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.711,
    "relShare": 0.131,
    "modShare": 0.158,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 311
  },
  "30099": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.732,
    "relShare": 0.122,
    "modShare": 0.146,
    "demTurnoutBasis": 462,
    "repTurnoutBasis": 392
  },
  "30101": {
    "progShare": 0.453,
    "estabShare": 0.547,
    "magaShare": 0.713,
    "relShare": 0.092,
    "modShare": 0.195,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 405
  },
  "30103": {
    "progShare": 0.558,
    "estabShare": 0.442,
    "magaShare": 0.746,
    "relShare": 0.109,
    "modShare": 0.145,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "30105": {
    "progShare": 0.496,
    "estabShare": 0.504,
    "magaShare": 0.714,
    "relShare": 0.129,
    "modShare": 0.157,
    "demTurnoutBasis": 369,
    "repTurnoutBasis": 569
  },
  "30107": {
    "progShare": 0.52,
    "estabShare": 0.48,
    "magaShare": 0.752,
    "relShare": 0.099,
    "modShare": 0.149,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 170
  },
  "30109": {
    "progShare": 0.308,
    "estabShare": 0.692,
    "magaShare": 0.753,
    "relShare": 0.119,
    "modShare": 0.128,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "30111": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.686,
    "relShare": 0.138,
    "modShare": 0.176,
    "demTurnoutBasis": 7978,
    "repTurnoutBasis": 8505
  },
  "31001": {
    "progShare": 0.503,
    "estabShare": 0.497,
    "magaShare": 0.541,
    "relShare": 0.276,
    "modShare": 0.183,
    "demTurnoutBasis": 787,
    "repTurnoutBasis": 1502
  },
  "31003": {
    "progShare": 0.619,
    "estabShare": 0.381,
    "magaShare": 0.568,
    "relShare": 0.31,
    "modShare": 0.122,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 398
  },
  "31005": {
    "progShare": 0.85,
    "estabShare": 0.15,
    "magaShare": 0.474,
    "relShare": 0.409,
    "modShare": 0.117,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31007": {
    "progShare": 0.286,
    "estabShare": 0.714,
    "magaShare": 0.523,
    "relShare": 0.39,
    "modShare": 0.087,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31009": {
    "progShare": 0.308,
    "estabShare": 0.692,
    "magaShare": 0.696,
    "relShare": 0.216,
    "modShare": 0.088,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31011": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.548,
    "relShare": 0.245,
    "modShare": 0.207,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 392
  },
  "31013": {
    "progShare": 0.565,
    "estabShare": 0.435,
    "magaShare": 0.605,
    "relShare": 0.239,
    "modShare": 0.156,
    "demTurnoutBasis": 223,
    "repTurnoutBasis": 588
  },
  "31015": {
    "progShare": 0.545,
    "estabShare": 0.455,
    "magaShare": 0.611,
    "relShare": 0.243,
    "modShare": 0.146,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 159
  },
  "31017": {
    "progShare": 0.582,
    "estabShare": 0.418,
    "magaShare": 0.705,
    "relShare": 0.204,
    "modShare": 0.091,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 240
  },
  "31019": {
    "progShare": 0.508,
    "estabShare": 0.492,
    "magaShare": 0.553,
    "relShare": 0.278,
    "modShare": 0.169,
    "demTurnoutBasis": 697,
    "repTurnoutBasis": 1979
  },
  "31021": {
    "progShare": 0.428,
    "estabShare": 0.572,
    "magaShare": 0.583,
    "relShare": 0.23,
    "modShare": 0.187,
    "demTurnoutBasis": 181,
    "repTurnoutBasis": 306
  },
  "31023": {
    "progShare": 0.599,
    "estabShare": 0.401,
    "magaShare": 0.535,
    "relShare": 0.312,
    "modShare": 0.153,
    "demTurnoutBasis": 267,
    "repTurnoutBasis": 494
  },
  "31025": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.524,
    "relShare": 0.328,
    "modShare": 0.148,
    "demTurnoutBasis": 563,
    "repTurnoutBasis": 997
  },
  "31027": {
    "progShare": 0.587,
    "estabShare": 0.413,
    "magaShare": 0.455,
    "relShare": 0.353,
    "modShare": 0.192,
    "demTurnoutBasis": 198,
    "repTurnoutBasis": 479
  },
  "31029": {
    "progShare": 0.547,
    "estabShare": 0.453,
    "magaShare": 0.643,
    "relShare": 0.236,
    "modShare": 0.121,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 222
  },
  "31031": {
    "progShare": 0.539,
    "estabShare": 0.461,
    "magaShare": 0.596,
    "relShare": 0.292,
    "modShare": 0.112,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 603
  },
  "31033": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.611,
    "relShare": 0.257,
    "modShare": 0.132,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 551
  },
  "31035": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.608,
    "relShare": 0.276,
    "modShare": 0.116,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 324
  },
  "31037": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.588,
    "relShare": 0.256,
    "modShare": 0.156,
    "demTurnoutBasis": 163,
    "repTurnoutBasis": 248
  },
  "31039": {
    "progShare": 0.553,
    "estabShare": 0.447,
    "magaShare": 0.571,
    "relShare": 0.256,
    "modShare": 0.173,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 393
  },
  "31041": {
    "progShare": 0.516,
    "estabShare": 0.484,
    "magaShare": 0.564,
    "relShare": 0.332,
    "modShare": 0.104,
    "demTurnoutBasis": 174,
    "repTurnoutBasis": 689
  },
  "31043": {
    "progShare": 0.397,
    "estabShare": 0.603,
    "magaShare": 0.598,
    "relShare": 0.261,
    "modShare": 0.141,
    "demTurnoutBasis": 397,
    "repTurnoutBasis": 408
  },
  "31045": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.543,
    "relShare": 0.302,
    "modShare": 0.155,
    "demTurnoutBasis": 164,
    "repTurnoutBasis": 449
  },
  "31047": {
    "progShare": 0.493,
    "estabShare": 0.507,
    "magaShare": 0.583,
    "relShare": 0.261,
    "modShare": 0.156,
    "demTurnoutBasis": 287,
    "repTurnoutBasis": 984
  },
  "31049": {
    "progShare": 0.667,
    "estabShare": 0.333,
    "magaShare": 0.712,
    "relShare": 0.182,
    "modShare": 0.106,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31051": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.486,
    "relShare": 0.335,
    "modShare": 0.179,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 300
  },
  "31053": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.579,
    "relShare": 0.241,
    "modShare": 0.18,
    "demTurnoutBasis": 823,
    "repTurnoutBasis": 1409
  },
  "31055": {
    "progShare": 0.44,
    "estabShare": 0.56,
    "magaShare": 0.545,
    "relShare": 0.248,
    "modShare": 0.207,
    "demTurnoutBasis": 11474,
    "repTurnoutBasis": 12973
  },
  "31057": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.605,
    "relShare": 0.279,
    "modShare": 0.116,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31059": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.549,
    "relShare": 0.268,
    "modShare": 0.183,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 305
  },
  "31061": {
    "progShare": 0.538,
    "estabShare": 0.462,
    "magaShare": 0.661,
    "relShare": 0.222,
    "modShare": 0.117,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 152
  },
  "31063": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.643,
    "relShare": 0.231,
    "modShare": 0.126,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31065": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.612,
    "relShare": 0.251,
    "modShare": 0.137,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 266
  },
  "31067": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.462,
    "relShare": 0.333,
    "modShare": 0.205,
    "demTurnoutBasis": 550,
    "repTurnoutBasis": 863
  },
  "31069": {
    "progShare": 0.519,
    "estabShare": 0.481,
    "magaShare": 0.705,
    "relShare": 0.21,
    "modShare": 0.085,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 161
  },
  "31071": {
    "progShare": 0.551,
    "estabShare": 0.449,
    "magaShare": 0.581,
    "relShare": 0.301,
    "modShare": 0.118,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31073": {
    "progShare": 0.524,
    "estabShare": 0.476,
    "magaShare": 0.618,
    "relShare": 0.219,
    "modShare": 0.163,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31075": {
    "progShare": 0.75,
    "estabShare": 0.25,
    "magaShare": 0.633,
    "relShare": 0.285,
    "modShare": 0.082,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31077": {
    "progShare": 0.712,
    "estabShare": 0.288,
    "magaShare": 0.446,
    "relShare": 0.384,
    "modShare": 0.17,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31079": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.572,
    "relShare": 0.242,
    "modShare": 0.186,
    "demTurnoutBasis": 1249,
    "repTurnoutBasis": 1967
  },
  "31081": {
    "progShare": 0.48,
    "estabShare": 0.52,
    "magaShare": 0.458,
    "relShare": 0.378,
    "modShare": 0.164,
    "demTurnoutBasis": 167,
    "repTurnoutBasis": 634
  },
  "31083": {
    "progShare": 0.584,
    "estabShare": 0.416,
    "magaShare": 0.538,
    "relShare": 0.307,
    "modShare": 0.155,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 235
  },
  "31085": {
    "progShare": 0.364,
    "estabShare": 0.636,
    "magaShare": 0.577,
    "relShare": 0.329,
    "modShare": 0.094,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31087": {
    "progShare": 0.492,
    "estabShare": 0.508,
    "magaShare": 0.641,
    "relShare": 0.26,
    "modShare": 0.099,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31089": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.606,
    "relShare": 0.266,
    "modShare": 0.128,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 643
  },
  "31091": {
    "progShare": 0.429,
    "estabShare": 0.571,
    "magaShare": 0.616,
    "relShare": 0.283,
    "modShare": 0.101,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31093": {
    "progShare": 0.544,
    "estabShare": 0.456,
    "magaShare": 0.565,
    "relShare": 0.274,
    "modShare": 0.161,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 276
  },
  "31095": {
    "progShare": 0.523,
    "estabShare": 0.477,
    "magaShare": 0.553,
    "relShare": 0.284,
    "modShare": 0.163,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 280
  },
  "31097": {
    "progShare": 0.517,
    "estabShare": 0.483,
    "magaShare": 0.55,
    "relShare": 0.274,
    "modShare": 0.176,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 173
  },
  "31099": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.574,
    "relShare": 0.298,
    "modShare": 0.128,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 315
  },
  "31101": {
    "progShare": 0.585,
    "estabShare": 0.415,
    "magaShare": 0.622,
    "relShare": 0.246,
    "modShare": 0.132,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 601
  },
  "31103": {
    "progShare": 0.545,
    "estabShare": 0.455,
    "magaShare": 0.675,
    "relShare": 0.237,
    "modShare": 0.088,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31105": {
    "progShare": 0.623,
    "estabShare": 0.377,
    "magaShare": 0.646,
    "relShare": 0.246,
    "modShare": 0.108,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 206
  },
  "31107": {
    "progShare": 0.553,
    "estabShare": 0.447,
    "magaShare": 0.544,
    "relShare": 0.303,
    "modShare": 0.153,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 342
  },
  "31109": {
    "progShare": 0.457,
    "estabShare": 0.543,
    "magaShare": 0.408,
    "relShare": 0.341,
    "modShare": 0.251,
    "demTurnoutBasis": 11275,
    "repTurnoutBasis": 9071
  },
  "31111": {
    "progShare": 0.493,
    "estabShare": 0.507,
    "magaShare": 0.588,
    "relShare": 0.285,
    "modShare": 0.127,
    "demTurnoutBasis": 656,
    "repTurnoutBasis": 1627
  },
  "31113": {
    "progShare": 0.4,
    "estabShare": 0.6,
    "magaShare": 0.536,
    "relShare": 0.385,
    "modShare": 0.079,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31115": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.611,
    "relShare": 0.262,
    "modShare": 0.127,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31117": {
    "progShare": 0.643,
    "estabShare": 0.357,
    "magaShare": 0.534,
    "relShare": 0.348,
    "modShare": 0.118,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31119": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.523,
    "relShare": 0.314,
    "modShare": 0.163,
    "demTurnoutBasis": 362,
    "repTurnoutBasis": 1257
  },
  "31121": {
    "progShare": 0.528,
    "estabShare": 0.472,
    "magaShare": 0.506,
    "relShare": 0.349,
    "modShare": 0.145,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 441
  },
  "31123": {
    "progShare": 0.491,
    "estabShare": 0.509,
    "magaShare": 0.631,
    "relShare": 0.247,
    "modShare": 0.122,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 331
  },
  "31125": {
    "progShare": 0.494,
    "estabShare": 0.506,
    "magaShare": 0.617,
    "relShare": 0.23,
    "modShare": 0.153,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31127": {
    "progShare": 0.519,
    "estabShare": 0.481,
    "magaShare": 0.484,
    "relShare": 0.343,
    "modShare": 0.173,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 281
  },
  "31129": {
    "progShare": 0.527,
    "estabShare": 0.473,
    "magaShare": 0.619,
    "relShare": 0.26,
    "modShare": 0.121,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 216
  },
  "31131": {
    "progShare": 0.504,
    "estabShare": 0.496,
    "magaShare": 0.507,
    "relShare": 0.302,
    "modShare": 0.191,
    "demTurnoutBasis": 351,
    "repTurnoutBasis": 714
  },
  "31133": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.554,
    "relShare": 0.261,
    "modShare": 0.185,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31135": {
    "progShare": 0.486,
    "estabShare": 0.514,
    "magaShare": 0.501,
    "relShare": 0.347,
    "modShare": 0.152,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 192
  },
  "31137": {
    "progShare": 0.568,
    "estabShare": 0.432,
    "magaShare": 0.531,
    "relShare": 0.303,
    "modShare": 0.166,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 525
  },
  "31139": {
    "progShare": 0.59,
    "estabShare": 0.41,
    "magaShare": 0.572,
    "relShare": 0.283,
    "modShare": 0.145,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 316
  },
  "31141": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.567,
    "relShare": 0.265,
    "modShare": 0.168,
    "demTurnoutBasis": 518,
    "repTurnoutBasis": 1501
  },
  "31143": {
    "progShare": 0.465,
    "estabShare": 0.535,
    "magaShare": 0.49,
    "relShare": 0.315,
    "modShare": 0.195,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 254
  },
  "31145": {
    "progShare": 0.517,
    "estabShare": 0.483,
    "magaShare": 0.627,
    "relShare": 0.239,
    "modShare": 0.134,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 561
  },
  "31147": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.581,
    "relShare": 0.263,
    "modShare": 0.156,
    "demTurnoutBasis": 181,
    "repTurnoutBasis": 355
  },
  "31149": {
    "progShare": 0.667,
    "estabShare": 0.333,
    "magaShare": 0.604,
    "relShare": 0.275,
    "modShare": 0.121,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 151
  },
  "31151": {
    "progShare": 0.496,
    "estabShare": 0.504,
    "magaShare": 0.531,
    "relShare": 0.304,
    "modShare": 0.165,
    "demTurnoutBasis": 342,
    "repTurnoutBasis": 306
  },
  "31153": {
    "progShare": 0.449,
    "estabShare": 0.551,
    "magaShare": 0.537,
    "relShare": 0.279,
    "modShare": 0.184,
    "demTurnoutBasis": 2332,
    "repTurnoutBasis": 5114
  },
  "31155": {
    "progShare": 0.542,
    "estabShare": 0.458,
    "magaShare": 0.541,
    "relShare": 0.29,
    "modShare": 0.169,
    "demTurnoutBasis": 380,
    "repTurnoutBasis": 952
  },
  "31157": {
    "progShare": 0.45,
    "estabShare": 0.55,
    "magaShare": 0.543,
    "relShare": 0.294,
    "modShare": 0.163,
    "demTurnoutBasis": 397,
    "repTurnoutBasis": 1285
  },
  "31159": {
    "progShare": 0.47,
    "estabShare": 0.53,
    "magaShare": 0.44,
    "relShare": 0.374,
    "modShare": 0.186,
    "demTurnoutBasis": 222,
    "repTurnoutBasis": 598
  },
  "31161": {
    "progShare": 0.684,
    "estabShare": 0.316,
    "magaShare": 0.681,
    "relShare": 0.227,
    "modShare": 0.092,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 360
  },
  "31163": {
    "progShare": 0.583,
    "estabShare": 0.417,
    "magaShare": 0.601,
    "relShare": 0.23,
    "modShare": 0.169,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31165": {
    "progShare": 0.4,
    "estabShare": 0.6,
    "magaShare": 0.519,
    "relShare": 0.354,
    "modShare": 0.127,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31167": {
    "progShare": 0.614,
    "estabShare": 0.386,
    "magaShare": 0.486,
    "relShare": 0.345,
    "modShare": 0.169,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 316
  },
  "31169": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.534,
    "relShare": 0.282,
    "modShare": 0.184,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 255
  },
  "31171": {
    "progShare": 0.611,
    "estabShare": 0.389,
    "magaShare": 0.677,
    "relShare": 0.21,
    "modShare": 0.113,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31173": {
    "progShare": 0.535,
    "estabShare": 0.465,
    "magaShare": 0.573,
    "relShare": 0.272,
    "modShare": 0.155,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31175": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.597,
    "relShare": 0.28,
    "modShare": 0.123,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 255
  },
  "31177": {
    "progShare": 0.429,
    "estabShare": 0.571,
    "magaShare": 0.555,
    "relShare": 0.268,
    "modShare": 0.177,
    "demTurnoutBasis": 436,
    "repTurnoutBasis": 1207
  },
  "31179": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.481,
    "relShare": 0.302,
    "modShare": 0.217,
    "demTurnoutBasis": 174,
    "repTurnoutBasis": 417
  },
  "31181": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.628,
    "relShare": 0.269,
    "modShare": 0.103,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 178
  },
  "31183": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.525,
    "relShare": 0.261,
    "modShare": 0.214,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "31185": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.516,
    "relShare": 0.321,
    "modShare": 0.163,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 584
  },
  "32001": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32003": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 4459,
    "repTurnoutBasis": 150
  },
  "32005": {
    "progShare": 0.459,
    "estabShare": 0.541,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32007": {
    "progShare": 0.568,
    "estabShare": 0.432,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32009": {
    "progShare": 0.682,
    "estabShare": 0.318,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32011": {
    "progShare": 0.85,
    "estabShare": 0.15,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32013": {
    "progShare": 0.662,
    "estabShare": 0.338,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32015": {
    "progShare": 0.706,
    "estabShare": 0.294,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32017": {
    "progShare": 0.397,
    "estabShare": 0.603,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32019": {
    "progShare": 0.524,
    "estabShare": 0.476,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32021": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32023": {
    "progShare": 0.435,
    "estabShare": 0.565,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32027": {
    "progShare": 0.508,
    "estabShare": 0.492,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32029": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32031": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 960,
    "repTurnoutBasis": 150
  },
  "32033": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "32510": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "33001": {
    "progShare": 0.402,
    "estabShare": 0.598,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 5552,
    "repTurnoutBasis": 150
  },
  "33003": {
    "progShare": 0.392,
    "estabShare": 0.608,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 5445,
    "repTurnoutBasis": 150
  },
  "33005": {
    "progShare": 0.503,
    "estabShare": 0.497,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 9374,
    "repTurnoutBasis": 150
  },
  "33007": {
    "progShare": 0.473,
    "estabShare": 0.527,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 2607,
    "repTurnoutBasis": 150
  },
  "33009": {
    "progShare": 0.491,
    "estabShare": 0.509,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 11926,
    "repTurnoutBasis": 150
  },
  "33011": {
    "progShare": 0.436,
    "estabShare": 0.564,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 41639,
    "repTurnoutBasis": 150
  },
  "33013": {
    "progShare": 0.422,
    "estabShare": 0.578,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 17449,
    "repTurnoutBasis": 150
  },
  "33015": {
    "progShare": 0.405,
    "estabShare": 0.595,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 33167,
    "repTurnoutBasis": 150
  },
  "33017": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 14665,
    "repTurnoutBasis": 150
  },
  "33019": {
    "progShare": 0.453,
    "estabShare": 0.547,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 4352,
    "repTurnoutBasis": 150
  },
  "34001": {
    "progShare": 0.394,
    "estabShare": 0.606,
    "magaShare": 0.758,
    "relShare": 0.092,
    "modShare": 0.15,
    "demTurnoutBasis": 11181,
    "repTurnoutBasis": 5010
  },
  "34003": {
    "progShare": 0.365,
    "estabShare": 0.635,
    "magaShare": 0.758,
    "relShare": 0.08,
    "modShare": 0.162,
    "demTurnoutBasis": 45157,
    "repTurnoutBasis": 14529
  },
  "34005": {
    "progShare": 0.37,
    "estabShare": 0.63,
    "magaShare": 0.698,
    "relShare": 0.093,
    "modShare": 0.209,
    "demTurnoutBasis": 26314,
    "repTurnoutBasis": 9240
  },
  "34007": {
    "progShare": 0.377,
    "estabShare": 0.623,
    "magaShare": 0.684,
    "relShare": 0.125,
    "modShare": 0.191,
    "demTurnoutBasis": 35653,
    "repTurnoutBasis": 5966
  },
  "34009": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.732,
    "relShare": 0.09,
    "modShare": 0.178,
    "demTurnoutBasis": 3619,
    "repTurnoutBasis": 3514
  },
  "34011": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.775,
    "relShare": 0.096,
    "modShare": 0.129,
    "demTurnoutBasis": 5371,
    "repTurnoutBasis": 1996
  },
  "34013": {
    "progShare": 0.269,
    "estabShare": 0.731,
    "magaShare": 0.728,
    "relShare": 0.08,
    "modShare": 0.192,
    "demTurnoutBasis": 53258,
    "repTurnoutBasis": 4975
  },
  "34015": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.741,
    "relShare": 0.102,
    "modShare": 0.157,
    "demTurnoutBasis": 16047,
    "repTurnoutBasis": 4948
  },
  "34017": {
    "progShare": 0.337,
    "estabShare": 0.663,
    "magaShare": 0.734,
    "relShare": 0.122,
    "modShare": 0.144,
    "demTurnoutBasis": 38345,
    "repTurnoutBasis": 2777
  },
  "34019": {
    "progShare": 0.481,
    "estabShare": 0.519,
    "magaShare": 0.686,
    "relShare": 0.079,
    "modShare": 0.235,
    "demTurnoutBasis": 5578,
    "repTurnoutBasis": 5474
  },
  "34021": {
    "progShare": 0.34,
    "estabShare": 0.66,
    "magaShare": 0.661,
    "relShare": 0.096,
    "modShare": 0.243,
    "demTurnoutBasis": 22463,
    "repTurnoutBasis": 3968
  },
  "34023": {
    "progShare": 0.39,
    "estabShare": 0.61,
    "magaShare": 0.786,
    "relShare": 0.079,
    "modShare": 0.135,
    "demTurnoutBasis": 39501,
    "repTurnoutBasis": 8337
  },
  "34025": {
    "progShare": 0.419,
    "estabShare": 0.581,
    "magaShare": 0.783,
    "relShare": 0.079,
    "modShare": 0.138,
    "demTurnoutBasis": 26664,
    "repTurnoutBasis": 13941
  },
  "34027": {
    "progShare": 0.417,
    "estabShare": 0.583,
    "magaShare": 0.686,
    "relShare": 0.08,
    "modShare": 0.234,
    "demTurnoutBasis": 20820,
    "repTurnoutBasis": 16918
  },
  "34029": {
    "progShare": 0.455,
    "estabShare": 0.545,
    "magaShare": 0.822,
    "relShare": 0.08,
    "modShare": 0.098,
    "demTurnoutBasis": 18044,
    "repTurnoutBasis": 16976
  },
  "34031": {
    "progShare": 0.324,
    "estabShare": 0.676,
    "magaShare": 0.796,
    "relShare": 0.082,
    "modShare": 0.122,
    "demTurnoutBasis": 22177,
    "repTurnoutBasis": 6602
  },
  "34033": {
    "progShare": 0.435,
    "estabShare": 0.565,
    "magaShare": 0.718,
    "relShare": 0.127,
    "modShare": 0.155,
    "demTurnoutBasis": 2498,
    "repTurnoutBasis": 1283
  },
  "34035": {
    "progShare": 0.384,
    "estabShare": 0.616,
    "magaShare": 0.685,
    "relShare": 0.08,
    "modShare": 0.235,
    "demTurnoutBasis": 16112,
    "repTurnoutBasis": 7500
  },
  "34037": {
    "progShare": 0.571,
    "estabShare": 0.429,
    "magaShare": 0.76,
    "relShare": 0.089,
    "modShare": 0.151,
    "demTurnoutBasis": 4645,
    "repTurnoutBasis": 5742
  },
  "34039": {
    "progShare": 0.312,
    "estabShare": 0.688,
    "magaShare": 0.682,
    "relShare": 0.08,
    "modShare": 0.238,
    "demTurnoutBasis": 30229,
    "repTurnoutBasis": 5530
  },
  "34041": {
    "progShare": 0.51,
    "estabShare": 0.49,
    "magaShare": 0.764,
    "relShare": 0.082,
    "modShare": 0.154,
    "demTurnoutBasis": 3483,
    "repTurnoutBasis": 4089
  },
  "35001": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.6,
    "relShare": 0.201,
    "modShare": 0.199,
    "demTurnoutBasis": 37838,
    "repTurnoutBasis": 10483
  },
  "35003": {
    "progShare": 0.612,
    "estabShare": 0.388,
    "magaShare": 0.737,
    "relShare": 0.184,
    "modShare": 0.079,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 210
  },
  "35005": {
    "progShare": 0.435,
    "estabShare": 0.565,
    "magaShare": 0.704,
    "relShare": 0.199,
    "modShare": 0.097,
    "demTurnoutBasis": 1095,
    "repTurnoutBasis": 1568
  },
  "35006": {
    "progShare": 0.485,
    "estabShare": 0.515,
    "magaShare": 0.645,
    "relShare": 0.243,
    "modShare": 0.112,
    "demTurnoutBasis": 1547,
    "repTurnoutBasis": 314
  },
  "35007": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.622,
    "relShare": 0.238,
    "modShare": 0.14,
    "demTurnoutBasis": 846,
    "repTurnoutBasis": 273
  },
  "35009": {
    "progShare": 0.532,
    "estabShare": 0.468,
    "magaShare": 0.718,
    "relShare": 0.194,
    "modShare": 0.088,
    "demTurnoutBasis": 723,
    "repTurnoutBasis": 1106
  },
  "35011": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.692,
    "relShare": 0.199,
    "modShare": 0.109,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "35013": {
    "progShare": 0.444,
    "estabShare": 0.556,
    "magaShare": 0.594,
    "relShare": 0.227,
    "modShare": 0.179,
    "demTurnoutBasis": 8292,
    "repTurnoutBasis": 2448
  },
  "35015": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.717,
    "relShare": 0.197,
    "modShare": 0.086,
    "demTurnoutBasis": 1456,
    "repTurnoutBasis": 1458
  },
  "35017": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.687,
    "relShare": 0.199,
    "modShare": 0.114,
    "demTurnoutBasis": 2272,
    "repTurnoutBasis": 554
  },
  "35019": {
    "progShare": 0.454,
    "estabShare": 0.546,
    "magaShare": 0.517,
    "relShare": 0.384,
    "modShare": 0.099,
    "demTurnoutBasis": 366,
    "repTurnoutBasis": 150
  },
  "35021": {
    "progShare": 0.38,
    "estabShare": 0.62,
    "magaShare": 0.586,
    "relShare": 0.307,
    "modShare": 0.107,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "35023": {
    "progShare": 0.385,
    "estabShare": 0.615,
    "magaShare": 0.711,
    "relShare": 0.21,
    "modShare": 0.079,
    "demTurnoutBasis": 420,
    "repTurnoutBasis": 150
  },
  "35025": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.722,
    "relShare": 0.198,
    "modShare": 0.08,
    "demTurnoutBasis": 679,
    "repTurnoutBasis": 1322
  },
  "35027": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.727,
    "relShare": 0.166,
    "modShare": 0.107,
    "demTurnoutBasis": 522,
    "repTurnoutBasis": 922
  },
  "35028": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.418,
    "relShare": 0.239,
    "modShare": 0.343,
    "demTurnoutBasis": 1419,
    "repTurnoutBasis": 525
  },
  "35029": {
    "progShare": 0.438,
    "estabShare": 0.562,
    "magaShare": 0.71,
    "relShare": 0.164,
    "modShare": 0.126,
    "demTurnoutBasis": 816,
    "repTurnoutBasis": 484
  },
  "35031": {
    "progShare": 0.409,
    "estabShare": 0.591,
    "magaShare": 0.464,
    "relShare": 0.324,
    "modShare": 0.212,
    "demTurnoutBasis": 4113,
    "repTurnoutBasis": 469
  },
  "35033": {
    "progShare": 0.38,
    "estabShare": 0.62,
    "magaShare": 0.529,
    "relShare": 0.35,
    "modShare": 0.121,
    "demTurnoutBasis": 794,
    "repTurnoutBasis": 150
  },
  "35035": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.662,
    "relShare": 0.216,
    "modShare": 0.122,
    "demTurnoutBasis": 1276,
    "repTurnoutBasis": 1505
  },
  "35037": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.697,
    "relShare": 0.201,
    "modShare": 0.102,
    "demTurnoutBasis": 460,
    "repTurnoutBasis": 305
  },
  "35039": {
    "progShare": 0.4,
    "estabShare": 0.6,
    "magaShare": 0.569,
    "relShare": 0.261,
    "modShare": 0.17,
    "demTurnoutBasis": 4202,
    "repTurnoutBasis": 243
  },
  "35041": {
    "progShare": 0.582,
    "estabShare": 0.418,
    "magaShare": 0.682,
    "relShare": 0.209,
    "modShare": 0.109,
    "demTurnoutBasis": 337,
    "repTurnoutBasis": 429
  },
  "35043": {
    "progShare": 0.483,
    "estabShare": 0.517,
    "magaShare": 0.643,
    "relShare": 0.21,
    "modShare": 0.147,
    "demTurnoutBasis": 7249,
    "repTurnoutBasis": 2650
  },
  "35045": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.642,
    "relShare": 0.237,
    "modShare": 0.121,
    "demTurnoutBasis": 2976,
    "repTurnoutBasis": 2692
  },
  "35047": {
    "progShare": 0.407,
    "estabShare": 0.593,
    "magaShare": 0.53,
    "relShare": 0.321,
    "modShare": 0.149,
    "demTurnoutBasis": 2904,
    "repTurnoutBasis": 190
  },
  "35049": {
    "progShare": 0.494,
    "estabShare": 0.506,
    "magaShare": 0.565,
    "relShare": 0.21,
    "modShare": 0.225,
    "demTurnoutBasis": 15954,
    "repTurnoutBasis": 1482
  },
  "35051": {
    "progShare": 0.57,
    "estabShare": 0.43,
    "magaShare": 0.771,
    "relShare": 0.134,
    "modShare": 0.095,
    "demTurnoutBasis": 467,
    "repTurnoutBasis": 409
  },
  "35053": {
    "progShare": 0.493,
    "estabShare": 0.507,
    "magaShare": 0.578,
    "relShare": 0.254,
    "modShare": 0.168,
    "demTurnoutBasis": 1041,
    "repTurnoutBasis": 382
  },
  "35055": {
    "progShare": 0.569,
    "estabShare": 0.431,
    "magaShare": 0.544,
    "relShare": 0.253,
    "modShare": 0.203,
    "demTurnoutBasis": 3832,
    "repTurnoutBasis": 245
  },
  "35057": {
    "progShare": 0.502,
    "estabShare": 0.498,
    "magaShare": 0.634,
    "relShare": 0.269,
    "modShare": 0.097,
    "demTurnoutBasis": 653,
    "repTurnoutBasis": 482
  },
  "35059": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.675,
    "relShare": 0.214,
    "modShare": 0.111,
    "demTurnoutBasis": 172,
    "repTurnoutBasis": 150
  },
  "35061": {
    "progShare": 0.48,
    "estabShare": 0.52,
    "magaShare": 0.631,
    "relShare": 0.24,
    "modShare": 0.129,
    "demTurnoutBasis": 3006,
    "repTurnoutBasis": 1237
  },
  "36000": {
    "progShare": 0.436,
    "estabShare": 0.564,
    "magaShare": 0.32,
    "relShare": 0.376,
    "modShare": 0.304,
    "demTurnoutBasis": 25828,
    "repTurnoutBasis": 8048
  },
  "36001": {
    "progShare": 0.557,
    "estabShare": 0.443,
    "magaShare": 0.379,
    "relShare": 0.2,
    "modShare": 0.421,
    "demTurnoutBasis": 21003,
    "repTurnoutBasis": 7105
  },
  "36003": {
    "progShare": 0.614,
    "estabShare": 0.386,
    "magaShare": 0.447,
    "relShare": 0.275,
    "modShare": 0.278,
    "demTurnoutBasis": 1028,
    "repTurnoutBasis": 2581
  },
  "36005": {
    "progShare": 0.375,
    "estabShare": 0.625,
    "magaShare": 0.577,
    "relShare": 0.213,
    "modShare": 0.21,
    "demTurnoutBasis": 76871,
    "repTurnoutBasis": 3521
  },
  "36007": {
    "progShare": 0.599,
    "estabShare": 0.401,
    "magaShare": 0.396,
    "relShare": 0.263,
    "modShare": 0.341,
    "demTurnoutBasis": 8900,
    "repTurnoutBasis": 9007
  },
  "36009": {
    "progShare": 0.6,
    "estabShare": 0.4,
    "magaShare": 0.472,
    "relShare": 0.252,
    "modShare": 0.276,
    "demTurnoutBasis": 2164,
    "repTurnoutBasis": 3177
  },
  "36011": {
    "progShare": 0.545,
    "estabShare": 0.455,
    "magaShare": 0.396,
    "relShare": 0.223,
    "modShare": 0.381,
    "demTurnoutBasis": 2703,
    "repTurnoutBasis": 3051
  },
  "36013": {
    "progShare": 0.573,
    "estabShare": 0.427,
    "magaShare": 0.437,
    "relShare": 0.263,
    "modShare": 0.3,
    "demTurnoutBasis": 4149,
    "repTurnoutBasis": 4669
  },
  "36015": {
    "progShare": 0.535,
    "estabShare": 0.465,
    "magaShare": 0.401,
    "relShare": 0.26,
    "modShare": 0.339,
    "demTurnoutBasis": 2746,
    "repTurnoutBasis": 4200
  },
  "36017": {
    "progShare": 0.624,
    "estabShare": 0.376,
    "magaShare": 0.412,
    "relShare": 0.264,
    "modShare": 0.324,
    "demTurnoutBasis": 1338,
    "repTurnoutBasis": 2593
  },
  "36019": {
    "progShare": 0.726,
    "estabShare": 0.274,
    "magaShare": 0.438,
    "relShare": 0.195,
    "modShare": 0.367,
    "demTurnoutBasis": 3287,
    "repTurnoutBasis": 2308
  },
  "36021": {
    "progShare": 0.565,
    "estabShare": 0.435,
    "magaShare": 0.468,
    "relShare": 0.196,
    "modShare": 0.336,
    "demTurnoutBasis": 3352,
    "repTurnoutBasis": 2339
  },
  "36023": {
    "progShare": 0.597,
    "estabShare": 0.403,
    "magaShare": 0.344,
    "relShare": 0.271,
    "modShare": 0.385,
    "demTurnoutBasis": 1778,
    "repTurnoutBasis": 1943
  },
  "36025": {
    "progShare": 0.629,
    "estabShare": 0.371,
    "magaShare": 0.487,
    "relShare": 0.218,
    "modShare": 0.295,
    "demTurnoutBasis": 1493,
    "repTurnoutBasis": 2410
  },
  "36027": {
    "progShare": 0.553,
    "estabShare": 0.447,
    "magaShare": 0.543,
    "relShare": 0.179,
    "modShare": 0.278,
    "demTurnoutBasis": 12052,
    "repTurnoutBasis": 10057
  },
  "36029": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.555,
    "relShare": 0.168,
    "modShare": 0.277,
    "demTurnoutBasis": 53376,
    "repTurnoutBasis": 30345
  },
  "36031": {
    "progShare": 0.697,
    "estabShare": 0.303,
    "magaShare": 0.398,
    "relShare": 0.206,
    "modShare": 0.396,
    "demTurnoutBasis": 1492,
    "repTurnoutBasis": 1928
  },
  "36033": {
    "progShare": 0.712,
    "estabShare": 0.288,
    "magaShare": 0.449,
    "relShare": 0.2,
    "modShare": 0.351,
    "demTurnoutBasis": 1796,
    "repTurnoutBasis": 1328
  },
  "36035": {
    "progShare": 0.618,
    "estabShare": 0.382,
    "magaShare": 0.471,
    "relShare": 0.212,
    "modShare": 0.317,
    "demTurnoutBasis": 1256,
    "repTurnoutBasis": 3022
  },
  "36037": {
    "progShare": 0.561,
    "estabShare": 0.439,
    "magaShare": 0.524,
    "relShare": 0.212,
    "modShare": 0.264,
    "demTurnoutBasis": 1509,
    "repTurnoutBasis": 3065
  },
  "36039": {
    "progShare": 0.592,
    "estabShare": 0.408,
    "magaShare": 0.538,
    "relShare": 0.211,
    "modShare": 0.251,
    "demTurnoutBasis": 1382,
    "repTurnoutBasis": 2116
  },
  "36041": {
    "progShare": 0.626,
    "estabShare": 0.374,
    "magaShare": 0.413,
    "relShare": 0.23,
    "modShare": 0.357,
    "demTurnoutBasis": 193,
    "repTurnoutBasis": 551
  },
  "36043": {
    "progShare": 0.601,
    "estabShare": 0.399,
    "magaShare": 0.489,
    "relShare": 0.182,
    "modShare": 0.329,
    "demTurnoutBasis": 1691,
    "repTurnoutBasis": 3556
  },
  "36045": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.458,
    "relShare": 0.163,
    "modShare": 0.379,
    "demTurnoutBasis": 2619,
    "repTurnoutBasis": 4643
  },
  "36047": {
    "progShare": 0.488,
    "estabShare": 0.512,
    "magaShare": 0.544,
    "relShare": 0.25,
    "modShare": 0.206,
    "demTurnoutBasis": 155453,
    "repTurnoutBasis": 12408
  },
  "36049": {
    "progShare": 0.631,
    "estabShare": 0.369,
    "magaShare": 0.444,
    "relShare": 0.193,
    "modShare": 0.363,
    "demTurnoutBasis": 600,
    "repTurnoutBasis": 1509
  },
  "36051": {
    "progShare": 0.614,
    "estabShare": 0.386,
    "magaShare": 0.464,
    "relShare": 0.234,
    "modShare": 0.302,
    "demTurnoutBasis": 2101,
    "repTurnoutBasis": 3505
  },
  "36053": {
    "progShare": 0.583,
    "estabShare": 0.417,
    "magaShare": 0.367,
    "relShare": 0.241,
    "modShare": 0.392,
    "demTurnoutBasis": 2284,
    "repTurnoutBasis": 3340
  },
  "36055": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.414,
    "relShare": 0.211,
    "modShare": 0.375,
    "demTurnoutBasis": 37919,
    "repTurnoutBasis": 27221
  },
  "36057": {
    "progShare": 0.607,
    "estabShare": 0.393,
    "magaShare": 0.451,
    "relShare": 0.263,
    "modShare": 0.286,
    "demTurnoutBasis": 1517,
    "repTurnoutBasis": 1849
  },
  "36059": {
    "progShare": 0.423,
    "estabShare": 0.577,
    "magaShare": 0.588,
    "relShare": 0.125,
    "modShare": 0.287,
    "demTurnoutBasis": 59867,
    "repTurnoutBasis": 51158
  },
  "36061": {
    "progShare": 0.418,
    "estabShare": 0.582,
    "magaShare": 0.321,
    "relShare": 0.154,
    "modShare": 0.525,
    "demTurnoutBasis": 145828,
    "repTurnoutBasis": 13482
  },
  "36063": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.571,
    "relShare": 0.18,
    "modShare": 0.249,
    "demTurnoutBasis": 8750,
    "repTurnoutBasis": 8589
  },
  "36065": {
    "progShare": 0.594,
    "estabShare": 0.406,
    "magaShare": 0.464,
    "relShare": 0.205,
    "modShare": 0.331,
    "demTurnoutBasis": 7164,
    "repTurnoutBasis": 10033
  },
  "36067": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.358,
    "relShare": 0.215,
    "modShare": 0.427,
    "demTurnoutBasis": 20486,
    "repTurnoutBasis": 16643
  },
  "36069": {
    "progShare": 0.546,
    "estabShare": 0.454,
    "magaShare": 0.405,
    "relShare": 0.225,
    "modShare": 0.37,
    "demTurnoutBasis": 4244,
    "repTurnoutBasis": 5500
  },
  "36071": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.597,
    "relShare": 0.168,
    "modShare": 0.235,
    "demTurnoutBasis": 12466,
    "repTurnoutBasis": 12076
  },
  "36073": {
    "progShare": 0.573,
    "estabShare": 0.427,
    "magaShare": 0.54,
    "relShare": 0.215,
    "modShare": 0.245,
    "demTurnoutBasis": 825,
    "repTurnoutBasis": 2072
  },
  "36075": {
    "progShare": 0.579,
    "estabShare": 0.421,
    "magaShare": 0.446,
    "relShare": 0.211,
    "modShare": 0.343,
    "demTurnoutBasis": 2953,
    "repTurnoutBasis": 5867
  },
  "36077": {
    "progShare": 0.618,
    "estabShare": 0.382,
    "magaShare": 0.415,
    "relShare": 0.237,
    "modShare": 0.348,
    "demTurnoutBasis": 2432,
    "repTurnoutBasis": 2635
  },
  "36079": {
    "progShare": 0.547,
    "estabShare": 0.453,
    "magaShare": 0.609,
    "relShare": 0.15,
    "modShare": 0.241,
    "demTurnoutBasis": 3775,
    "repTurnoutBasis": 4300
  },
  "36081": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.58,
    "relShare": 0.187,
    "modShare": 0.233,
    "demTurnoutBasis": 108622,
    "repTurnoutBasis": 15524
  },
  "36083": {
    "progShare": 0.62,
    "estabShare": 0.38,
    "magaShare": 0.432,
    "relShare": 0.214,
    "modShare": 0.354,
    "demTurnoutBasis": 6036,
    "repTurnoutBasis": 4467
  },
  "36085": {
    "progShare": 0.516,
    "estabShare": 0.484,
    "magaShare": 0.749,
    "relShare": 0.11,
    "modShare": 0.141,
    "demTurnoutBasis": 16807,
    "repTurnoutBasis": 13154
  },
  "36087": {
    "progShare": 0.436,
    "estabShare": 0.564,
    "magaShare": 0.526,
    "relShare": 0.203,
    "modShare": 0.271,
    "demTurnoutBasis": 14834,
    "repTurnoutBasis": 7372
  },
  "36089": {
    "progShare": 0.619,
    "estabShare": 0.381,
    "magaShare": 0.451,
    "relShare": 0.19,
    "modShare": 0.359,
    "demTurnoutBasis": 3784,
    "repTurnoutBasis": 3468
  },
  "36091": {
    "progShare": 0.586,
    "estabShare": 0.414,
    "magaShare": 0.38,
    "relShare": 0.215,
    "modShare": 0.405,
    "demTurnoutBasis": 8688,
    "repTurnoutBasis": 12175
  },
  "36093": {
    "progShare": 0.572,
    "estabShare": 0.428,
    "magaShare": 0.377,
    "relShare": 0.253,
    "modShare": 0.37,
    "demTurnoutBasis": 6887,
    "repTurnoutBasis": 4726
  },
  "36095": {
    "progShare": 0.651,
    "estabShare": 0.349,
    "magaShare": 0.438,
    "relShare": 0.281,
    "modShare": 0.281,
    "demTurnoutBasis": 961,
    "repTurnoutBasis": 1388
  },
  "36097": {
    "progShare": 0.641,
    "estabShare": 0.359,
    "magaShare": 0.43,
    "relShare": 0.267,
    "modShare": 0.303,
    "demTurnoutBasis": 713,
    "repTurnoutBasis": 923
  },
  "36099": {
    "progShare": 0.563,
    "estabShare": 0.437,
    "magaShare": 0.435,
    "relShare": 0.214,
    "modShare": 0.351,
    "demTurnoutBasis": 1186,
    "repTurnoutBasis": 1480
  },
  "36101": {
    "progShare": 0.598,
    "estabShare": 0.402,
    "magaShare": 0.447,
    "relShare": 0.258,
    "modShare": 0.295,
    "demTurnoutBasis": 2538,
    "repTurnoutBasis": 5704
  },
  "36103": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.634,
    "relShare": 0.12,
    "modShare": 0.246,
    "demTurnoutBasis": 48739,
    "repTurnoutBasis": 50076
  },
  "36105": {
    "progShare": 0.581,
    "estabShare": 0.419,
    "magaShare": 0.6,
    "relShare": 0.175,
    "modShare": 0.225,
    "demTurnoutBasis": 2665,
    "repTurnoutBasis": 1982
  },
  "36107": {
    "progShare": 0.617,
    "estabShare": 0.383,
    "magaShare": 0.396,
    "relShare": 0.29,
    "modShare": 0.314,
    "demTurnoutBasis": 1627,
    "repTurnoutBasis": 2951
  },
  "36109": {
    "progShare": 0.663,
    "estabShare": 0.337,
    "magaShare": 0.286,
    "relShare": 0.316,
    "modShare": 0.398,
    "demTurnoutBasis": 8137,
    "repTurnoutBasis": 2427
  },
  "36111": {
    "progShare": 0.647,
    "estabShare": 0.353,
    "magaShare": 0.547,
    "relShare": 0.171,
    "modShare": 0.282,
    "demTurnoutBasis": 10044,
    "repTurnoutBasis": 4959
  },
  "36113": {
    "progShare": 0.609,
    "estabShare": 0.391,
    "magaShare": 0.387,
    "relShare": 0.186,
    "modShare": 0.427,
    "demTurnoutBasis": 2370,
    "repTurnoutBasis": 3870
  },
  "36115": {
    "progShare": 0.653,
    "estabShare": 0.347,
    "magaShare": 0.362,
    "relShare": 0.232,
    "modShare": 0.406,
    "demTurnoutBasis": 1783,
    "repTurnoutBasis": 2673
  },
  "36117": {
    "progShare": 0.584,
    "estabShare": 0.416,
    "magaShare": 0.45,
    "relShare": 0.246,
    "modShare": 0.304,
    "demTurnoutBasis": 2213,
    "repTurnoutBasis": 4058
  },
  "36119": {
    "progShare": 0.377,
    "estabShare": 0.623,
    "magaShare": 0.478,
    "relShare": 0.145,
    "modShare": 0.377,
    "demTurnoutBasis": 55827,
    "repTurnoutBasis": 22362
  },
  "36121": {
    "progShare": 0.59,
    "estabShare": 0.41,
    "magaShare": 0.555,
    "relShare": 0.226,
    "modShare": 0.219,
    "demTurnoutBasis": 801,
    "repTurnoutBasis": 2113
  },
  "36123": {
    "progShare": 0.557,
    "estabShare": 0.443,
    "magaShare": 0.414,
    "relShare": 0.19,
    "modShare": 0.396,
    "demTurnoutBasis": 680,
    "repTurnoutBasis": 1349
  },
  "39001": {
    "progShare": 0.422,
    "estabShare": 0.578,
    "magaShare": 0.522,
    "relShare": 0.207,
    "modShare": 0.271,
    "demTurnoutBasis": 1560,
    "repTurnoutBasis": 10789
  },
  "39003": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.404,
    "relShare": 0.231,
    "modShare": 0.365,
    "demTurnoutBasis": 6672,
    "repTurnoutBasis": 41664
  },
  "39005": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.374,
    "relShare": 0.234,
    "modShare": 0.392,
    "demTurnoutBasis": 3006,
    "repTurnoutBasis": 22942
  },
  "39007": {
    "progShare": 0.446,
    "estabShare": 0.554,
    "magaShare": 0.502,
    "relShare": 0.17,
    "modShare": 0.328,
    "demTurnoutBasis": 9873,
    "repTurnoutBasis": 28164
  },
  "39009": {
    "progShare": 0.638,
    "estabShare": 0.362,
    "magaShare": 0.47,
    "relShare": 0.155,
    "modShare": 0.375,
    "demTurnoutBasis": 10038,
    "repTurnoutBasis": 13115
  },
  "39011": {
    "progShare": 0.482,
    "estabShare": 0.518,
    "magaShare": 0.431,
    "relShare": 0.195,
    "modShare": 0.374,
    "demTurnoutBasis": 2064,
    "repTurnoutBasis": 23161
  },
  "39013": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.532,
    "relShare": 0.216,
    "modShare": 0.252,
    "demTurnoutBasis": 7591,
    "repTurnoutBasis": 21567
  },
  "39015": {
    "progShare": 0.409,
    "estabShare": 0.591,
    "magaShare": 0.542,
    "relShare": 0.195,
    "modShare": 0.263,
    "demTurnoutBasis": 2706,
    "repTurnoutBasis": 18719
  },
  "39017": {
    "progShare": 0.47,
    "estabShare": 0.53,
    "magaShare": 0.447,
    "relShare": 0.189,
    "modShare": 0.364,
    "demTurnoutBasis": 25081,
    "repTurnoutBasis": 135701
  },
  "39019": {
    "progShare": 0.476,
    "estabShare": 0.524,
    "magaShare": 0.53,
    "relShare": 0.186,
    "modShare": 0.284,
    "demTurnoutBasis": 2148,
    "repTurnoutBasis": 11431
  },
  "39021": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.458,
    "relShare": 0.185,
    "modShare": 0.357,
    "demTurnoutBasis": 2413,
    "repTurnoutBasis": 17265
  },
  "39023": {
    "progShare": 0.411,
    "estabShare": 0.589,
    "magaShare": 0.465,
    "relShare": 0.158,
    "modShare": 0.377,
    "demTurnoutBasis": 12416,
    "repTurnoutBasis": 49125
  },
  "39025": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.452,
    "relShare": 0.201,
    "modShare": 0.347,
    "demTurnoutBasis": 11831,
    "repTurnoutBasis": 86353
  },
  "39027": {
    "progShare": 0.515,
    "estabShare": 0.485,
    "magaShare": 0.494,
    "relShare": 0.172,
    "modShare": 0.334,
    "demTurnoutBasis": 1934,
    "repTurnoutBasis": 18599
  },
  "39029": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.528,
    "relShare": 0.154,
    "modShare": 0.318,
    "demTurnoutBasis": 7872,
    "repTurnoutBasis": 38162
  },
  "39031": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.472,
    "relShare": 0.182,
    "modShare": 0.346,
    "demTurnoutBasis": 2581,
    "repTurnoutBasis": 12986
  },
  "39033": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.412,
    "relShare": 0.255,
    "modShare": 0.333,
    "demTurnoutBasis": 2582,
    "repTurnoutBasis": 16945
  },
  "39035": {
    "progShare": 0.368,
    "estabShare": 0.632,
    "magaShare": 0.387,
    "relShare": 0.119,
    "modShare": 0.494,
    "demTurnoutBasis": 207106,
    "repTurnoutBasis": 284484
  },
  "39037": {
    "progShare": 0.447,
    "estabShare": 0.553,
    "magaShare": 0.477,
    "relShare": 0.186,
    "modShare": 0.337,
    "demTurnoutBasis": 2338,
    "repTurnoutBasis": 24937
  },
  "39039": {
    "progShare": 0.491,
    "estabShare": 0.509,
    "magaShare": 0.352,
    "relShare": 0.224,
    "modShare": 0.424,
    "demTurnoutBasis": 3020,
    "repTurnoutBasis": 16592
  },
  "39041": {
    "progShare": 0.425,
    "estabShare": 0.575,
    "magaShare": 0.273,
    "relShare": 0.168,
    "modShare": 0.559,
    "demTurnoutBasis": 16970,
    "repTurnoutBasis": 103366
  },
  "39043": {
    "progShare": 0.443,
    "estabShare": 0.557,
    "magaShare": 0.446,
    "relShare": 0.167,
    "modShare": 0.387,
    "demTurnoutBasis": 10103,
    "repTurnoutBasis": 25962
  },
  "39045": {
    "progShare": 0.444,
    "estabShare": 0.556,
    "magaShare": 0.365,
    "relShare": 0.216,
    "modShare": 0.419,
    "demTurnoutBasis": 11868,
    "repTurnoutBasis": 63831
  },
  "39047": {
    "progShare": 0.417,
    "estabShare": 0.583,
    "magaShare": 0.44,
    "relShare": 0.159,
    "modShare": 0.401,
    "demTurnoutBasis": 1337,
    "repTurnoutBasis": 10347
  },
  "39049": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.278,
    "relShare": 0.163,
    "modShare": 0.559,
    "demTurnoutBasis": 161232,
    "repTurnoutBasis": 320608
  },
  "39051": {
    "progShare": 0.51,
    "estabShare": 0.49,
    "magaShare": 0.354,
    "relShare": 0.233,
    "modShare": 0.413,
    "demTurnoutBasis": 3095,
    "repTurnoutBasis": 18913
  },
  "39053": {
    "progShare": 0.506,
    "estabShare": 0.494,
    "magaShare": 0.512,
    "relShare": 0.194,
    "modShare": 0.294,
    "demTurnoutBasis": 2016,
    "repTurnoutBasis": 12450
  },
  "39055": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.403,
    "relShare": 0.149,
    "modShare": 0.448,
    "demTurnoutBasis": 7865,
    "repTurnoutBasis": 48464
  },
  "39057": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.416,
    "relShare": 0.18,
    "modShare": 0.404,
    "demTurnoutBasis": 13956,
    "repTurnoutBasis": 73647
  },
  "39059": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.492,
    "relShare": 0.177,
    "modShare": 0.331,
    "demTurnoutBasis": 2767,
    "repTurnoutBasis": 14000
  },
  "39061": {
    "progShare": 0.408,
    "estabShare": 0.592,
    "magaShare": 0.378,
    "relShare": 0.159,
    "modShare": 0.463,
    "demTurnoutBasis": 101083,
    "repTurnoutBasis": 263725
  },
  "39063": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.366,
    "relShare": 0.224,
    "modShare": 0.41,
    "demTurnoutBasis": 4648,
    "repTurnoutBasis": 35118
  },
  "39065": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.41,
    "relShare": 0.226,
    "modShare": 0.364,
    "demTurnoutBasis": 1495,
    "repTurnoutBasis": 10694
  },
  "39067": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.556,
    "relShare": 0.188,
    "modShare": 0.256,
    "demTurnoutBasis": 1559,
    "repTurnoutBasis": 5652
  },
  "39069": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.345,
    "relShare": 0.196,
    "modShare": 0.459,
    "demTurnoutBasis": 2000,
    "repTurnoutBasis": 13301
  },
  "39071": {
    "progShare": 0.44,
    "estabShare": 0.56,
    "magaShare": 0.527,
    "relShare": 0.188,
    "modShare": 0.285,
    "demTurnoutBasis": 2055,
    "repTurnoutBasis": 15565
  },
  "39073": {
    "progShare": 0.47,
    "estabShare": 0.53,
    "magaShare": 0.464,
    "relShare": 0.226,
    "modShare": 0.31,
    "demTurnoutBasis": 2340,
    "repTurnoutBasis": 9694
  },
  "39075": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.356,
    "relShare": 0.291,
    "modShare": 0.353,
    "demTurnoutBasis": 1165,
    "repTurnoutBasis": 11362
  },
  "39077": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.438,
    "relShare": 0.199,
    "modShare": 0.363,
    "demTurnoutBasis": 4066,
    "repTurnoutBasis": 19415
  },
  "39079": {
    "progShare": 0.41,
    "estabShare": 0.59,
    "magaShare": 0.557,
    "relShare": 0.154,
    "modShare": 0.289,
    "demTurnoutBasis": 1766,
    "repTurnoutBasis": 12076
  },
  "39081": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.58,
    "relShare": 0.166,
    "modShare": 0.254,
    "demTurnoutBasis": 8016,
    "repTurnoutBasis": 22507
  },
  "39083": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.359,
    "relShare": 0.28,
    "modShare": 0.361,
    "demTurnoutBasis": 3995,
    "repTurnoutBasis": 26452
  },
  "39085": {
    "progShare": 0.457,
    "estabShare": 0.543,
    "magaShare": 0.455,
    "relShare": 0.136,
    "modShare": 0.409,
    "demTurnoutBasis": 23634,
    "repTurnoutBasis": 87165
  },
  "39087": {
    "progShare": 0.432,
    "estabShare": 0.568,
    "magaShare": 0.52,
    "relShare": 0.197,
    "modShare": 0.283,
    "demTurnoutBasis": 4630,
    "repTurnoutBasis": 23673
  },
  "39089": {
    "progShare": 0.469,
    "estabShare": 0.531,
    "magaShare": 0.365,
    "relShare": 0.206,
    "modShare": 0.429,
    "demTurnoutBasis": 13231,
    "repTurnoutBasis": 70184
  },
  "39091": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.443,
    "relShare": 0.228,
    "modShare": 0.329,
    "demTurnoutBasis": 2091,
    "repTurnoutBasis": 21126
  },
  "39093": {
    "progShare": 0.437,
    "estabShare": 0.563,
    "magaShare": 0.427,
    "relShare": 0.149,
    "modShare": 0.424,
    "demTurnoutBasis": 38807,
    "repTurnoutBasis": 88191
  },
  "39095": {
    "progShare": 0.432,
    "estabShare": 0.568,
    "magaShare": 0.391,
    "relShare": 0.196,
    "modShare": 0.413,
    "demTurnoutBasis": 57867,
    "repTurnoutBasis": 100308
  },
  "39097": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.377,
    "relShare": 0.206,
    "modShare": 0.417,
    "demTurnoutBasis": 2184,
    "repTurnoutBasis": 16375
  },
  "39099": {
    "progShare": 0.402,
    "estabShare": 0.598,
    "magaShare": 0.569,
    "relShare": 0.109,
    "modShare": 0.322,
    "demTurnoutBasis": 36207,
    "repTurnoutBasis": 68606
  },
  "39101": {
    "progShare": 0.429,
    "estabShare": 0.571,
    "magaShare": 0.426,
    "relShare": 0.224,
    "modShare": 0.35,
    "demTurnoutBasis": 4685,
    "repTurnoutBasis": 21942
  },
  "39103": {
    "progShare": 0.469,
    "estabShare": 0.531,
    "magaShare": 0.416,
    "relShare": 0.159,
    "modShare": 0.425,
    "demTurnoutBasis": 15175,
    "repTurnoutBasis": 75927
  },
  "39105": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.529,
    "relShare": 0.173,
    "modShare": 0.298,
    "demTurnoutBasis": 1629,
    "repTurnoutBasis": 10192
  },
  "39107": {
    "progShare": 0.454,
    "estabShare": 0.546,
    "magaShare": 0.383,
    "relShare": 0.248,
    "modShare": 0.369,
    "demTurnoutBasis": 1960,
    "repTurnoutBasis": 20933
  },
  "39109": {
    "progShare": 0.464,
    "estabShare": 0.536,
    "magaShare": 0.46,
    "relShare": 0.183,
    "modShare": 0.357,
    "demTurnoutBasis": 6023,
    "repTurnoutBasis": 52542
  },
  "39111": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.55,
    "relShare": 0.215,
    "modShare": 0.235,
    "demTurnoutBasis": 2501,
    "repTurnoutBasis": 4135
  },
  "39113": {
    "progShare": 0.408,
    "estabShare": 0.592,
    "magaShare": 0.46,
    "relShare": 0.157,
    "modShare": 0.383,
    "demTurnoutBasis": 57950,
    "repTurnoutBasis": 175329
  },
  "39115": {
    "progShare": 0.432,
    "estabShare": 0.568,
    "magaShare": 0.468,
    "relShare": 0.189,
    "modShare": 0.343,
    "demTurnoutBasis": 1015,
    "repTurnoutBasis": 6620
  },
  "39117": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.376,
    "relShare": 0.296,
    "modShare": 0.328,
    "demTurnoutBasis": 2265,
    "repTurnoutBasis": 17515
  },
  "39119": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.458,
    "relShare": 0.164,
    "modShare": 0.378,
    "demTurnoutBasis": 5512,
    "repTurnoutBasis": 30223
  },
  "39121": {
    "progShare": 0.443,
    "estabShare": 0.557,
    "magaShare": 0.524,
    "relShare": 0.177,
    "modShare": 0.299,
    "demTurnoutBasis": 985,
    "repTurnoutBasis": 5071
  },
  "39123": {
    "progShare": 0.441,
    "estabShare": 0.559,
    "magaShare": 0.446,
    "relShare": 0.181,
    "modShare": 0.373,
    "demTurnoutBasis": 4688,
    "repTurnoutBasis": 15491
  },
  "39125": {
    "progShare": 0.429,
    "estabShare": 0.571,
    "magaShare": 0.359,
    "relShare": 0.274,
    "modShare": 0.367,
    "demTurnoutBasis": 1310,
    "repTurnoutBasis": 8032
  },
  "39127": {
    "progShare": 0.423,
    "estabShare": 0.577,
    "magaShare": 0.492,
    "relShare": 0.195,
    "modShare": 0.313,
    "demTurnoutBasis": 2615,
    "repTurnoutBasis": 11691
  },
  "39129": {
    "progShare": 0.446,
    "estabShare": 0.554,
    "magaShare": 0.381,
    "relShare": 0.234,
    "modShare": 0.385,
    "demTurnoutBasis": 3919,
    "repTurnoutBasis": 21683
  },
  "39131": {
    "progShare": 0.416,
    "estabShare": 0.584,
    "magaShare": 0.505,
    "relShare": 0.201,
    "modShare": 0.294,
    "demTurnoutBasis": 2376,
    "repTurnoutBasis": 7238
  },
  "39133": {
    "progShare": 0.511,
    "estabShare": 0.489,
    "magaShare": 0.484,
    "relShare": 0.144,
    "modShare": 0.372,
    "demTurnoutBasis": 18226,
    "repTurnoutBasis": 50685
  },
  "39135": {
    "progShare": 0.473,
    "estabShare": 0.527,
    "magaShare": 0.529,
    "relShare": 0.193,
    "modShare": 0.278,
    "demTurnoutBasis": 2290,
    "repTurnoutBasis": 20847
  },
  "39137": {
    "progShare": 0.534,
    "estabShare": 0.466,
    "magaShare": 0.3,
    "relShare": 0.277,
    "modShare": 0.423,
    "demTurnoutBasis": 1802,
    "repTurnoutBasis": 21103
  },
  "39139": {
    "progShare": 0.441,
    "estabShare": 0.559,
    "magaShare": 0.399,
    "relShare": 0.289,
    "modShare": 0.312,
    "demTurnoutBasis": 9642,
    "repTurnoutBasis": 49092
  },
  "39141": {
    "progShare": 0.424,
    "estabShare": 0.576,
    "magaShare": 0.441,
    "relShare": 0.204,
    "modShare": 0.355,
    "demTurnoutBasis": 6389,
    "repTurnoutBasis": 24248
  },
  "39143": {
    "progShare": 0.464,
    "estabShare": 0.536,
    "magaShare": 0.405,
    "relShare": 0.214,
    "modShare": 0.381,
    "demTurnoutBasis": 5473,
    "repTurnoutBasis": 23452
  },
  "39145": {
    "progShare": 0.457,
    "estabShare": 0.543,
    "magaShare": 0.544,
    "relShare": 0.169,
    "modShare": 0.287,
    "demTurnoutBasis": 6644,
    "repTurnoutBasis": 22996
  },
  "39147": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.4,
    "relShare": 0.195,
    "modShare": 0.405,
    "demTurnoutBasis": 4260,
    "repTurnoutBasis": 20789
  },
  "39149": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.447,
    "relShare": 0.203,
    "modShare": 0.35,
    "demTurnoutBasis": 2513,
    "repTurnoutBasis": 23615
  },
  "39151": {
    "progShare": 0.433,
    "estabShare": 0.567,
    "magaShare": 0.432,
    "relShare": 0.152,
    "modShare": 0.416,
    "demTurnoutBasis": 38880,
    "repTurnoutBasis": 137300
  },
  "39153": {
    "progShare": 0.435,
    "estabShare": 0.565,
    "magaShare": 0.424,
    "relShare": 0.134,
    "modShare": 0.442,
    "demTurnoutBasis": 70500,
    "repTurnoutBasis": 158850
  },
  "39155": {
    "progShare": 0.453,
    "estabShare": 0.547,
    "magaShare": 0.581,
    "relShare": 0.126,
    "modShare": 0.293,
    "demTurnoutBasis": 33829,
    "repTurnoutBasis": 57350
  },
  "39157": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.462,
    "relShare": 0.204,
    "modShare": 0.334,
    "demTurnoutBasis": 8877,
    "repTurnoutBasis": 29150
  },
  "39159": {
    "progShare": 0.488,
    "estabShare": 0.512,
    "magaShare": 0.335,
    "relShare": 0.216,
    "modShare": 0.449,
    "demTurnoutBasis": 3181,
    "repTurnoutBasis": 26075
  },
  "39161": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.376,
    "relShare": 0.265,
    "modShare": 0.359,
    "demTurnoutBasis": 1383,
    "repTurnoutBasis": 14131
  },
  "39163": {
    "progShare": 0.496,
    "estabShare": 0.504,
    "magaShare": 0.531,
    "relShare": 0.204,
    "modShare": 0.265,
    "demTurnoutBasis": 1063,
    "repTurnoutBasis": 4287
  },
  "39165": {
    "progShare": 0.47,
    "estabShare": 0.53,
    "magaShare": 0.437,
    "relShare": 0.191,
    "modShare": 0.372,
    "demTurnoutBasis": 13441,
    "repTurnoutBasis": 109011
  },
  "39167": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.452,
    "relShare": 0.2,
    "modShare": 0.348,
    "demTurnoutBasis": 5163,
    "repTurnoutBasis": 25885
  },
  "39169": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.351,
    "relShare": 0.226,
    "modShare": 0.423,
    "demTurnoutBasis": 6867,
    "repTurnoutBasis": 42251
  },
  "39171": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.379,
    "relShare": 0.21,
    "modShare": 0.411,
    "demTurnoutBasis": 2235,
    "repTurnoutBasis": 17290
  },
  "39173": {
    "progShare": 0.551,
    "estabShare": 0.449,
    "magaShare": 0.355,
    "relShare": 0.217,
    "modShare": 0.428,
    "demTurnoutBasis": 13977,
    "repTurnoutBasis": 44803
  },
  "39175": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.422,
    "relShare": 0.218,
    "modShare": 0.36,
    "demTurnoutBasis": 1355,
    "repTurnoutBasis": 9086
  },
  "41001": {
    "progShare": 0.568,
    "estabShare": 0.432,
    "magaShare": 0.713,
    "relShare": 0.17,
    "modShare": 0.117,
    "demTurnoutBasis": 1412,
    "repTurnoutBasis": 3661
  },
  "41003": {
    "progShare": 0.595,
    "estabShare": 0.405,
    "magaShare": 0.608,
    "relShare": 0.176,
    "modShare": 0.216,
    "demTurnoutBasis": 19739,
    "repTurnoutBasis": 7497
  },
  "41005": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.685,
    "relShare": 0.152,
    "modShare": 0.163,
    "demTurnoutBasis": 62031,
    "repTurnoutBasis": 43874
  },
  "41007": {
    "progShare": 0.537,
    "estabShare": 0.463,
    "magaShare": 0.743,
    "relShare": 0.11,
    "modShare": 0.147,
    "demTurnoutBasis": 6544,
    "repTurnoutBasis": 3923
  },
  "41009": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.736,
    "relShare": 0.16,
    "modShare": 0.104,
    "demTurnoutBasis": 7928,
    "repTurnoutBasis": 5807
  },
  "41011": {
    "progShare": 0.549,
    "estabShare": 0.451,
    "magaShare": 0.78,
    "relShare": 0.119,
    "modShare": 0.101,
    "demTurnoutBasis": 17314,
    "repTurnoutBasis": 13550
  },
  "41013": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.772,
    "relShare": 0.137,
    "modShare": 0.091,
    "demTurnoutBasis": 2004,
    "repTurnoutBasis": 4452
  },
  "41015": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.799,
    "relShare": 0.119,
    "modShare": 0.082,
    "demTurnoutBasis": 3153,
    "repTurnoutBasis": 3801
  },
  "41017": {
    "progShare": 0.509,
    "estabShare": 0.491,
    "magaShare": 0.726,
    "relShare": 0.126,
    "modShare": 0.148,
    "demTurnoutBasis": 25176,
    "repTurnoutBasis": 23156
  },
  "41019": {
    "progShare": 0.534,
    "estabShare": 0.466,
    "magaShare": 0.791,
    "relShare": 0.127,
    "modShare": 0.082,
    "demTurnoutBasis": 11346,
    "repTurnoutBasis": 17367
  },
  "41021": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.771,
    "relShare": 0.111,
    "modShare": 0.118,
    "demTurnoutBasis": 232,
    "repTurnoutBasis": 363
  },
  "41023": {
    "progShare": 0.615,
    "estabShare": 0.385,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 759,
    "repTurnoutBasis": 606
  },
  "41025": {
    "progShare": 0.571,
    "estabShare": 0.429,
    "magaShare": 0.8,
    "relShare": 0.109,
    "modShare": 0.091,
    "demTurnoutBasis": 736,
    "repTurnoutBasis": 1917
  },
  "41027": {
    "progShare": 0.582,
    "estabShare": 0.418,
    "magaShare": 0.642,
    "relShare": 0.145,
    "modShare": 0.213,
    "demTurnoutBasis": 4292,
    "repTurnoutBasis": 1978
  },
  "41029": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.78,
    "relShare": 0.112,
    "modShare": 0.108,
    "demTurnoutBasis": 31317,
    "repTurnoutBasis": 28108
  },
  "41031": {
    "progShare": 0.493,
    "estabShare": 0.507,
    "magaShare": 0.765,
    "relShare": 0.123,
    "modShare": 0.112,
    "demTurnoutBasis": 1840,
    "repTurnoutBasis": 2790
  },
  "41033": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.786,
    "relShare": 0.129,
    "modShare": 0.085,
    "demTurnoutBasis": 9797,
    "repTurnoutBasis": 14280
  },
  "41035": {
    "progShare": 0.53,
    "estabShare": 0.47,
    "magaShare": 0.772,
    "relShare": 0.149,
    "modShare": 0.079,
    "demTurnoutBasis": 5820,
    "repTurnoutBasis": 12004
  },
  "41037": {
    "progShare": 0.585,
    "estabShare": 0.415,
    "magaShare": 0.744,
    "relShare": 0.154,
    "modShare": 0.102,
    "demTurnoutBasis": 1182,
    "repTurnoutBasis": 3063
  },
  "41039": {
    "progShare": 0.591,
    "estabShare": 0.409,
    "magaShare": 0.709,
    "relShare": 0.145,
    "modShare": 0.146,
    "demTurnoutBasis": 75119,
    "repTurnoutBasis": 34266
  },
  "41041": {
    "progShare": 0.511,
    "estabShare": 0.489,
    "magaShare": 0.736,
    "relShare": 0.12,
    "modShare": 0.144,
    "demTurnoutBasis": 9193,
    "repTurnoutBasis": 5087
  },
  "41043": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.733,
    "relShare": 0.164,
    "modShare": 0.103,
    "demTurnoutBasis": 13020,
    "repTurnoutBasis": 15737
  },
  "41045": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.778,
    "relShare": 0.143,
    "modShare": 0.079,
    "demTurnoutBasis": 1365,
    "repTurnoutBasis": 3673
  },
  "41047": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.67,
    "relShare": 0.193,
    "modShare": 0.137,
    "demTurnoutBasis": 36169,
    "repTurnoutBasis": 32825
  },
  "41049": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.734,
    "relShare": 0.167,
    "modShare": 0.099,
    "demTurnoutBasis": 726,
    "repTurnoutBasis": 1432
  },
  "41051": {
    "progShare": 0.579,
    "estabShare": 0.421,
    "magaShare": 0.619,
    "relShare": 0.155,
    "modShare": 0.226,
    "demTurnoutBasis": 188171,
    "repTurnoutBasis": 32197
  },
  "41053": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.664,
    "relShare": 0.198,
    "modShare": 0.138,
    "demTurnoutBasis": 10674,
    "repTurnoutBasis": 10252
  },
  "41055": {
    "progShare": 0.52,
    "estabShare": 0.48,
    "magaShare": 0.778,
    "relShare": 0.126,
    "modShare": 0.096,
    "demTurnoutBasis": 187,
    "repTurnoutBasis": 429
  },
  "41057": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 553,
    "repTurnoutBasis": 1476
  },
  "41059": {
    "progShare": 0.51,
    "estabShare": 0.49,
    "magaShare": 0.75,
    "relShare": 0.147,
    "modShare": 0.103,
    "demTurnoutBasis": 4843,
    "repTurnoutBasis": 7888
  },
  "41061": {
    "progShare": 0.564,
    "estabShare": 0.436,
    "magaShare": 0.743,
    "relShare": 0.162,
    "modShare": 0.095,
    "demTurnoutBasis": 2624,
    "repTurnoutBasis": 4970
  },
  "41063": {
    "progShare": 0.565,
    "estabShare": 0.435,
    "magaShare": 0.785,
    "relShare": 0.136,
    "modShare": 0.079,
    "demTurnoutBasis": 921,
    "repTurnoutBasis": 1860
  },
  "41065": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.731,
    "relShare": 0.139,
    "modShare": 0.13,
    "demTurnoutBasis": 3204,
    "repTurnoutBasis": 2716
  },
  "41067": {
    "progShare": 0.53,
    "estabShare": 0.47,
    "magaShare": 0.58,
    "relShare": 0.186,
    "modShare": 0.234,
    "demTurnoutBasis": 168298,
    "repTurnoutBasis": 75658
  },
  "41069": {
    "progShare": 0.608,
    "estabShare": 0.392,
    "magaShare": 0.773,
    "relShare": 0.147,
    "modShare": 0.08,
    "demTurnoutBasis": 176,
    "repTurnoutBasis": 325
  },
  "41071": {
    "progShare": 0.527,
    "estabShare": 0.473,
    "magaShare": 0.672,
    "relShare": 0.188,
    "modShare": 0.14,
    "demTurnoutBasis": 12358,
    "repTurnoutBasis": 12068
  },
  "42001": {
    "progShare": 0.187,
    "estabShare": 0.813,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4550,
    "repTurnoutBasis": 4518
  },
  "42003": {
    "progShare": 0.362,
    "estabShare": 0.638,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 77057,
    "repTurnoutBasis": 27849
  },
  "42005": {
    "progShare": 0.325,
    "estabShare": 0.675,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1724,
    "repTurnoutBasis": 3300
  },
  "42007": {
    "progShare": 0.195,
    "estabShare": 0.805,
    "magaShare": 0.836,
    "relShare": 0.082,
    "modShare": 0.082,
    "demTurnoutBasis": 12249,
    "repTurnoutBasis": 9466
  },
  "42009": {
    "progShare": 0.291,
    "estabShare": 0.709,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 750,
    "repTurnoutBasis": 2916
  },
  "42011": {
    "progShare": 0.346,
    "estabShare": 0.654,
    "magaShare": 0.823,
    "relShare": 0.08,
    "modShare": 0.097,
    "demTurnoutBasis": 14173,
    "repTurnoutBasis": 21381
  },
  "42013": {
    "progShare": 0.245,
    "estabShare": 0.755,
    "magaShare": 0.831,
    "relShare": 0.081,
    "modShare": 0.088,
    "demTurnoutBasis": 4407,
    "repTurnoutBasis": 11582
  },
  "42015": {
    "progShare": 0.324,
    "estabShare": 0.676,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1038,
    "repTurnoutBasis": 2782
  },
  "42017": {
    "progShare": 0.183,
    "estabShare": 0.817,
    "magaShare": 0.795,
    "relShare": 0.078,
    "modShare": 0.127,
    "demTurnoutBasis": 49282,
    "repTurnoutBasis": 43030
  },
  "42019": {
    "progShare": 0.297,
    "estabShare": 0.703,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5611,
    "repTurnoutBasis": 9667
  },
  "42021": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4752,
    "repTurnoutBasis": 4892
  },
  "42025": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.792,
    "relShare": 0.077,
    "modShare": 0.131,
    "demTurnoutBasis": 1250,
    "repTurnoutBasis": 2263
  },
  "42027": {
    "progShare": 0.283,
    "estabShare": 0.717,
    "magaShare": 0.801,
    "relShare": 0.078,
    "modShare": 0.121,
    "demTurnoutBasis": 10217,
    "repTurnoutBasis": 8541
  },
  "42029": {
    "progShare": 0.189,
    "estabShare": 0.811,
    "magaShare": 0.77,
    "relShare": 0.075,
    "modShare": 0.155,
    "demTurnoutBasis": 41021,
    "repTurnoutBasis": 28659
  },
  "42033": {
    "progShare": 0.226,
    "estabShare": 0.774,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3056,
    "repTurnoutBasis": 6596
  },
  "42035": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 980,
    "repTurnoutBasis": 1557
  },
  "42037": {
    "progShare": 0.237,
    "estabShare": 0.763,
    "magaShare": 0.815,
    "relShare": 0.08,
    "modShare": 0.105,
    "demTurnoutBasis": 2820,
    "repTurnoutBasis": 4897
  },
  "42041": {
    "progShare": 0.207,
    "estabShare": 0.793,
    "magaShare": 0.782,
    "relShare": 0.076,
    "modShare": 0.142,
    "demTurnoutBasis": 15926,
    "repTurnoutBasis": 19635
  },
  "42043": {
    "progShare": 0.307,
    "estabShare": 0.693,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 11652,
    "repTurnoutBasis": 10057
  },
  "42045": {
    "progShare": 0.288,
    "estabShare": 0.712,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 29023,
    "repTurnoutBasis": 16440
  },
  "42047": {
    "progShare": 0.227,
    "estabShare": 0.773,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1726,
    "repTurnoutBasis": 2659
  },
  "42049": {
    "progShare": 0.216,
    "estabShare": 0.784,
    "magaShare": 0.798,
    "relShare": 0.078,
    "modShare": 0.124,
    "demTurnoutBasis": 19988,
    "repTurnoutBasis": 12929
  },
  "42051": {
    "progShare": 0.261,
    "estabShare": 0.739,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4078,
    "repTurnoutBasis": 3293
  },
  "42053": {
    "progShare": 0.176,
    "estabShare": 0.824,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 277
  },
  "42055": {
    "progShare": 0.207,
    "estabShare": 0.793,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5175,
    "repTurnoutBasis": 13718
  },
  "42061": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.786,
    "relShare": 0.077,
    "modShare": 0.137,
    "demTurnoutBasis": 608,
    "repTurnoutBasis": 1872
  },
  "42063": {
    "progShare": 0.32,
    "estabShare": 0.68,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2346,
    "repTurnoutBasis": 3308
  },
  "42067": {
    "progShare": 0.227,
    "estabShare": 0.773,
    "magaShare": 0.835,
    "relShare": 0.081,
    "modShare": 0.084,
    "demTurnoutBasis": 753,
    "repTurnoutBasis": 2323
  },
  "42069": {
    "progShare": 0.166,
    "estabShare": 0.834,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 19735,
    "repTurnoutBasis": 9383
  },
  "42071": {
    "progShare": 0.38,
    "estabShare": 0.62,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 14524,
    "repTurnoutBasis": 19566
  },
  "42073": {
    "progShare": 0.18,
    "estabShare": 0.82,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4805,
    "repTurnoutBasis": 5372
  },
  "42075": {
    "progShare": 0.199,
    "estabShare": 0.801,
    "magaShare": 0.814,
    "relShare": 0.079,
    "modShare": 0.107,
    "demTurnoutBasis": 5431,
    "repTurnoutBasis": 11686
  },
  "42077": {
    "progShare": 0.334,
    "estabShare": 0.666,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 13078,
    "repTurnoutBasis": 9259
  },
  "42079": {
    "progShare": 0.307,
    "estabShare": 0.693,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 11186,
    "repTurnoutBasis": 9520
  },
  "42081": {
    "progShare": 0.245,
    "estabShare": 0.755,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4040,
    "repTurnoutBasis": 9790
  },
  "42083": {
    "progShare": 0.33,
    "estabShare": 0.67,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 689,
    "repTurnoutBasis": 1918
  },
  "42085": {
    "progShare": 0.179,
    "estabShare": 0.821,
    "magaShare": 0.83,
    "relShare": 0.081,
    "modShare": 0.089,
    "demTurnoutBasis": 5299,
    "repTurnoutBasis": 6880
  },
  "42087": {
    "progShare": 0.209,
    "estabShare": 0.791,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1218,
    "repTurnoutBasis": 3908
  },
  "42089": {
    "progShare": 0.323,
    "estabShare": 0.677,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5341,
    "repTurnoutBasis": 3741
  },
  "42091": {
    "progShare": 0.294,
    "estabShare": 0.706,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 48745,
    "repTurnoutBasis": 21754
  },
  "42093": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.685,
    "relShare": 0.074,
    "modShare": 0.241,
    "demTurnoutBasis": 369,
    "repTurnoutBasis": 630
  },
  "42095": {
    "progShare": 0.209,
    "estabShare": 0.791,
    "magaShare": 0.824,
    "relShare": 0.08,
    "modShare": 0.096,
    "demTurnoutBasis": 20648,
    "repTurnoutBasis": 15999
  },
  "42097": {
    "progShare": 0.218,
    "estabShare": 0.782,
    "magaShare": 0.835,
    "relShare": 0.081,
    "modShare": 0.084,
    "demTurnoutBasis": 3305,
    "repTurnoutBasis": 6240
  },
  "42099": {
    "progShare": 0.351,
    "estabShare": 0.649,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 927,
    "repTurnoutBasis": 2722
  },
  "42101": {
    "progShare": 0.335,
    "estabShare": 0.665,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 101397,
    "repTurnoutBasis": 8608
  },
  "42103": {
    "progShare": 0.182,
    "estabShare": 0.818,
    "magaShare": 0.834,
    "relShare": 0.081,
    "modShare": 0.085,
    "demTurnoutBasis": 2667,
    "repTurnoutBasis": 3528
  },
  "42105": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.796,
    "relShare": 0.078,
    "modShare": 0.126,
    "demTurnoutBasis": 205,
    "repTurnoutBasis": 813
  },
  "42107": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3565,
    "repTurnoutBasis": 6455
  },
  "42109": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.762,
    "relShare": 0.074,
    "modShare": 0.164,
    "demTurnoutBasis": 489,
    "repTurnoutBasis": 1543
  },
  "42113": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.748,
    "relShare": 0.074,
    "modShare": 0.178,
    "demTurnoutBasis": 153,
    "repTurnoutBasis": 339
  },
  "42117": {
    "progShare": 0.18,
    "estabShare": 0.82,
    "magaShare": 0.822,
    "relShare": 0.08,
    "modShare": 0.098,
    "demTurnoutBasis": 1679,
    "repTurnoutBasis": 5596
  },
  "42121": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.755,
    "relShare": 0.074,
    "modShare": 0.171,
    "demTurnoutBasis": 858,
    "repTurnoutBasis": 1946
  },
  "42125": {
    "progShare": 0.176,
    "estabShare": 0.824,
    "magaShare": 0.836,
    "relShare": 0.082,
    "modShare": 0.082,
    "demTurnoutBasis": 14266,
    "repTurnoutBasis": 13136
  },
  "42127": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.766,
    "relShare": 0.075,
    "modShare": 0.159,
    "demTurnoutBasis": 946,
    "repTurnoutBasis": 2110
  },
  "42129": {
    "progShare": 0.298,
    "estabShare": 0.702,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 13880,
    "repTurnoutBasis": 13693
  },
  "42133": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 11746,
    "repTurnoutBasis": 16926
  },
  "44001": {
    "progShare": 0.52,
    "estabShare": 0.48,
    "magaShare": 0.545,
    "relShare": 0.095,
    "modShare": 0.36,
    "demTurnoutBasis": 3396,
    "repTurnoutBasis": 1752
  },
  "44003": {
    "progShare": 0.592,
    "estabShare": 0.408,
    "magaShare": 0.676,
    "relShare": 0.092,
    "modShare": 0.232,
    "demTurnoutBasis": 8959,
    "repTurnoutBasis": 6633
  },
  "44005": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.578,
    "relShare": 0.114,
    "modShare": 0.308,
    "demTurnoutBasis": 5220,
    "repTurnoutBasis": 3087
  },
  "44007": {
    "progShare": 0.544,
    "estabShare": 0.456,
    "magaShare": 0.684,
    "relShare": 0.103,
    "modShare": 0.213,
    "demTurnoutBasis": 32703,
    "repTurnoutBasis": 12984
  },
  "44009": {
    "progShare": 0.616,
    "estabShare": 0.384,
    "magaShare": 0.588,
    "relShare": 0.108,
    "modShare": 0.304,
    "demTurnoutBasis": 8103,
    "repTurnoutBasis": 5252
  },
  "45001": {
    "progShare": 0.262,
    "estabShare": 0.738,
    "magaShare": 0.369,
    "relShare": 0.322,
    "modShare": 0.309,
    "demTurnoutBasis": 1900,
    "repTurnoutBasis": 1840
  },
  "45003": {
    "progShare": 0.37,
    "estabShare": 0.63,
    "magaShare": 0.316,
    "relShare": 0.337,
    "modShare": 0.347,
    "demTurnoutBasis": 12462,
    "repTurnoutBasis": 14520
  },
  "45005": {
    "progShare": 0.23,
    "estabShare": 0.77,
    "magaShare": 0.443,
    "relShare": 0.211,
    "modShare": 0.346,
    "demTurnoutBasis": 1037,
    "repTurnoutBasis": 181
  },
  "45007": {
    "progShare": 0.407,
    "estabShare": 0.593,
    "magaShare": 0.319,
    "relShare": 0.342,
    "modShare": 0.339,
    "demTurnoutBasis": 10835,
    "repTurnoutBasis": 17194
  },
  "45009": {
    "progShare": 0.241,
    "estabShare": 0.759,
    "magaShare": 0.401,
    "relShare": 0.226,
    "modShare": 0.373,
    "demTurnoutBasis": 1894,
    "repTurnoutBasis": 600
  },
  "45011": {
    "progShare": 0.238,
    "estabShare": 0.762,
    "magaShare": 0.428,
    "relShare": 0.265,
    "modShare": 0.307,
    "demTurnoutBasis": 1789,
    "repTurnoutBasis": 1295
  },
  "45013": {
    "progShare": 0.32,
    "estabShare": 0.68,
    "magaShare": 0.301,
    "relShare": 0.167,
    "modShare": 0.532,
    "demTurnoutBasis": 19106,
    "repTurnoutBasis": 16553
  },
  "45015": {
    "progShare": 0.345,
    "estabShare": 0.655,
    "magaShare": 0.34,
    "relShare": 0.285,
    "modShare": 0.375,
    "demTurnoutBasis": 17380,
    "repTurnoutBasis": 13851
  },
  "45017": {
    "progShare": 0.242,
    "estabShare": 0.758,
    "magaShare": 0.352,
    "relShare": 0.307,
    "modShare": 0.341,
    "demTurnoutBasis": 1825,
    "repTurnoutBasis": 1145
  },
  "45019": {
    "progShare": 0.365,
    "estabShare": 0.635,
    "magaShare": 0.264,
    "relShare": 0.211,
    "modShare": 0.525,
    "demTurnoutBasis": 52164,
    "repTurnoutBasis": 27401
  },
  "45021": {
    "progShare": 0.299,
    "estabShare": 0.701,
    "magaShare": 0.42,
    "relShare": 0.332,
    "modShare": 0.248,
    "demTurnoutBasis": 2791,
    "repTurnoutBasis": 4309
  },
  "45023": {
    "progShare": 0.258,
    "estabShare": 0.742,
    "magaShare": 0.421,
    "relShare": 0.339,
    "modShare": 0.24,
    "demTurnoutBasis": 2826,
    "repTurnoutBasis": 1665
  },
  "45025": {
    "progShare": 0.238,
    "estabShare": 0.762,
    "magaShare": 0.402,
    "relShare": 0.372,
    "modShare": 0.226,
    "demTurnoutBasis": 2759,
    "repTurnoutBasis": 2267
  },
  "45027": {
    "progShare": 0.173,
    "estabShare": 0.827,
    "magaShare": 0.374,
    "relShare": 0.303,
    "modShare": 0.323,
    "demTurnoutBasis": 3944,
    "repTurnoutBasis": 2170
  },
  "45029": {
    "progShare": 0.265,
    "estabShare": 0.735,
    "magaShare": 0.433,
    "relShare": 0.258,
    "modShare": 0.309,
    "demTurnoutBasis": 3787,
    "repTurnoutBasis": 2688
  },
  "45031": {
    "progShare": 0.257,
    "estabShare": 0.743,
    "magaShare": 0.378,
    "relShare": 0.351,
    "modShare": 0.271,
    "demTurnoutBasis": 6513,
    "repTurnoutBasis": 4440
  },
  "45033": {
    "progShare": 0.243,
    "estabShare": 0.757,
    "magaShare": 0.363,
    "relShare": 0.383,
    "modShare": 0.254,
    "demTurnoutBasis": 2146,
    "repTurnoutBasis": 1338
  },
  "45035": {
    "progShare": 0.357,
    "estabShare": 0.643,
    "magaShare": 0.315,
    "relShare": 0.295,
    "modShare": 0.39,
    "demTurnoutBasis": 12993,
    "repTurnoutBasis": 11063
  },
  "45037": {
    "progShare": 0.29,
    "estabShare": 0.71,
    "magaShare": 0.341,
    "relShare": 0.368,
    "modShare": 0.291,
    "demTurnoutBasis": 2089,
    "repTurnoutBasis": 2005
  },
  "45039": {
    "progShare": 0.232,
    "estabShare": 0.768,
    "magaShare": 0.359,
    "relShare": 0.303,
    "modShare": 0.338,
    "demTurnoutBasis": 3794,
    "repTurnoutBasis": 1282
  },
  "45041": {
    "progShare": 0.291,
    "estabShare": 0.709,
    "magaShare": 0.331,
    "relShare": 0.357,
    "modShare": 0.312,
    "demTurnoutBasis": 13426,
    "repTurnoutBasis": 9085
  },
  "45043": {
    "progShare": 0.288,
    "estabShare": 0.712,
    "magaShare": 0.402,
    "relShare": 0.192,
    "modShare": 0.406,
    "demTurnoutBasis": 7646,
    "repTurnoutBasis": 5756
  },
  "45045": {
    "progShare": 0.423,
    "estabShare": 0.577,
    "magaShare": 0.268,
    "relShare": 0.333,
    "modShare": 0.399,
    "demTurnoutBasis": 42743,
    "repTurnoutBasis": 46737
  },
  "45047": {
    "progShare": 0.334,
    "estabShare": 0.666,
    "magaShare": 0.288,
    "relShare": 0.323,
    "modShare": 0.389,
    "demTurnoutBasis": 5159,
    "repTurnoutBasis": 5297
  },
  "45049": {
    "progShare": 0.27,
    "estabShare": 0.73,
    "magaShare": 0.434,
    "relShare": 0.275,
    "modShare": 0.291,
    "demTurnoutBasis": 2151,
    "repTurnoutBasis": 832
  },
  "45051": {
    "progShare": 0.384,
    "estabShare": 0.616,
    "magaShare": 0.492,
    "relShare": 0.207,
    "modShare": 0.301,
    "demTurnoutBasis": 23619,
    "repTurnoutBasis": 27138
  },
  "45053": {
    "progShare": 0.272,
    "estabShare": 0.728,
    "magaShare": 0.392,
    "relShare": 0.243,
    "modShare": 0.365,
    "demTurnoutBasis": 2991,
    "repTurnoutBasis": 1492
  },
  "45055": {
    "progShare": 0.302,
    "estabShare": 0.698,
    "magaShare": 0.344,
    "relShare": 0.317,
    "modShare": 0.339,
    "demTurnoutBasis": 5674,
    "repTurnoutBasis": 5358
  },
  "45057": {
    "progShare": 0.302,
    "estabShare": 0.698,
    "magaShare": 0.339,
    "relShare": 0.309,
    "modShare": 0.352,
    "demTurnoutBasis": 6508,
    "repTurnoutBasis": 6209
  },
  "45059": {
    "progShare": 0.33,
    "estabShare": 0.67,
    "magaShare": 0.344,
    "relShare": 0.367,
    "modShare": 0.289,
    "demTurnoutBasis": 4321,
    "repTurnoutBasis": 4830
  },
  "45061": {
    "progShare": 0.201,
    "estabShare": 0.799,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 2622,
    "repTurnoutBasis": 150
  },
  "45063": {
    "progShare": 0.427,
    "estabShare": 0.573,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 19450,
    "repTurnoutBasis": 150
  },
  "45065": {
    "progShare": 0.304,
    "estabShare": 0.696,
    "magaShare": 0.339,
    "relShare": 0.263,
    "modShare": 0.398,
    "demTurnoutBasis": 1330,
    "repTurnoutBasis": 909
  },
  "45067": {
    "progShare": 0.223,
    "estabShare": 0.777,
    "magaShare": 0.426,
    "relShare": 0.31,
    "modShare": 0.264,
    "demTurnoutBasis": 4014,
    "repTurnoutBasis": 1423
  },
  "45069": {
    "progShare": 0.228,
    "estabShare": 0.772,
    "magaShare": 0.422,
    "relShare": 0.307,
    "modShare": 0.271,
    "demTurnoutBasis": 2410,
    "repTurnoutBasis": 877
  },
  "45071": {
    "progShare": 0.269,
    "estabShare": 0.731,
    "magaShare": 0.344,
    "relShare": 0.301,
    "modShare": 0.355,
    "demTurnoutBasis": 2923,
    "repTurnoutBasis": 2978
  },
  "45073": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.284,
    "relShare": 0.275,
    "modShare": 0.441,
    "demTurnoutBasis": 4544,
    "repTurnoutBasis": 7796
  },
  "45075": {
    "progShare": 0.188,
    "estabShare": 0.812,
    "magaShare": 0.38,
    "relShare": 0.255,
    "modShare": 0.365,
    "demTurnoutBasis": 13202,
    "repTurnoutBasis": 3357
  },
  "45077": {
    "progShare": 0.489,
    "estabShare": 0.511,
    "magaShare": 0.301,
    "relShare": 0.342,
    "modShare": 0.357,
    "demTurnoutBasis": 6110,
    "repTurnoutBasis": 11857
  },
  "45079": {
    "progShare": 0.317,
    "estabShare": 0.683,
    "magaShare": 0.234,
    "relShare": 0.27,
    "modShare": 0.496,
    "demTurnoutBasis": 59707,
    "repTurnoutBasis": 19689
  },
  "45081": {
    "progShare": 0.285,
    "estabShare": 0.715,
    "magaShare": 0.364,
    "relShare": 0.318,
    "modShare": 0.318,
    "demTurnoutBasis": 1335,
    "repTurnoutBasis": 1716
  },
  "45083": {
    "progShare": 0.394,
    "estabShare": 0.606,
    "magaShare": 0.327,
    "relShare": 0.332,
    "modShare": 0.341,
    "demTurnoutBasis": 19386,
    "repTurnoutBasis": 23373
  },
  "45085": {
    "progShare": 0.217,
    "estabShare": 0.783,
    "magaShare": 0.337,
    "relShare": 0.295,
    "modShare": 0.368,
    "demTurnoutBasis": 12077,
    "repTurnoutBasis": 5590
  },
  "45087": {
    "progShare": 0.275,
    "estabShare": 0.725,
    "magaShare": 0.388,
    "relShare": 0.297,
    "modShare": 0.315,
    "demTurnoutBasis": 2145,
    "repTurnoutBasis": 1806
  },
  "45089": {
    "progShare": 0.19,
    "estabShare": 0.81,
    "magaShare": 0.433,
    "relShare": 0.265,
    "modShare": 0.302,
    "demTurnoutBasis": 5233,
    "repTurnoutBasis": 1371
  },
  "45091": {
    "progShare": 0.381,
    "estabShare": 0.619,
    "magaShare": 0.318,
    "relShare": 0.346,
    "modShare": 0.336,
    "demTurnoutBasis": 20334,
    "repTurnoutBasis": 19070
  },
  "46003": {
    "progShare": 0.211,
    "estabShare": 0.789,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46005": {
    "progShare": 0.148,
    "estabShare": 0.852,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 374,
    "repTurnoutBasis": 150
  },
  "46007": {
    "progShare": 0.322,
    "estabShare": 0.678,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46009": {
    "progShare": 0.226,
    "estabShare": 0.774,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 169,
    "repTurnoutBasis": 150
  },
  "46011": {
    "progShare": 0.251,
    "estabShare": 0.749,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 801,
    "repTurnoutBasis": 150
  },
  "46013": {
    "progShare": 0.183,
    "estabShare": 0.817,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1075,
    "repTurnoutBasis": 150
  },
  "46015": {
    "progShare": 0.188,
    "estabShare": 0.812,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46017": {
    "progShare": 0.4,
    "estabShare": 0.6,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46019": {
    "progShare": 0.245,
    "estabShare": 0.755,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 182,
    "repTurnoutBasis": 150
  },
  "46021": {
    "progShare": 0.257,
    "estabShare": 0.743,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46023": {
    "progShare": 0.288,
    "estabShare": 0.712,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 220,
    "repTurnoutBasis": 150
  },
  "46025": {
    "progShare": 0.142,
    "estabShare": 0.858,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46027": {
    "progShare": 0.192,
    "estabShare": 0.808,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 767,
    "repTurnoutBasis": 150
  },
  "46029": {
    "progShare": 0.169,
    "estabShare": 0.831,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 580,
    "repTurnoutBasis": 150
  },
  "46031": {
    "progShare": 0.421,
    "estabShare": 0.579,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46033": {
    "progShare": 0.155,
    "estabShare": 0.845,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 274,
    "repTurnoutBasis": 150
  },
  "46035": {
    "progShare": 0.139,
    "estabShare": 0.861,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 691,
    "repTurnoutBasis": 150
  },
  "46037": {
    "progShare": 0.133,
    "estabShare": 0.867,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 213,
    "repTurnoutBasis": 150
  },
  "46039": {
    "progShare": 0.216,
    "estabShare": 0.784,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46041": {
    "progShare": 0.387,
    "estabShare": 0.613,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 227,
    "repTurnoutBasis": 150
  },
  "46043": {
    "progShare": 0.132,
    "estabShare": 0.868,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46045": {
    "progShare": 0.179,
    "estabShare": 0.821,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46047": {
    "progShare": 0.201,
    "estabShare": 0.799,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 204,
    "repTurnoutBasis": 150
  },
  "46049": {
    "progShare": 0.209,
    "estabShare": 0.791,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46051": {
    "progShare": 0.156,
    "estabShare": 0.844,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 194,
    "repTurnoutBasis": 150
  },
  "46053": {
    "progShare": 0.2,
    "estabShare": 0.8,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 154,
    "repTurnoutBasis": 150
  },
  "46055": {
    "progShare": 0.245,
    "estabShare": 0.755,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46057": {
    "progShare": 0.178,
    "estabShare": 0.822,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46059": {
    "progShare": 0.17,
    "estabShare": 0.83,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46061": {
    "progShare": 0.195,
    "estabShare": 0.805,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46063": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46065": {
    "progShare": 0.251,
    "estabShare": 0.749,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 355,
    "repTurnoutBasis": 150
  },
  "46067": {
    "progShare": 0.177,
    "estabShare": 0.823,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46069": {
    "progShare": 0.197,
    "estabShare": 0.803,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46071": {
    "progShare": 0.299,
    "estabShare": 0.701,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46073": {
    "progShare": 0.157,
    "estabShare": 0.843,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46075": {
    "progShare": 0.256,
    "estabShare": 0.744,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46077": {
    "progShare": 0.204,
    "estabShare": 0.796,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46079": {
    "progShare": 0.234,
    "estabShare": 0.766,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 413,
    "repTurnoutBasis": 150
  },
  "46081": {
    "progShare": 0.233,
    "estabShare": 0.767,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 797,
    "repTurnoutBasis": 150
  },
  "46083": {
    "progShare": 0.204,
    "estabShare": 0.796,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 1442,
    "repTurnoutBasis": 150
  },
  "46085": {
    "progShare": 0.389,
    "estabShare": 0.611,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46087": {
    "progShare": 0.193,
    "estabShare": 0.807,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46089": {
    "progShare": 0.268,
    "estabShare": 0.732,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46091": {
    "progShare": 0.181,
    "estabShare": 0.819,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 224,
    "repTurnoutBasis": 150
  },
  "46093": {
    "progShare": 0.181,
    "estabShare": 0.819,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 540,
    "repTurnoutBasis": 150
  },
  "46095": {
    "progShare": 0.361,
    "estabShare": 0.639,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46097": {
    "progShare": 0.189,
    "estabShare": 0.811,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46099": {
    "progShare": 0.258,
    "estabShare": 0.742,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 5353,
    "repTurnoutBasis": 150
  },
  "46101": {
    "progShare": 0.235,
    "estabShare": 0.765,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 164,
    "repTurnoutBasis": 150
  },
  "46103": {
    "progShare": 0.233,
    "estabShare": 0.767,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 3258,
    "repTurnoutBasis": 150
  },
  "46105": {
    "progShare": 0.262,
    "estabShare": 0.738,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46107": {
    "progShare": 0.213,
    "estabShare": 0.787,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46109": {
    "progShare": 0.245,
    "estabShare": 0.755,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 386,
    "repTurnoutBasis": 150
  },
  "46111": {
    "progShare": 0.173,
    "estabShare": 0.827,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46113": {
    "progShare": 0.378,
    "estabShare": 0.622,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 349,
    "repTurnoutBasis": 150
  },
  "46115": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46117": {
    "progShare": 0.153,
    "estabShare": 0.847,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46119": {
    "progShare": 0.171,
    "estabShare": 0.829,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46121": {
    "progShare": 0.398,
    "estabShare": 0.602,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 364,
    "repTurnoutBasis": 150
  },
  "46123": {
    "progShare": 0.147,
    "estabShare": 0.853,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46125": {
    "progShare": 0.192,
    "estabShare": 0.808,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 191,
    "repTurnoutBasis": 150
  },
  "46127": {
    "progShare": 0.182,
    "estabShare": 0.818,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 375,
    "repTurnoutBasis": 150
  },
  "46129": {
    "progShare": 0.243,
    "estabShare": 0.757,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "46135": {
    "progShare": 0.167,
    "estabShare": 0.833,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 621,
    "repTurnoutBasis": 150
  },
  "46137": {
    "progShare": 0.406,
    "estabShare": 0.594,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "47001": {
    "progShare": 0.371,
    "estabShare": 0.629,
    "magaShare": 0.647,
    "relShare": 0.143,
    "modShare": 0.21,
    "demTurnoutBasis": 5843,
    "repTurnoutBasis": 11795
  },
  "47003": {
    "progShare": 0.288,
    "estabShare": 0.712,
    "magaShare": 0.714,
    "relShare": 0.168,
    "modShare": 0.118,
    "demTurnoutBasis": 1997,
    "repTurnoutBasis": 6387
  },
  "47005": {
    "progShare": 0.278,
    "estabShare": 0.722,
    "magaShare": 0.758,
    "relShare": 0.138,
    "modShare": 0.104,
    "demTurnoutBasis": 924,
    "repTurnoutBasis": 2525
  },
  "47007": {
    "progShare": 0.264,
    "estabShare": 0.736,
    "magaShare": 0.75,
    "relShare": 0.14,
    "modShare": 0.11,
    "demTurnoutBasis": 696,
    "repTurnoutBasis": 2367
  },
  "47009": {
    "progShare": 0.363,
    "estabShare": 0.637,
    "magaShare": 0.654,
    "relShare": 0.136,
    "modShare": 0.21,
    "demTurnoutBasis": 7618,
    "repTurnoutBasis": 24239
  },
  "47011": {
    "progShare": 0.36,
    "estabShare": 0.64,
    "magaShare": 0.663,
    "relShare": 0.143,
    "modShare": 0.194,
    "demTurnoutBasis": 4105,
    "repTurnoutBasis": 18894
  },
  "47013": {
    "progShare": 0.29,
    "estabShare": 0.71,
    "magaShare": 0.749,
    "relShare": 0.123,
    "modShare": 0.128,
    "demTurnoutBasis": 1147,
    "repTurnoutBasis": 4584
  },
  "47015": {
    "progShare": 0.319,
    "estabShare": 0.681,
    "magaShare": 0.746,
    "relShare": 0.167,
    "modShare": 0.087,
    "demTurnoutBasis": 745,
    "repTurnoutBasis": 2462
  },
  "47017": {
    "progShare": 0.252,
    "estabShare": 0.748,
    "magaShare": 0.696,
    "relShare": 0.171,
    "modShare": 0.133,
    "demTurnoutBasis": 1191,
    "repTurnoutBasis": 3792
  },
  "47019": {
    "progShare": 0.436,
    "estabShare": 0.564,
    "magaShare": 0.699,
    "relShare": 0.145,
    "modShare": 0.156,
    "demTurnoutBasis": 2135,
    "repTurnoutBasis": 10712
  },
  "47021": {
    "progShare": 0.368,
    "estabShare": 0.632,
    "magaShare": 0.672,
    "relShare": 0.178,
    "modShare": 0.15,
    "demTurnoutBasis": 2587,
    "repTurnoutBasis": 5814
  },
  "47023": {
    "progShare": 0.288,
    "estabShare": 0.712,
    "magaShare": 0.702,
    "relShare": 0.175,
    "modShare": 0.123,
    "demTurnoutBasis": 613,
    "repTurnoutBasis": 2801
  },
  "47025": {
    "progShare": 0.3,
    "estabShare": 0.7,
    "magaShare": 0.789,
    "relShare": 0.1,
    "modShare": 0.111,
    "demTurnoutBasis": 1142,
    "repTurnoutBasis": 5096
  },
  "47027": {
    "progShare": 0.262,
    "estabShare": 0.738,
    "magaShare": 0.755,
    "relShare": 0.121,
    "modShare": 0.124,
    "demTurnoutBasis": 385,
    "repTurnoutBasis": 1055
  },
  "47029": {
    "progShare": 0.355,
    "estabShare": 0.645,
    "magaShare": 0.769,
    "relShare": 0.114,
    "modShare": 0.117,
    "demTurnoutBasis": 1095,
    "repTurnoutBasis": 7434
  },
  "47031": {
    "progShare": 0.313,
    "estabShare": 0.687,
    "magaShare": 0.701,
    "relShare": 0.148,
    "modShare": 0.151,
    "demTurnoutBasis": 2819,
    "repTurnoutBasis": 10091
  },
  "47033": {
    "progShare": 0.18,
    "estabShare": 0.82,
    "magaShare": 0.721,
    "relShare": 0.167,
    "modShare": 0.112,
    "demTurnoutBasis": 605,
    "repTurnoutBasis": 2205
  },
  "47035": {
    "progShare": 0.29,
    "estabShare": 0.71,
    "magaShare": 0.736,
    "relShare": 0.123,
    "modShare": 0.141,
    "demTurnoutBasis": 3130,
    "repTurnoutBasis": 15965
  },
  "47037": {
    "progShare": 0.331,
    "estabShare": 0.669,
    "magaShare": 0.508,
    "relShare": 0.162,
    "modShare": 0.33,
    "demTurnoutBasis": 98655,
    "repTurnoutBasis": 50034
  },
  "47039": {
    "progShare": 0.236,
    "estabShare": 0.764,
    "magaShare": 0.773,
    "relShare": 0.115,
    "modShare": 0.112,
    "demTurnoutBasis": 543,
    "repTurnoutBasis": 2110
  },
  "47041": {
    "progShare": 0.278,
    "estabShare": 0.722,
    "magaShare": 0.739,
    "relShare": 0.131,
    "modShare": 0.13,
    "demTurnoutBasis": 1074,
    "repTurnoutBasis": 3034
  },
  "47043": {
    "progShare": 0.308,
    "estabShare": 0.692,
    "magaShare": 0.681,
    "relShare": 0.177,
    "modShare": 0.142,
    "demTurnoutBasis": 2783,
    "repTurnoutBasis": 6496
  },
  "47045": {
    "progShare": 0.231,
    "estabShare": 0.769,
    "magaShare": 0.697,
    "relShare": 0.169,
    "modShare": 0.134,
    "demTurnoutBasis": 1326,
    "repTurnoutBasis": 4863
  },
  "47047": {
    "progShare": 0.159,
    "estabShare": 0.841,
    "magaShare": 0.669,
    "relShare": 0.2,
    "modShare": 0.131,
    "demTurnoutBasis": 2927,
    "repTurnoutBasis": 7476
  },
  "47049": {
    "progShare": 0.311,
    "estabShare": 0.689,
    "magaShare": 0.751,
    "relShare": 0.158,
    "modShare": 0.091,
    "demTurnoutBasis": 624,
    "repTurnoutBasis": 3335
  },
  "47051": {
    "progShare": 0.309,
    "estabShare": 0.691,
    "magaShare": 0.728,
    "relShare": 0.138,
    "modShare": 0.134,
    "demTurnoutBasis": 2870,
    "repTurnoutBasis": 7394
  },
  "47053": {
    "progShare": 0.194,
    "estabShare": 0.806,
    "magaShare": 0.669,
    "relShare": 0.201,
    "modShare": 0.13,
    "demTurnoutBasis": 2323,
    "repTurnoutBasis": 6701
  },
  "47055": {
    "progShare": 0.231,
    "estabShare": 0.769,
    "magaShare": 0.741,
    "relShare": 0.147,
    "modShare": 0.112,
    "demTurnoutBasis": 1503,
    "repTurnoutBasis": 4040
  },
  "47057": {
    "progShare": 0.313,
    "estabShare": 0.687,
    "magaShare": 0.774,
    "relShare": 0.11,
    "modShare": 0.116,
    "demTurnoutBasis": 619,
    "repTurnoutBasis": 4467
  },
  "47059": {
    "progShare": 0.372,
    "estabShare": 0.628,
    "magaShare": 0.699,
    "relShare": 0.146,
    "modShare": 0.155,
    "demTurnoutBasis": 2563,
    "repTurnoutBasis": 11987
  },
  "47061": {
    "progShare": 0.281,
    "estabShare": 0.719,
    "magaShare": 0.789,
    "relShare": 0.132,
    "modShare": 0.079,
    "demTurnoutBasis": 732,
    "repTurnoutBasis": 1989
  },
  "47063": {
    "progShare": 0.342,
    "estabShare": 0.658,
    "magaShare": 0.695,
    "relShare": 0.144,
    "modShare": 0.161,
    "demTurnoutBasis": 2261,
    "repTurnoutBasis": 10926
  },
  "47065": {
    "progShare": 0.314,
    "estabShare": 0.686,
    "magaShare": 0.588,
    "relShare": 0.145,
    "modShare": 0.267,
    "demTurnoutBasis": 34927,
    "repTurnoutBasis": 54443
  },
  "47067": {
    "progShare": 0.336,
    "estabShare": 0.664,
    "magaShare": 0.761,
    "relShare": 0.119,
    "modShare": 0.12,
    "demTurnoutBasis": 164,
    "repTurnoutBasis": 1066
  },
  "47069": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.73,
    "relShare": 0.163,
    "modShare": 0.107,
    "demTurnoutBasis": 2167,
    "repTurnoutBasis": 2438
  },
  "47071": {
    "progShare": 0.246,
    "estabShare": 0.754,
    "magaShare": 0.754,
    "relShare": 0.114,
    "modShare": 0.132,
    "demTurnoutBasis": 912,
    "repTurnoutBasis": 4033
  },
  "47073": {
    "progShare": 0.33,
    "estabShare": 0.67,
    "magaShare": 0.719,
    "relShare": 0.136,
    "modShare": 0.145,
    "demTurnoutBasis": 1854,
    "repTurnoutBasis": 9848
  },
  "47075": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.652,
    "relShare": 0.212,
    "modShare": 0.136,
    "demTurnoutBasis": 1642,
    "repTurnoutBasis": 1381
  },
  "47077": {
    "progShare": 0.266,
    "estabShare": 0.734,
    "magaShare": 0.764,
    "relShare": 0.126,
    "modShare": 0.11,
    "demTurnoutBasis": 719,
    "repTurnoutBasis": 5377
  },
  "47079": {
    "progShare": 0.253,
    "estabShare": 0.747,
    "magaShare": 0.709,
    "relShare": 0.147,
    "modShare": 0.144,
    "demTurnoutBasis": 1793,
    "repTurnoutBasis": 5501
  },
  "47081": {
    "progShare": 0.323,
    "estabShare": 0.677,
    "magaShare": 0.723,
    "relShare": 0.173,
    "modShare": 0.104,
    "demTurnoutBasis": 1058,
    "repTurnoutBasis": 3049
  },
  "47083": {
    "progShare": 0.263,
    "estabShare": 0.737,
    "magaShare": 0.747,
    "relShare": 0.134,
    "modShare": 0.119,
    "demTurnoutBasis": 497,
    "repTurnoutBasis": 1121
  },
  "47085": {
    "progShare": 0.274,
    "estabShare": 0.726,
    "magaShare": 0.723,
    "relShare": 0.15,
    "modShare": 0.127,
    "demTurnoutBasis": 1185,
    "repTurnoutBasis": 2372
  },
  "47087": {
    "progShare": 0.292,
    "estabShare": 0.708,
    "magaShare": 0.734,
    "relShare": 0.158,
    "modShare": 0.108,
    "demTurnoutBasis": 665,
    "repTurnoutBasis": 1729
  },
  "47089": {
    "progShare": 0.357,
    "estabShare": 0.643,
    "magaShare": 0.7,
    "relShare": 0.135,
    "modShare": 0.165,
    "demTurnoutBasis": 1900,
    "repTurnoutBasis": 10095
  },
  "47091": {
    "progShare": 0.374,
    "estabShare": 0.626,
    "magaShare": 0.727,
    "relShare": 0.142,
    "modShare": 0.131,
    "demTurnoutBasis": 608,
    "repTurnoutBasis": 3248
  },
  "47093": {
    "progShare": 0.403,
    "estabShare": 0.597,
    "magaShare": 0.605,
    "relShare": 0.129,
    "modShare": 0.266,
    "demTurnoutBasis": 42141,
    "repTurnoutBasis": 73746
  },
  "47095": {
    "progShare": 0.195,
    "estabShare": 0.805,
    "magaShare": 0.771,
    "relShare": 0.143,
    "modShare": 0.086,
    "demTurnoutBasis": 284,
    "repTurnoutBasis": 598
  },
  "47097": {
    "progShare": 0.165,
    "estabShare": 0.835,
    "magaShare": 0.722,
    "relShare": 0.168,
    "modShare": 0.11,
    "demTurnoutBasis": 1453,
    "repTurnoutBasis": 2400
  },
  "47099": {
    "progShare": 0.337,
    "estabShare": 0.663,
    "magaShare": 0.725,
    "relShare": 0.165,
    "modShare": 0.11,
    "demTurnoutBasis": 2190,
    "repTurnoutBasis": 6041
  },
  "47101": {
    "progShare": 0.421,
    "estabShare": 0.579,
    "magaShare": 0.758,
    "relShare": 0.158,
    "modShare": 0.084,
    "demTurnoutBasis": 563,
    "repTurnoutBasis": 1784
  },
  "47103": {
    "progShare": 0.275,
    "estabShare": 0.725,
    "magaShare": 0.733,
    "relShare": 0.147,
    "modShare": 0.12,
    "demTurnoutBasis": 1381,
    "repTurnoutBasis": 6015
  },
  "47105": {
    "progShare": 0.269,
    "estabShare": 0.731,
    "magaShare": 0.676,
    "relShare": 0.112,
    "modShare": 0.212,
    "demTurnoutBasis": 2870,
    "repTurnoutBasis": 13023
  },
  "47107": {
    "progShare": 0.307,
    "estabShare": 0.693,
    "magaShare": 0.72,
    "relShare": 0.135,
    "modShare": 0.145,
    "demTurnoutBasis": 2116,
    "repTurnoutBasis": 10370
  },
  "47109": {
    "progShare": 0.208,
    "estabShare": 0.792,
    "magaShare": 0.736,
    "relShare": 0.146,
    "modShare": 0.118,
    "demTurnoutBasis": 1043,
    "repTurnoutBasis": 4072
  },
  "47111": {
    "progShare": 0.304,
    "estabShare": 0.696,
    "magaShare": 0.794,
    "relShare": 0.126,
    "modShare": 0.08,
    "demTurnoutBasis": 601,
    "repTurnoutBasis": 3713
  },
  "47113": {
    "progShare": 0.183,
    "estabShare": 0.817,
    "magaShare": 0.602,
    "relShare": 0.199,
    "modShare": 0.199,
    "demTurnoutBasis": 7166,
    "repTurnoutBasis": 11845
  },
  "47115": {
    "progShare": 0.274,
    "estabShare": 0.726,
    "magaShare": 0.76,
    "relShare": 0.108,
    "modShare": 0.132,
    "demTurnoutBasis": 2310,
    "repTurnoutBasis": 4516
  },
  "47117": {
    "progShare": 0.292,
    "estabShare": 0.708,
    "magaShare": 0.725,
    "relShare": 0.156,
    "modShare": 0.119,
    "demTurnoutBasis": 1574,
    "repTurnoutBasis": 4199
  },
  "47119": {
    "progShare": 0.315,
    "estabShare": 0.685,
    "magaShare": 0.673,
    "relShare": 0.173,
    "modShare": 0.154,
    "demTurnoutBasis": 5270,
    "repTurnoutBasis": 13063
  },
  "47121": {
    "progShare": 0.247,
    "estabShare": 0.753,
    "magaShare": 0.797,
    "relShare": 0.085,
    "modShare": 0.118,
    "demTurnoutBasis": 612,
    "repTurnoutBasis": 2788
  },
  "47123": {
    "progShare": 0.277,
    "estabShare": 0.723,
    "magaShare": 0.729,
    "relShare": 0.126,
    "modShare": 0.145,
    "demTurnoutBasis": 2078,
    "repTurnoutBasis": 9839
  },
  "47125": {
    "progShare": 0.321,
    "estabShare": 0.679,
    "magaShare": 0.645,
    "relShare": 0.156,
    "modShare": 0.199,
    "demTurnoutBasis": 11642,
    "repTurnoutBasis": 18437
  },
  "47127": {
    "progShare": 0.25,
    "estabShare": 0.75,
    "magaShare": 0.701,
    "relShare": 0.185,
    "modShare": 0.114,
    "demTurnoutBasis": 354,
    "repTurnoutBasis": 1510
  },
  "47129": {
    "progShare": 0.338,
    "estabShare": 0.662,
    "magaShare": 0.744,
    "relShare": 0.152,
    "modShare": 0.104,
    "demTurnoutBasis": 696,
    "repTurnoutBasis": 2905
  },
  "47131": {
    "progShare": 0.259,
    "estabShare": 0.741,
    "magaShare": 0.69,
    "relShare": 0.2,
    "modShare": 0.11,
    "demTurnoutBasis": 1225,
    "repTurnoutBasis": 4500
  },
  "47133": {
    "progShare": 0.297,
    "estabShare": 0.703,
    "magaShare": 0.725,
    "relShare": 0.165,
    "modShare": 0.11,
    "demTurnoutBasis": 1507,
    "repTurnoutBasis": 3560
  },
  "47135": {
    "progShare": 0.293,
    "estabShare": 0.707,
    "magaShare": 0.765,
    "relShare": 0.127,
    "modShare": 0.108,
    "demTurnoutBasis": 351,
    "repTurnoutBasis": 1077
  },
  "47137": {
    "progShare": 0.203,
    "estabShare": 0.797,
    "magaShare": 0.744,
    "relShare": 0.138,
    "modShare": 0.118,
    "demTurnoutBasis": 311,
    "repTurnoutBasis": 1345
  },
  "47139": {
    "progShare": 0.33,
    "estabShare": 0.67,
    "magaShare": 0.807,
    "relShare": 0.101,
    "modShare": 0.092,
    "demTurnoutBasis": 1435,
    "repTurnoutBasis": 3249
  },
  "47141": {
    "progShare": 0.405,
    "estabShare": 0.595,
    "magaShare": 0.653,
    "relShare": 0.181,
    "modShare": 0.166,
    "demTurnoutBasis": 4579,
    "repTurnoutBasis": 10989
  },
  "47143": {
    "progShare": 0.31,
    "estabShare": 0.69,
    "magaShare": 0.713,
    "relShare": 0.123,
    "modShare": 0.164,
    "demTurnoutBasis": 1132,
    "repTurnoutBasis": 6543
  },
  "47145": {
    "progShare": 0.308,
    "estabShare": 0.692,
    "magaShare": 0.681,
    "relShare": 0.147,
    "modShare": 0.172,
    "demTurnoutBasis": 3148,
    "repTurnoutBasis": 9310
  },
  "47147": {
    "progShare": 0.282,
    "estabShare": 0.718,
    "magaShare": 0.657,
    "relShare": 0.19,
    "modShare": 0.153,
    "demTurnoutBasis": 3647,
    "repTurnoutBasis": 10190
  },
  "47149": {
    "progShare": 0.385,
    "estabShare": 0.615,
    "magaShare": 0.621,
    "relShare": 0.188,
    "modShare": 0.191,
    "demTurnoutBasis": 21609,
    "repTurnoutBasis": 38061
  },
  "47151": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.735,
    "relShare": 0.135,
    "modShare": 0.13,
    "demTurnoutBasis": 477,
    "repTurnoutBasis": 2419
  },
  "47153": {
    "progShare": 0.335,
    "estabShare": 0.665,
    "magaShare": 0.733,
    "relShare": 0.131,
    "modShare": 0.136,
    "demTurnoutBasis": 629,
    "repTurnoutBasis": 2456
  },
  "47155": {
    "progShare": 0.392,
    "estabShare": 0.608,
    "magaShare": 0.694,
    "relShare": 0.14,
    "modShare": 0.166,
    "demTurnoutBasis": 3506,
    "repTurnoutBasis": 16640
  },
  "47157": {
    "progShare": 0.215,
    "estabShare": 0.785,
    "magaShare": 0.529,
    "relShare": 0.2,
    "modShare": 0.271,
    "demTurnoutBasis": 107131,
    "repTurnoutBasis": 60828
  },
  "47159": {
    "progShare": 0.271,
    "estabShare": 0.729,
    "magaShare": 0.79,
    "relShare": 0.13,
    "modShare": 0.08,
    "demTurnoutBasis": 1098,
    "repTurnoutBasis": 4308
  },
  "47161": {
    "progShare": 0.282,
    "estabShare": 0.718,
    "magaShare": 0.734,
    "relShare": 0.135,
    "modShare": 0.131,
    "demTurnoutBasis": 805,
    "repTurnoutBasis": 2143
  },
  "47163": {
    "progShare": 0.379,
    "estabShare": 0.621,
    "magaShare": 0.624,
    "relShare": 0.176,
    "modShare": 0.2,
    "demTurnoutBasis": 6831,
    "repTurnoutBasis": 22690
  },
  "47165": {
    "progShare": 0.313,
    "estabShare": 0.687,
    "magaShare": 0.632,
    "relShare": 0.166,
    "modShare": 0.202,
    "demTurnoutBasis": 10370,
    "repTurnoutBasis": 30306
  },
  "47167": {
    "progShare": 0.262,
    "estabShare": 0.738,
    "magaShare": 0.687,
    "relShare": 0.185,
    "modShare": 0.128,
    "demTurnoutBasis": 2462,
    "repTurnoutBasis": 8841
  },
  "47169": {
    "progShare": 0.231,
    "estabShare": 0.769,
    "magaShare": 0.744,
    "relShare": 0.164,
    "modShare": 0.092,
    "demTurnoutBasis": 478,
    "repTurnoutBasis": 1070
  },
  "47171": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.747,
    "relShare": 0.115,
    "modShare": 0.138,
    "demTurnoutBasis": 725,
    "repTurnoutBasis": 4059
  },
  "47173": {
    "progShare": 0.322,
    "estabShare": 0.678,
    "magaShare": 0.761,
    "relShare": 0.131,
    "modShare": 0.108,
    "demTurnoutBasis": 628,
    "repTurnoutBasis": 2654
  },
  "47175": {
    "progShare": 0.262,
    "estabShare": 0.738,
    "magaShare": 0.765,
    "relShare": 0.149,
    "modShare": 0.086,
    "demTurnoutBasis": 361,
    "repTurnoutBasis": 995
  },
  "47177": {
    "progShare": 0.306,
    "estabShare": 0.694,
    "magaShare": 0.703,
    "relShare": 0.157,
    "modShare": 0.14,
    "demTurnoutBasis": 2284,
    "repTurnoutBasis": 4956
  },
  "47179": {
    "progShare": 0.454,
    "estabShare": 0.546,
    "magaShare": 0.637,
    "relShare": 0.154,
    "modShare": 0.209,
    "demTurnoutBasis": 7637,
    "repTurnoutBasis": 20814
  },
  "47181": {
    "progShare": 0.275,
    "estabShare": 0.725,
    "magaShare": 0.755,
    "relShare": 0.15,
    "modShare": 0.095,
    "demTurnoutBasis": 366,
    "repTurnoutBasis": 2316
  },
  "47183": {
    "progShare": 0.314,
    "estabShare": 0.686,
    "magaShare": 0.688,
    "relShare": 0.179,
    "modShare": 0.133,
    "demTurnoutBasis": 1515,
    "repTurnoutBasis": 4517
  },
  "47185": {
    "progShare": 0.315,
    "estabShare": 0.685,
    "magaShare": 0.757,
    "relShare": 0.145,
    "modShare": 0.098,
    "demTurnoutBasis": 1245,
    "repTurnoutBasis": 4732
  },
  "47187": {
    "progShare": 0.305,
    "estabShare": 0.695,
    "magaShare": 0.552,
    "relShare": 0.149,
    "modShare": 0.299,
    "demTurnoutBasis": 18921,
    "repTurnoutBasis": 45138
  },
  "47189": {
    "progShare": 0.295,
    "estabShare": 0.705,
    "magaShare": 0.665,
    "relShare": 0.161,
    "modShare": 0.174,
    "demTurnoutBasis": 8469,
    "repTurnoutBasis": 25620
  },
  "48001": {
    "progShare": 0.248,
    "estabShare": 0.752,
    "magaShare": 0.583,
    "relShare": 0.319,
    "modShare": 0.098,
    "demTurnoutBasis": 2113,
    "repTurnoutBasis": 12463
  },
  "48003": {
    "progShare": 0.406,
    "estabShare": 0.594,
    "magaShare": 0.519,
    "relShare": 0.315,
    "modShare": 0.166,
    "demTurnoutBasis": 231,
    "repTurnoutBasis": 4162
  },
  "48005": {
    "progShare": 0.256,
    "estabShare": 0.744,
    "magaShare": 0.678,
    "relShare": 0.223,
    "modShare": 0.099,
    "demTurnoutBasis": 4300,
    "repTurnoutBasis": 13187
  },
  "48007": {
    "progShare": 0.332,
    "estabShare": 0.668,
    "magaShare": 0.611,
    "relShare": 0.2,
    "modShare": 0.189,
    "demTurnoutBasis": 1369,
    "repTurnoutBasis": 7492
  },
  "48009": {
    "progShare": 0.326,
    "estabShare": 0.674,
    "magaShare": 0.703,
    "relShare": 0.217,
    "modShare": 0.08,
    "demTurnoutBasis": 168,
    "repTurnoutBasis": 2529
  },
  "48011": {
    "progShare": 0.487,
    "estabShare": 0.513,
    "magaShare": 0.565,
    "relShare": 0.337,
    "modShare": 0.098,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1124
  },
  "48013": {
    "progShare": 0.318,
    "estabShare": 0.682,
    "magaShare": 0.593,
    "relShare": 0.294,
    "modShare": 0.113,
    "demTurnoutBasis": 3300,
    "repTurnoutBasis": 6770
  },
  "48015": {
    "progShare": 0.266,
    "estabShare": 0.734,
    "magaShare": 0.557,
    "relShare": 0.32,
    "modShare": 0.123,
    "demTurnoutBasis": 1184,
    "repTurnoutBasis": 8538
  },
  "48017": {
    "progShare": 0.336,
    "estabShare": 0.664,
    "magaShare": 0.66,
    "relShare": 0.243,
    "modShare": 0.097,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 937
  },
  "48019": {
    "progShare": 0.402,
    "estabShare": 0.598,
    "magaShare": 0.594,
    "relShare": 0.273,
    "modShare": 0.133,
    "demTurnoutBasis": 1260,
    "repTurnoutBasis": 7373
  },
  "48021": {
    "progShare": 0.425,
    "estabShare": 0.575,
    "magaShare": 0.569,
    "relShare": 0.264,
    "modShare": 0.167,
    "demTurnoutBasis": 8614,
    "repTurnoutBasis": 14830
  },
  "48023": {
    "progShare": 0.292,
    "estabShare": 0.708,
    "magaShare": 0.725,
    "relShare": 0.187,
    "modShare": 0.088,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 851
  },
  "48025": {
    "progShare": 0.249,
    "estabShare": 0.751,
    "magaShare": 0.482,
    "relShare": 0.341,
    "modShare": 0.177,
    "demTurnoutBasis": 2128,
    "repTurnoutBasis": 3904
  },
  "48027": {
    "progShare": 0.327,
    "estabShare": 0.673,
    "magaShare": 0.509,
    "relShare": 0.301,
    "modShare": 0.19,
    "demTurnoutBasis": 19759,
    "repTurnoutBasis": 43099
  },
  "48029": {
    "progShare": 0.387,
    "estabShare": 0.613,
    "magaShare": 0.462,
    "relShare": 0.271,
    "modShare": 0.267,
    "demTurnoutBasis": 201162,
    "repTurnoutBasis": 173148
  },
  "48031": {
    "progShare": 0.408,
    "estabShare": 0.592,
    "magaShare": 0.659,
    "relShare": 0.221,
    "modShare": 0.12,
    "demTurnoutBasis": 780,
    "repTurnoutBasis": 2667
  },
  "48033": {
    "progShare": 0.176,
    "estabShare": 0.824,
    "magaShare": 0.668,
    "relShare": 0.252,
    "modShare": 0.08,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 275
  },
  "48035": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.692,
    "relShare": 0.226,
    "modShare": 0.082,
    "demTurnoutBasis": 640,
    "repTurnoutBasis": 4006
  },
  "48037": {
    "progShare": 0.235,
    "estabShare": 0.765,
    "magaShare": 0.563,
    "relShare": 0.291,
    "modShare": 0.146,
    "demTurnoutBasis": 5022,
    "repTurnoutBasis": 22951
  },
  "48039": {
    "progShare": 0.331,
    "estabShare": 0.669,
    "magaShare": 0.546,
    "relShare": 0.305,
    "modShare": 0.149,
    "demTurnoutBasis": 23826,
    "repTurnoutBasis": 57135
  },
  "48041": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.563,
    "relShare": 0.251,
    "modShare": 0.186,
    "demTurnoutBasis": 10119,
    "repTurnoutBasis": 22195
  },
  "48043": {
    "progShare": 0.52,
    "estabShare": 0.48,
    "magaShare": 0.662,
    "relShare": 0.2,
    "modShare": 0.138,
    "demTurnoutBasis": 1460,
    "repTurnoutBasis": 1106
  },
  "48045": {
    "progShare": 0.389,
    "estabShare": 0.611,
    "magaShare": 0.699,
    "relShare": 0.221,
    "modShare": 0.08,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 483
  },
  "48047": {
    "progShare": 0.287,
    "estabShare": 0.713,
    "magaShare": 0.719,
    "relShare": 0.203,
    "modShare": 0.078,
    "demTurnoutBasis": 1854,
    "repTurnoutBasis": 150
  },
  "48049": {
    "progShare": 0.376,
    "estabShare": 0.624,
    "magaShare": 0.535,
    "relShare": 0.332,
    "modShare": 0.133,
    "demTurnoutBasis": 932,
    "repTurnoutBasis": 11874
  },
  "48051": {
    "progShare": 0.237,
    "estabShare": 0.763,
    "magaShare": 0.615,
    "relShare": 0.297,
    "modShare": 0.088,
    "demTurnoutBasis": 1013,
    "repTurnoutBasis": 5074
  },
  "48053": {
    "progShare": 0.371,
    "estabShare": 0.629,
    "magaShare": 0.537,
    "relShare": 0.274,
    "modShare": 0.189,
    "demTurnoutBasis": 2788,
    "repTurnoutBasis": 13621
  },
  "48055": {
    "progShare": 0.393,
    "estabShare": 0.607,
    "magaShare": 0.649,
    "relShare": 0.22,
    "modShare": 0.131,
    "demTurnoutBasis": 2668,
    "repTurnoutBasis": 3584
  },
  "48057": {
    "progShare": 0.302,
    "estabShare": 0.698,
    "magaShare": 0.593,
    "relShare": 0.278,
    "modShare": 0.129,
    "demTurnoutBasis": 1566,
    "repTurnoutBasis": 3751
  },
  "48059": {
    "progShare": 0.487,
    "estabShare": 0.513,
    "magaShare": 0.563,
    "relShare": 0.323,
    "modShare": 0.114,
    "demTurnoutBasis": 326,
    "repTurnoutBasis": 4683
  },
  "48061": {
    "progShare": 0.343,
    "estabShare": 0.657,
    "magaShare": 0.543,
    "relShare": 0.233,
    "modShare": 0.224,
    "demTurnoutBasis": 45571,
    "repTurnoutBasis": 16758
  },
  "48063": {
    "progShare": 0.228,
    "estabShare": 0.772,
    "magaShare": 0.716,
    "relShare": 0.187,
    "modShare": 0.097,
    "demTurnoutBasis": 649,
    "repTurnoutBasis": 1923
  },
  "48065": {
    "progShare": 0.333,
    "estabShare": 0.667,
    "magaShare": 0.663,
    "relShare": 0.258,
    "modShare": 0.079,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1500
  },
  "48067": {
    "progShare": 0.255,
    "estabShare": 0.745,
    "magaShare": 0.679,
    "relShare": 0.24,
    "modShare": 0.081,
    "demTurnoutBasis": 1092,
    "repTurnoutBasis": 4977
  },
  "48069": {
    "progShare": 0.249,
    "estabShare": 0.751,
    "magaShare": 0.506,
    "relShare": 0.348,
    "modShare": 0.146,
    "demTurnoutBasis": 257,
    "repTurnoutBasis": 1384
  },
  "48071": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.71,
    "relShare": 0.21,
    "modShare": 0.08,
    "demTurnoutBasis": 1134,
    "repTurnoutBasis": 7395
  },
  "48073": {
    "progShare": 0.251,
    "estabShare": 0.749,
    "magaShare": 0.572,
    "relShare": 0.323,
    "modShare": 0.105,
    "demTurnoutBasis": 2169,
    "repTurnoutBasis": 12549
  },
  "48075": {
    "progShare": 0.398,
    "estabShare": 0.602,
    "magaShare": 0.574,
    "relShare": 0.302,
    "modShare": 0.124,
    "demTurnoutBasis": 195,
    "repTurnoutBasis": 2100
  },
  "48077": {
    "progShare": 0.318,
    "estabShare": 0.682,
    "magaShare": 0.588,
    "relShare": 0.3,
    "modShare": 0.112,
    "demTurnoutBasis": 326,
    "repTurnoutBasis": 4381
  },
  "48079": {
    "progShare": 0.37,
    "estabShare": 0.63,
    "magaShare": 0.433,
    "relShare": 0.343,
    "modShare": 0.224,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 963
  },
  "48081": {
    "progShare": 0.41,
    "estabShare": 0.59,
    "magaShare": 0.593,
    "relShare": 0.288,
    "modShare": 0.119,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1292
  },
  "48083": {
    "progShare": 0.365,
    "estabShare": 0.635,
    "magaShare": 0.607,
    "relShare": 0.293,
    "modShare": 0.1,
    "demTurnoutBasis": 207,
    "repTurnoutBasis": 3503
  },
  "48085": {
    "progShare": 0.415,
    "estabShare": 0.585,
    "magaShare": 0.57,
    "relShare": 0.213,
    "modShare": 0.217,
    "demTurnoutBasis": 62379,
    "repTurnoutBasis": 92831
  },
  "48087": {
    "progShare": 0.354,
    "estabShare": 0.646,
    "magaShare": 0.716,
    "relShare": 0.204,
    "modShare": 0.08,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 646
  },
  "48089": {
    "progShare": 0.253,
    "estabShare": 0.747,
    "magaShare": 0.588,
    "relShare": 0.289,
    "modShare": 0.123,
    "demTurnoutBasis": 1107,
    "repTurnoutBasis": 5656
  },
  "48091": {
    "progShare": 0.382,
    "estabShare": 0.618,
    "magaShare": 0.517,
    "relShare": 0.289,
    "modShare": 0.194,
    "demTurnoutBasis": 10222,
    "repTurnoutBasis": 39553
  },
  "48093": {
    "progShare": 0.326,
    "estabShare": 0.674,
    "magaShare": 0.701,
    "relShare": 0.214,
    "modShare": 0.085,
    "demTurnoutBasis": 364,
    "repTurnoutBasis": 2830
  },
  "48095": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.621,
    "relShare": 0.256,
    "modShare": 0.123,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1103
  },
  "48097": {
    "progShare": 0.392,
    "estabShare": 0.608,
    "magaShare": 0.596,
    "relShare": 0.281,
    "modShare": 0.123,
    "demTurnoutBasis": 1410,
    "repTurnoutBasis": 13091
  },
  "48099": {
    "progShare": 0.373,
    "estabShare": 0.627,
    "magaShare": 0.586,
    "relShare": 0.275,
    "modShare": 0.139,
    "demTurnoutBasis": 2843,
    "repTurnoutBasis": 11339
  },
  "48101": {
    "progShare": 0.423,
    "estabShare": 0.577,
    "magaShare": 0.708,
    "relShare": 0.215,
    "modShare": 0.077,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 341
  },
  "48103": {
    "progShare": 0.348,
    "estabShare": 0.652,
    "magaShare": 0.569,
    "relShare": 0.258,
    "modShare": 0.173,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 820
  },
  "48105": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.818,
    "relShare": 0.103,
    "modShare": 0.079,
    "demTurnoutBasis": 509,
    "repTurnoutBasis": 380
  },
  "48107": {
    "progShare": 0.375,
    "estabShare": 0.625,
    "magaShare": 0.697,
    "relShare": 0.217,
    "modShare": 0.086,
    "demTurnoutBasis": 209,
    "repTurnoutBasis": 779
  },
  "48109": {
    "progShare": 0.372,
    "estabShare": 0.628,
    "magaShare": 0.612,
    "relShare": 0.284,
    "modShare": 0.104,
    "demTurnoutBasis": 582,
    "repTurnoutBasis": 150
  },
  "48111": {
    "progShare": 0.317,
    "estabShare": 0.683,
    "magaShare": 0.431,
    "relShare": 0.366,
    "modShare": 0.203,
    "demTurnoutBasis": 155,
    "repTurnoutBasis": 2462
  },
  "48113": {
    "progShare": 0.325,
    "estabShare": 0.675,
    "magaShare": 0.429,
    "relShare": 0.244,
    "modShare": 0.327,
    "demTurnoutBasis": 280408,
    "repTurnoutBasis": 218208
  },
  "48115": {
    "progShare": 0.305,
    "estabShare": 0.695,
    "magaShare": 0.632,
    "relShare": 0.22,
    "modShare": 0.148,
    "demTurnoutBasis": 232,
    "repTurnoutBasis": 1981
  },
  "48117": {
    "progShare": 0.321,
    "estabShare": 0.679,
    "magaShare": 0.609,
    "relShare": 0.254,
    "modShare": 0.137,
    "demTurnoutBasis": 330,
    "repTurnoutBasis": 1712
  },
  "48119": {
    "progShare": 0.3,
    "estabShare": 0.7,
    "magaShare": 0.739,
    "relShare": 0.181,
    "modShare": 0.08,
    "demTurnoutBasis": 156,
    "repTurnoutBasis": 1344
  },
  "48121": {
    "progShare": 0.473,
    "estabShare": 0.527,
    "magaShare": 0.488,
    "relShare": 0.27,
    "modShare": 0.242,
    "demTurnoutBasis": 66270,
    "repTurnoutBasis": 129806
  },
  "48123": {
    "progShare": 0.291,
    "estabShare": 0.709,
    "magaShare": 0.675,
    "relShare": 0.231,
    "modShare": 0.094,
    "demTurnoutBasis": 469,
    "repTurnoutBasis": 3210
  },
  "48125": {
    "progShare": 0.399,
    "estabShare": 0.601,
    "magaShare": 0.504,
    "relShare": 0.362,
    "modShare": 0.134,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1137
  },
  "48127": {
    "progShare": 0.328,
    "estabShare": 0.672,
    "magaShare": 0.665,
    "relShare": 0.244,
    "modShare": 0.091,
    "demTurnoutBasis": 2477,
    "repTurnoutBasis": 150
  },
  "48129": {
    "progShare": 0.388,
    "estabShare": 0.612,
    "magaShare": 0.697,
    "relShare": 0.222,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 797
  },
  "48131": {
    "progShare": 0.307,
    "estabShare": 0.693,
    "magaShare": 0.758,
    "relShare": 0.164,
    "modShare": 0.078,
    "demTurnoutBasis": 2645,
    "repTurnoutBasis": 150
  },
  "48133": {
    "progShare": 0.415,
    "estabShare": 0.585,
    "magaShare": 0.523,
    "relShare": 0.374,
    "modShare": 0.103,
    "demTurnoutBasis": 672,
    "repTurnoutBasis": 7775
  },
  "48135": {
    "progShare": 0.381,
    "estabShare": 0.619,
    "magaShare": 0.633,
    "relShare": 0.24,
    "modShare": 0.127,
    "demTurnoutBasis": 3142,
    "repTurnoutBasis": 13484
  },
  "48137": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.743,
    "relShare": 0.165,
    "modShare": 0.092,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 600
  },
  "48139": {
    "progShare": 0.315,
    "estabShare": 0.685,
    "magaShare": 0.549,
    "relShare": 0.303,
    "modShare": 0.148,
    "demTurnoutBasis": 10236,
    "repTurnoutBasis": 36991
  },
  "48141": {
    "progShare": 0.367,
    "estabShare": 0.633,
    "magaShare": 0.47,
    "relShare": 0.259,
    "modShare": 0.271,
    "demTurnoutBasis": 89009,
    "repTurnoutBasis": 38007
  },
  "48143": {
    "progShare": 0.447,
    "estabShare": 0.553,
    "magaShare": 0.594,
    "relShare": 0.278,
    "modShare": 0.128,
    "demTurnoutBasis": 1369,
    "repTurnoutBasis": 10795
  },
  "48145": {
    "progShare": 0.204,
    "estabShare": 0.796,
    "magaShare": 0.592,
    "relShare": 0.293,
    "modShare": 0.115,
    "demTurnoutBasis": 1047,
    "repTurnoutBasis": 3424
  },
  "48147": {
    "progShare": 0.323,
    "estabShare": 0.677,
    "magaShare": 0.599,
    "relShare": 0.297,
    "modShare": 0.104,
    "demTurnoutBasis": 895,
    "repTurnoutBasis": 8424
  },
  "48149": {
    "progShare": 0.325,
    "estabShare": 0.675,
    "magaShare": 0.58,
    "relShare": 0.278,
    "modShare": 0.142,
    "demTurnoutBasis": 1530,
    "repTurnoutBasis": 8758
  },
  "48151": {
    "progShare": 0.372,
    "estabShare": 0.628,
    "magaShare": 0.586,
    "relShare": 0.308,
    "modShare": 0.106,
    "demTurnoutBasis": 496,
    "repTurnoutBasis": 877
  },
  "48153": {
    "progShare": 0.282,
    "estabShare": 0.718,
    "magaShare": 0.442,
    "relShare": 0.383,
    "modShare": 0.175,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1827
  },
  "48155": {
    "progShare": 0.552,
    "estabShare": 0.448,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 188
  },
  "48157": {
    "progShare": 0.304,
    "estabShare": 0.696,
    "magaShare": 0.515,
    "relShare": 0.275,
    "modShare": 0.21,
    "demTurnoutBasis": 74009,
    "repTurnoutBasis": 97209
  },
  "48159": {
    "progShare": 0.251,
    "estabShare": 0.749,
    "magaShare": 0.631,
    "relShare": 0.239,
    "modShare": 0.13,
    "demTurnoutBasis": 307,
    "repTurnoutBasis": 2112
  },
  "48161": {
    "progShare": 0.256,
    "estabShare": 0.744,
    "magaShare": 0.567,
    "relShare": 0.317,
    "modShare": 0.116,
    "demTurnoutBasis": 846,
    "repTurnoutBasis": 6646
  },
  "48163": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.663,
    "relShare": 0.259,
    "modShare": 0.078,
    "demTurnoutBasis": 2645,
    "repTurnoutBasis": 446
  },
  "48165": {
    "progShare": 0.385,
    "estabShare": 0.615,
    "magaShare": 0.507,
    "relShare": 0.368,
    "modShare": 0.125,
    "demTurnoutBasis": 258,
    "repTurnoutBasis": 3282
  },
  "48167": {
    "progShare": 0.345,
    "estabShare": 0.655,
    "magaShare": 0.647,
    "relShare": 0.216,
    "modShare": 0.137,
    "demTurnoutBasis": 18128,
    "repTurnoutBasis": 34042
  },
  "48169": {
    "progShare": 0.354,
    "estabShare": 0.646,
    "magaShare": 0.413,
    "relShare": 0.448,
    "modShare": 0.139,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1807
  },
  "48171": {
    "progShare": 0.32,
    "estabShare": 0.68,
    "magaShare": 0.622,
    "relShare": 0.213,
    "modShare": 0.165,
    "demTurnoutBasis": 1146,
    "repTurnoutBasis": 7049
  },
  "48173": {
    "progShare": 0.476,
    "estabShare": 0.524,
    "magaShare": 0.64,
    "relShare": 0.243,
    "modShare": 0.117,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 380
  },
  "48175": {
    "progShare": 0.273,
    "estabShare": 0.727,
    "magaShare": 0.604,
    "relShare": 0.276,
    "modShare": 0.12,
    "demTurnoutBasis": 822,
    "repTurnoutBasis": 2269
  },
  "48177": {
    "progShare": 0.285,
    "estabShare": 0.715,
    "magaShare": 0.709,
    "relShare": 0.204,
    "modShare": 0.087,
    "demTurnoutBasis": 569,
    "repTurnoutBasis": 3177
  },
  "48179": {
    "progShare": 0.394,
    "estabShare": 0.606,
    "magaShare": 0.676,
    "relShare": 0.244,
    "modShare": 0.08,
    "demTurnoutBasis": 241,
    "repTurnoutBasis": 4171
  },
  "48181": {
    "progShare": 0.413,
    "estabShare": 0.587,
    "magaShare": 0.54,
    "relShare": 0.291,
    "modShare": 0.169,
    "demTurnoutBasis": 6668,
    "repTurnoutBasis": 28019
  },
  "48183": {
    "progShare": 0.233,
    "estabShare": 0.767,
    "magaShare": 0.487,
    "relShare": 0.318,
    "modShare": 0.195,
    "demTurnoutBasis": 7196,
    "repTurnoutBasis": 23962
  },
  "48185": {
    "progShare": 0.285,
    "estabShare": 0.715,
    "magaShare": 0.597,
    "relShare": 0.295,
    "modShare": 0.108,
    "demTurnoutBasis": 1349,
    "repTurnoutBasis": 6422
  },
  "48187": {
    "progShare": 0.375,
    "estabShare": 0.625,
    "magaShare": 0.544,
    "relShare": 0.279,
    "modShare": 0.177,
    "demTurnoutBasis": 11048,
    "repTurnoutBasis": 29452
  },
  "48189": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.442,
    "relShare": 0.371,
    "modShare": 0.187,
    "demTurnoutBasis": 846,
    "repTurnoutBasis": 5763
  },
  "48191": {
    "progShare": 0.273,
    "estabShare": 0.727,
    "magaShare": 0.694,
    "relShare": 0.228,
    "modShare": 0.078,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 507
  },
  "48193": {
    "progShare": 0.317,
    "estabShare": 0.683,
    "magaShare": 0.714,
    "relShare": 0.206,
    "modShare": 0.08,
    "demTurnoutBasis": 287,
    "repTurnoutBasis": 2199
  },
  "48195": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.661,
    "relShare": 0.241,
    "modShare": 0.098,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1246
  },
  "48197": {
    "progShare": 0.411,
    "estabShare": 0.589,
    "magaShare": 0.712,
    "relShare": 0.195,
    "modShare": 0.093,
    "demTurnoutBasis": 152,
    "repTurnoutBasis": 684
  },
  "48199": {
    "progShare": 0.343,
    "estabShare": 0.657,
    "magaShare": 0.578,
    "relShare": 0.321,
    "modShare": 0.101,
    "demTurnoutBasis": 1775,
    "repTurnoutBasis": 17095
  },
  "48201": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.466,
    "relShare": 0.297,
    "modShare": 0.237,
    "demTurnoutBasis": 384340,
    "repTurnoutBasis": 423799
  },
  "48203": {
    "progShare": 0.224,
    "estabShare": 0.776,
    "magaShare": 0.567,
    "relShare": 0.299,
    "modShare": 0.134,
    "demTurnoutBasis": 4304,
    "repTurnoutBasis": 14640
  },
  "48205": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.674,
    "relShare": 0.222,
    "modShare": 0.104,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1115
  },
  "48207": {
    "progShare": 0.31,
    "estabShare": 0.69,
    "magaShare": 0.675,
    "relShare": 0.246,
    "modShare": 0.079,
    "demTurnoutBasis": 223,
    "repTurnoutBasis": 800
  },
  "48209": {
    "progShare": 0.533,
    "estabShare": 0.467,
    "magaShare": 0.493,
    "relShare": 0.272,
    "modShare": 0.235,
    "demTurnoutBasis": 26929,
    "repTurnoutBasis": 28055
  },
  "48211": {
    "progShare": 0.227,
    "estabShare": 0.773,
    "magaShare": 0.616,
    "relShare": 0.238,
    "modShare": 0.146,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1032
  },
  "48213": {
    "progShare": 0.279,
    "estabShare": 0.721,
    "magaShare": 0.562,
    "relShare": 0.295,
    "modShare": 0.143,
    "demTurnoutBasis": 3756,
    "repTurnoutBasis": 21336
  },
  "48215": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.513,
    "relShare": 0.255,
    "modShare": 0.232,
    "demTurnoutBasis": 90487,
    "repTurnoutBasis": 24893
  },
  "48217": {
    "progShare": 0.295,
    "estabShare": 0.705,
    "magaShare": 0.547,
    "relShare": 0.308,
    "modShare": 0.145,
    "demTurnoutBasis": 1687,
    "repTurnoutBasis": 11731
  },
  "48219": {
    "progShare": 0.374,
    "estabShare": 0.626,
    "magaShare": 0.636,
    "relShare": 0.257,
    "modShare": 0.107,
    "demTurnoutBasis": 353,
    "repTurnoutBasis": 3712
  },
  "48221": {
    "progShare": 0.329,
    "estabShare": 0.671,
    "magaShare": 0.694,
    "relShare": 0.191,
    "modShare": 0.115,
    "demTurnoutBasis": 1937,
    "repTurnoutBasis": 13843
  },
  "48223": {
    "progShare": 0.32,
    "estabShare": 0.68,
    "magaShare": 0.547,
    "relShare": 0.313,
    "modShare": 0.14,
    "demTurnoutBasis": 1552,
    "repTurnoutBasis": 9392
  },
  "48225": {
    "progShare": 0.214,
    "estabShare": 0.786,
    "magaShare": 0.708,
    "relShare": 0.213,
    "modShare": 0.079,
    "demTurnoutBasis": 739,
    "repTurnoutBasis": 4202
  },
  "48227": {
    "progShare": 0.338,
    "estabShare": 0.662,
    "magaShare": 0.57,
    "relShare": 0.297,
    "modShare": 0.133,
    "demTurnoutBasis": 944,
    "repTurnoutBasis": 5583
  },
  "48229": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.735,
    "relShare": 0.179,
    "modShare": 0.086,
    "demTurnoutBasis": 302,
    "repTurnoutBasis": 178
  },
  "48231": {
    "progShare": 0.396,
    "estabShare": 0.604,
    "magaShare": 0.573,
    "relShare": 0.304,
    "modShare": 0.123,
    "demTurnoutBasis": 3835,
    "repTurnoutBasis": 21005
  },
  "48233": {
    "progShare": 0.384,
    "estabShare": 0.616,
    "magaShare": 0.575,
    "relShare": 0.31,
    "modShare": 0.115,
    "demTurnoutBasis": 450,
    "repTurnoutBasis": 7374
  },
  "48235": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.567,
    "relShare": 0.313,
    "modShare": 0.12,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 659
  },
  "48237": {
    "progShare": 0.304,
    "estabShare": 0.696,
    "magaShare": 0.718,
    "relShare": 0.203,
    "modShare": 0.079,
    "demTurnoutBasis": 158,
    "repTurnoutBasis": 1889
  },
  "48239": {
    "progShare": 0.26,
    "estabShare": 0.74,
    "magaShare": 0.69,
    "relShare": 0.225,
    "modShare": 0.085,
    "demTurnoutBasis": 373,
    "repTurnoutBasis": 2647
  },
  "48241": {
    "progShare": 0.226,
    "estabShare": 0.774,
    "magaShare": 0.721,
    "relShare": 0.201,
    "modShare": 0.078,
    "demTurnoutBasis": 1269,
    "repTurnoutBasis": 6102
  },
  "48243": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.672,
    "relShare": 0.218,
    "modShare": 0.11,
    "demTurnoutBasis": 307,
    "repTurnoutBasis": 498
  },
  "48245": {
    "progShare": 0.229,
    "estabShare": 0.771,
    "magaShare": 0.566,
    "relShare": 0.299,
    "modShare": 0.135,
    "demTurnoutBasis": 31686,
    "repTurnoutBasis": 26179
  },
  "48247": {
    "progShare": 0.274,
    "estabShare": 0.726,
    "magaShare": 0.57,
    "relShare": 0.303,
    "modShare": 0.127,
    "demTurnoutBasis": 1563,
    "repTurnoutBasis": 150
  },
  "48249": {
    "progShare": 0.252,
    "estabShare": 0.748,
    "magaShare": 0.513,
    "relShare": 0.308,
    "modShare": 0.179,
    "demTurnoutBasis": 12182,
    "repTurnoutBasis": 3778
  },
  "48251": {
    "progShare": 0.401,
    "estabShare": 0.599,
    "magaShare": 0.638,
    "relShare": 0.256,
    "modShare": 0.106,
    "demTurnoutBasis": 5042,
    "repTurnoutBasis": 21330
  },
  "48253": {
    "progShare": 0.347,
    "estabShare": 0.653,
    "magaShare": 0.558,
    "relShare": 0.316,
    "modShare": 0.126,
    "demTurnoutBasis": 448,
    "repTurnoutBasis": 4801
  },
  "48255": {
    "progShare": 0.384,
    "estabShare": 0.616,
    "magaShare": 0.742,
    "relShare": 0.179,
    "modShare": 0.079,
    "demTurnoutBasis": 996,
    "repTurnoutBasis": 1466
  },
  "48257": {
    "progShare": 0.329,
    "estabShare": 0.671,
    "magaShare": 0.575,
    "relShare": 0.288,
    "modShare": 0.137,
    "demTurnoutBasis": 6022,
    "repTurnoutBasis": 25186
  },
  "48259": {
    "progShare": 0.383,
    "estabShare": 0.617,
    "magaShare": 0.498,
    "relShare": 0.292,
    "modShare": 0.21,
    "demTurnoutBasis": 2435,
    "repTurnoutBasis": 13774
  },
  "48261": {
    "progShare": 0.334,
    "estabShare": 0.666,
    "magaShare": 0.389,
    "relShare": 0.336,
    "modShare": 0.275,
    "demTurnoutBasis": 179,
    "repTurnoutBasis": 150
  },
  "48263": {
    "progShare": 0.359,
    "estabShare": 0.641,
    "magaShare": 0.675,
    "relShare": 0.247,
    "modShare": 0.078,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 213
  },
  "48265": {
    "progShare": 0.387,
    "estabShare": 0.613,
    "magaShare": 0.546,
    "relShare": 0.252,
    "modShare": 0.202,
    "demTurnoutBasis": 3159,
    "repTurnoutBasis": 17703
  },
  "48267": {
    "progShare": 0.428,
    "estabShare": 0.572,
    "magaShare": 0.751,
    "relShare": 0.165,
    "modShare": 0.084,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1255
  },
  "48269": {
    "progShare": 0.4,
    "estabShare": 0.6,
    "magaShare": 0.707,
    "relShare": 0.215,
    "modShare": 0.078,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "48271": {
    "progShare": 0.327,
    "estabShare": 0.673,
    "magaShare": 0.783,
    "relShare": 0.137,
    "modShare": 0.08,
    "demTurnoutBasis": 246,
    "repTurnoutBasis": 687
  },
  "48273": {
    "progShare": 0.292,
    "estabShare": 0.708,
    "magaShare": 0.522,
    "relShare": 0.277,
    "modShare": 0.201,
    "demTurnoutBasis": 3702,
    "repTurnoutBasis": 3089
  },
  "48275": {
    "progShare": 0.225,
    "estabShare": 0.775,
    "magaShare": 0.702,
    "relShare": 0.212,
    "modShare": 0.086,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 751
  },
  "48277": {
    "progShare": 0.297,
    "estabShare": 0.703,
    "magaShare": 0.565,
    "relShare": 0.279,
    "modShare": 0.156,
    "demTurnoutBasis": 2270,
    "repTurnoutBasis": 13675
  },
  "48279": {
    "progShare": 0.323,
    "estabShare": 0.677,
    "magaShare": 0.596,
    "relShare": 0.271,
    "modShare": 0.133,
    "demTurnoutBasis": 309,
    "repTurnoutBasis": 2112
  },
  "48281": {
    "progShare": 0.37,
    "estabShare": 0.63,
    "magaShare": 0.569,
    "relShare": 0.287,
    "modShare": 0.144,
    "demTurnoutBasis": 984,
    "repTurnoutBasis": 5361
  },
  "48283": {
    "progShare": 0.305,
    "estabShare": 0.695,
    "magaShare": 0.524,
    "relShare": 0.31,
    "modShare": 0.166,
    "demTurnoutBasis": 1412,
    "repTurnoutBasis": 346
  },
  "48285": {
    "progShare": 0.301,
    "estabShare": 0.699,
    "magaShare": 0.703,
    "relShare": 0.218,
    "modShare": 0.079,
    "demTurnoutBasis": 515,
    "repTurnoutBasis": 4081
  },
  "48287": {
    "progShare": 0.32,
    "estabShare": 0.68,
    "magaShare": 0.616,
    "relShare": 0.269,
    "modShare": 0.115,
    "demTurnoutBasis": 915,
    "repTurnoutBasis": 4766
  },
  "48289": {
    "progShare": 0.227,
    "estabShare": 0.773,
    "magaShare": 0.636,
    "relShare": 0.285,
    "modShare": 0.079,
    "demTurnoutBasis": 613,
    "repTurnoutBasis": 5856
  },
  "48291": {
    "progShare": 0.297,
    "estabShare": 0.703,
    "magaShare": 0.615,
    "relShare": 0.301,
    "modShare": 0.084,
    "demTurnoutBasis": 2383,
    "repTurnoutBasis": 17016
  },
  "48293": {
    "progShare": 0.222,
    "estabShare": 0.778,
    "magaShare": 0.641,
    "relShare": 0.263,
    "modShare": 0.096,
    "demTurnoutBasis": 1146,
    "repTurnoutBasis": 5958
  },
  "48295": {
    "progShare": 0.33,
    "estabShare": 0.67,
    "magaShare": 0.547,
    "relShare": 0.338,
    "modShare": 0.115,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1461
  },
  "48297": {
    "progShare": 0.249,
    "estabShare": 0.751,
    "magaShare": 0.69,
    "relShare": 0.226,
    "modShare": 0.084,
    "demTurnoutBasis": 310,
    "repTurnoutBasis": 1979
  },
  "48299": {
    "progShare": 0.317,
    "estabShare": 0.683,
    "magaShare": 0.581,
    "relShare": 0.224,
    "modShare": 0.195,
    "demTurnoutBasis": 1478,
    "repTurnoutBasis": 8478
  },
  "48301": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.63,
    "relShare": 0.204,
    "modShare": 0.166,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "48303": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.473,
    "relShare": 0.315,
    "modShare": 0.212,
    "demTurnoutBasis": 17399,
    "repTurnoutBasis": 57633
  },
  "48305": {
    "progShare": 0.268,
    "estabShare": 0.732,
    "magaShare": 0.593,
    "relShare": 0.28,
    "modShare": 0.127,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1186
  },
  "48307": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.699,
    "relShare": 0.2,
    "modShare": 0.101,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 2030
  },
  "48309": {
    "progShare": 0.346,
    "estabShare": 0.654,
    "magaShare": 0.506,
    "relShare": 0.303,
    "modShare": 0.191,
    "demTurnoutBasis": 14720,
    "repTurnoutBasis": 43188
  },
  "48311": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.688,
    "relShare": 0.213,
    "modShare": 0.099,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 332
  },
  "48313": {
    "progShare": 0.269,
    "estabShare": 0.731,
    "magaShare": 0.612,
    "relShare": 0.289,
    "modShare": 0.099,
    "demTurnoutBasis": 463,
    "repTurnoutBasis": 3205
  },
  "48315": {
    "progShare": 0.23,
    "estabShare": 0.77,
    "magaShare": 0.652,
    "relShare": 0.257,
    "modShare": 0.091,
    "demTurnoutBasis": 865,
    "repTurnoutBasis": 2489
  },
  "48317": {
    "progShare": 0.363,
    "estabShare": 0.637,
    "magaShare": 0.557,
    "relShare": 0.315,
    "modShare": 0.128,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1501
  },
  "48319": {
    "progShare": 0.326,
    "estabShare": 0.674,
    "magaShare": 0.705,
    "relShare": 0.21,
    "modShare": 0.085,
    "demTurnoutBasis": 176,
    "repTurnoutBasis": 1432
  },
  "48321": {
    "progShare": 0.267,
    "estabShare": 0.733,
    "magaShare": 0.734,
    "relShare": 0.186,
    "modShare": 0.08,
    "demTurnoutBasis": 1437,
    "repTurnoutBasis": 4656
  },
  "48323": {
    "progShare": 0.406,
    "estabShare": 0.594,
    "magaShare": 0.684,
    "relShare": 0.18,
    "modShare": 0.136,
    "demTurnoutBasis": 7119,
    "repTurnoutBasis": 405
  },
  "48325": {
    "progShare": 0.338,
    "estabShare": 0.662,
    "magaShare": 0.656,
    "relShare": 0.234,
    "modShare": 0.11,
    "demTurnoutBasis": 1926,
    "repTurnoutBasis": 6756
  },
  "48327": {
    "progShare": 0.407,
    "estabShare": 0.593,
    "magaShare": 0.701,
    "relShare": 0.182,
    "modShare": 0.117,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 562
  },
  "48329": {
    "progShare": 0.365,
    "estabShare": 0.635,
    "magaShare": 0.646,
    "relShare": 0.231,
    "modShare": 0.123,
    "demTurnoutBasis": 3191,
    "repTurnoutBasis": 21100
  },
  "48331": {
    "progShare": 0.326,
    "estabShare": 0.674,
    "magaShare": 0.612,
    "relShare": 0.269,
    "modShare": 0.119,
    "demTurnoutBasis": 1383,
    "repTurnoutBasis": 6242
  },
  "48333": {
    "progShare": 0.423,
    "estabShare": 0.577,
    "magaShare": 0.605,
    "relShare": 0.281,
    "modShare": 0.114,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 2098
  },
  "48335": {
    "progShare": 0.235,
    "estabShare": 0.765,
    "magaShare": 0.591,
    "relShare": 0.299,
    "modShare": 0.11,
    "demTurnoutBasis": 222,
    "repTurnoutBasis": 1873
  },
  "48337": {
    "progShare": 0.361,
    "estabShare": 0.639,
    "magaShare": 0.701,
    "relShare": 0.216,
    "modShare": 0.083,
    "demTurnoutBasis": 381,
    "repTurnoutBasis": 4444
  },
  "48339": {
    "progShare": 0.383,
    "estabShare": 0.617,
    "magaShare": 0.517,
    "relShare": 0.309,
    "modShare": 0.174,
    "demTurnoutBasis": 25488,
    "repTurnoutBasis": 122885
  },
  "48341": {
    "progShare": 0.36,
    "estabShare": 0.64,
    "magaShare": 0.675,
    "relShare": 0.241,
    "modShare": 0.084,
    "demTurnoutBasis": 269,
    "repTurnoutBasis": 2444
  },
  "48343": {
    "progShare": 0.253,
    "estabShare": 0.747,
    "magaShare": 0.576,
    "relShare": 0.305,
    "modShare": 0.119,
    "demTurnoutBasis": 988,
    "repTurnoutBasis": 2287
  },
  "48345": {
    "progShare": 0.324,
    "estabShare": 0.676,
    "magaShare": 0.696,
    "relShare": 0.224,
    "modShare": 0.08,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 424
  },
  "48347": {
    "progShare": 0.373,
    "estabShare": 0.627,
    "magaShare": 0.507,
    "relShare": 0.338,
    "modShare": 0.155,
    "demTurnoutBasis": 4151,
    "repTurnoutBasis": 13975
  },
  "48349": {
    "progShare": 0.275,
    "estabShare": 0.725,
    "magaShare": 0.587,
    "relShare": 0.267,
    "modShare": 0.146,
    "demTurnoutBasis": 2283,
    "repTurnoutBasis": 11600
  },
  "48351": {
    "progShare": 0.41,
    "estabShare": 0.59,
    "magaShare": 0.771,
    "relShare": 0.152,
    "modShare": 0.077,
    "demTurnoutBasis": 832,
    "repTurnoutBasis": 2315
  },
  "48353": {
    "progShare": 0.334,
    "estabShare": 0.666,
    "magaShare": 0.516,
    "relShare": 0.312,
    "modShare": 0.172,
    "demTurnoutBasis": 611,
    "repTurnoutBasis": 4139
  },
  "48355": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.61,
    "relShare": 0.212,
    "modShare": 0.178,
    "demTurnoutBasis": 22436,
    "repTurnoutBasis": 22421
  },
  "48357": {
    "progShare": 0.409,
    "estabShare": 0.591,
    "magaShare": 0.675,
    "relShare": 0.23,
    "modShare": 0.095,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1794
  },
  "48359": {
    "progShare": 0.323,
    "estabShare": 0.677,
    "magaShare": 0.677,
    "relShare": 0.242,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 597
  },
  "48361": {
    "progShare": 0.304,
    "estabShare": 0.696,
    "magaShare": 0.609,
    "relShare": 0.286,
    "modShare": 0.105,
    "demTurnoutBasis": 4043,
    "repTurnoutBasis": 22257
  },
  "48363": {
    "progShare": 0.36,
    "estabShare": 0.64,
    "magaShare": 0.577,
    "relShare": 0.293,
    "modShare": 0.13,
    "demTurnoutBasis": 1062,
    "repTurnoutBasis": 8769
  },
  "48365": {
    "progShare": 0.205,
    "estabShare": 0.795,
    "magaShare": 0.677,
    "relShare": 0.244,
    "modShare": 0.079,
    "demTurnoutBasis": 769,
    "repTurnoutBasis": 4775
  },
  "48367": {
    "progShare": 0.394,
    "estabShare": 0.606,
    "magaShare": 0.685,
    "relShare": 0.218,
    "modShare": 0.097,
    "demTurnoutBasis": 4321,
    "repTurnoutBasis": 25560
  },
  "48369": {
    "progShare": 0.286,
    "estabShare": 0.714,
    "magaShare": 0.447,
    "relShare": 0.424,
    "modShare": 0.129,
    "demTurnoutBasis": 170,
    "repTurnoutBasis": 1633
  },
  "48371": {
    "progShare": 0.378,
    "estabShare": 0.622,
    "magaShare": 0.645,
    "relShare": 0.239,
    "modShare": 0.116,
    "demTurnoutBasis": 1621,
    "repTurnoutBasis": 1593
  },
  "48373": {
    "progShare": 0.306,
    "estabShare": 0.694,
    "magaShare": 0.717,
    "relShare": 0.191,
    "modShare": 0.092,
    "demTurnoutBasis": 1424,
    "repTurnoutBasis": 7608
  },
  "48375": {
    "progShare": 0.413,
    "estabShare": 0.587,
    "magaShare": 0.641,
    "relShare": 0.243,
    "modShare": 0.116,
    "demTurnoutBasis": 3072,
    "repTurnoutBasis": 10241
  },
  "48377": {
    "progShare": 0.464,
    "estabShare": 0.536,
    "magaShare": 0.772,
    "relShare": 0.145,
    "modShare": 0.083,
    "demTurnoutBasis": 1181,
    "repTurnoutBasis": 150
  },
  "48379": {
    "progShare": 0.315,
    "estabShare": 0.685,
    "magaShare": 0.577,
    "relShare": 0.304,
    "modShare": 0.119,
    "demTurnoutBasis": 621,
    "repTurnoutBasis": 4610
  },
  "48381": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.506,
    "relShare": 0.335,
    "modShare": 0.159,
    "demTurnoutBasis": 5496,
    "repTurnoutBasis": 35009
  },
  "48383": {
    "progShare": 0.318,
    "estabShare": 0.682,
    "magaShare": 0.502,
    "relShare": 0.3,
    "modShare": 0.198,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1139
  },
  "48385": {
    "progShare": 0.429,
    "estabShare": 0.571,
    "magaShare": 0.667,
    "relShare": 0.212,
    "modShare": 0.121,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1072
  },
  "48387": {
    "progShare": 0.224,
    "estabShare": 0.776,
    "magaShare": 0.63,
    "relShare": 0.279,
    "modShare": 0.091,
    "demTurnoutBasis": 758,
    "repTurnoutBasis": 3413
  },
  "48389": {
    "progShare": 0.346,
    "estabShare": 0.654,
    "magaShare": 0.637,
    "relShare": 0.262,
    "modShare": 0.101,
    "demTurnoutBasis": 1677,
    "repTurnoutBasis": 150
  },
  "48391": {
    "progShare": 0.304,
    "estabShare": 0.696,
    "magaShare": 0.651,
    "relShare": 0.236,
    "modShare": 0.113,
    "demTurnoutBasis": 1080,
    "repTurnoutBasis": 1620
  },
  "48393": {
    "progShare": 0.227,
    "estabShare": 0.773,
    "magaShare": 0.614,
    "relShare": 0.273,
    "modShare": 0.113,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 606
  },
  "48395": {
    "progShare": 0.241,
    "estabShare": 0.759,
    "magaShare": 0.6,
    "relShare": 0.306,
    "modShare": 0.094,
    "demTurnoutBasis": 1832,
    "repTurnoutBasis": 4023
  },
  "48397": {
    "progShare": 0.372,
    "estabShare": 0.628,
    "magaShare": 0.627,
    "relShare": 0.209,
    "modShare": 0.164,
    "demTurnoutBasis": 4420,
    "repTurnoutBasis": 14979
  },
  "48399": {
    "progShare": 0.352,
    "estabShare": 0.648,
    "magaShare": 0.57,
    "relShare": 0.312,
    "modShare": 0.118,
    "demTurnoutBasis": 224,
    "repTurnoutBasis": 3399
  },
  "48401": {
    "progShare": 0.208,
    "estabShare": 0.792,
    "magaShare": 0.68,
    "relShare": 0.237,
    "modShare": 0.083,
    "demTurnoutBasis": 1633,
    "repTurnoutBasis": 9146
  },
  "48403": {
    "progShare": 0.26,
    "estabShare": 0.74,
    "magaShare": 0.736,
    "relShare": 0.184,
    "modShare": 0.08,
    "demTurnoutBasis": 310,
    "repTurnoutBasis": 2579
  },
  "48405": {
    "progShare": 0.161,
    "estabShare": 0.839,
    "magaShare": 0.632,
    "relShare": 0.277,
    "modShare": 0.091,
    "demTurnoutBasis": 690,
    "repTurnoutBasis": 2819
  },
  "48407": {
    "progShare": 0.266,
    "estabShare": 0.734,
    "magaShare": 0.614,
    "relShare": 0.293,
    "modShare": 0.093,
    "demTurnoutBasis": 1222,
    "repTurnoutBasis": 6943
  },
  "48409": {
    "progShare": 0.282,
    "estabShare": 0.718,
    "magaShare": 0.562,
    "relShare": 0.269,
    "modShare": 0.169,
    "demTurnoutBasis": 5726,
    "repTurnoutBasis": 9733
  },
  "48411": {
    "progShare": 0.346,
    "estabShare": 0.654,
    "magaShare": 0.701,
    "relShare": 0.215,
    "modShare": 0.084,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1423
  },
  "48413": {
    "progShare": 0.318,
    "estabShare": 0.682,
    "magaShare": 0.545,
    "relShare": 0.323,
    "modShare": 0.132,
    "demTurnoutBasis": 151,
    "repTurnoutBasis": 775
  },
  "48415": {
    "progShare": 0.373,
    "estabShare": 0.627,
    "magaShare": 0.564,
    "relShare": 0.283,
    "modShare": 0.153,
    "demTurnoutBasis": 383,
    "repTurnoutBasis": 4160
  },
  "48417": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.655,
    "relShare": 0.256,
    "modShare": 0.089,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 958
  },
  "48419": {
    "progShare": 0.216,
    "estabShare": 0.784,
    "magaShare": 0.706,
    "relShare": 0.216,
    "modShare": 0.078,
    "demTurnoutBasis": 451,
    "repTurnoutBasis": 5288
  },
  "48421": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.699,
    "relShare": 0.222,
    "modShare": 0.079,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 556
  },
  "48423": {
    "progShare": 0.281,
    "estabShare": 0.719,
    "magaShare": 0.472,
    "relShare": 0.364,
    "modShare": 0.164,
    "demTurnoutBasis": 13758,
    "repTurnoutBasis": 54256
  },
  "48425": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.683,
    "relShare": 0.214,
    "modShare": 0.103,
    "demTurnoutBasis": 226,
    "repTurnoutBasis": 2419
  },
  "48427": {
    "progShare": 0.357,
    "estabShare": 0.643,
    "magaShare": 0.487,
    "relShare": 0.297,
    "modShare": 0.216,
    "demTurnoutBasis": 8265,
    "repTurnoutBasis": 150
  },
  "48429": {
    "progShare": 0.327,
    "estabShare": 0.673,
    "magaShare": 0.684,
    "relShare": 0.218,
    "modShare": 0.098,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 2216
  },
  "48431": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.644,
    "relShare": 0.225,
    "modShare": 0.131,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 352
  },
  "48433": {
    "progShare": 0.322,
    "estabShare": 0.678,
    "magaShare": 0.681,
    "relShare": 0.229,
    "modShare": 0.09,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 248
  },
  "48435": {
    "progShare": 0.377,
    "estabShare": 0.623,
    "magaShare": 0.63,
    "relShare": 0.205,
    "modShare": 0.165,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 881
  },
  "48437": {
    "progShare": 0.318,
    "estabShare": 0.682,
    "magaShare": 0.577,
    "relShare": 0.311,
    "modShare": 0.112,
    "demTurnoutBasis": 346,
    "repTurnoutBasis": 1411
  },
  "48439": {
    "progShare": 0.386,
    "estabShare": 0.614,
    "magaShare": 0.578,
    "relShare": 0.232,
    "modShare": 0.19,
    "demTurnoutBasis": 129777,
    "repTurnoutBasis": 169598
  },
  "48441": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.595,
    "relShare": 0.247,
    "modShare": 0.158,
    "demTurnoutBasis": 4071,
    "repTurnoutBasis": 19149
  },
  "48443": {
    "progShare": 0.405,
    "estabShare": 0.595,
    "magaShare": 0.715,
    "relShare": 0.197,
    "modShare": 0.088,
    "demTurnoutBasis": 163,
    "repTurnoutBasis": 150
  },
  "48445": {
    "progShare": 0.363,
    "estabShare": 0.637,
    "magaShare": 0.664,
    "relShare": 0.23,
    "modShare": 0.106,
    "demTurnoutBasis": 238,
    "repTurnoutBasis": 1818
  },
  "48447": {
    "progShare": 0.294,
    "estabShare": 0.706,
    "magaShare": 0.697,
    "relShare": 0.209,
    "modShare": 0.094,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 412
  },
  "48449": {
    "progShare": 0.273,
    "estabShare": 0.727,
    "magaShare": 0.686,
    "relShare": 0.214,
    "modShare": 0.1,
    "demTurnoutBasis": 852,
    "repTurnoutBasis": 4144
  },
  "48451": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.537,
    "relShare": 0.28,
    "modShare": 0.183,
    "demTurnoutBasis": 5214,
    "repTurnoutBasis": 24492
  },
  "48453": {
    "progShare": 0.551,
    "estabShare": 0.449,
    "magaShare": 0.425,
    "relShare": 0.217,
    "modShare": 0.358,
    "demTurnoutBasis": 256479,
    "repTurnoutBasis": 105837
  },
  "48455": {
    "progShare": 0.264,
    "estabShare": 0.736,
    "magaShare": 0.743,
    "relShare": 0.177,
    "modShare": 0.08,
    "demTurnoutBasis": 518,
    "repTurnoutBasis": 3455
  },
  "48457": {
    "progShare": 0.24,
    "estabShare": 0.76,
    "magaShare": 0.641,
    "relShare": 0.269,
    "modShare": 0.09,
    "demTurnoutBasis": 932,
    "repTurnoutBasis": 6467
  },
  "48459": {
    "progShare": 0.264,
    "estabShare": 0.736,
    "magaShare": 0.656,
    "relShare": 0.262,
    "modShare": 0.082,
    "demTurnoutBasis": 1171,
    "repTurnoutBasis": 7304
  },
  "48461": {
    "progShare": 0.395,
    "estabShare": 0.605,
    "magaShare": 0.671,
    "relShare": 0.205,
    "modShare": 0.124,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 644
  },
  "48463": {
    "progShare": 0.335,
    "estabShare": 0.665,
    "magaShare": 0.718,
    "relShare": 0.196,
    "modShare": 0.086,
    "demTurnoutBasis": 2648,
    "repTurnoutBasis": 2336
  },
  "48465": {
    "progShare": 0.358,
    "estabShare": 0.642,
    "magaShare": 0.694,
    "relShare": 0.161,
    "modShare": 0.145,
    "demTurnoutBasis": 2937,
    "repTurnoutBasis": 2657
  },
  "48467": {
    "progShare": 0.32,
    "estabShare": 0.68,
    "magaShare": 0.69,
    "relShare": 0.23,
    "modShare": 0.08,
    "demTurnoutBasis": 1323,
    "repTurnoutBasis": 11116
  },
  "48469": {
    "progShare": 0.342,
    "estabShare": 0.658,
    "magaShare": 0.564,
    "relShare": 0.28,
    "modShare": 0.156,
    "demTurnoutBasis": 5478,
    "repTurnoutBasis": 17955
  },
  "48471": {
    "progShare": 0.377,
    "estabShare": 0.623,
    "magaShare": 0.521,
    "relShare": 0.311,
    "modShare": 0.168,
    "demTurnoutBasis": 3457,
    "repTurnoutBasis": 11312
  },
  "48473": {
    "progShare": 0.359,
    "estabShare": 0.641,
    "magaShare": 0.564,
    "relShare": 0.339,
    "modShare": 0.097,
    "demTurnoutBasis": 3140,
    "repTurnoutBasis": 8632
  },
  "48475": {
    "progShare": 0.341,
    "estabShare": 0.659,
    "magaShare": 0.683,
    "relShare": 0.231,
    "modShare": 0.086,
    "demTurnoutBasis": 445,
    "repTurnoutBasis": 1456
  },
  "48477": {
    "progShare": 0.287,
    "estabShare": 0.713,
    "magaShare": 0.62,
    "relShare": 0.259,
    "modShare": 0.121,
    "demTurnoutBasis": 1344,
    "repTurnoutBasis": 5900
  },
  "48479": {
    "progShare": 0.322,
    "estabShare": 0.678,
    "magaShare": 0.549,
    "relShare": 0.179,
    "modShare": 0.272,
    "demTurnoutBasis": 40259,
    "repTurnoutBasis": 5569
  },
  "48481": {
    "progShare": 0.263,
    "estabShare": 0.737,
    "magaShare": 0.698,
    "relShare": 0.196,
    "modShare": 0.106,
    "demTurnoutBasis": 1353,
    "repTurnoutBasis": 6936
  },
  "48483": {
    "progShare": 0.336,
    "estabShare": 0.664,
    "magaShare": 0.608,
    "relShare": 0.294,
    "modShare": 0.098,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 2452
  },
  "48485": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.639,
    "relShare": 0.223,
    "modShare": 0.138,
    "demTurnoutBasis": 4039,
    "repTurnoutBasis": 14291
  },
  "48487": {
    "progShare": 0.325,
    "estabShare": 0.675,
    "magaShare": 0.581,
    "relShare": 0.257,
    "modShare": 0.162,
    "demTurnoutBasis": 363,
    "repTurnoutBasis": 3537
  },
  "48489": {
    "progShare": 0.331,
    "estabShare": 0.669,
    "magaShare": 0.62,
    "relShare": 0.196,
    "modShare": 0.184,
    "demTurnoutBasis": 2987,
    "repTurnoutBasis": 252
  },
  "48491": {
    "progShare": 0.478,
    "estabShare": 0.522,
    "magaShare": 0.491,
    "relShare": 0.249,
    "modShare": 0.26,
    "demTurnoutBasis": 61647,
    "repTurnoutBasis": 89525
  },
  "48493": {
    "progShare": 0.312,
    "estabShare": 0.688,
    "magaShare": 0.563,
    "relShare": 0.312,
    "modShare": 0.125,
    "demTurnoutBasis": 2955,
    "repTurnoutBasis": 11909
  },
  "48495": {
    "progShare": 0.308,
    "estabShare": 0.692,
    "magaShare": 0.63,
    "relShare": 0.233,
    "modShare": 0.137,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 970
  },
  "48497": {
    "progShare": 0.397,
    "estabShare": 0.603,
    "magaShare": 0.699,
    "relShare": 0.222,
    "modShare": 0.079,
    "demTurnoutBasis": 1585,
    "repTurnoutBasis": 10602
  },
  "48499": {
    "progShare": 0.286,
    "estabShare": 0.714,
    "magaShare": 0.583,
    "relShare": 0.293,
    "modShare": 0.124,
    "demTurnoutBasis": 1700,
    "repTurnoutBasis": 15654
  },
  "48501": {
    "progShare": 0.415,
    "estabShare": 0.585,
    "magaShare": 0.604,
    "relShare": 0.258,
    "modShare": 0.138,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1287
  },
  "48503": {
    "progShare": 0.361,
    "estabShare": 0.639,
    "magaShare": 0.574,
    "relShare": 0.289,
    "modShare": 0.137,
    "demTurnoutBasis": 556,
    "repTurnoutBasis": 6073
  },
  "48505": {
    "progShare": 0.303,
    "estabShare": 0.697,
    "magaShare": 0.575,
    "relShare": 0.29,
    "modShare": 0.135,
    "demTurnoutBasis": 4988,
    "repTurnoutBasis": 150
  },
  "48507": {
    "progShare": 0.296,
    "estabShare": 0.704,
    "magaShare": 0.811,
    "relShare": 0.11,
    "modShare": 0.079,
    "demTurnoutBasis": 2411,
    "repTurnoutBasis": 150
  },
  "49001": {
    "progShare": 0.21,
    "estabShare": 0.79,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 675
  },
  "49003": {
    "progShare": 0.331,
    "estabShare": 0.669,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 928,
    "repTurnoutBasis": 4198
  },
  "49005": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3626,
    "repTurnoutBasis": 7452
  },
  "49007": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 348,
    "repTurnoutBasis": 150
  },
  "49009": {
    "progShare": 0.275,
    "estabShare": 0.725,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49011": {
    "progShare": 0.381,
    "estabShare": 0.619,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 13660,
    "repTurnoutBasis": 22094
  },
  "49013": {
    "progShare": 0.309,
    "estabShare": 0.691,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 224,
    "repTurnoutBasis": 1847
  },
  "49015": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49017": {
    "progShare": 0.438,
    "estabShare": 0.562,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 155,
    "repTurnoutBasis": 675
  },
  "49019": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 281,
    "repTurnoutBasis": 150
  },
  "49021": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 352,
    "repTurnoutBasis": 150
  },
  "49023": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49025": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49027": {
    "progShare": 0.188,
    "estabShare": 0.812,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 162,
    "repTurnoutBasis": 1423
  },
  "49029": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49031": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49033": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49035": {
    "progShare": 0.432,
    "estabShare": 0.568,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 81113,
    "repTurnoutBasis": 44923
  },
  "49037": {
    "progShare": 0.396,
    "estabShare": 0.604,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 874,
    "repTurnoutBasis": 897
  },
  "49039": {
    "progShare": 0.367,
    "estabShare": 0.633,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 403,
    "repTurnoutBasis": 2521
  },
  "49041": {
    "progShare": 0.276,
    "estabShare": 0.724,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 249,
    "repTurnoutBasis": 2179
  },
  "49043": {
    "progShare": 0.275,
    "estabShare": 0.725,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4717,
    "repTurnoutBasis": 2015
  },
  "49045": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 508,
    "repTurnoutBasis": 150
  },
  "49047": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.52,
    "relShare": 0.24,
    "modShare": 0.24,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "49049": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 12159,
    "repTurnoutBasis": 29202
  },
  "49051": {
    "progShare": 0.311,
    "estabShare": 0.689,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1512,
    "repTurnoutBasis": 2065
  },
  "49053": {
    "progShare": 0.28,
    "estabShare": 0.72,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 6256,
    "repTurnoutBasis": 14805
  },
  "49055": {
    "progShare": 0.364,
    "estabShare": 0.636,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 371
  },
  "49057": {
    "progShare": 0.375,
    "estabShare": 0.625,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 9463,
    "repTurnoutBasis": 12181
  },
  "50001": {
    "progShare": 0.818,
    "estabShare": 0.182,
    "magaShare": 0.234,
    "relShare": 0.201,
    "modShare": 0.565,
    "demTurnoutBasis": 2957,
    "repTurnoutBasis": 1274
  },
  "50003": {
    "progShare": 0.744,
    "estabShare": 0.256,
    "magaShare": 0.335,
    "relShare": 0.182,
    "modShare": 0.483,
    "demTurnoutBasis": 2311,
    "repTurnoutBasis": 1153
  },
  "50005": {
    "progShare": 0.849,
    "estabShare": 0.151,
    "magaShare": 0.247,
    "relShare": 0.186,
    "modShare": 0.567,
    "demTurnoutBasis": 1716,
    "repTurnoutBasis": 1049
  },
  "50007": {
    "progShare": 0.785,
    "estabShare": 0.215,
    "magaShare": 0.224,
    "relShare": 0.174,
    "modShare": 0.602,
    "demTurnoutBasis": 12697,
    "repTurnoutBasis": 4702
  },
  "50009": {
    "progShare": 0.803,
    "estabShare": 0.197,
    "magaShare": 0.355,
    "relShare": 0.163,
    "modShare": 0.482,
    "demTurnoutBasis": 346,
    "repTurnoutBasis": 291
  },
  "50011": {
    "progShare": 0.848,
    "estabShare": 0.152,
    "magaShare": 0.293,
    "relShare": 0.175,
    "modShare": 0.532,
    "demTurnoutBasis": 2528,
    "repTurnoutBasis": 1551
  },
  "50013": {
    "progShare": 0.809,
    "estabShare": 0.191,
    "magaShare": 0.303,
    "relShare": 0.157,
    "modShare": 0.54,
    "demTurnoutBasis": 593,
    "repTurnoutBasis": 333
  },
  "50015": {
    "progShare": 0.834,
    "estabShare": 0.166,
    "magaShare": 0.244,
    "relShare": 0.152,
    "modShare": 0.604,
    "demTurnoutBasis": 1686,
    "repTurnoutBasis": 689
  },
  "50017": {
    "progShare": 0.844,
    "estabShare": 0.156,
    "magaShare": 0.271,
    "relShare": 0.185,
    "modShare": 0.544,
    "demTurnoutBasis": 2022,
    "repTurnoutBasis": 912
  },
  "50019": {
    "progShare": 0.829,
    "estabShare": 0.171,
    "magaShare": 0.29,
    "relShare": 0.166,
    "modShare": 0.544,
    "demTurnoutBasis": 1345,
    "repTurnoutBasis": 864
  },
  "50021": {
    "progShare": 0.792,
    "estabShare": 0.208,
    "magaShare": 0.304,
    "relShare": 0.135,
    "modShare": 0.561,
    "demTurnoutBasis": 3673,
    "repTurnoutBasis": 2728
  },
  "50023": {
    "progShare": 0.822,
    "estabShare": 0.178,
    "magaShare": 0.249,
    "relShare": 0.153,
    "modShare": 0.598,
    "demTurnoutBasis": 4696,
    "repTurnoutBasis": 1853
  },
  "50025": {
    "progShare": 0.821,
    "estabShare": 0.179,
    "magaShare": 0.299,
    "relShare": 0.18,
    "modShare": 0.521,
    "demTurnoutBasis": 3848,
    "repTurnoutBasis": 1151
  },
  "50027": {
    "progShare": 0.769,
    "estabShare": 0.231,
    "magaShare": 0.282,
    "relShare": 0.161,
    "modShare": 0.557,
    "demTurnoutBasis": 4529,
    "repTurnoutBasis": 1925
  },
  "53001": {
    "progShare": 0.429,
    "estabShare": 0.571,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 459,
    "repTurnoutBasis": 964
  },
  "53003": {
    "progShare": 0.338,
    "estabShare": 0.662,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1446,
    "repTurnoutBasis": 1911
  },
  "53005": {
    "progShare": 0.406,
    "estabShare": 0.594,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 11557,
    "repTurnoutBasis": 13756
  },
  "53007": {
    "progShare": 0.421,
    "estabShare": 0.579,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 6265,
    "repTurnoutBasis": 5840
  },
  "53009": {
    "progShare": 0.407,
    "estabShare": 0.593,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 9322,
    "repTurnoutBasis": 6148
  },
  "53011": {
    "progShare": 0.436,
    "estabShare": 0.564,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 43100,
    "repTurnoutBasis": 26205
  },
  "53013": {
    "progShare": 0.348,
    "estabShare": 0.652,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 251,
    "repTurnoutBasis": 505
  },
  "53015": {
    "progShare": 0.38,
    "estabShare": 0.62,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8106,
    "repTurnoutBasis": 7777
  },
  "53017": {
    "progShare": 0.397,
    "estabShare": 0.603,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2347,
    "repTurnoutBasis": 3219
  },
  "53019": {
    "progShare": 0.437,
    "estabShare": 0.563,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 482,
    "repTurnoutBasis": 835
  },
  "53021": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3546,
    "repTurnoutBasis": 4159
  },
  "53023": {
    "progShare": 0.342,
    "estabShare": 0.658,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 276
  },
  "53025": {
    "progShare": 0.405,
    "estabShare": 0.595,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3413,
    "repTurnoutBasis": 6201
  },
  "53027": {
    "progShare": 0.412,
    "estabShare": 0.588,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5808,
    "repTurnoutBasis": 4460
  },
  "53029": {
    "progShare": 0.405,
    "estabShare": 0.595,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 10441,
    "repTurnoutBasis": 5773
  },
  "53031": {
    "progShare": 0.491,
    "estabShare": 0.509,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 6906,
    "repTurnoutBasis": 1718
  },
  "53033": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 307931,
    "repTurnoutBasis": 51933
  },
  "53035": {
    "progShare": 0.428,
    "estabShare": 0.572,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 30797,
    "repTurnoutBasis": 14048
  },
  "53037": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3749,
    "repTurnoutBasis": 3409
  },
  "53039": {
    "progShare": 0.464,
    "estabShare": 0.536,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2078,
    "repTurnoutBasis": 2002
  },
  "53041": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4925,
    "repTurnoutBasis": 7521
  },
  "53043": {
    "progShare": 0.339,
    "estabShare": 0.661,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 570,
    "repTurnoutBasis": 1466
  },
  "53045": {
    "progShare": 0.398,
    "estabShare": 0.602,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 6038,
    "repTurnoutBasis": 4609
  },
  "53047": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2989,
    "repTurnoutBasis": 3197
  },
  "53049": {
    "progShare": 0.393,
    "estabShare": 0.607,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2403,
    "repTurnoutBasis": 1777
  },
  "53051": {
    "progShare": 0.387,
    "estabShare": 0.613,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 887,
    "repTurnoutBasis": 1458
  },
  "53053": {
    "progShare": 0.438,
    "estabShare": 0.562,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 75937,
    "repTurnoutBasis": 40012
  },
  "53055": {
    "progShare": 0.506,
    "estabShare": 0.494,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3686,
    "repTurnoutBasis": 696
  },
  "53057": {
    "progShare": 0.419,
    "estabShare": 0.581,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 12888,
    "repTurnoutBasis": 7486
  },
  "53059": {
    "progShare": 0.447,
    "estabShare": 0.553,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1087,
    "repTurnoutBasis": 990
  },
  "53061": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 81834,
    "repTurnoutBasis": 34087
  },
  "53063": {
    "progShare": 0.427,
    "estabShare": 0.573,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 42903,
    "repTurnoutBasis": 33401
  },
  "53065": {
    "progShare": 0.398,
    "estabShare": 0.602,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2718,
    "repTurnoutBasis": 5234
  },
  "53067": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 32714,
    "repTurnoutBasis": 13934
  },
  "53069": {
    "progShare": 0.391,
    "estabShare": 0.609,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 450,
    "repTurnoutBasis": 455
  },
  "53071": {
    "progShare": 0.424,
    "estabShare": 0.576,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4518,
    "repTurnoutBasis": 4045
  },
  "53073": {
    "progShare": 0.561,
    "estabShare": 0.439,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 29597,
    "repTurnoutBasis": 11782
  },
  "53075": {
    "progShare": 0.564,
    "estabShare": 0.436,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3406,
    "repTurnoutBasis": 2198
  },
  "53077": {
    "progShare": 0.437,
    "estabShare": 0.563,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 11706,
    "repTurnoutBasis": 12161
  },
  "54001": {
    "progShare": 0.5,
    "estabShare": 0.5,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 968,
    "repTurnoutBasis": 2415
  },
  "54003": {
    "progShare": 0.426,
    "estabShare": 0.574,
    "magaShare": 0.831,
    "relShare": 0.081,
    "modShare": 0.088,
    "demTurnoutBasis": 4056,
    "repTurnoutBasis": 11916
  },
  "54005": {
    "progShare": 0.574,
    "estabShare": 0.426,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2334,
    "repTurnoutBasis": 1833
  },
  "54007": {
    "progShare": 0.508,
    "estabShare": 0.492,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1294,
    "repTurnoutBasis": 1254
  },
  "54009": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1760,
    "repTurnoutBasis": 2397
  },
  "54011": {
    "progShare": 0.449,
    "estabShare": 0.551,
    "magaShare": 0.791,
    "relShare": 0.079,
    "modShare": 0.13,
    "demTurnoutBasis": 5856,
    "repTurnoutBasis": 8926
  },
  "54013": {
    "progShare": 0.655,
    "estabShare": 0.345,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 688,
    "repTurnoutBasis": 851
  },
  "54015": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 741,
    "repTurnoutBasis": 883
  },
  "54017": {
    "progShare": 0.581,
    "estabShare": 0.419,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 201,
    "repTurnoutBasis": 1613
  },
  "54019": {
    "progShare": 0.522,
    "estabShare": 0.478,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3452,
    "repTurnoutBasis": 3708
  },
  "54021": {
    "progShare": 0.569,
    "estabShare": 0.431,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 610,
    "repTurnoutBasis": 621
  },
  "54023": {
    "progShare": 0.445,
    "estabShare": 0.555,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 200,
    "repTurnoutBasis": 3005
  },
  "54025": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.835,
    "relShare": 0.081,
    "modShare": 0.084,
    "demTurnoutBasis": 2713,
    "repTurnoutBasis": 4468
  },
  "54027": {
    "progShare": 0.522,
    "estabShare": 0.478,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 999,
    "repTurnoutBasis": 2926
  },
  "54029": {
    "progShare": 0.502,
    "estabShare": 0.498,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2112,
    "repTurnoutBasis": 3348
  },
  "54031": {
    "progShare": 0.487,
    "estabShare": 0.513,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 959,
    "repTurnoutBasis": 1552
  },
  "54033": {
    "progShare": 0.475,
    "estabShare": 0.525,
    "magaShare": 0.827,
    "relShare": 0.081,
    "modShare": 0.092,
    "demTurnoutBasis": 5506,
    "repTurnoutBasis": 7790
  },
  "54035": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.831,
    "relShare": 0.081,
    "modShare": 0.088,
    "demTurnoutBasis": 1810,
    "repTurnoutBasis": 4837
  },
  "54037": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.798,
    "relShare": 0.08,
    "modShare": 0.122,
    "demTurnoutBasis": 3252,
    "repTurnoutBasis": 5243
  },
  "54039": {
    "progShare": 0.425,
    "estabShare": 0.575,
    "magaShare": 0.789,
    "relShare": 0.078,
    "modShare": 0.133,
    "demTurnoutBasis": 14253,
    "repTurnoutBasis": 18913
  },
  "54041": {
    "progShare": 0.543,
    "estabShare": 0.457,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1130,
    "repTurnoutBasis": 2798
  },
  "54043": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1616,
    "repTurnoutBasis": 1951
  },
  "54045": {
    "progShare": 0.618,
    "estabShare": 0.382,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3186,
    "repTurnoutBasis": 2583
  },
  "54047": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1347,
    "repTurnoutBasis": 1008
  },
  "54049": {
    "progShare": 0.506,
    "estabShare": 0.494,
    "magaShare": 0.827,
    "relShare": 0.081,
    "modShare": 0.092,
    "demTurnoutBasis": 5105,
    "repTurnoutBasis": 5617
  },
  "54051": {
    "progShare": 0.542,
    "estabShare": 0.458,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2333,
    "repTurnoutBasis": 3878
  },
  "54053": {
    "progShare": 0.505,
    "estabShare": 0.495,
    "magaShare": 0.829,
    "relShare": 0.081,
    "modShare": 0.09,
    "demTurnoutBasis": 1723,
    "repTurnoutBasis": 3552
  },
  "54055": {
    "progShare": 0.513,
    "estabShare": 0.487,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3152,
    "repTurnoutBasis": 7122
  },
  "54057": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1133,
    "repTurnoutBasis": 4310
  },
  "54059": {
    "progShare": 0.638,
    "estabShare": 0.362,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2517,
    "repTurnoutBasis": 2105
  },
  "54061": {
    "progShare": 0.514,
    "estabShare": 0.486,
    "magaShare": 0.763,
    "relShare": 0.079,
    "modShare": 0.158,
    "demTurnoutBasis": 7068,
    "repTurnoutBasis": 8184
  },
  "54063": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 834,
    "repTurnoutBasis": 2159
  },
  "54065": {
    "progShare": 0.485,
    "estabShare": 0.515,
    "magaShare": 0.833,
    "relShare": 0.081,
    "modShare": 0.086,
    "demTurnoutBasis": 619,
    "repTurnoutBasis": 3464
  },
  "54067": {
    "progShare": 0.549,
    "estabShare": 0.451,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1853,
    "repTurnoutBasis": 3310
  },
  "54069": {
    "progShare": 0.465,
    "estabShare": 0.535,
    "magaShare": 0.792,
    "relShare": 0.078,
    "modShare": 0.13,
    "demTurnoutBasis": 3192,
    "repTurnoutBasis": 5554
  },
  "54071": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 576,
    "repTurnoutBasis": 907
  },
  "54073": {
    "progShare": 0.521,
    "estabShare": 0.479,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 501,
    "repTurnoutBasis": 1206
  },
  "54075": {
    "progShare": 0.526,
    "estabShare": 0.474,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 757,
    "repTurnoutBasis": 1220
  },
  "54077": {
    "progShare": 0.535,
    "estabShare": 0.465,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1532,
    "repTurnoutBasis": 5668
  },
  "54079": {
    "progShare": 0.465,
    "estabShare": 0.535,
    "magaShare": 0.819,
    "relShare": 0.08,
    "modShare": 0.101,
    "demTurnoutBasis": 3191,
    "repTurnoutBasis": 8967
  },
  "54081": {
    "progShare": 0.511,
    "estabShare": 0.489,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4750,
    "repTurnoutBasis": 9888
  },
  "54083": {
    "progShare": 0.524,
    "estabShare": 0.476,
    "magaShare": 0.836,
    "relShare": 0.082,
    "modShare": 0.082,
    "demTurnoutBasis": 2388,
    "repTurnoutBasis": 3164
  },
  "54085": {
    "progShare": 0.549,
    "estabShare": 0.451,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 307,
    "repTurnoutBasis": 2122
  },
  "54087": {
    "progShare": 0.496,
    "estabShare": 0.504,
    "magaShare": 0.83,
    "relShare": 0.081,
    "modShare": 0.089,
    "demTurnoutBasis": 949,
    "repTurnoutBasis": 1984
  },
  "54089": {
    "progShare": 0.486,
    "estabShare": 0.514,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1041,
    "repTurnoutBasis": 1515
  },
  "54091": {
    "progShare": 0.497,
    "estabShare": 0.503,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1073,
    "repTurnoutBasis": 2473
  },
  "54093": {
    "progShare": 0.597,
    "estabShare": 0.403,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 636,
    "repTurnoutBasis": 1151
  },
  "54095": {
    "progShare": 0.588,
    "estabShare": 0.412,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 362,
    "repTurnoutBasis": 1752
  },
  "54097": {
    "progShare": 0.488,
    "estabShare": 0.512,
    "magaShare": 0.825,
    "relShare": 0.08,
    "modShare": 0.095,
    "demTurnoutBasis": 1016,
    "repTurnoutBasis": 4309
  },
  "54099": {
    "progShare": 0.51,
    "estabShare": 0.49,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3180,
    "repTurnoutBasis": 3929
  },
  "54101": {
    "progShare": 0.601,
    "estabShare": 0.399,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 782,
    "repTurnoutBasis": 738
  },
  "54103": {
    "progShare": 0.587,
    "estabShare": 0.413,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1549,
    "repTurnoutBasis": 1644
  },
  "54105": {
    "progShare": 0.578,
    "estabShare": 0.422,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 393,
    "repTurnoutBasis": 934
  },
  "54107": {
    "progShare": 0.492,
    "estabShare": 0.508,
    "magaShare": 0.803,
    "relShare": 0.079,
    "modShare": 0.118,
    "demTurnoutBasis": 4284,
    "repTurnoutBasis": 11593
  },
  "54109": {
    "progShare": 0.596,
    "estabShare": 0.404,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1442,
    "repTurnoutBasis": 2194
  },
  "55001": {
    "progShare": 0.382,
    "estabShare": 0.618,
    "magaShare": 0.62,
    "relShare": 0.291,
    "modShare": 0.089,
    "demTurnoutBasis": 2771,
    "repTurnoutBasis": 2058
  },
  "55003": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.57,
    "relShare": 0.3,
    "modShare": 0.13,
    "demTurnoutBasis": 3048,
    "repTurnoutBasis": 1229
  },
  "55005": {
    "progShare": 0.401,
    "estabShare": 0.599,
    "magaShare": 0.536,
    "relShare": 0.355,
    "modShare": 0.109,
    "demTurnoutBasis": 5355,
    "repTurnoutBasis": 4507
  },
  "55007": {
    "progShare": 0.496,
    "estabShare": 0.504,
    "magaShare": 0.586,
    "relShare": 0.268,
    "modShare": 0.146,
    "demTurnoutBasis": 4094,
    "repTurnoutBasis": 1540
  },
  "55009": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.436,
    "relShare": 0.458,
    "modShare": 0.106,
    "demTurnoutBasis": 36028,
    "repTurnoutBasis": 25348
  },
  "55011": {
    "progShare": 0.427,
    "estabShare": 0.573,
    "magaShare": 0.565,
    "relShare": 0.318,
    "modShare": 0.117,
    "demTurnoutBasis": 1881,
    "repTurnoutBasis": 1398
  },
  "55013": {
    "progShare": 0.368,
    "estabShare": 0.632,
    "magaShare": 0.571,
    "relShare": 0.319,
    "modShare": 0.11,
    "demTurnoutBasis": 1837,
    "repTurnoutBasis": 1635
  },
  "55015": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.426,
    "relShare": 0.47,
    "modShare": 0.104,
    "demTurnoutBasis": 6928,
    "repTurnoutBasis": 5825
  },
  "55017": {
    "progShare": 0.416,
    "estabShare": 0.584,
    "magaShare": 0.527,
    "relShare": 0.385,
    "modShare": 0.088,
    "demTurnoutBasis": 8941,
    "repTurnoutBasis": 6401
  },
  "55019": {
    "progShare": 0.424,
    "estabShare": 0.576,
    "magaShare": 0.535,
    "relShare": 0.386,
    "modShare": 0.079,
    "demTurnoutBasis": 3189,
    "repTurnoutBasis": 3112
  },
  "55021": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.469,
    "relShare": 0.363,
    "modShare": 0.168,
    "demTurnoutBasis": 10486,
    "repTurnoutBasis": 5606
  },
  "55023": {
    "progShare": 0.454,
    "estabShare": 0.546,
    "magaShare": 0.524,
    "relShare": 0.344,
    "modShare": 0.132,
    "demTurnoutBasis": 2611,
    "repTurnoutBasis": 1341
  },
  "55025": {
    "progShare": 0.529,
    "estabShare": 0.471,
    "magaShare": 0.365,
    "relShare": 0.355,
    "modShare": 0.28,
    "demTurnoutBasis": 166751,
    "repTurnoutBasis": 34702
  },
  "55027": {
    "progShare": 0.444,
    "estabShare": 0.556,
    "magaShare": 0.414,
    "relShare": 0.459,
    "modShare": 0.127,
    "demTurnoutBasis": 10241,
    "repTurnoutBasis": 9994
  },
  "55029": {
    "progShare": 0.395,
    "estabShare": 0.605,
    "magaShare": 0.465,
    "relShare": 0.384,
    "modShare": 0.151,
    "demTurnoutBasis": 6468,
    "repTurnoutBasis": 3750
  },
  "55031": {
    "progShare": 0.423,
    "estabShare": 0.577,
    "magaShare": 0.598,
    "relShare": 0.283,
    "modShare": 0.119,
    "demTurnoutBasis": 7588,
    "repTurnoutBasis": 3367
  },
  "55033": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.486,
    "relShare": 0.412,
    "modShare": 0.102,
    "demTurnoutBasis": 6180,
    "repTurnoutBasis": 3750
  },
  "55035": {
    "progShare": 0.518,
    "estabShare": 0.482,
    "magaShare": 0.443,
    "relShare": 0.428,
    "modShare": 0.129,
    "demTurnoutBasis": 20171,
    "repTurnoutBasis": 9085
  },
  "55037": {
    "progShare": 0.445,
    "estabShare": 0.555,
    "magaShare": 0.606,
    "relShare": 0.302,
    "modShare": 0.092,
    "demTurnoutBasis": 473,
    "repTurnoutBasis": 610
  },
  "55039": {
    "progShare": 0.434,
    "estabShare": 0.566,
    "magaShare": 0.413,
    "relShare": 0.486,
    "modShare": 0.101,
    "demTurnoutBasis": 12292,
    "repTurnoutBasis": 11633
  },
  "55041": {
    "progShare": 0.403,
    "estabShare": 0.597,
    "magaShare": 0.625,
    "relShare": 0.286,
    "modShare": 0.089,
    "demTurnoutBasis": 1172,
    "repTurnoutBasis": 998
  },
  "55043": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.473,
    "relShare": 0.347,
    "modShare": 0.18,
    "demTurnoutBasis": 6930,
    "repTurnoutBasis": 4308
  },
  "55045": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.473,
    "relShare": 0.327,
    "modShare": 0.2,
    "demTurnoutBasis": 7007,
    "repTurnoutBasis": 3497
  },
  "55047": {
    "progShare": 0.42,
    "estabShare": 0.58,
    "magaShare": 0.497,
    "relShare": 0.404,
    "modShare": 0.099,
    "demTurnoutBasis": 1990,
    "repTurnoutBasis": 2353
  },
  "55049": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.458,
    "relShare": 0.34,
    "modShare": 0.202,
    "demTurnoutBasis": 5127,
    "repTurnoutBasis": 2071
  },
  "55051": {
    "progShare": 0.398,
    "estabShare": 0.602,
    "magaShare": 0.667,
    "relShare": 0.214,
    "modShare": 0.119,
    "demTurnoutBasis": 1087,
    "repTurnoutBasis": 783
  },
  "55053": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.584,
    "relShare": 0.325,
    "modShare": 0.091,
    "demTurnoutBasis": 2857,
    "repTurnoutBasis": 1717
  },
  "55055": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.405,
    "relShare": 0.455,
    "modShare": 0.14,
    "demTurnoutBasis": 12311,
    "repTurnoutBasis": 9098
  },
  "55057": {
    "progShare": 0.436,
    "estabShare": 0.564,
    "magaShare": 0.579,
    "relShare": 0.302,
    "modShare": 0.119,
    "demTurnoutBasis": 3034,
    "repTurnoutBasis": 2392
  },
  "55059": {
    "progShare": 0.469,
    "estabShare": 0.531,
    "magaShare": 0.487,
    "relShare": 0.372,
    "modShare": 0.141,
    "demTurnoutBasis": 23553,
    "repTurnoutBasis": 13249
  },
  "55061": {
    "progShare": 0.407,
    "estabShare": 0.593,
    "magaShare": 0.48,
    "relShare": 0.436,
    "modShare": 0.084,
    "demTurnoutBasis": 2850,
    "repTurnoutBasis": 2545
  },
  "55063": {
    "progShare": 0.503,
    "estabShare": 0.497,
    "magaShare": 0.471,
    "relShare": 0.348,
    "modShare": 0.181,
    "demTurnoutBasis": 22308,
    "repTurnoutBasis": 9979
  },
  "55065": {
    "progShare": 0.391,
    "estabShare": 0.609,
    "magaShare": 0.488,
    "relShare": 0.326,
    "modShare": 0.186,
    "demTurnoutBasis": 2409,
    "repTurnoutBasis": 1499
  },
  "55067": {
    "progShare": 0.405,
    "estabShare": 0.595,
    "magaShare": 0.548,
    "relShare": 0.364,
    "modShare": 0.088,
    "demTurnoutBasis": 2355,
    "repTurnoutBasis": 2479
  },
  "55069": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.553,
    "relShare": 0.361,
    "modShare": 0.086,
    "demTurnoutBasis": 3895,
    "repTurnoutBasis": 3107
  },
  "55071": {
    "progShare": 0.429,
    "estabShare": 0.571,
    "magaShare": 0.442,
    "relShare": 0.473,
    "modShare": 0.085,
    "demTurnoutBasis": 10639,
    "repTurnoutBasis": 8809
  },
  "55073": {
    "progShare": 0.45,
    "estabShare": 0.55,
    "magaShare": 0.515,
    "relShare": 0.398,
    "modShare": 0.087,
    "demTurnoutBasis": 18688,
    "repTurnoutBasis": 14983
  },
  "55075": {
    "progShare": 0.384,
    "estabShare": 0.616,
    "magaShare": 0.568,
    "relShare": 0.352,
    "modShare": 0.08,
    "demTurnoutBasis": 4894,
    "repTurnoutBasis": 4622
  },
  "55077": {
    "progShare": 0.432,
    "estabShare": 0.568,
    "magaShare": 0.557,
    "relShare": 0.328,
    "modShare": 0.115,
    "demTurnoutBasis": 2108,
    "repTurnoutBasis": 1808
  },
  "55078": {
    "progShare": 0.553,
    "estabShare": 0.447,
    "magaShare": 0.493,
    "relShare": 0.377,
    "modShare": 0.13,
    "demTurnoutBasis": 427,
    "repTurnoutBasis": 150
  },
  "55079": {
    "progShare": 0.443,
    "estabShare": 0.557,
    "magaShare": 0.331,
    "relShare": 0.497,
    "modShare": 0.172,
    "demTurnoutBasis": 174044,
    "repTurnoutBasis": 56748
  },
  "55081": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.523,
    "relShare": 0.35,
    "modShare": 0.127,
    "demTurnoutBasis": 5352,
    "repTurnoutBasis": 3963
  },
  "55083": {
    "progShare": 0.401,
    "estabShare": 0.599,
    "magaShare": 0.545,
    "relShare": 0.376,
    "modShare": 0.079,
    "demTurnoutBasis": 4595,
    "repTurnoutBasis": 4652
  },
  "55085": {
    "progShare": 0.444,
    "estabShare": 0.556,
    "magaShare": 0.548,
    "relShare": 0.322,
    "modShare": 0.13,
    "demTurnoutBasis": 6107,
    "repTurnoutBasis": 4499
  },
  "55087": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.445,
    "relShare": 0.444,
    "modShare": 0.111,
    "demTurnoutBasis": 27418,
    "repTurnoutBasis": 18739
  },
  "55089": {
    "progShare": 0.387,
    "estabShare": 0.613,
    "magaShare": 0.302,
    "relShare": 0.531,
    "modShare": 0.167,
    "demTurnoutBasis": 14756,
    "repTurnoutBasis": 14081
  },
  "55091": {
    "progShare": 0.408,
    "estabShare": 0.592,
    "magaShare": 0.53,
    "relShare": 0.359,
    "modShare": 0.111,
    "demTurnoutBasis": 962,
    "repTurnoutBasis": 669
  },
  "55093": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.472,
    "relShare": 0.371,
    "modShare": 0.157,
    "demTurnoutBasis": 5391,
    "repTurnoutBasis": 3495
  },
  "55095": {
    "progShare": 0.388,
    "estabShare": 0.612,
    "magaShare": 0.547,
    "relShare": 0.339,
    "modShare": 0.114,
    "demTurnoutBasis": 4892,
    "repTurnoutBasis": 3839
  },
  "55097": {
    "progShare": 0.516,
    "estabShare": 0.484,
    "magaShare": 0.472,
    "relShare": 0.417,
    "modShare": 0.111,
    "demTurnoutBasis": 13545,
    "repTurnoutBasis": 6373
  },
  "55099": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.602,
    "relShare": 0.318,
    "modShare": 0.08,
    "demTurnoutBasis": 2215,
    "repTurnoutBasis": 1607
  },
  "55101": {
    "progShare": 0.41,
    "estabShare": 0.59,
    "magaShare": 0.41,
    "relShare": 0.449,
    "modShare": 0.141,
    "demTurnoutBasis": 28274,
    "repTurnoutBasis": 18342
  },
  "55103": {
    "progShare": 0.455,
    "estabShare": 0.545,
    "magaShare": 0.504,
    "relShare": 0.332,
    "modShare": 0.164,
    "demTurnoutBasis": 2791,
    "repTurnoutBasis": 1622
  },
  "55105": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.473,
    "relShare": 0.339,
    "modShare": 0.188,
    "demTurnoutBasis": 26663,
    "repTurnoutBasis": 12398
  },
  "55107": {
    "progShare": 0.423,
    "estabShare": 0.577,
    "magaShare": 0.559,
    "relShare": 0.361,
    "modShare": 0.08,
    "demTurnoutBasis": 1743,
    "repTurnoutBasis": 1634
  },
  "55109": {
    "progShare": 0.398,
    "estabShare": 0.602,
    "magaShare": 0.464,
    "relShare": 0.367,
    "modShare": 0.169,
    "demTurnoutBasis": 10859,
    "repTurnoutBasis": 8546
  },
  "55111": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.497,
    "relShare": 0.312,
    "modShare": 0.191,
    "demTurnoutBasis": 11759,
    "repTurnoutBasis": 5577
  },
  "55113": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.601,
    "relShare": 0.274,
    "modShare": 0.125,
    "demTurnoutBasis": 2524,
    "repTurnoutBasis": 1887
  },
  "55115": {
    "progShare": 0.459,
    "estabShare": 0.541,
    "magaShare": 0.525,
    "relShare": 0.396,
    "modShare": 0.079,
    "demTurnoutBasis": 4495,
    "repTurnoutBasis": 4661
  },
  "55117": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.357,
    "relShare": 0.52,
    "modShare": 0.123,
    "demTurnoutBasis": 15780,
    "repTurnoutBasis": 13198
  },
  "55119": {
    "progShare": 0.44,
    "estabShare": 0.56,
    "magaShare": 0.548,
    "relShare": 0.372,
    "modShare": 0.08,
    "demTurnoutBasis": 1893,
    "repTurnoutBasis": 2261
  },
  "55121": {
    "progShare": 0.421,
    "estabShare": 0.579,
    "magaShare": 0.556,
    "relShare": 0.329,
    "modShare": 0.115,
    "demTurnoutBasis": 4117,
    "repTurnoutBasis": 2426
  },
  "55123": {
    "progShare": 0.519,
    "estabShare": 0.481,
    "magaShare": 0.54,
    "relShare": 0.333,
    "modShare": 0.127,
    "demTurnoutBasis": 5076,
    "repTurnoutBasis": 2568
  },
  "55125": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.585,
    "relShare": 0.287,
    "modShare": 0.128,
    "demTurnoutBasis": 3516,
    "repTurnoutBasis": 3134
  },
  "55127": {
    "progShare": 0.472,
    "estabShare": 0.528,
    "magaShare": 0.427,
    "relShare": 0.427,
    "modShare": 0.146,
    "demTurnoutBasis": 13343,
    "repTurnoutBasis": 11094
  },
  "55129": {
    "progShare": 0.413,
    "estabShare": 0.587,
    "magaShare": 0.564,
    "relShare": 0.314,
    "modShare": 0.122,
    "demTurnoutBasis": 2381,
    "repTurnoutBasis": 1944
  },
  "55131": {
    "progShare": 0.41,
    "estabShare": 0.59,
    "magaShare": 0.347,
    "relShare": 0.538,
    "modShare": 0.115,
    "demTurnoutBasis": 15180,
    "repTurnoutBasis": 20403
  },
  "55133": {
    "progShare": 0.396,
    "estabShare": 0.604,
    "magaShare": 0.324,
    "relShare": 0.531,
    "modShare": 0.145,
    "demTurnoutBasis": 56814,
    "repTurnoutBasis": 61829
  },
  "55135": {
    "progShare": 0.457,
    "estabShare": 0.543,
    "magaShare": 0.508,
    "relShare": 0.412,
    "modShare": 0.08,
    "demTurnoutBasis": 6146,
    "repTurnoutBasis": 5523
  },
  "55137": {
    "progShare": 0.414,
    "estabShare": 0.586,
    "magaShare": 0.524,
    "relShare": 0.396,
    "modShare": 0.08,
    "demTurnoutBasis": 2719,
    "repTurnoutBasis": 2762
  },
  "55139": {
    "progShare": 0.488,
    "estabShare": 0.512,
    "magaShare": 0.459,
    "relShare": 0.422,
    "modShare": 0.119,
    "demTurnoutBasis": 27347,
    "repTurnoutBasis": 17195
  },
  "55141": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.509,
    "relShare": 0.397,
    "modShare": 0.094,
    "demTurnoutBasis": 10679,
    "repTurnoutBasis": 8043
  },
  "01001": {
    "progShare": 0.212,
    "estabShare": 0.788,
    "magaShare": 0.695,
    "relShare": 0.198,
    "modShare": 0.107,
    "demTurnoutBasis": 3301,
    "repTurnoutBasis": 11116
  },
  "01003": {
    "progShare": 0.302,
    "estabShare": 0.698,
    "magaShare": 0.706,
    "relShare": 0.146,
    "modShare": 0.148,
    "demTurnoutBasis": 10451,
    "repTurnoutBasis": 46052
  },
  "01005": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.727,
    "relShare": 0.168,
    "modShare": 0.105,
    "demTurnoutBasis": 2714,
    "repTurnoutBasis": 3123
  },
  "01007": {
    "progShare": 0.194,
    "estabShare": 0.806,
    "magaShare": 0.743,
    "relShare": 0.177,
    "modShare": 0.08,
    "demTurnoutBasis": 1139,
    "repTurnoutBasis": 4032
  },
  "01009": {
    "progShare": 0.379,
    "estabShare": 0.621,
    "magaShare": 0.729,
    "relShare": 0.189,
    "modShare": 0.082,
    "demTurnoutBasis": 1169,
    "repTurnoutBasis": 14210
  },
  "01011": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.753,
    "relShare": 0.148,
    "modShare": 0.099,
    "demTurnoutBasis": 2594,
    "repTurnoutBasis": 493
  },
  "01013": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.541,
    "relShare": 0.288,
    "modShare": 0.171,
    "demTurnoutBasis": 1203,
    "repTurnoutBasis": 1610
  },
  "01015": {
    "progShare": 0.242,
    "estabShare": 0.758,
    "magaShare": 0.7,
    "relShare": 0.176,
    "modShare": 0.124,
    "demTurnoutBasis": 7345,
    "repTurnoutBasis": 18911
  },
  "01017": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.727,
    "relShare": 0.177,
    "modShare": 0.096,
    "demTurnoutBasis": 3076,
    "repTurnoutBasis": 4422
  },
  "01019": {
    "progShare": 0.265,
    "estabShare": 0.735,
    "magaShare": 0.771,
    "relShare": 0.136,
    "modShare": 0.093,
    "demTurnoutBasis": 986,
    "repTurnoutBasis": 5627
  },
  "01021": {
    "progShare": 0.234,
    "estabShare": 0.766,
    "magaShare": 0.74,
    "relShare": 0.171,
    "modShare": 0.089,
    "demTurnoutBasis": 1253,
    "repTurnoutBasis": 9680
  },
  "01023": {
    "progShare": 0.131,
    "estabShare": 0.869,
    "magaShare": 0.721,
    "relShare": 0.168,
    "modShare": 0.111,
    "demTurnoutBasis": 2496,
    "repTurnoutBasis": 1921
  },
  "01025": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.743,
    "relShare": 0.148,
    "modShare": 0.109,
    "demTurnoutBasis": 3366,
    "repTurnoutBasis": 4497
  },
  "01027": {
    "progShare": 0.148,
    "estabShare": 0.852,
    "magaShare": 0.737,
    "relShare": 0.173,
    "modShare": 0.09,
    "demTurnoutBasis": 876,
    "repTurnoutBasis": 4071
  },
  "01029": {
    "progShare": 0.243,
    "estabShare": 0.757,
    "magaShare": 0.708,
    "relShare": 0.184,
    "modShare": 0.108,
    "demTurnoutBasis": 340,
    "repTurnoutBasis": 3901
  },
  "01031": {
    "progShare": 0.221,
    "estabShare": 0.779,
    "magaShare": 0.696,
    "relShare": 0.196,
    "modShare": 0.108,
    "demTurnoutBasis": 2235,
    "repTurnoutBasis": 10047
  },
  "01033": {
    "progShare": 0.236,
    "estabShare": 0.764,
    "magaShare": 0.747,
    "relShare": 0.15,
    "modShare": 0.103,
    "demTurnoutBasis": 5572,
    "repTurnoutBasis": 8558
  },
  "01035": {
    "progShare": 0.185,
    "estabShare": 0.815,
    "magaShare": 0.79,
    "relShare": 0.131,
    "modShare": 0.079,
    "demTurnoutBasis": 3076,
    "repTurnoutBasis": 1343
  },
  "01037": {
    "progShare": 0.124,
    "estabShare": 0.876,
    "magaShare": 0.771,
    "relShare": 0.15,
    "modShare": 0.079,
    "demTurnoutBasis": 1020,
    "repTurnoutBasis": 2215
  },
  "01039": {
    "progShare": 0.195,
    "estabShare": 0.805,
    "magaShare": 0.723,
    "relShare": 0.177,
    "modShare": 0.1,
    "demTurnoutBasis": 1133,
    "repTurnoutBasis": 9001
  },
  "01041": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.749,
    "relShare": 0.172,
    "modShare": 0.079,
    "demTurnoutBasis": 963,
    "repTurnoutBasis": 2602
  },
  "01043": {
    "progShare": 0.349,
    "estabShare": 0.651,
    "magaShare": 0.758,
    "relShare": 0.158,
    "modShare": 0.084,
    "demTurnoutBasis": 2338,
    "repTurnoutBasis": 21489
  },
  "01045": {
    "progShare": 0.212,
    "estabShare": 0.788,
    "magaShare": 0.713,
    "relShare": 0.19,
    "modShare": 0.097,
    "demTurnoutBasis": 2222,
    "repTurnoutBasis": 8719
  },
  "01047": {
    "progShare": 0.159,
    "estabShare": 0.841,
    "magaShare": 0.801,
    "relShare": 0.121,
    "modShare": 0.078,
    "demTurnoutBasis": 11535,
    "repTurnoutBasis": 949
  },
  "01049": {
    "progShare": 0.332,
    "estabShare": 0.668,
    "magaShare": 0.727,
    "relShare": 0.141,
    "modShare": 0.132,
    "demTurnoutBasis": 2172,
    "repTurnoutBasis": 12684
  },
  "01051": {
    "progShare": 0.202,
    "estabShare": 0.798,
    "magaShare": 0.721,
    "relShare": 0.182,
    "modShare": 0.097,
    "demTurnoutBasis": 4290,
    "repTurnoutBasis": 16750
  },
  "01053": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.736,
    "relShare": 0.146,
    "modShare": 0.118,
    "demTurnoutBasis": 2222,
    "repTurnoutBasis": 5522
  },
  "01055": {
    "progShare": 0.229,
    "estabShare": 0.771,
    "magaShare": 0.718,
    "relShare": 0.171,
    "modShare": 0.111,
    "demTurnoutBasis": 5912,
    "repTurnoutBasis": 18128
  },
  "01057": {
    "progShare": 0.184,
    "estabShare": 0.816,
    "magaShare": 0.745,
    "relShare": 0.166,
    "modShare": 0.089,
    "demTurnoutBasis": 832,
    "repTurnoutBasis": 4860
  },
  "01059": {
    "progShare": 0.338,
    "estabShare": 0.662,
    "magaShare": 0.786,
    "relShare": 0.135,
    "modShare": 0.079,
    "demTurnoutBasis": 2062,
    "repTurnoutBasis": 4948
  },
  "01061": {
    "progShare": 0.201,
    "estabShare": 0.799,
    "magaShare": 0.743,
    "relShare": 0.172,
    "modShare": 0.085,
    "demTurnoutBasis": 779,
    "repTurnoutBasis": 6359
  },
  "01063": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.809,
    "relShare": 0.112,
    "modShare": 0.079,
    "demTurnoutBasis": 2827,
    "repTurnoutBasis": 353
  },
  "01065": {
    "progShare": 0.123,
    "estabShare": 0.877,
    "magaShare": 0.78,
    "relShare": 0.142,
    "modShare": 0.078,
    "demTurnoutBasis": 2905,
    "repTurnoutBasis": 1310
  },
  "01067": {
    "progShare": 0.135,
    "estabShare": 0.865,
    "magaShare": 0.728,
    "relShare": 0.177,
    "modShare": 0.095,
    "demTurnoutBasis": 1389,
    "repTurnoutBasis": 3723
  },
  "01069": {
    "progShare": 0.211,
    "estabShare": 0.789,
    "magaShare": 0.691,
    "relShare": 0.183,
    "modShare": 0.126,
    "demTurnoutBasis": 4796,
    "repTurnoutBasis": 19657
  },
  "01071": {
    "progShare": 0.277,
    "estabShare": 0.723,
    "magaShare": 0.743,
    "relShare": 0.147,
    "modShare": 0.11,
    "demTurnoutBasis": 1906,
    "repTurnoutBasis": 10888
  },
  "01073": {
    "progShare": 0.209,
    "estabShare": 0.791,
    "magaShare": 0.618,
    "relShare": 0.196,
    "modShare": 0.186,
    "demTurnoutBasis": 92604,
    "repTurnoutBasis": 81665
  },
  "01075": {
    "progShare": 0.216,
    "estabShare": 0.784,
    "magaShare": 0.747,
    "relShare": 0.159,
    "modShare": 0.094,
    "demTurnoutBasis": 700,
    "repTurnoutBasis": 3446
  },
  "01077": {
    "progShare": 0.323,
    "estabShare": 0.677,
    "magaShare": 0.699,
    "relShare": 0.167,
    "modShare": 0.134,
    "demTurnoutBasis": 6144,
    "repTurnoutBasis": 17342
  },
  "01079": {
    "progShare": 0.169,
    "estabShare": 0.831,
    "magaShare": 0.751,
    "relShare": 0.155,
    "modShare": 0.094,
    "demTurnoutBasis": 2395,
    "repTurnoutBasis": 6483
  },
  "01081": {
    "progShare": 0.289,
    "estabShare": 0.711,
    "magaShare": 0.604,
    "relShare": 0.212,
    "modShare": 0.184,
    "demTurnoutBasis": 11161,
    "repTurnoutBasis": 18085
  },
  "01083": {
    "progShare": 0.268,
    "estabShare": 0.732,
    "magaShare": 0.69,
    "relShare": 0.18,
    "modShare": 0.13,
    "demTurnoutBasis": 5636,
    "repTurnoutBasis": 17760
  },
  "01085": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.769,
    "relShare": 0.151,
    "modShare": 0.08,
    "demTurnoutBasis": 4153,
    "repTurnoutBasis": 756
  },
  "01087": {
    "progShare": 0.128,
    "estabShare": 0.872,
    "magaShare": 0.697,
    "relShare": 0.193,
    "modShare": 0.11,
    "demTurnoutBasis": 4768,
    "repTurnoutBasis": 635
  },
  "01089": {
    "progShare": 0.315,
    "estabShare": 0.685,
    "magaShare": 0.629,
    "relShare": 0.18,
    "modShare": 0.191,
    "demTurnoutBasis": 37240,
    "repTurnoutBasis": 58634
  },
  "01091": {
    "progShare": 0.175,
    "estabShare": 0.825,
    "magaShare": 0.834,
    "relShare": 0.084,
    "modShare": 0.082,
    "demTurnoutBasis": 4960,
    "repTurnoutBasis": 1948
  },
  "01093": {
    "progShare": 0.284,
    "estabShare": 0.716,
    "magaShare": 0.766,
    "relShare": 0.145,
    "modShare": 0.089,
    "demTurnoutBasis": 787,
    "repTurnoutBasis": 6534
  },
  "01095": {
    "progShare": 0.342,
    "estabShare": 0.658,
    "magaShare": 0.732,
    "relShare": 0.136,
    "modShare": 0.132,
    "demTurnoutBasis": 2722,
    "repTurnoutBasis": 17456
  },
  "01097": {
    "progShare": 0.19,
    "estabShare": 0.81,
    "magaShare": 0.689,
    "relShare": 0.17,
    "modShare": 0.141,
    "demTurnoutBasis": 38108,
    "repTurnoutBasis": 56337
  },
  "01099": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.758,
    "relShare": 0.142,
    "modShare": 0.1,
    "demTurnoutBasis": 2607,
    "repTurnoutBasis": 3750
  },
  "01101": {
    "progShare": 0.156,
    "estabShare": 0.844,
    "magaShare": 0.634,
    "relShare": 0.187,
    "modShare": 0.179,
    "demTurnoutBasis": 34174,
    "repTurnoutBasis": 22616
  },
  "01103": {
    "progShare": 0.252,
    "estabShare": 0.748,
    "magaShare": 0.703,
    "relShare": 0.17,
    "modShare": 0.127,
    "demTurnoutBasis": 6023,
    "repTurnoutBasis": 23379
  },
  "01105": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.786,
    "relShare": 0.137,
    "modShare": 0.077,
    "demTurnoutBasis": 3157,
    "repTurnoutBasis": 501
  },
  "01107": {
    "progShare": 0.139,
    "estabShare": 0.861,
    "magaShare": 0.746,
    "relShare": 0.173,
    "modShare": 0.081,
    "demTurnoutBasis": 2800,
    "repTurnoutBasis": 2796
  },
  "01109": {
    "progShare": 0.182,
    "estabShare": 0.818,
    "magaShare": 0.696,
    "relShare": 0.193,
    "modShare": 0.111,
    "demTurnoutBasis": 2630,
    "repTurnoutBasis": 4844
  },
  "01111": {
    "progShare": 0.187,
    "estabShare": 0.813,
    "magaShare": 0.767,
    "relShare": 0.149,
    "modShare": 0.084,
    "demTurnoutBasis": 1471,
    "repTurnoutBasis": 4783
  },
  "01113": {
    "progShare": 0.168,
    "estabShare": 0.832,
    "magaShare": 0.714,
    "relShare": 0.196,
    "modShare": 0.09,
    "demTurnoutBasis": 5551,
    "repTurnoutBasis": 3464
  },
  "01117": {
    "progShare": 0.344,
    "estabShare": 0.656,
    "magaShare": 0.622,
    "relShare": 0.211,
    "modShare": 0.167,
    "demTurnoutBasis": 13741,
    "repTurnoutBasis": 46941
  },
  "01115": {
    "progShare": 0.292,
    "estabShare": 0.708,
    "magaShare": 0.709,
    "relShare": 0.202,
    "modShare": 0.089,
    "demTurnoutBasis": 3298,
    "repTurnoutBasis": 18458
  },
  "01119": {
    "progShare": 0.122,
    "estabShare": 0.878,
    "magaShare": 0.592,
    "relShare": 0.235,
    "modShare": 0.173,
    "demTurnoutBasis": 2033,
    "repTurnoutBasis": 150
  },
  "01121": {
    "progShare": 0.14,
    "estabShare": 0.86,
    "magaShare": 0.748,
    "relShare": 0.156,
    "modShare": 0.096,
    "demTurnoutBasis": 6582,
    "repTurnoutBasis": 12069
  },
  "01123": {
    "progShare": 0.127,
    "estabShare": 0.873,
    "magaShare": 0.75,
    "relShare": 0.143,
    "modShare": 0.107,
    "demTurnoutBasis": 2870,
    "repTurnoutBasis": 8451
  },
  "01125": {
    "progShare": 0.25,
    "estabShare": 0.75,
    "magaShare": 0.641,
    "relShare": 0.21,
    "modShare": 0.149,
    "demTurnoutBasis": 17807,
    "repTurnoutBasis": 27439
  },
  "01127": {
    "progShare": 0.293,
    "estabShare": 0.707,
    "magaShare": 0.773,
    "relShare": 0.148,
    "modShare": 0.079,
    "demTurnoutBasis": 2557,
    "repTurnoutBasis": 15648
  },
  "01129": {
    "progShare": 0.213,
    "estabShare": 0.787,
    "magaShare": 0.785,
    "relShare": 0.135,
    "modShare": 0.08,
    "demTurnoutBasis": 2666,
    "repTurnoutBasis": 2526
  },
  "01131": {
    "progShare": 0.12,
    "estabShare": 0.88,
    "magaShare": 0.793,
    "relShare": 0.128,
    "modShare": 0.079,
    "demTurnoutBasis": 3798,
    "repTurnoutBasis": 622
  },
  "01133": {
    "progShare": 0.308,
    "estabShare": 0.692,
    "magaShare": 0.773,
    "relShare": 0.145,
    "modShare": 0.082,
    "demTurnoutBasis": 485,
    "repTurnoutBasis": 5763
  },
  "05001": {
    "progShare": 0.234,
    "estabShare": 0.766,
    "magaShare": 0.509,
    "relShare": 0.219,
    "modShare": 0.272,
    "demTurnoutBasis": 688,
    "repTurnoutBasis": 1730
  },
  "05003": {
    "progShare": 0.46,
    "estabShare": 0.54,
    "magaShare": 0.681,
    "relShare": 0.191,
    "modShare": 0.128,
    "demTurnoutBasis": 1790,
    "repTurnoutBasis": 1350
  },
  "05005": {
    "progShare": 0.403,
    "estabShare": 0.597,
    "magaShare": 0.568,
    "relShare": 0.265,
    "modShare": 0.167,
    "demTurnoutBasis": 1689,
    "repTurnoutBasis": 5649
  },
  "05007": {
    "progShare": 0.515,
    "estabShare": 0.485,
    "magaShare": 0.436,
    "relShare": 0.272,
    "modShare": 0.292,
    "demTurnoutBasis": 10323,
    "repTurnoutBasis": 27362
  },
  "05009": {
    "progShare": 0.449,
    "estabShare": 0.551,
    "magaShare": 0.55,
    "relShare": 0.258,
    "modShare": 0.192,
    "demTurnoutBasis": 1071,
    "repTurnoutBasis": 4125
  },
  "05011": {
    "progShare": 0.221,
    "estabShare": 0.779,
    "magaShare": 0.596,
    "relShare": 0.214,
    "modShare": 0.19,
    "demTurnoutBasis": 574,
    "repTurnoutBasis": 1180
  },
  "05013": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.629,
    "relShare": 0.243,
    "modShare": 0.128,
    "demTurnoutBasis": 568,
    "repTurnoutBasis": 327
  },
  "05015": {
    "progShare": 0.56,
    "estabShare": 0.44,
    "magaShare": 0.527,
    "relShare": 0.274,
    "modShare": 0.199,
    "demTurnoutBasis": 1698,
    "repTurnoutBasis": 2733
  },
  "05017": {
    "progShare": 0.211,
    "estabShare": 0.789,
    "magaShare": 0.667,
    "relShare": 0.168,
    "modShare": 0.165,
    "demTurnoutBasis": 1318,
    "repTurnoutBasis": 574
  },
  "05019": {
    "progShare": 0.299,
    "estabShare": 0.701,
    "magaShare": 0.447,
    "relShare": 0.305,
    "modShare": 0.248,
    "demTurnoutBasis": 1673,
    "repTurnoutBasis": 1757
  },
  "05021": {
    "progShare": 0.453,
    "estabShare": 0.547,
    "magaShare": 0.689,
    "relShare": 0.208,
    "modShare": 0.103,
    "demTurnoutBasis": 1146,
    "repTurnoutBasis": 795
  },
  "05023": {
    "progShare": 0.388,
    "estabShare": 0.612,
    "magaShare": 0.376,
    "relShare": 0.377,
    "modShare": 0.247,
    "demTurnoutBasis": 561,
    "repTurnoutBasis": 3460
  },
  "05025": {
    "progShare": 0.301,
    "estabShare": 0.699,
    "magaShare": 0.561,
    "relShare": 0.277,
    "modShare": 0.162,
    "demTurnoutBasis": 420,
    "repTurnoutBasis": 1123
  },
  "05027": {
    "progShare": 0.293,
    "estabShare": 0.707,
    "magaShare": 0.499,
    "relShare": 0.298,
    "modShare": 0.203,
    "demTurnoutBasis": 993,
    "repTurnoutBasis": 1979
  },
  "05029": {
    "progShare": 0.367,
    "estabShare": 0.633,
    "magaShare": 0.59,
    "relShare": 0.249,
    "modShare": 0.161,
    "demTurnoutBasis": 2040,
    "repTurnoutBasis": 1726
  },
  "05031": {
    "progShare": 0.437,
    "estabShare": 0.563,
    "magaShare": 0.478,
    "relShare": 0.298,
    "modShare": 0.224,
    "demTurnoutBasis": 4141,
    "repTurnoutBasis": 8758
  },
  "05033": {
    "progShare": 0.411,
    "estabShare": 0.589,
    "magaShare": 0.503,
    "relShare": 0.317,
    "modShare": 0.18,
    "demTurnoutBasis": 2082,
    "repTurnoutBasis": 7230
  },
  "05035": {
    "progShare": 0.231,
    "estabShare": 0.769,
    "magaShare": 0.55,
    "relShare": 0.275,
    "modShare": 0.175,
    "demTurnoutBasis": 3255,
    "repTurnoutBasis": 1929
  },
  "05037": {
    "progShare": 0.307,
    "estabShare": 0.693,
    "magaShare": 0.542,
    "relShare": 0.308,
    "modShare": 0.15,
    "demTurnoutBasis": 708,
    "repTurnoutBasis": 1571
  },
  "05039": {
    "progShare": 0.345,
    "estabShare": 0.655,
    "magaShare": 0.637,
    "relShare": 0.234,
    "modShare": 0.129,
    "demTurnoutBasis": 824,
    "repTurnoutBasis": 378
  },
  "05041": {
    "progShare": 0.283,
    "estabShare": 0.717,
    "magaShare": 0.764,
    "relShare": 0.104,
    "modShare": 0.132,
    "demTurnoutBasis": 1370,
    "repTurnoutBasis": 456
  },
  "05043": {
    "progShare": 0.322,
    "estabShare": 0.678,
    "magaShare": 0.564,
    "relShare": 0.233,
    "modShare": 0.203,
    "demTurnoutBasis": 1331,
    "repTurnoutBasis": 1564
  },
  "05045": {
    "progShare": 0.494,
    "estabShare": 0.506,
    "magaShare": 0.421,
    "relShare": 0.312,
    "modShare": 0.267,
    "demTurnoutBasis": 5831,
    "repTurnoutBasis": 11771
  },
  "05047": {
    "progShare": 0.356,
    "estabShare": 0.644,
    "magaShare": 0.542,
    "relShare": 0.294,
    "modShare": 0.164,
    "demTurnoutBasis": 750,
    "repTurnoutBasis": 2272
  },
  "05049": {
    "progShare": 0.438,
    "estabShare": 0.562,
    "magaShare": 0.633,
    "relShare": 0.256,
    "modShare": 0.111,
    "demTurnoutBasis": 879,
    "repTurnoutBasis": 994
  },
  "05051": {
    "progShare": 0.38,
    "estabShare": 0.62,
    "magaShare": 0.508,
    "relShare": 0.251,
    "modShare": 0.241,
    "demTurnoutBasis": 4788,
    "repTurnoutBasis": 10395
  },
  "05053": {
    "progShare": 0.359,
    "estabShare": 0.641,
    "magaShare": 0.522,
    "relShare": 0.319,
    "modShare": 0.159,
    "demTurnoutBasis": 778,
    "repTurnoutBasis": 2323
  },
  "05055": {
    "progShare": 0.396,
    "estabShare": 0.604,
    "magaShare": 0.53,
    "relShare": 0.264,
    "modShare": 0.206,
    "demTurnoutBasis": 1409,
    "repTurnoutBasis": 4091
  },
  "05057": {
    "progShare": 0.212,
    "estabShare": 0.788,
    "magaShare": 0.556,
    "relShare": 0.301,
    "modShare": 0.143,
    "demTurnoutBasis": 827,
    "repTurnoutBasis": 1774
  },
  "05059": {
    "progShare": 0.394,
    "estabShare": 0.606,
    "magaShare": 0.579,
    "relShare": 0.26,
    "modShare": 0.161,
    "demTurnoutBasis": 1700,
    "repTurnoutBasis": 3169
  },
  "05061": {
    "progShare": 0.271,
    "estabShare": 0.729,
    "magaShare": 0.35,
    "relShare": 0.419,
    "modShare": 0.231,
    "demTurnoutBasis": 352,
    "repTurnoutBasis": 814
  },
  "05063": {
    "progShare": 0.371,
    "estabShare": 0.629,
    "magaShare": 0.467,
    "relShare": 0.302,
    "modShare": 0.231,
    "demTurnoutBasis": 1237,
    "repTurnoutBasis": 3600
  },
  "05065": {
    "progShare": 0.375,
    "estabShare": 0.625,
    "magaShare": 0.583,
    "relShare": 0.274,
    "modShare": 0.143,
    "demTurnoutBasis": 584,
    "repTurnoutBasis": 1442
  },
  "05067": {
    "progShare": 0.288,
    "estabShare": 0.712,
    "magaShare": 0.603,
    "relShare": 0.225,
    "modShare": 0.172,
    "demTurnoutBasis": 727,
    "repTurnoutBasis": 1174
  },
  "05069": {
    "progShare": 0.244,
    "estabShare": 0.756,
    "magaShare": 0.601,
    "relShare": 0.261,
    "modShare": 0.138,
    "demTurnoutBasis": 9249,
    "repTurnoutBasis": 2850
  },
  "05071": {
    "progShare": 0.426,
    "estabShare": 0.574,
    "magaShare": 0.574,
    "relShare": 0.258,
    "modShare": 0.168,
    "demTurnoutBasis": 1302,
    "repTurnoutBasis": 2360
  },
  "05073": {
    "progShare": 0.3,
    "estabShare": 0.7,
    "magaShare": 0.572,
    "relShare": 0.338,
    "modShare": 0.09,
    "demTurnoutBasis": 423,
    "repTurnoutBasis": 530
  },
  "05075": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.641,
    "relShare": 0.237,
    "modShare": 0.122,
    "demTurnoutBasis": 1225,
    "repTurnoutBasis": 1102
  },
  "05077": {
    "progShare": 0.146,
    "estabShare": 0.854,
    "magaShare": 0.625,
    "relShare": 0.201,
    "modShare": 0.174,
    "demTurnoutBasis": 759,
    "repTurnoutBasis": 410
  },
  "05079": {
    "progShare": 0.279,
    "estabShare": 0.721,
    "magaShare": 0.445,
    "relShare": 0.36,
    "modShare": 0.195,
    "demTurnoutBasis": 402,
    "repTurnoutBasis": 675
  },
  "05081": {
    "progShare": 0.395,
    "estabShare": 0.605,
    "magaShare": 0.634,
    "relShare": 0.267,
    "modShare": 0.099,
    "demTurnoutBasis": 919,
    "repTurnoutBasis": 1110
  },
  "05083": {
    "progShare": 0.334,
    "estabShare": 0.666,
    "magaShare": 0.571,
    "relShare": 0.268,
    "modShare": 0.161,
    "demTurnoutBasis": 953,
    "repTurnoutBasis": 2453
  },
  "05085": {
    "progShare": 0.4,
    "estabShare": 0.6,
    "magaShare": 0.452,
    "relShare": 0.334,
    "modShare": 0.214,
    "demTurnoutBasis": 2118,
    "repTurnoutBasis": 7346
  },
  "05087": {
    "progShare": 0.545,
    "estabShare": 0.455,
    "magaShare": 0.621,
    "relShare": 0.258,
    "modShare": 0.121,
    "demTurnoutBasis": 1625,
    "repTurnoutBasis": 1420
  },
  "05089": {
    "progShare": 0.458,
    "estabShare": 0.542,
    "magaShare": 0.551,
    "relShare": 0.277,
    "modShare": 0.172,
    "demTurnoutBasis": 611,
    "repTurnoutBasis": 2320
  },
  "05091": {
    "progShare": 0.259,
    "estabShare": 0.741,
    "magaShare": 0.551,
    "relShare": 0.329,
    "modShare": 0.12,
    "demTurnoutBasis": 1404,
    "repTurnoutBasis": 4993
  },
  "05093": {
    "progShare": 0.215,
    "estabShare": 0.785,
    "magaShare": 0.586,
    "relShare": 0.221,
    "modShare": 0.193,
    "demTurnoutBasis": 1729,
    "repTurnoutBasis": 2484
  },
  "05095": {
    "progShare": 0.376,
    "estabShare": 0.624,
    "magaShare": 0.676,
    "relShare": 0.208,
    "modShare": 0.116,
    "demTurnoutBasis": 993,
    "repTurnoutBasis": 374
  },
  "05097": {
    "progShare": 0.36,
    "estabShare": 0.64,
    "magaShare": 0.597,
    "relShare": 0.239,
    "modShare": 0.164,
    "demTurnoutBasis": 384,
    "repTurnoutBasis": 1155
  },
  "05099": {
    "progShare": 0.362,
    "estabShare": 0.638,
    "magaShare": 0.565,
    "relShare": 0.292,
    "modShare": 0.143,
    "demTurnoutBasis": 759,
    "repTurnoutBasis": 516
  },
  "05101": {
    "progShare": 0.519,
    "estabShare": 0.481,
    "magaShare": 0.58,
    "relShare": 0.266,
    "modShare": 0.154,
    "demTurnoutBasis": 369,
    "repTurnoutBasis": 921
  },
  "05103": {
    "progShare": 0.247,
    "estabShare": 0.753,
    "magaShare": 0.503,
    "relShare": 0.279,
    "modShare": 0.218,
    "demTurnoutBasis": 1922,
    "repTurnoutBasis": 1726
  },
  "05105": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.568,
    "relShare": 0.297,
    "modShare": 0.135,
    "demTurnoutBasis": 845,
    "repTurnoutBasis": 1059
  },
  "05107": {
    "progShare": 0.255,
    "estabShare": 0.745,
    "magaShare": 0.743,
    "relShare": 0.133,
    "modShare": 0.124,
    "demTurnoutBasis": 2328,
    "repTurnoutBasis": 531
  },
  "05109": {
    "progShare": 0.369,
    "estabShare": 0.631,
    "magaShare": 0.515,
    "relShare": 0.304,
    "modShare": 0.181,
    "demTurnoutBasis": 399,
    "repTurnoutBasis": 1018
  },
  "05111": {
    "progShare": 0.316,
    "estabShare": 0.684,
    "magaShare": 0.589,
    "relShare": 0.269,
    "modShare": 0.142,
    "demTurnoutBasis": 828,
    "repTurnoutBasis": 2003
  },
  "05113": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.568,
    "relShare": 0.226,
    "modShare": 0.206,
    "demTurnoutBasis": 512,
    "repTurnoutBasis": 3143
  },
  "05115": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.492,
    "relShare": 0.292,
    "modShare": 0.216,
    "demTurnoutBasis": 2201,
    "repTurnoutBasis": 6488
  },
  "05117": {
    "progShare": 0.464,
    "estabShare": 0.536,
    "magaShare": 0.529,
    "relShare": 0.318,
    "modShare": 0.153,
    "demTurnoutBasis": 675,
    "repTurnoutBasis": 819
  },
  "05119": {
    "progShare": 0.321,
    "estabShare": 0.679,
    "magaShare": 0.412,
    "relShare": 0.258,
    "modShare": 0.33,
    "demTurnoutBasis": 40980,
    "repTurnoutBasis": 29510
  },
  "05121": {
    "progShare": 0.422,
    "estabShare": 0.578,
    "magaShare": 0.543,
    "relShare": 0.287,
    "modShare": 0.17,
    "demTurnoutBasis": 770,
    "repTurnoutBasis": 1368
  },
  "05125": {
    "progShare": 0.397,
    "estabShare": 0.603,
    "magaShare": 0.471,
    "relShare": 0.292,
    "modShare": 0.237,
    "demTurnoutBasis": 5435,
    "repTurnoutBasis": 14888
  },
  "05129": {
    "progShare": 0.498,
    "estabShare": 0.502,
    "magaShare": 0.515,
    "relShare": 0.346,
    "modShare": 0.139,
    "demTurnoutBasis": 293,
    "repTurnoutBasis": 1504
  },
  "05131": {
    "progShare": 0.443,
    "estabShare": 0.557,
    "magaShare": 0.497,
    "relShare": 0.272,
    "modShare": 0.231,
    "demTurnoutBasis": 5309,
    "repTurnoutBasis": 12963
  },
  "05133": {
    "progShare": 0.365,
    "estabShare": 0.635,
    "magaShare": 0.581,
    "relShare": 0.286,
    "modShare": 0.133,
    "demTurnoutBasis": 479,
    "repTurnoutBasis": 1134
  },
  "05135": {
    "progShare": 0.373,
    "estabShare": 0.627,
    "magaShare": 0.592,
    "relShare": 0.235,
    "modShare": 0.173,
    "demTurnoutBasis": 746,
    "repTurnoutBasis": 2095
  },
  "05123": {
    "progShare": 0.214,
    "estabShare": 0.786,
    "magaShare": 0.422,
    "relShare": 0.394,
    "modShare": 0.184,
    "demTurnoutBasis": 1238,
    "repTurnoutBasis": 726
  },
  "05137": {
    "progShare": 0.487,
    "estabShare": 0.513,
    "magaShare": 0.582,
    "relShare": 0.274,
    "modShare": 0.144,
    "demTurnoutBasis": 786,
    "repTurnoutBasis": 1825
  },
  "05139": {
    "progShare": 0.422,
    "estabShare": 0.578,
    "magaShare": 0.578,
    "relShare": 0.266,
    "modShare": 0.156,
    "demTurnoutBasis": 3331,
    "repTurnoutBasis": 2569
  },
  "05141": {
    "progShare": 0.411,
    "estabShare": 0.589,
    "magaShare": 0.53,
    "relShare": 0.276,
    "modShare": 0.194,
    "demTurnoutBasis": 911,
    "repTurnoutBasis": 2098
  },
  "05143": {
    "progShare": 0.563,
    "estabShare": 0.437,
    "magaShare": 0.452,
    "relShare": 0.278,
    "modShare": 0.27,
    "demTurnoutBasis": 16608,
    "repTurnoutBasis": 19311
  },
  "05147": {
    "progShare": 0.345,
    "estabShare": 0.655,
    "magaShare": 0.697,
    "relShare": 0.201,
    "modShare": 0.102,
    "demTurnoutBasis": 932,
    "repTurnoutBasis": 294
  },
  "05149": {
    "progShare": 0.437,
    "estabShare": 0.563,
    "magaShare": 0.545,
    "relShare": 0.285,
    "modShare": 0.17,
    "demTurnoutBasis": 916,
    "repTurnoutBasis": 1655
  },
  "06001": {
    "progShare": 0.483,
    "estabShare": 0.517,
    "magaShare": 0.591,
    "relShare": 0.193,
    "modShare": 0.216,
    "demTurnoutBasis": 480632,
    "repTurnoutBasis": 44048
  },
  "06003": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.739,
    "relShare": 0.101,
    "modShare": 0.16,
    "demTurnoutBasis": 378,
    "repTurnoutBasis": 154
  },
  "06005": {
    "progShare": 0.452,
    "estabShare": 0.548,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 13335,
    "repTurnoutBasis": 7728
  },
  "06007": {
    "progShare": 0.627,
    "estabShare": 0.373,
    "magaShare": 0.742,
    "relShare": 0.163,
    "modShare": 0.095,
    "demTurnoutBasis": 47730,
    "repTurnoutBasis": 25156
  },
  "06009": {
    "progShare": 0.495,
    "estabShare": 0.505,
    "magaShare": 0.772,
    "relShare": 0.135,
    "modShare": 0.093,
    "demTurnoutBasis": 9012,
    "repTurnoutBasis": 7009
  },
  "06011": {
    "progShare": 0.492,
    "estabShare": 0.508,
    "magaShare": 0.785,
    "relShare": 0.128,
    "modShare": 0.087,
    "demTurnoutBasis": 2538,
    "repTurnoutBasis": 2057
  },
  "06013": {
    "progShare": 0.43,
    "estabShare": 0.57,
    "magaShare": 0.625,
    "relShare": 0.153,
    "modShare": 0.222,
    "demTurnoutBasis": 273416,
    "repTurnoutBasis": 59690
  },
  "06015": {
    "progShare": 0.588,
    "estabShare": 0.412,
    "magaShare": 0.723,
    "relShare": 0.197,
    "modShare": 0.08,
    "demTurnoutBasis": 4158,
    "repTurnoutBasis": 2411
  },
  "06017": {
    "progShare": 0.503,
    "estabShare": 0.497,
    "magaShare": 0.73,
    "relShare": 0.145,
    "modShare": 0.125,
    "demTurnoutBasis": 38138,
    "repTurnoutBasis": 27781
  },
  "06019": {
    "progShare": 0.433,
    "estabShare": 0.567,
    "magaShare": 0.708,
    "relShare": 0.191,
    "modShare": 0.101,
    "demTurnoutBasis": 121646,
    "repTurnoutBasis": 65556
  },
  "06021": {
    "progShare": 0.524,
    "estabShare": 0.476,
    "magaShare": 0.754,
    "relShare": 0.166,
    "modShare": 0.08,
    "demTurnoutBasis": 2922,
    "repTurnoutBasis": 3107
  },
  "06023": {
    "progShare": 0.71,
    "estabShare": 0.29,
    "magaShare": 0.67,
    "relShare": 0.215,
    "modShare": 0.115,
    "demTurnoutBasis": 42455,
    "repTurnoutBasis": 9203
  },
  "06025": {
    "progShare": 0.383,
    "estabShare": 0.617,
    "magaShare": 0.815,
    "relShare": 0.105,
    "modShare": 0.08,
    "demTurnoutBasis": 29258,
    "repTurnoutBasis": 3174
  },
  "06027": {
    "progShare": 0.567,
    "estabShare": 0.433,
    "magaShare": 0.724,
    "relShare": 0.159,
    "modShare": 0.117,
    "demTurnoutBasis": 3537,
    "repTurnoutBasis": 2462
  },
  "06029": {
    "progShare": 0.448,
    "estabShare": 0.552,
    "magaShare": 0.711,
    "relShare": 0.204,
    "modShare": 0.085,
    "demTurnoutBasis": 79851,
    "repTurnoutBasis": 64961
  },
  "06031": {
    "progShare": 0.409,
    "estabShare": 0.591,
    "magaShare": 0.742,
    "relShare": 0.179,
    "modShare": 0.079,
    "demTurnoutBasis": 10776,
    "repTurnoutBasis": 9272
  },
  "06033": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.746,
    "relShare": 0.143,
    "modShare": 0.111,
    "demTurnoutBasis": 13997,
    "repTurnoutBasis": 5200
  },
  "06035": {
    "progShare": 0.557,
    "estabShare": 0.443,
    "magaShare": 0.761,
    "relShare": 0.161,
    "modShare": 0.078,
    "demTurnoutBasis": 2858,
    "repTurnoutBasis": 3902
  },
  "06037": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.631,
    "relShare": 0.202,
    "modShare": 0.167,
    "demTurnoutBasis": 2151990,
    "repTurnoutBasis": 339513
  },
  "06039": {
    "progShare": 0.455,
    "estabShare": 0.545,
    "magaShare": 0.727,
    "relShare": 0.188,
    "modShare": 0.085,
    "demTurnoutBasis": 16409,
    "repTurnoutBasis": 12741
  },
  "06041": {
    "progShare": 0.434,
    "estabShare": 0.566,
    "magaShare": 0.581,
    "relShare": 0.111,
    "modShare": 0.308,
    "demTurnoutBasis": 115136,
    "repTurnoutBasis": 15151
  },
  "06043": {
    "progShare": 0.551,
    "estabShare": 0.449,
    "magaShare": 0.713,
    "relShare": 0.193,
    "modShare": 0.094,
    "demTurnoutBasis": 3752,
    "repTurnoutBasis": 2969
  },
  "06045": {
    "progShare": 0.67,
    "estabShare": 0.33,
    "magaShare": 0.701,
    "relShare": 0.171,
    "modShare": 0.128,
    "demTurnoutBasis": 27639,
    "repTurnoutBasis": 5253
  },
  "06047": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.731,
    "relShare": 0.182,
    "modShare": 0.087,
    "demTurnoutBasis": 30677,
    "repTurnoutBasis": 13127
  },
  "06049": {
    "progShare": 0.554,
    "estabShare": 0.446,
    "magaShare": 0.769,
    "relShare": 0.153,
    "modShare": 0.078,
    "demTurnoutBasis": 998,
    "repTurnoutBasis": 1497
  },
  "06051": {
    "progShare": 0.558,
    "estabShare": 0.442,
    "magaShare": 0.674,
    "relShare": 0.161,
    "modShare": 0.165,
    "demTurnoutBasis": 2682,
    "repTurnoutBasis": 1200
  },
  "06053": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.64,
    "relShare": 0.158,
    "modShare": 0.202,
    "demTurnoutBasis": 84474,
    "repTurnoutBasis": 20009
  },
  "06055": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.653,
    "relShare": 0.158,
    "modShare": 0.189,
    "demTurnoutBasis": 38183,
    "repTurnoutBasis": 10298
  },
  "06057": {
    "progShare": 0.628,
    "estabShare": 0.372,
    "magaShare": 0.741,
    "relShare": 0.141,
    "modShare": 0.118,
    "demTurnoutBasis": 33225,
    "repTurnoutBasis": 15112
  },
  "06059": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.7,
    "relShare": 0.157,
    "modShare": 0.143,
    "demTurnoutBasis": 495893,
    "repTurnoutBasis": 264551
  },
  "06061": {
    "progShare": 0.453,
    "estabShare": 0.547,
    "magaShare": 0.731,
    "relShare": 0.136,
    "modShare": 0.133,
    "demTurnoutBasis": 69982,
    "repTurnoutBasis": 52494
  },
  "06063": {
    "progShare": 0.549,
    "estabShare": 0.451,
    "magaShare": 0.765,
    "relShare": 0.128,
    "modShare": 0.107,
    "demTurnoutBasis": 4122,
    "repTurnoutBasis": 3320
  },
  "06065": {
    "progShare": 0.433,
    "estabShare": 0.567,
    "magaShare": 0.76,
    "relShare": 0.144,
    "modShare": 0.096,
    "demTurnoutBasis": 300962,
    "repTurnoutBasis": 152684
  },
  "06067": {
    "progShare": 0.449,
    "estabShare": 0.551,
    "magaShare": 0.68,
    "relShare": 0.164,
    "modShare": 0.156,
    "demTurnoutBasis": 301887,
    "repTurnoutBasis": 93928
  },
  "06069": {
    "progShare": 0.451,
    "estabShare": 0.549,
    "magaShare": 0.715,
    "relShare": 0.158,
    "modShare": 0.127,
    "demTurnoutBasis": 11363,
    "repTurnoutBasis": 4160
  },
  "06071": {
    "progShare": 0.447,
    "estabShare": 0.553,
    "magaShare": 0.734,
    "relShare": 0.179,
    "modShare": 0.087,
    "demTurnoutBasis": 263963,
    "repTurnoutBasis": 114759
  },
  "06073": {
    "progShare": 0.481,
    "estabShare": 0.519,
    "magaShare": 0.716,
    "relShare": 0.146,
    "modShare": 0.138,
    "demTurnoutBasis": 627418,
    "repTurnoutBasis": 243565
  },
  "06075": {
    "progShare": 0.461,
    "estabShare": 0.539,
    "magaShare": 0.521,
    "relShare": 0.158,
    "modShare": 0.321,
    "demTurnoutBasis": 325368,
    "repTurnoutBasis": 15455
  },
  "06077": {
    "progShare": 0.427,
    "estabShare": 0.573,
    "magaShare": 0.718,
    "relShare": 0.177,
    "modShare": 0.105,
    "demTurnoutBasis": 101421,
    "repTurnoutBasis": 43868
  },
  "06079": {
    "progShare": 0.53,
    "estabShare": 0.47,
    "magaShare": 0.682,
    "relShare": 0.169,
    "modShare": 0.149,
    "demTurnoutBasis": 69543,
    "repTurnoutBasis": 35054
  },
  "06081": {
    "progShare": 0.41,
    "estabShare": 0.59,
    "magaShare": 0.598,
    "relShare": 0.142,
    "modShare": 0.26,
    "demTurnoutBasis": 203742,
    "repTurnoutBasis": 29886
  },
  "06083": {
    "progShare": 0.528,
    "estabShare": 0.472,
    "magaShare": 0.671,
    "relShare": 0.163,
    "modShare": 0.166,
    "demTurnoutBasis": 102176,
    "repTurnoutBasis": 33853
  },
  "06085": {
    "progShare": 0.421,
    "estabShare": 0.579,
    "magaShare": 0.557,
    "relShare": 0.192,
    "modShare": 0.251,
    "demTurnoutBasis": 416270,
    "repTurnoutBasis": 79073
  },
  "06087": {
    "progShare": 0.593,
    "estabShare": 0.407,
    "magaShare": 0.605,
    "relShare": 0.159,
    "modShare": 0.236,
    "demTurnoutBasis": 109256,
    "repTurnoutBasis": 13413
  },
  "06089": {
    "progShare": 0.536,
    "estabShare": 0.464,
    "magaShare": 0.754,
    "relShare": 0.166,
    "modShare": 0.08,
    "demTurnoutBasis": 25818,
    "repTurnoutBasis": 26503
  },
  "06091": {
    "progShare": 0.57,
    "estabShare": 0.43,
    "magaShare": 0.785,
    "relShare": 0.136,
    "modShare": 0.079,
    "demTurnoutBasis": 791,
    "repTurnoutBasis": 634
  },
  "06093": {
    "progShare": 0.587,
    "estabShare": 0.413,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 12770,
    "repTurnoutBasis": 3366
  },
  "06095": {
    "progShare": 0.442,
    "estabShare": 0.558,
    "magaShare": 0.709,
    "relShare": 0.165,
    "modShare": 0.126,
    "demTurnoutBasis": 92820,
    "repTurnoutBasis": 24210
  },
  "06097": {
    "progShare": 0.524,
    "estabShare": 0.476,
    "magaShare": 0.604,
    "relShare": 0.174,
    "modShare": 0.222,
    "demTurnoutBasis": 176348,
    "repTurnoutBasis": 31049
  },
  "06099": {
    "progShare": 0.479,
    "estabShare": 0.521,
    "magaShare": 0.701,
    "relShare": 0.196,
    "modShare": 0.103,
    "demTurnoutBasis": 71311,
    "repTurnoutBasis": 36960
  },
  "06101": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.774,
    "relShare": 0.146,
    "modShare": 0.08,
    "demTurnoutBasis": 11448,
    "repTurnoutBasis": 9754
  },
  "06103": {
    "progShare": 0.528,
    "estabShare": 0.472,
    "magaShare": 0.777,
    "relShare": 0.145,
    "modShare": 0.078,
    "demTurnoutBasis": 7745,
    "repTurnoutBasis": 7949
  },
  "06105": {
    "progShare": 0.643,
    "estabShare": 0.357,
    "magaShare": 0.712,
    "relShare": 0.177,
    "modShare": 0.111,
    "demTurnoutBasis": 2871,
    "repTurnoutBasis": 1556
  },
  "06107": {
    "progShare": 0.446,
    "estabShare": 0.554,
    "magaShare": 0.748,
    "relShare": 0.171,
    "modShare": 0.081,
    "demTurnoutBasis": 37161,
    "repTurnoutBasis": 29806
  },
  "06109": {
    "progShare": 0.487,
    "estabShare": 0.513,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 14675,
    "repTurnoutBasis": 4884
  },
  "06111": {
    "progShare": 0.484,
    "estabShare": 0.516,
    "magaShare": 0.671,
    "relShare": 0.168,
    "modShare": 0.161,
    "demTurnoutBasis": 177572,
    "repTurnoutBasis": 67547
  },
  "06113": {
    "progShare": 0.515,
    "estabShare": 0.485,
    "magaShare": 0.646,
    "relShare": 0.161,
    "modShare": 0.193,
    "demTurnoutBasis": 54909,
    "repTurnoutBasis": 10371
  },
  "06115": {
    "progShare": 0.525,
    "estabShare": 0.475,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 10817,
    "repTurnoutBasis": 4011
  },
  "09001": {
    "progShare": 0.346,
    "estabShare": 0.654,
    "magaShare": 0.522,
    "relShare": 0.089,
    "modShare": 0.389,
    "demTurnoutBasis": 2937,
    "repTurnoutBasis": 2681
  },
  "09003": {
    "progShare": 0.28,
    "estabShare": 0.72,
    "magaShare": 0.543,
    "relShare": 0.17,
    "modShare": 0.287,
    "demTurnoutBasis": 5302,
    "repTurnoutBasis": 272
  },
  "09005": {
    "progShare": 0.459,
    "estabShare": 0.541,
    "magaShare": 0.606,
    "relShare": 0.128,
    "modShare": 0.266,
    "demTurnoutBasis": 431,
    "repTurnoutBasis": 504
  },
  "09009": {
    "progShare": 0.376,
    "estabShare": 0.624,
    "magaShare": 0.546,
    "relShare": 0.153,
    "modShare": 0.301,
    "demTurnoutBasis": 8404,
    "repTurnoutBasis": 561
  },
  "09011": {
    "progShare": 0.482,
    "estabShare": 0.518,
    "magaShare": 0.604,
    "relShare": 0.13,
    "modShare": 0.266,
    "demTurnoutBasis": 1255,
    "repTurnoutBasis": 241
  },
  "09013": {
    "progShare": 0.485,
    "estabShare": 0.515,
    "magaShare": 0.568,
    "relShare": 0.132,
    "modShare": 0.3,
    "demTurnoutBasis": 701,
    "repTurnoutBasis": 621
  },
  "09015": {
    "progShare": 0.549,
    "estabShare": 0.451,
    "magaShare": 0.635,
    "relShare": 0.154,
    "modShare": 0.211,
    "demTurnoutBasis": 958,
    "repTurnoutBasis": 297
  },
  "05127": {
    "progShare": 0.27,
    "estabShare": 0.73,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 444
  },
  "05145": {
    "progShare": 0.329,
    "estabShare": 0.671,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1070,
    "repTurnoutBasis": 2479
  },
  "08001": {
    "progShare": 0.579,
    "estabShare": 0.421,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 33077,
    "repTurnoutBasis": 21017
  },
  "08003": {
    "progShare": 0.611,
    "estabShare": 0.389,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1085,
    "repTurnoutBasis": 953
  },
  "08005": {
    "progShare": 0.531,
    "estabShare": 0.469,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 52672,
    "repTurnoutBasis": 31011
  },
  "08007": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 945,
    "repTurnoutBasis": 1356
  },
  "08009": {
    "progShare": 0.462,
    "estabShare": 0.538,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 577
  },
  "08011": {
    "progShare": 0.466,
    "estabShare": 0.534,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 225,
    "repTurnoutBasis": 431
  },
  "08013": {
    "progShare": 0.616,
    "estabShare": 0.384,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 49947,
    "repTurnoutBasis": 10759
  },
  "08014": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8025,
    "repTurnoutBasis": 4113
  },
  "08015": {
    "progShare": 0.557,
    "estabShare": 0.443,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2106,
    "repTurnoutBasis": 1818
  },
  "08017": {
    "progShare": 0.378,
    "estabShare": 0.622,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 328
  },
  "08019": {
    "progShare": 0.556,
    "estabShare": 0.444,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 988,
    "repTurnoutBasis": 677
  },
  "08021": {
    "progShare": 0.471,
    "estabShare": 0.529,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 643,
    "repTurnoutBasis": 553
  },
  "08023": {
    "progShare": 0.54,
    "estabShare": 0.46,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 399,
    "repTurnoutBasis": 150
  },
  "08025": {
    "progShare": 0.399,
    "estabShare": 0.601,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 401
  },
  "08027": {
    "progShare": 0.49,
    "estabShare": 0.51,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 266,
    "repTurnoutBasis": 808
  },
  "08029": {
    "progShare": 0.575,
    "estabShare": 0.425,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1725,
    "repTurnoutBasis": 3748
  },
  "08031": {
    "progShare": 0.607,
    "estabShare": 0.393,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 89712,
    "repTurnoutBasis": 15030
  },
  "08033": {
    "progShare": 0.629,
    "estabShare": 0.371,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 326
  },
  "08035": {
    "progShare": 0.458,
    "estabShare": 0.542,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 24351,
    "repTurnoutBasis": 29300
  },
  "08037": {
    "progShare": 0.477,
    "estabShare": 0.523,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4643,
    "repTurnoutBasis": 2047
  },
  "08041": {
    "progShare": 0.548,
    "estabShare": 0.452,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 38716,
    "repTurnoutBasis": 54414
  },
  "08039": {
    "progShare": 0.459,
    "estabShare": 0.541,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1111,
    "repTurnoutBasis": 3869
  },
  "08043": {
    "progShare": 0.468,
    "estabShare": 0.532,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2021,
    "repTurnoutBasis": 4772
  },
  "08045": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 4056,
    "repTurnoutBasis": 3644
  },
  "08047": {
    "progShare": 0.672,
    "estabShare": 0.328,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 649,
    "repTurnoutBasis": 398
  },
  "08049": {
    "progShare": 0.55,
    "estabShare": 0.45,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1157,
    "repTurnoutBasis": 1360
  },
  "08051": {
    "progShare": 0.67,
    "estabShare": 0.33,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1920,
    "repTurnoutBasis": 912
  },
  "08053": {
    "progShare": 0.531,
    "estabShare": 0.469,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "08055": {
    "progShare": 0.535,
    "estabShare": 0.465,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 675,
    "repTurnoutBasis": 594
  },
  "08057": {
    "progShare": 0.516,
    "estabShare": 0.484,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 243
  },
  "08059": {
    "progShare": 0.554,
    "estabShare": 0.446,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 59808,
    "repTurnoutBasis": 38611
  },
  "08061": {
    "progShare": 0.366,
    "estabShare": 0.634,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 267
  },
  "08063": {
    "progShare": 0.431,
    "estabShare": 0.569,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 184,
    "repTurnoutBasis": 1023
  },
  "08067": {
    "progShare": 0.608,
    "estabShare": 0.392,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 5482,
    "repTurnoutBasis": 3569
  },
  "08065": {
    "progShare": 0.647,
    "estabShare": 0.353,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 666,
    "repTurnoutBasis": 258
  },
  "08069": {
    "progShare": 0.612,
    "estabShare": 0.388,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 33890,
    "repTurnoutBasis": 22788
  },
  "08071": {
    "progShare": 0.445,
    "estabShare": 0.555,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1117,
    "repTurnoutBasis": 982
  },
  "08073": {
    "progShare": 0.564,
    "estabShare": 0.436,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 685
  },
  "08075": {
    "progShare": 0.463,
    "estabShare": 0.537,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 642,
    "repTurnoutBasis": 2498
  },
  "08077": {
    "progShare": 0.516,
    "estabShare": 0.484,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 8035,
    "repTurnoutBasis": 14476
  },
  "08079": {
    "progShare": 0.566,
    "estabShare": 0.434,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "08081": {
    "progShare": 0.559,
    "estabShare": 0.441,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 280,
    "repTurnoutBasis": 1559
  },
  "08083": {
    "progShare": 0.61,
    "estabShare": 0.39,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1476,
    "repTurnoutBasis": 2650
  },
  "08085": {
    "progShare": 0.474,
    "estabShare": 0.526,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1986,
    "repTurnoutBasis": 4753
  },
  "08087": {
    "progShare": 0.456,
    "estabShare": 0.544,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 893,
    "repTurnoutBasis": 2487
  },
  "08089": {
    "progShare": 0.457,
    "estabShare": 0.543,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 998,
    "repTurnoutBasis": 1643
  },
  "08091": {
    "progShare": 0.588,
    "estabShare": 0.412,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 683,
    "repTurnoutBasis": 466
  },
  "08093": {
    "progShare": 0.604,
    "estabShare": 0.396,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1274,
    "repTurnoutBasis": 1860
  },
  "08095": {
    "progShare": 0.424,
    "estabShare": 0.576,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 602
  },
  "08097": {
    "progShare": 0.432,
    "estabShare": 0.568,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2468,
    "repTurnoutBasis": 501
  },
  "08099": {
    "progShare": 0.467,
    "estabShare": 0.533,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 376,
    "repTurnoutBasis": 1217
  },
  "08101": {
    "progShare": 0.439,
    "estabShare": 0.561,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 12464,
    "repTurnoutBasis": 9697
  },
  "08103": {
    "progShare": 0.501,
    "estabShare": 0.499,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 1027
  },
  "08105": {
    "progShare": 0.517,
    "estabShare": 0.483,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 644,
    "repTurnoutBasis": 1050
  },
  "08107": {
    "progShare": 0.507,
    "estabShare": 0.493,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 2769,
    "repTurnoutBasis": 1361
  },
  "08109": {
    "progShare": 0.7,
    "estabShare": 0.3,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 594,
    "repTurnoutBasis": 346
  },
  "08111": {
    "progShare": 0.663,
    "estabShare": 0.337,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 150
  },
  "08113": {
    "progShare": 0.635,
    "estabShare": 0.365,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1135,
    "repTurnoutBasis": 254
  },
  "08115": {
    "progShare": 0.523,
    "estabShare": 0.477,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 361
  },
  "08117": {
    "progShare": 0.54,
    "estabShare": 0.46,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 3055,
    "repTurnoutBasis": 1104
  },
  "08119": {
    "progShare": 0.542,
    "estabShare": 0.458,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 1337,
    "repTurnoutBasis": 3047
  },
  "08121": {
    "progShare": 0.554,
    "estabShare": 0.446,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 150,
    "repTurnoutBasis": 853
  },
  "08123": {
    "progShare": 0.556,
    "estabShare": 0.444,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 15174,
    "repTurnoutBasis": 21730
  },
  "08125": {
    "progShare": 0.413,
    "estabShare": 0.587,
    "magaShare": 0.837,
    "relShare": 0.082,
    "modShare": 0.081,
    "demTurnoutBasis": 238,
    "repTurnoutBasis": 1229
  }
};
