import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useFoldingFeature } from 'react-native-folding-feature';

export default () => {
  const { layoutInfo, isTableTop, isBook } = useFoldingFeature();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Folding Feature Information</Text>

      <Text style={styles.blockText}>state: {layoutInfo.state}</Text>
      <Text style={styles.blockText}>
        orientation: {layoutInfo.orientation}
      </Text>
      <Text style={styles.blockText}>
        occlusionType: {layoutInfo.occlusionType}
      </Text>
      <Text style={styles.blockText}>
        isSeparating: {layoutInfo.isSeparating ? 'true' : 'false'}
      </Text>
      <Text style={styles.blockText}>
        bounds: {`${JSON.stringify(layoutInfo.bounds)}`}
      </Text>

      <Text style={styles.header}>Helpers: </Text>
      <Text style={styles.blockText}>
        isTableTop: {isTableTop ? 'true' : 'false'}
      </Text>
      <Text style={styles.blockText}>isBook: {isBook ? 'true' : 'false'}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
  },
  blockText: {
    display: 'flex',
  },
});
