import React, { Component } from 'react';
import { Text, View, TextInput, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const SERVER_URL = 'http://192.168.1.109:5000';

class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            cols: 0.43,
            scale: 80
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
            crossDomain:true,
            redirect: 'follow',
            method: 'POST',
            body: data,
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response', response);
            })
            .catch((error) => {
                console.log('error', error);
            });
    }

    render() {
        return (
            <View style={{ padding: 10 }}>
                {this.state.file && (
                    <>
                        <Image
                            source={{ uri: this.state.file.uri }}
                            style={{ width: 300, height: 300 }}
                        />
                        <Button title="Upload Photo" onPress={this.handleUploadPhoto} />
                    </>
                )}
                {!this.state.file && <Button title="Choose Photo" onPress={this.handleChoosePhoto} />}

                <TextInput
                    style={{ height: 40 }}
                    placeholder="Scale"
                    onChangeText={scale => this.updateValue('scale', scale)}
                    defaultValue={this.state.scale}
                />
                <TextInput
                    style={{ height: 40 }}
                    placeholder="Cols"
                    onChangeText={cols => this.updateValue('cols', cols)}
                    defaultValue={this.state.cols}
                />
                <Text style={{ padding: 10, fontSize: 42 }}>
                    {this.state.cols} | {this.state.scale}
                </Text>
            </View>
        );
    }
}

export default Uploader;