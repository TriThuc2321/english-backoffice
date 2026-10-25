import { ComboBox, FieldError, Input, Label, ListBox } from '@heroui/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { useDebounce } from '@/hooks';
import { testApi, userApi } from '@/services/apis';
import { MediaScope } from '@/types/media';

type OwnerOption = { id: string; label: string };

// Only the active scope fetches; keys match the tests/users list hooks
const useOwnerOptions = (scope: MediaScope, search: string) => {
  const isTest = scope === MediaScope.TEST;
  const params = { search: search || undefined, take: 20 };
  const { data: tests } = useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST.LIST, params],
    queryFn: () => testApi.getAll(params),
    enabled: isTest,
    placeholderData: keepPreviousData,
  });
  const { data: users } = useQuery({
    queryKey: [REACT_QUERY_KEYS.USER.LIST, params],
    queryFn: () => userApi.getAll(params),
    enabled: !isTest,
    placeholderData: keepPreviousData,
  });

  if (isTest) {
    return (tests?.data ?? []).map<OwnerOption>((test) => ({
      id: String(test.id),
      label: `#${test.id} · ${test.title}`,
    }));
  }
  return (users?.data ?? []).map<OwnerOption>((user) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    return {
      id: user.id,
      label: name ? `${name} · ${user.email ?? ''}` : (user.email ?? user.id),
    };
  });
};

type OwnerPickerProps = {
  scope: MediaScope;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

const OwnerPicker = ({ scope, value, onChange, error }: OwnerPickerProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const options = useOwnerOptions(scope, debouncedSearch);

  return (
    <ComboBox
      fullWidth
      inputValue={search}
      onInputChange={setSearch}
      selectedKey={value || null}
      defaultFilter={() => true}
      isInvalid={!!error}
      onSelectionChange={(key) => {
        const option = options.find((o) => o.id === String(key));
        onChange(option?.id ?? '');
        if (option) setSearch(option.label);
      }}
    >
      <Label>{t('media.field.owner')}</Label>
      <ComboBox.InputGroup>
        <Input placeholder={t('media.searchOwner')} />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.label}
            >
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
      <FieldError>{error}</FieldError>
    </ComboBox>
  );
};

export default OwnerPicker;
