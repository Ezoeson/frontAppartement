import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

import { getApartmentStats, getApartments, Apartment } from '../api/api';

export default function StatsScreen() {
  const [stats, setStats] = useState<{
    total: number;
    min: number;
    max: number;
  }>({
    total: 0,
    min: 0,
    max: 0,
  });
  const [apartments, setApartments] = useState<Apartment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const loadStats = async () => {
    try {
      const [statsData, apartmentsData] = await Promise.all([
        getApartmentStats(),
        getApartments(),
      ]);
      setStats(statsData);
      setApartments(apartmentsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [apartments]);

  const chartData = {
    labels: ['Total', 'Minimal', 'Maximal'],
    datasets: [
      {
        data: [stats.total, stats.min, stats.max],
      },
    ],
  };

  return (
    <View style={styles.container}>
      {loading ? null : (
        <View>
          <View style={styles.statsContainer}>
            <Text style={styles.title}>Statistiques des Loyers</Text>
            <Text style={styles.statText}>
              Total des loyers: {stats.total}Ariary
            </Text>
            <Text style={styles.statText}>
              Loyer minimal: {stats.min}Ariary
            </Text>
            <Text style={styles.statText}>
              Loyer maximal: {stats.max}Ariary
            </Text>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Graphique des loyers</Text>
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              yAxisLabel="Ariary"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
});
