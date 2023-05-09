type Receiver = {
  amount: string | number
  address: string
}

type Task = {
  type?: 'space' | 'token'
  genesis?: string
  codehash?: string
  receivers: Receiver[]
}

const cases: {
  id: number
  name: string
  disabled?: boolean
  tasks: Task[]
  broadcast: boolean
}[] = [
  {
    id: 1,
    name: '1: 1000sats - testnet - broadcast',
    tasks: [
      {
        receivers: [
          {
            amount: '1000',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
    ],
    broadcast: true,
  },
  {
    id: 2,
    name: '2: 1500sats - testnet - no broadcast',
    tasks: [
      {
        receivers: [
          {
            amount: '1500',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
    ],
    broadcast: false,
  },
  {
    id: 3,
    name: '3: 2000sats+1500sats - testnet - broadcast',
    tasks: [
      {
        receivers: [
          {
            amount: '2000',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
          {
            amount: '1500',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
    ],
    broadcast: true,
  },
  {
    id: 4,
    name: '4: 2000sats+1500sats+3000sats - testnet - no broadcast',
    tasks: [
      {
        receivers: [
          {
            amount: '2000',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
          {
            amount: '1500',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
          {
            amount: '3000',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
    ],
    broadcast: false,
  },
  {
    id: 5,
    name: '5: 2000sats+1500sats+3000sats - mainnet - broadcast',
    disabled: true,
    tasks: [
      {
        receivers: [
          {
            amount: '2000',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
          {
            amount: '1500',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
          {
            amount: '3000',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
    ],
    broadcast: true,
  },
  {
    id: 6,
    name: '6: 1500sats+30ft - testnet - broadcast',
    tasks: [
      {
        receivers: [
          {
            amount: '1500',
            address: 'mpe6Kvsm9LJoa24cRwfW5jLxY1jSq2oYZP',
          },
        ],
      },
      {
        genesis: '039032ade3d49a6d4ff41c33b3d63ea5c986f310',
        codehash: 'a2421f1e90c6048c36745edd44fad682e8644693',
        receivers: [
          {
            amount: '30',
            address: 'mpe6Kvsm9LJoa24cRwfW5jLxY1jSq2oYZP',
          },
        ],
      },
    ],
    broadcast: true,
  },
  {
    id: 7,
    name: '7: 46ft+1500sats - testnet - no broadcast',
    tasks: [
      {
        genesis: '039032ade3d49a6d4ff41c33b3d63ea5c986f310',
        codehash: 'a2421f1e90c6048c36745edd44fad682e8644693',
        receivers: [
          {
            amount: '46',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
      {
        receivers: [
          {
            amount: '1500',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
    ],
    broadcast: false,
  },

  {
    id: 8,
    name: '8: 2000sats+46ft+1500sats - testnet - no broadcast',
    tasks: [
      {
        receivers: [
          {
            amount: '2000',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
      // {
      //   genesis: '039032ade3d49a6d4ff41c33b3d63ea5c986f310',
      //   codehash: 'a2421f1e90c6048c36745edd44fad682e8644693',
      //   receivers: [
      //     {
      //       amount: '146',
      //       address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
      //     },
      //   ],
      // },
      {
        genesis: '039032ade3d49a6d4ff41c33b3d63ea5c986f310',
        codehash: 'a2421f1e90c6048c36745edd44fad682e8644693',
        receivers: [
          {
            amount: '46',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
      {
        receivers: [
          {
            amount: '1500',
            address: 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx',
          },
        ],
      },
    ],
    broadcast: false,
  },

  {
    id: 9,
    name: '9: 1000sats+10000TMUSDT - testnet - no broadcast',
    tasks: [
      {
        type: 'space',
        receivers: [
          {
            amount: '1000',
            address: 'mtoEiX2gtKKRsxBPa3oYARNc9bmVDseUxK',
          },
        ],
      },
      {
        type: 'token',
        genesis: '1739804f265e85826bdd1078f8c719a9e6f421d5',
        codehash: 'a2421f1e90c6048c36745edd44fad682e8644693',
        receivers: [
          {
            amount: '10000',
            address: 'mtoEiX2gtKKRsxBPa3oYARNc9bmVDseUxK',
          },
        ],
      },
    ],
    broadcast: false,
  },

  {
    id: 10,
    name: '10: 1000sats+10000TMUSDT - testnet - broadcast',
    tasks: [
      {
        type: 'space',
        receivers: [
          {
            amount: '1000',
            address: 'mtoEiX2gtKKRsxBPa3oYARNc9bmVDseUxK',
          },
        ],
      },
      {
        type: 'token',
        genesis: '1739804f265e85826bdd1078f8c719a9e6f421d5',
        codehash: 'a2421f1e90c6048c36745edd44fad682e8644693',
        receivers: [
          {
            amount: '10000',
            address: 'mtoEiX2gtKKRsxBPa3oYARNc9bmVDseUxK',
          },
        ],
      },
    ],
    broadcast: true,
  },
]

export default cases
