import * as React from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../../Icon';
import { IconType, ButtonVariant, ButtonSize } from '../../../support/types';
import { colors, variables } from '../../../config';
import FluidSpinner from '../../loaders/FluidSpinner';

const BUTTON_PADDING = {
    small: '2px 12px',
    large: '9px 12px',
};

const getIconColor = (variant: ButtonVariant, isDisabled: boolean) => {
    if (isDisabled) return colors.BLACK80;
    return variant === 'primary' || variant === 'danger' ? colors.WHITE : colors.BLACK25;
};

const getFontSize = (variant: ButtonVariant, size: ButtonSize) => {
    // all button variants use same font size except the small tertiary btn
    if (variant === 'tertiary' && size === 'small') {
        return variables.FONT_SIZE.TINY;
    }
    return variables.FONT_SIZE.BUTTON;
};

const Wrapper = styled.button<WrapperProps>`
    display: flex;
    background: transparent;
    align-items: center;
    justify-content: center;
    border: none;
    white-space: nowrap;
    cursor: ${props => (props.isDisabled ? 'default' : 'pointer')};
    border-radius: 4px;
    font-size: ${props => getFontSize(props.variant, props.size)}; 
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => (props.color ? props.color : colors.BLACK25)};
    outline: none;
    padding: ${props => BUTTON_PADDING[props.size]};

    ${props =>
        props.fullWidth &&
        css`
            width: 100%;
        `}

    ${props =>
        props.variant === 'primary' &&
        css`
            color: ${colors.WHITE};
            font-weight: ${variables.FONT_WEIGHT.BOLD};
            background: ${colors.BUTTON_PRIMARY};

            &:hover,
            &:focus {
                box-shadow: 0 0 0 4px ${colors.BUTTON_PRIMARY_BORDER};
                background: ${colors.BUTTON_PRIMARY_HOVER};
            }

            &:active {
                box-shadow: 0 0 0 4px ${colors.BUTTON_PRIMARY_BORDER};
                background: ${colors.BUTTON_PRIMARY_ACTIVE};
            }
        `}

    ${props =>
        props.variant === 'secondary' &&
        css`
            background: ${colors.BUTTON_SECONDARY};

            &:hover,
            &:focus {
                box-shadow: 0 0 0 4px ${colors.BUTTON_SECONDARY_BORDER};
                background: ${colors.BUTTON_SECONDARY_HOVER};
            }

            &:active {
                box-shadow: 0 0 0 4px ${colors.BUTTON_SECONDARY_BORDER};
                background: ${colors.BUTTON_SECONDARY_ACTIVE};
            }
        `}
    ${props =>
        props.variant === 'tertiary' &&
        css`
            padding: 0px;
        `}

    ${props =>
        props.variant === 'tertiary' &&
        !props.isDisabled &&
        css`
            &:hover,
            &:focus {
                color: ${colors.BLACK25};
                text-decoration: underline;
            }
            &:active {
                color: ${colors.BLACK25};
                text-decoration: underline;
            }
        `};

    ${props =>
        props.variant === 'danger' &&
        css`
            color: ${colors.WHITE};
            font-weight: ${variables.FONT_WEIGHT.BOLD};
            background: ${colors.BUTTON_RED};

            &:hover,
            &:focus {
                background: ${colors.BUTTON_RED_HOVER};
                box-shadow: 0 0 0 4px ${colors.BUTTON_RED_BORDER};
            }

            &:active {
                box-shadow: 0 0 0 4px ${colors.BUTTON_RED_BORDER};
                background: ${colors.BUTTON_RED_ACTIVE};
            }
        `}

    ${props =>
        props.isDisabled &&
        css`
            background: ${colors.BUTTON_DISABLED_BACKGROUND};
            color: ${colors.BUTTON_DISABLED_TEXT};

            &:hover,
            &:active {
                box-shadow: none;
                background: ${colors.BUTTON_DISABLED_BACKGROUND};
                color: ${colors.BUTTON_DISABLED_TEXT};
            }
        `}

    ${props =>
        props.isDisabled &&
        props.variant === 'tertiary' &&
        css`
            border: none;
            background: transparent;

            &:hover,
            &:active {
                box-shadow: none;
                background: transparent;
            }
        `}
`;

const IconWrapper = styled.div<IconWrapperProps>`
    position: relative;
    display: flex;

    ${props =>
        props.alignIcon === 'left' &&
        css`
            margin: 0 8px 0 3px;
        `}

    ${props =>
        props.alignIcon === 'right' &&
        css`
            margin: 0 0 0 8px;
        `}
    
    ${props =>
        props.variant === 'tertiary' &&
        props.alignIcon === 'right' &&
        css`
            margin: 0 0 0 3px;
        `}

    ${props =>
        props.variant === 'tertiary' &&
        props.alignIcon === 'left' &&
        css`
            margin: 0 3px 0 0;
        `}
`;

interface IconWrapperProps {
    alignIcon?: Props['alignIcon'];
    variant?: Props['variant'];
}

interface WrapperProps {
    variant: ButtonVariant;
    size: ButtonSize;
    isDisabled: boolean;
    fullWidth: boolean;
    color: string | undefined;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    additionalClassName?: string;
    icon?: IconType;
    isDisabled?: boolean;
    isLoading?: boolean;
    fullWidth?: boolean;
    alignIcon?: 'left' | 'right';
}

const Button = React.forwardRef(
    (
        {
            children,
            className,
            variant = 'primary',
            size = 'large',
            icon,
            additionalClassName,
            color,
            fullWidth = false,
            isDisabled = false,
            isLoading = false,
            alignIcon = 'left',
            onChange,
            ...rest
        }: Props,
        ref?: React.Ref<HTMLButtonElement>
    ) => {
        const newClassName = additionalClassName
            ? `${className} ${additionalClassName}`
            : className;
        const IconComponent = icon ? (
            <IconWrapper alignIcon={alignIcon} variant={variant}>
                <Icon
                    icon={icon}
                    size={size === 'large' ? 14 : 12}
                    color={color || getIconColor(variant, isDisabled)}
                />
            </IconWrapper>
        ) : null;
        const Loader = (
            <IconWrapper alignIcon={alignIcon}>
                <FluidSpinner size={10} color={color} />
            </IconWrapper>
        );
        return (
            <Wrapper
                className={newClassName}
                variant={variant}
                size={size}
                onChange={onChange}
                isDisabled={isDisabled}
                disabled={isDisabled || isLoading}
                fullWidth={fullWidth}
                color={color}
                ref={ref}
                {...rest}
            >
                {!isLoading && alignIcon === 'left' && IconComponent}
                {isLoading && alignIcon === 'left' && Loader}
                {children}
                {!isLoading && alignIcon === 'right' && IconComponent}
                {isLoading && alignIcon === 'right' && Loader}
            </Wrapper>
        );
    }
);

export { Button, Props as ButtonProps };
