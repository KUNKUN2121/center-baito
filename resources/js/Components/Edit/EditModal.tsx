import React from 'react';
import styled from '@emotion/styled';

type EditModalProps = {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
};

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContainer = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 28rem;
    padding: 1.5rem;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: #6b7280;
    &:hover {
        color: #374151;
    }
`;

const ModalTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
`;

const EditModal: React.FC<EditModalProps> = ({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay
            aria-modal="true"
            role="dialog"
        >
            <ModalContainer>
                <CloseButton
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </CloseButton>
                {title && <ModalTitle>{title}</ModalTitle>}
                <div>{children}</div>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default EditModal;