import React from 'react';
import styled from 'styled-components';

import { P, variables } from '@trezor/components';
import { Option } from '@onboarding-components';

import { WordCount } from '@recovery-types';
import { Translation } from '@suite-components';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    margin-top: 24px;

    @media (min-width: ${variables.SCREEN_SIZE.SM}) {
        flex-direction: row;
    }
`;

interface Props {
    onSelect: (number: WordCount) => void;
}

const SelectWordCount = ({ onSelect }: Props) => (
    <>
        <P size="small">
            <Translation id="TR_RECOVER_SUBHEADING" />
        </P>
        <Wrapper>
            <Option
                variant={3}
                action={() => {
                    onSelect(12);
                }}
                button={<Translation id="TR_WORDS" values={{ count: '12' }} />}
                imgSrc="images/svg/12-words.svg"
                data-test="@recover/select-count/12"
            />
            <Option
                variant={3}
                action={() => {
                    onSelect(18);
                }}
                button={<Translation id="TR_WORDS" values={{ count: '18' }} />}
                imgSrc="images/svg/18-words.svg"
                data-test="@recover/select-count/18"
            />
            <Option
                variant={3}
                action={() => {
                    onSelect(24);
                }}
                button={<Translation id="TR_WORDS" values={{ count: '24' }} />}
                imgSrc="images/svg/24-words.svg"
                data-test="@recover/select-count/24"
            />
        </Wrapper>
    </>
);

export default SelectWordCount;
