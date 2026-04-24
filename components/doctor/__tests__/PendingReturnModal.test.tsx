import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { PendingReturnModal } from '../PendingReturnModal';

describe('PendingReturnModal', () => {
  const baseProps = {
    visible: true,
    patientName: 'João Silva',
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar título e nome do paciente', () => {
    render(React.createElement(PendingReturnModal, baseProps));
    expect(screen.getByText('Confirmar Retorno')).toBeTruthy();
    expect(screen.getByText(/João Silva/)).toBeTruthy();
  });

  it('deve renderizar texto de aviso', () => {
    render(React.createElement(PendingReturnModal, baseProps));
    expect(screen.getByText(/Essa ação não pode ser desfeita/)).toBeTruthy();
  });

  it('deve chamar onConfirm ao pressionar Confirmar', () => {
    render(React.createElement(PendingReturnModal, baseProps));
    fireEvent.press(screen.getByText('Confirmar'));
    expect(baseProps.onConfirm).toHaveBeenCalled();
  });

  it('deve chamar onClose ao pressionar Cancelar', () => {
    render(React.createElement(PendingReturnModal, baseProps));
    fireEvent.press(screen.getByText('Cancelar'));
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('deve exibir "Confirmando..." quando isLoading', () => {
    render(React.createElement(PendingReturnModal, { ...baseProps, isLoading: true }));
    expect(screen.getByText('Confirmando...')).toBeTruthy();
  });

  it('não deve renderizar conteúdo quando visible é false', () => {
    render(React.createElement(PendingReturnModal, { ...baseProps, visible: false }));
    expect(screen.queryByText('Confirmar Retorno')).toBeNull();
  });
});
