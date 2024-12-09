import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch para obtener los primeros 151 Pokémon
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((response) => response.json())
      .then((data) => setPokemonList(data.results))
      .catch((error) => console.error('Error al obtener la lista de Pokémon:', error))
      .finally(() => setLoading(false));
  }, []);

  // Fetch para obtener detalles de un Pokémon específico
  const fetchPokemonDetails = (url) => {
    setDetailsLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => setSelectedPokemon(data))
      .catch((error) => console.error('Error al obtener detalles del Pokémon:', error))
      .finally(() => setDetailsLoading(false));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista de Pokémon</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => fetchPokemonDetails(item.url)}>
              <Text style={styles.pokemonName}>{capitalizeFirstLetter(item.name)}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {detailsLoading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {selectedPokemon && (
        <View style={styles.detailsContainer}>
          <Text style={styles.subtitle}>Detalles del Pokémon</Text>
          <Text style={styles.detail}>Nombre: {capitalizeFirstLetter(selectedPokemon.name)}</Text>

          <Text style={styles.detail}>Tipos:</Text>
          {selectedPokemon.types.map((type) => (
            <Text key={type.type.name} style={styles.detailItem}>
              - {capitalizeFirstLetter(type.type.name)}
            </Text>
          ))}

          <Text style={styles.detail}>Habilidades:</Text>
          {selectedPokemon.abilities.map((ability) => (
            <Text key={ability.ability.name} style={styles.detailItem}>
              - {capitalizeFirstLetter(ability.ability.name)}
            </Text>
          ))}

          <Text style={styles.detail}>Estadísticas:</Text>
          {selectedPokemon.stats.map((stat) => (
            <Text key={stat.stat.name} style={styles.detailItem}>
              {capitalizeFirstLetter(stat.stat.name)}: {stat.base_stat}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pokemonName: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailItem: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default App;
