import React from 'react'

import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date
} from './styles'

interface Category {
    name: string;
    icon: string;
}

export interface TransactionCardProps {
    transactionType: 'up' | 'down';
    name: string;
    amount: string;
    category: Category;
    date: string;
}

interface Props {
    data: TransactionCardProps;
}

export function TransactionCard({ data }: Props) {
    return (
        <Container>
            <Title>{data.name}</Title>
            <Amount type={data.transactionType}>
                {data.transactionType === 'down' && '- '}
                {data.amount}
            </Amount>

            <Footer>
                <Category>
                    <Icon name={data.category.icon} />
                    <CategoryName>{data.category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    )
}