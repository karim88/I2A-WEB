import React, { Component } from 'react';
import { Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, Slider, VStack, Button, Toast, Divider, HStack, Box } from 'native-base'

const SERVER_URL = 'http://192.168.1.109:5000';

class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            cols: 80,
            scale: 0.43,
            ascii: []
        };
        this.updateValue.bind(this)
    }

    updateValue = (key, val) => {
        const st = {}
        st[key] = val
        this.setState(st)
    }

    async createFormData(photo, body = {}) {
        const data = new FormData();
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        data.append('file', blob, photo.fileName);

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    }

    handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            this.updateValue('file', result);
        }
    }

    handleUploadPhoto = async () => {
        const data = await this.createFormData(this.state.file, {
            cols: this.state.cols,
            scale: this.state.scale
        })

        await fetch(`${SERVER_URL}/api/convert`, {
            crossDomain: true,
            redirect: 'follow',
            method: 'POST',
            body: data,
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response', response);
                this.updateValue('ascii', response.ascii)
                this.updateValue('file', '')
                Toast.show({
                    title: 'Info',
                    description: response.message,
                    placement: 'bottom',
                    status: 'info',
                })
            })
            .catch((error) => {
                console.log('error', error);
                Toast.show({
                    title: 'Warning!',
                    description: error,
                    placement: 'bottom',
                    status: 'warning',
                })
            });
    }

    render() {
        return (
            <VStack space={4} style={{ padding: 10 }}>
                {this.state.file && (
                    <>
                        <Image
                            source={{ uri: this.state.file.uri }}
                            style={{ width: 300, height: 300 }}
                        />
                        <Button title="Upload Photo" onPress={this.handleUploadPhoto}>Upload Photo</Button>
                    </>
                )}
                {!this.state.file && <Button title="Choose Photo" onPress={this.handleChoosePhoto}>Choose Photo</Button>}

                <Divider></Divider>

                <HStack space={2} alignItems="center">
                    <Box>
                        <Text alignItems="start">Scale</Text>
                        <Slider
                            defaultValue={this.state.scale}
                            minValue={0}
                            maxValue={1}
                            accessibilityLabel="Scale"
                            step={.1}
                            onChangeText={scale => this.updateValue('scale', scale)}
                        >
                            <Slider.Track>
                                <Slider.FilledTrack />
                            </Slider.Track>
                            <Slider.Thumb />
                        </Slider>

                    </Box>
                    <Box>
                        <Text>Cols</Text>
                        <Slider
                            defaultValue={this.state.cols}
                            minValue={0}
                            maxValue={100}
                            accessibilityLabel="Cols"
                            step={1}
                            onChangeText={cols => this.updateValue('cols', cols)}
                        >
                            <Slider.Track>
                                <Slider.FilledTrack />
                            </Slider.Track>
                            <Slider.Thumb />
                        </Slider>

                    </Box>
                </HStack>

                <Divider></Divider>

                {this.state.ascii && (
                    <pre style={{ padding: 10, fontSize: 12 }}>
                        {this.state.ascii.map(line => `${line}\n`)}
                    </pre>
                )}
            </VStack>
        );
    }
}

export default Uploader;