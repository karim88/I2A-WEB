import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Box, Heading, Center } from 'native-base';
import Uploader from './components/Uploader';

export default function App() {
  return (
    <NativeBaseProvider style={styles.body}>
      <Center style={styles.container}>
        <Heading alignSelf={{
          base: "center",
          md: "flex-start",
          size: "4xl"
        }}>I2A</Heading>
      </Center>
      <Box style={styles.box}>
        <Uploader></Uploader>
      </Box>
      <StatusBar style={styles.statusbar} />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fefce8',
    flex: 1
  },
  container: {
    paddingTop: 40,
    justifyContent: 'center',
    backgroundColor: '#fefce8',
    flex: 1
  },
  box: {
    backgroundColor: '#fefce8',
    flex: 5
  },
  statusbar: {
    display: 'inline',
    backgroundColor: '#ca8a04',
    flex: 1
  }
});
