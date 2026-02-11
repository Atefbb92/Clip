import { DentType, OrientationDentaire } from './types';

export const matureMouthData: OrientationDentaire[] = [
  {
    orientation: 'top',
    data: [
      {
        label: 'molars 1',
        order: 7,
        teeth: [
          { code: '18', order: 3 }, // 18 remplace 26
          { code: '17', order: 2 }, // 17 remplace 27
          { code: '16', order: 1 }, // 16 remplace 28
        ],
      },
      {
        label: 'premolars 1',
        order: 6,
        teeth: [
          { code: '15', order: 1 }, // 15 remplace 25
          { code: '14', order: 2 }, // 14 remplace 24
        ],
      },
      {
        label: 'canine 1',
        order: 5,
        teeth: [{ code: '13', order: 1 }], // 13 remplace 23
      },
      {
        label: 'Incisors',
        order: 4,
        teeth: [
          { code: '12', order: 1 },
          { code: '11', order: 2 },
          { code: '21', order: 3 },
          { code: '22', order: 4 },
        ],
      },
      {
        label: 'Canine 2',
        order: 3,
        teeth: [{ code: '23', order: 1 }], // 23 remplace 13
      },
      {
        label: 'Premolars 2',
        order: 2,
        teeth: [
          { code: '24', order: 1 }, // 24 remplace 14
          { code: '25', order: 2 }, // 25 remplace 15
        ],
      },
      {
        label: 'Molars 2',
        order: 1,
        teeth: [
          { code: '26', order: 1 }, // 26 remplace 18
          { code: '27', order: 2 }, // 27 remplace 17
          { code: '28', order: 3 }, // 28 remplace 16
        ],
      },
    ],
  },
  {
    orientation: 'bottom',
    data: [
      {
        label: 'Molars 1',
        order: 7,
        teeth: [
          { code: '48', order: 1 }, // 48 remplace 36
          { code: '47', order: 2 }, // 47 remplace 37
          { code: '46', order: 3 }, // 46 remplace 38
        ],
      },
      {
        label: 'Premolars 1',
        order: 6,
        teeth: [
          { code: '45', order: 1 }, // 45 remplace 34
          { code: '44', order: 2 }, // 44 remplace 35
        ],
      },
      {
        label: 'Canine 1',
        order: 5,
        teeth: [{ code: '43', order: 1 }], // 43 remplace 33
      },
      {
        label: 'Incisors',
        order: 4,
        teeth: [
          { code: '42', order: 1 },
          { code: '41', order: 2 },
          { code: '31', order: 3 },
          { code: '32', order: 4 },
        ],
      },
      {
        label: 'Canine 2',
        order: 3,
        teeth: [{ code: '33', order: 1 }], // 33 remplace 43
      },
      {
        label: 'Premolars 2',
        order: 2,
        teeth: [
          { code: '34', order: 1 }, // 34 remplace 35 qui remplaçait 45
          { code: '35', order: 2 }, // 35 remplace 34 qui remplaçait 44
        ],
      },
      {
        label: 'Molars 2',
        order: 1,
        teeth: [
          { code: '36', order: 1 }, // 36 remplace 38 qui remplaçait 48
          { code: '37', order: 2 }, // 37 remplace 47
          { code: '38', order: 3 }, // 38 remplace 36 qui remplaçait 46
        ],
      },
    ],
  },
];

export const dentTypelist: DentType[] = [
  { key: 'normal', value: 'Aucun' },
  { key: 'absente', value: 'Dent absente' },
  { key: 'couronne', value: 'Couronne' },
  { key: 'pontique', value: 'Pontique' },
  { key: 'implant', value: 'Implant' },
  { key: 'dent_temporaire', value: 'Dent temporaire' },
];