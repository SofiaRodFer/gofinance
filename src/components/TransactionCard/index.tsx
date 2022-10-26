import React from 'react'
import { categories } from '../../utils/categories';

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


export interface TransactionCardProps {
    transactionType: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface Props {
    data: TransactionCardProps;
}

export function TransactionCard({ data }: Props) {
    const [ category ] = categories.filter(
        item => item.key === data.category
    )

    return (
        <Container>
            <Title>{data.name}</Title>
            <Amount type={data.transactionType}>
                {data.transactionType === 'negative' && '- '}
                {data.amount}
            </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    )
}