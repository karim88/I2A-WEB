import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Box, Heading, Center } from 'native-base';
import Uploader from './components/Uploader';

export default function App() {
  return (
    <NativeBaseProvider>
      <Center>
        <Heading alignSelf={{
          base: "center",
          md: "flex-start",
          size: "4xl"
        }}>I2A</Heading>
      </Center>
      <Box>
        <Uploader></Uploader>
      </Box>
      <StatusBar style="auto" />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
