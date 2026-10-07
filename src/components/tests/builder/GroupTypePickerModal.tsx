import { Modal } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { QuestionType } from '@/types/test';

import { QUESTION_TYPES } from './constants';

type GroupTypePickerModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPick: (type: QuestionType) => void;
};

const GroupTypePickerModal = ({
  isOpen,
  onOpenChange,
  onPick,
}: GroupTypePickerModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {t('tests.builder.typePicker.title')}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {QUESTION_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onPick(type)}
                    className="hover:border-accent hover:bg-accent/5 flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors"
                  >
                    <span className="text-default-900 text-sm font-medium">
                      {t(`tests.builder.types.${type}`)}
                    </span>
                    <span className="text-default-500 text-xs">
                      {t(`tests.builder.typeDescriptions.${type}`)}
                    </span>
                  </button>
                ))}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default GroupTypePickerModal;
