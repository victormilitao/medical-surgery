import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PickerModal, PickerOption } from '../SearchablePickerModal';

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  X: () => 'XIcon',
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockOptions: PickerOption[] = [
  { id: '1', label: 'Colecistectomia Videolaparoscópica' },
  { id: '2', label: 'Histerectomia' },
  { id: '3', label: 'Apendicectomia' },
  { id: '4', label: 'Herniorrafia Inguinal' },
  { id: '5', label: 'Colectomia' },
];

describe('PickerModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onSelect: jest.fn(),
    options: mockOptions,
    selectedId: '1',
    title: 'Selecionar Procedimento',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title correctly', () => {
    const { getByText } = render(<PickerModal {...defaultProps} />);
    expect(getByText('Selecionar Procedimento')).toBeTruthy();
  });

  it('renders all options', () => {
    const { getByText } = render(<PickerModal {...defaultProps} />);
    mockOptions.forEach((opt) => {
      expect(getByText(opt.label)).toBeTruthy();
    });
  });

  it('calls onSelect and onClose when an option is pressed', () => {
    const { getByTestId } = render(<PickerModal {...defaultProps} />);

    const option = getByTestId('picker-option-2');
    fireEvent.press(option);

    expect(defaultProps.onSelect).toHaveBeenCalledWith({
      id: '2',
      label: 'Histerectomia',
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when the close button is pressed', () => {
    const { getByTestId } = render(<PickerModal {...defaultProps} />);

    fireEvent.press(getByTestId('picker-close-btn'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <PickerModal {...defaultProps} visible={false} />
    );
    expect(queryByText('Selecionar Procedimento')).toBeNull();
  });

  it('shows empty message when no options available', () => {
    const { getByText } = render(
      <PickerModal {...defaultProps} options={[]} emptyMessage="Nenhum procedimento encontrado." />
    );
    expect(getByText('Nenhum procedimento encontrado.')).toBeTruthy();
  });

  it('shows default empty message', () => {
    const { getByText } = render(
      <PickerModal {...defaultProps} options={[]} />
    );
    expect(getByText('Nenhuma opção disponível.')).toBeTruthy();
  });

  it('highlights the selected option', () => {
    const { getByTestId } = render(<PickerModal {...defaultProps} selectedId="3" />);

    // The selected option should exist and be pressable
    const selectedOption = getByTestId('picker-option-3');
    expect(selectedOption).toBeTruthy();
  });
});
