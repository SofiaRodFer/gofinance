import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components';

import { HistoryCard } from '../../components/HistoryCard';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month
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
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Summary() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  const theme = useTheme()

  async function loadData() {
    const dataKey = '@gofinance:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expenses = responseFormatted.filter((expense: TransactionData) => expense.transactionType === 'negative')

    const expensesTotal = expenses.reduce((acc: number, expense: TransactionData) => {
      return acc + Number(expense.amount)
    }, 0)

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0

      expenses.forEach((expense: TransactionData) => {
        if(expense.category === category.key) {
          categorySum += Number(expense.amount)
        }
      })

      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / expensesTotal * 100).toFixed(0)}%`
  
        totalByCategory.push({
          name: category.name,
          color: category.color,
          key: category.key,
          total: categorySum,
          totalFormatted,
          percent
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

        <Content
          contentContainerStyle={{
            padding: 24,
            paddingBottom: useBottomTabBarHeight()
          }}
          showVerticalScroll={false}
        >

          <MonthSelect>
            <MonthSelectButton>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>Outubro</Month>

            <MonthSelectButton>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={50}
              x="percent"
              y="total"
            />
          </ChartContainer>

          { totalByCategories.map(item => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          )) }
        </Content>
    </Container>
  );
}