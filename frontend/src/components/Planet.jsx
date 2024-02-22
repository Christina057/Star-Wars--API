import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

function Planets() {
    const [planets, setPlanets] = useState([]);
    const [nextPage, setNextPage] = useState(null);

    const fetchPlanets = async (url) => {
        try {
            const response = await axios.get(url);
            return response.data.results;
        } catch (error) {
            console.error('Error fetching planet data:', error);
            return [];
        }
    };

    const fetchResidents = async (residentURLs) => {
        const residentPromises = residentURLs.map(async (residentURL) => {
            try {
                const residentResponse = await axios.get(residentURL);
                return residentResponse.data;
            } catch (error) {
                console.error('Error fetching resident data:', error);
                return null;
            }
        });

        return Promise.all(residentPromises);
    };

    const fetchPlanetsData = async (url) => {
        const results = await fetchPlanets(url);

        // Fetch residents for each planet
        const planetsWithResidents = await Promise.all(
            results.map(async (planet) => {
                const residents = await fetchResidents(planet.residents);
                return { ...planet, residents };
            })
        );

        setPlanets((prevPlanets) => [...prevPlanets, ...planetsWithResidents]);
        setNextPage(results.next);
    };

    useEffect(() => {
        fetchPlanetsData('https://swapi.dev/api/planets/?format=json');
    }, []);

    const handleLoadMore = () => {
        if (nextPage) {
            fetchPlanetsData(nextPage);
        }
    };

    return (
        <div className="container">
            {planets.map((planet) => (
                <div key={planet.name} className="planet-card">
                    {/* Planet details */}
                    <h2>{planet.name}</h2>
                    <p>Climate: {planet.climate}</p>
                    <p>Population: {planet.population}</p>
                    <p>Terrain: {planet.terrain}</p>

                    {/* Residents details */}
                    <h3>Residents:</h3>
                    <ul className="resident-list">
                        {planet.residents.map((resident, index) => (
                            <li key={index} className="resident-item">
                                <p>Name: {resident ? resident.name : 'Unknown'}</p>
                                <p>Height: {resident ? resident.height : 'Unknown'}</p>
                                <p>Mass: {resident ? resident.mass : 'Unknown'}</p>
                                <p>Gender: {resident ? resident.gender : 'Unknown'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button onClick={handleLoadMore}>Load More</button>
        </div>
    );
}

export default Planets;
