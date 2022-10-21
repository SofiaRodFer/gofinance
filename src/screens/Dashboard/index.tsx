import React from 'react'
import { HighlightCard } from '../../components/HighlightCard'

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
    HighlightCards
} from './styles'

export function Dashboard() {
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
                <HighlightCard />
                <HighlightCard />
                <HighlightCard />
            </HighlightCards>

        </Container>
    )
}
