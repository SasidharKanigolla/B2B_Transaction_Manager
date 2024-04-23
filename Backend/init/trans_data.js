const sampledata = [
  {
    name: "Transaction 1",
    // transType: "Debit",
    date: "2024-03-01T08:00:00.000Z",
    transDetails: [
      { productName: "Item 1", quantity: 50, pricePerUnit: 10, amount: 500 },
      { productName: "Item 2", quantity: 50, pricePerUnit: 10, amount: 500 },
    ],
    // custDetails: ObjectId("65e47188e8bb3ca6f6b6c8c1"),
  },
  {
    name: "Transaction 2",
    // transType: "Debit",
    date: "2024-04-02T08:00:00.000Z",
    transDetails: [
      { productName: "Item 3", quantity: 50, pricePerUnit: 10, amount: 500 },
    ],
    // custDetails: ObjectId("65e47188e8bb3ca6f6b6c8c1"),
  },
  {
    name: "Transaction 3",
    // transType: "Debit",
    date: "2024-03-03T08:00:00.000Z",
    transDetails: [
      { productName: "Item 5", quantity: 50, pricePerUnit: 10, amount: 500 },
      { productName: "Item 6", quantity: 50, pricePerUnit: 10, amount: 500 },
    ],
    // custDetails: ObjectId("65e47188e8bb3ca6f6b6c8c1"),
  },
  {
    name: "Transaction 4",
    // transType: "Credit",
    date: "2024-03-05T08:00:00.000Z",
    transDetails: [
      { productName: "Item 7", quantity: 50, pricePerUnit: 10, amount: 500 },
      { productName: "Item 8", quantity: 50, pricePerUnit: 10, amount: 500 },
    ],
    // custDetails: ObjectId("65e47188e8bb3ca6f6b6c8c1"),
  },
  {
    name: "Transaction 5",
    // transType: "Credit",
    // date: "2024-03-04T08:00:00.000Z",
    transDetails: [
      { productName: "Item 9", quantity: 50, pricePerUnit: 10, amount: 500 },
      { productName: "Item 10", quantity: 50, pricePerUnit: 10, amount: 500 },
    ],
    // custDetails: ObjectId("65e47188e8bb3ca6f6b6c8c1"),
  },
  // Add more entries here...
];

module.exports = { data: sampledata };
