import React from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard } from '../../components/TransactionCard'

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
    TransactionList
} from './styles'

export function Dashboard() {
    const data = [
        {
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "dollar-sign"
            },
            date: "13/10/2022"
        },
        {
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "dollar-sign"
            },
            date: "13/10/2022"
        },
        {
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "dollar-sign"
            },
            date: "13/10/2022"
        }
    ]

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
                    <Icon name="power" />
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
                    renderItem={({ item }) => <TransactionCard data={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: getBottomSpace()
                    }}
                />
            </Transactions>

        </Container>
    )
}
