import React from 'react'

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
    TransactionList
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {
            id: '1',
            type: "positive",
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "dollar-sign"
            },
            date: "13/10/2022"
        },
        {
            id: '2',
            type: "negative",
            title: "Hamburguer Pizzy",
            amount: "R$ 59,00",
            category: {
                name: "Alimentação",
                icon: "coffee"
            },
            date: "10/10/2022"
        },
        {
            id: '3',
            type: "negative",
            title: "Aluguel do apartamento",
            amount: "R$ 1.200,00",
            category: {
                name: "Casa",
                icon: "shopping-bag"
            },
            date: "11/10/2022"
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
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>

        </Container>
    )
}
