import React from 'react';
import {
View,
Text,
TextInput,
Button
} from 'react-native'

export function Profile() {
  return (
    <View>
        <Text testID='text-title'>Perfil</Text>

        <TextInput 
          testID="input-name"
          placeholder='Nome'
          autoCorrect={false}
          value="Sofia"
        />

        <TextInput 
          testID="input-surname"
          placeholder='Sobrenome'
          value="Rodrigues Ferreira"
        />

        <Button 
          title="Salvar"
          onPress={() => {}}
        />
    </View>
  );
}