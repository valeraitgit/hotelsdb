import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hotels, setHotels] = useState([]);
  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`http://localhost:8080/hotels?field=${searchField}&value=${searchValue}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch hotels');
      }
      const data = await response.json();
      // Проверяем, является ли data массивом
      if (!Array.isArray(data)) {
        throw new Error('По запросу данных нет');
      }
      setHotels(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setHotels([]);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = () => {
    fetchHotels();
  };

  return (
    <div className="App">
      <h1>База данных отелей</h1>
      <select onChange={(e) => setSearchField(e.target.value)} value={searchField}>
        <option value="name">Название отеля</option>
        <option value="city">Город</option>
        <option value="capacity">Вместимость</option>
        <option value="price">Цена номера</option>
      </select>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Введите запрос"
      />
      <button onClick={handleSearch}>Поиск</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Город</th>
            <th>Вместимость</th>
            <th>Цена номера</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(hotels) && hotels.length > 0 ? (
            hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{hotel.city}</td>
                <td>{hotel.capacity}</td>
                <td>{hotel.standard_room_price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Нет данных</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;