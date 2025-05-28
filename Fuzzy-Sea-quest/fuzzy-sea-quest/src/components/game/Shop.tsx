import React from 'react';

const Shop: React.FC = () => {
  const items = [
    { id: 1, name: 'Fishing Rod', price: 100 },
    { id: 2, name: 'Shovel', price: 150 },
    { id: 3, name: 'Net', price: 80 },
    { id: 4, name: 'Fruit Basket', price: 50 },
  ];

  const handleBuyItem = (itemId: number) => {
    console.log(`Item with ID ${itemId} purchased!`);
    // Add logic to handle item purchase
  };

  return (
    <div className="shop">
      <h2>Shop</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.price} Tokens
            <button onClick={() => handleBuyItem(item.id)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shop;