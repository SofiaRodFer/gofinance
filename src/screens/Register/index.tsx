import React, { useState } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { Control, FieldValues, useForm } from 'react-hook-form';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';

interface FormData {
  [name: string]: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Insira um nome!'),
  amount: Yup
    .number()
    .typeError('Informe uma valor numérico!')
    .positive('O valor não pode ser negativo!')
    .required('Insira um valor!'),
})

export function Register() {
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const formControl = control as unknown as Control<FieldValues, any>

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleOpenModalSelectCategory() {
    setCategoryModalOpen(true)
  }

  function handleCloseModalSelectCategory() {
    setCategoryModalOpen(false)
  }

  function handleRegister(form: FormData) {
    if(!transactionType) {
      return Alert.alert('Selecione o tipo da transação!')
    }

    if(category.key === 'category') {
      return Alert.alert('Selecione a categoria!')
    }

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }

    console.log(data)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
          <Header>
              <Title>Cadastro</Title>
          </Header>

          <Form>
            <Fields>
              <InputForm
                placeholder='Nome'
                control={formControl}
                name="name"
                autoCapitalize='sentences'
                autoCorrect={false}
                error={errors.name && errors?.name.message}
              />
              <InputForm
                placeholder='Preço'
                control={formControl}
                name="amount"
                keyboardType='numeric'
                error={errors.amount && errors?.amount.message}
              />

              <TransactionTypes>
                <TransactionTypeButton
                  type='up'
                  title='Income'
                  onPress={() => handleTransactionTypeSelect('up')}
                  isActive={transactionType === 'up'}
                />

                <TransactionTypeButton
                  type='down'
                  title='Outcome'
                  onPress={() => handleTransactionTypeSelect('down')}
                  isActive={transactionType === 'down'}
                />
              </TransactionTypes>

              <CategorySelectButton
                title={category.name}
                onPress={() => handleOpenModalSelectCategory()}
              />
            </Fields>

            <Button title='Enviar' onPress={handleSubmit(handleRegister)} />
          </Form>

          <Modal visible={categoryModalOpen}>
            <CategorySelect
              category={category}
              setCategory={setCategory}
              closeSelectCategory={() => handleCloseModalSelectCategory()}
            />
          </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
