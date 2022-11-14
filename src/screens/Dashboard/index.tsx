import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useTheme } from 'styled-components'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    const theme = useTheme()
    const { signOut, user } = useAuth()

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative') 
    {
        const collectionFiltered = collection
        .filter((transaction) => transaction.transactionType === type)

        if(collectionFiltered.length === 0) {
            return 0;
        }

        const lastTransaction = 
        new Date(
            Math.max.apply(
                Math,
                collectionFiltered
                .map((transaction) => new Date(transaction.date).getTime())
            )
        )

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
    }

    async function loadTransactions() {
        const dataKey = `@gofinance:transactions_user:${user.id}`

        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : []

        let entriesSum = 0
        let expensesSum = 0

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
            if(item.transactionType === 'positive') {
                entriesSum += Number(item.amount)
            } else {
                expensesSum += Number(item.amount)
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date))

            return {
                id: item.id,
                name: item.name,
                amount,
                transactionType: item.transactionType,
                category: item.category,
                date
            }
        })
        .reverse()

        setTransactions(transactionsFormatted)

        const lastEntryDate = getLastTransactionDate(transactions, 'positive')
        const lastExpenseDate = getLastTransactionDate(transactions, 'negative')
        const totalInterval =  lastExpenseDate === 0 
            ? 'Não há transações' 
            : `01 à ${lastExpenseDate}`

        const total = entriesSum - expensesSum

        setHighlightData({
            entries: {
                amount: entriesSum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastEntryDate === 0 
                    ? 'Ainda não há transações de entrada' 
                    : `Última entrada dia ${lastEntryDate}`
            },
            expenses: {
                amount: expensesSum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastExpenseDate === 0 
                    ? 'Ainda não há transações de saída' 
                    : `Última saída dia ${lastExpenseDate}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        })

        setIsLoading(false)
    }

    useEffect(() => {
        loadTransactions()
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            {
                isLoading ? 
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size='large' />
                </LoadContainer> :
            <>
                <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo source={{ uri: user.photo }} />
                            <User>
                                <UserGreeting>Olá, </UserGreeting>
                                <UserName>{user.name}</UserName>
                            </User>
                        </UserInfo>
                        <LogoutButton onPress={signOut}>
                            <Icon name="power" />
                        </LogoutButton>
                    </UserWrapper>
                </Header>
            
                <HighlightCards>
                    <HighlightCard
                        type="positive"
                        title="Entradas"
                        amount={highlightData.entries.amount}
                        last_transaction={highlightData.entries.lastTransaction}
                    />
                    <HighlightCard
                        type="negative"
                        title="Saídas"
                        amount={highlightData.expenses.amount}
                        last_transaction={highlightData.expenses.lastTransaction}
                    />
                    <HighlightCard
                        type="total"
                        title="Total"
                        amount={highlightData.total.amount}
                        last_transaction={highlightData.total.lastTransaction}
                    />
                </HighlightCards>
                
                <Transactions>
                    <Title>Listagem</Title>
                
                    <TransactionList
                        data={transactions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <TransactionCard data={item} />}
                    />
                </Transactions>
            </> 
            }
        </Container>
    )
}
