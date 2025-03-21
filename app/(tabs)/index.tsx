import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import {
  getApartments,
  addApartment,
  deleteApartment,
  updateApartment,
} from '../api/api';

export default function ApartmentsScreen() {
  interface Apartment {
    id: number;
    numApp: string;
    design: string;
    loyer: number;
  }

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [numApp, setNumApp] = useState('');
  const [design, setDesign] = useState('');
  const [loyer, setLoyer] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchApartments = async () => {
    try {
      const data = await getApartments();
      setApartments(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les appartements');
    }
  };
  useEffect(() => {
    fetchApartments();
  }, []);

  const handleSubmit = async () => {
    if (!numApp || !design || !loyer) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      if (editingId) {
        await updateApartment(editingId, {
          numApp,
          design,
          loyer: parseFloat(loyer),
        });
        setNumApp('');
        setDesign('');
        setLoyer('');

        fetchApartments();
      } else {
        await addApartment({
          numApp,
          design,
          loyer: parseFloat(loyer),
        });
      }

      setNumApp('');
      setDesign('');
      setLoyer('');
      setEditingId(null);
      fetchApartments();
    } catch (error) {
      Alert.alert('Erreur', "Impossible de sauvegarder l'appartement");
    }
  };

  const handleEdit = (apartment: Apartment) => {
    setEditingId(apartment.id ?? null);
    setNumApp(apartment.numApp);
    setDesign(apartment.design);
    setLoyer(apartment.loyer.toString());
  };

  const handleDelete = async (id: number,name:string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ${name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteApartment(id);
            fetchApartments();
          },
        },
      ]
    );
    // try {
    //   await deleteApartment(id);
    //   fetchApartments();
    // } catch (error) {
    //   Alert.alert('Erreur', "Impossible de supprimer l'appartement");
    // }
  };

  const getObservation = (loyer: number) => {
    if (loyer < 1000) return 'bas';
    if (loyer <= 5000) return 'moyen';
    return 'élevé';
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Numéro d'appartement"
          value={numApp}
          onChangeText={setNumApp}
        />
        <TextInput
          style={styles.input}
          placeholder="Design"
          value={design}
          onChangeText={setDesign}
        />
        <TextInput
          style={styles.input}
          placeholder="Loyer"
          value={loyer}
          onChangeText={setLoyer}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {editingId ? 'Modifier' : 'Ajouter'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={apartments}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={({ item }) => (
          <View style={styles.apartmentItem}>
            <View>
              <Text style={styles.apartmentText}>N° {item.numApp}</Text>
              <Text style={styles.apartmentText}>{item.design}</Text>
              <Text style={styles.apartmentText}>
                Loyer: {item.loyer} Ariary ({getObservation(item.loyer)})
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionButtonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id!, item.design)}
              >
                <Text style={styles.actionButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  apartmentItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  apartmentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  actionButtonText: {
    color: 'white',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
});
