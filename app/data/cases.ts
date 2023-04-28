type Receiver = {
  amount: string
  address: string
}

type Task = {
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
    name: '6: 46ft+1500sats - testnet - broadcast',
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
]

export default cases
