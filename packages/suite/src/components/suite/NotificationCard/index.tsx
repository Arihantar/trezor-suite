import React from 'react';
import styled from 'styled-components';
import Card from '@suite-components/Card';
import { Icon, Loader, colors, variables } from '@trezor/components';
import { MAX_WIDTH } from '@suite-constants/layout';

const getBorderColor = (variant: Props['variant']) => {
    switch (variant) {
        case 'info':
            return colors.BLUE_INFO;
        case 'warning':
            return colors.RED_ERROR;
        default:
            return 'transparent';
    }
};

const getTextColor = (variant: Props['variant']) => {
    switch (variant) {
        case 'info':
            return colors.BLUE_INFO;
        case 'warning':
            return colors.RED_ERROR;
        default:
            return colors.BLACK50;
    }
};

const getIcon = (variant: Props['variant']) => {
    switch (variant) {
        case 'loader':
            return <Loader size={16} />;
        case 'info':
            return <Icon icon="INFO" size={16} color={colors.BLUE_INFO} />;
        case 'warning':
            return <Icon icon="WARNING" size={16} color={colors.RED_ERROR} />;
        default:
            return null;
    }
};

const Wrapper = styled(Card)<{ variant: Props['variant'] }>`
    max-width: ${MAX_WIDTH};
    border: 1px solid ${props => getBorderColor(props.variant)};
    color: ${props => getTextColor(props.variant)};
    margin: 8px 32px;
    padding: 16px;
    align-items: center;

    @media screen and (max-width: ${variables.SCREEN_SIZE.LG}) {
        margin: 8px 16px;
    }
`;

const IconWrapper = styled.div`
    margin-right: 8px;
`;

const Body = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

interface Props {
    children: React.ReactNode;
    variant: 'loader' | 'info' | 'warning';
}

export default ({ variant, children }: Props) => {
    const iconElement = getIcon(variant);
    return (
        <Wrapper variant={variant}>
            {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
            <Body>{children}</Body>
        </Wrapper>
    );
};
