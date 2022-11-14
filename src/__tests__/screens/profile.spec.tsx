import React from 'react'
import { render } from '@testing-library/react-native'

import { Profile } from '../../screens/Profile'

describe('Profile', () => {
    it('should have the correct user input name placeholder', () => {
        const { getByPlaceholderText } = render(<Profile />)
    
        const inputName = getByPlaceholderText('Nome')
    
        expect(inputName).toBeTruthy()
    })
    
    it('should have loaded user data', () => {
        const { getByTestId } = render(<Profile />)
    
        const inputName = getByTestId('input-name')
        const inputSurname = getByTestId('input-surname')
    
        expect(inputName.props.value).toEqual('Sofia')
        expect(inputSurname.props.value).toEqual('Rodrigues Ferreira')
    })
    
    it('should have rendered the title correctly', () => {
        const { getByTestId } = render(<Profile />)
    
        const textTitle = getByTestId('text-title')
    
        expect(textTitle.props.children).toContain('Perfil')
    })
})

