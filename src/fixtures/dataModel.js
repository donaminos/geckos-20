import uuid from 'uuid/v4';

export default [
  {
    id: uuid(),
    title: 'Card one title',
    color: '#BD8D31',
    description:
      'Card detailed description. more info at [Github](https://github.com/chingu-voyage3/geckos-20)',
    status: 'todo',
    tasks: [
      { id: uuid(), name: 'Task one', done: true },
      { id: uuid(), name: 'Task two', done: false },
      { id: uuid(), name: 'Task three', done: false },
    ],
  },
  {
    id: uuid(),
    title: 'Write some code',
    description: 'Code **code** code _code_ code',
    color: '#38028',
    status: 'todo',
    tasks: [
      { id: uuid(), name: 'Board Example', done: true },
      { id: uuid(), name: 'Column Example', done: false },
      { id: uuid(), name: 'Some experiments', done: false },
    ],
  },
  {
    id: uuid(),
    color: '#3A7E28',
    title: 'Card Two title',
    description: 'Card detailed description',
    status: 'in-progress',
    tasks: [],
  },
  {
    id: uuid(),
    title: 'Read the Book',
    description: 'I should read the **whole** book',
    status: 'in-progress',
    tasks: [],
  },
  {
    id: uuid(),
    title: 'Card Three title',
    description: 'Card detailed description',
    status: 'done',
    tasks: [],
  },
];
