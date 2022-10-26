import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useTheme } from 'styled-components'
import { useFocusEffect } from '@react-navigation/native'

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
    spent: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    const theme = useTheme()

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative') 
    {
        const lastTransaction = 
        new Date(
            Math.max.apply(
                Math,
                collection
                .filter((transaction) => transaction.transactionType === type)
                .map((transaction) => new Date(transaction.date).getTime())
            )
        )

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
    }

    async function loadTransactions() {
        const dataKey = '@gofinance:transactions'

        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : []

        let entriesSum = 0
        let spentSum = 0


        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
            if(item.transactionType === 'positive') {
                entriesSum += Number(item.amount)
            } else {
                spentSum += Number(item.amount)
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

        setTransactions(transactionsFormatted)

        const lastEntryDate = getLastTransactionDate(transactions, 'positive')
        const lastSpentDate = getLastTransactionDate(transactions, 'negative')
        const totalInterval = `01 à ${lastSpentDate}`

        const total = entriesSum - spentSum

        setHighlightData({
            entries: {
                amount: entriesSum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastEntryDate}`
            },
            spent: {
                amount: spentSum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastSpentDate}`
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
                            <Photo source={{ uri: 'https://github.com/sofiarodfer.png' }} />
                            <User>
                                <UserGreeting>Olá, </UserGreeting>
                                <UserName>Sofia</UserName>
                            </User>
                        </UserInfo>
                        <LogoutButton onPress={() => {}}>
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
                        amount={highlightData.spent.amount}
                        last_transaction={highlightData.entries.lastTransaction}
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
