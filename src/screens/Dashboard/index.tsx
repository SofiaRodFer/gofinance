import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    LogoutButton
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const [data, setData] = useState<DataListProps[]>([])

    async function loadTransactions() {
        const dataKey = '@gofinance:transactions'

        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : []

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
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

        setData(transactionsFormatted)
    }

    useEffect(() => {
        loadTransactions()
    }, [])

    return (
        <Container>
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
                    type="up"
                    title="Entradas"
                    amount="R$ 17.400,00"
                    last_transaction="Última entrada dia 13 de outubro"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount="R$ 1.250,00"
                    last_transaction="Última saída dia 03 de outubro"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount="R$ 16.141,00"
                    last_transaction="01 à 16 de outubro"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>

        </Container>
    )
}
