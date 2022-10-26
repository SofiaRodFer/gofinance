import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';

import {
    Container,
    Header,
    Title,
    Content
} from './styles';
import { categories } from '../../utils/categories';

interface TransactionData {
  transactionType: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: string;
  color: string;
}

export function Summary() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  async function loadData() {
    const dataKey = '@gofinance:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expenses = responseFormatted.filter((expense: TransactionData) => expense.transactionType === 'negative')

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0

      expenses.forEach((expense: TransactionData) => {
        if(expense.category === category.key) {
          categorySum += Number(expense.amount)
        }
      })

      const total = categorySum.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      if(categorySum > 0) {
        totalByCategory.push({
          name: category.name,
          color: category.color,
          total
        })
      }
    })

    setTotalByCategories(totalByCategory)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
        <Header>
            <Title>Resumo por categoria</Title>
        </Header>

        <Content>
          { totalByCategories.map(item => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.total}
              color={item.color}
            />
          )) }
        </Content>
    </Container>
  );
}