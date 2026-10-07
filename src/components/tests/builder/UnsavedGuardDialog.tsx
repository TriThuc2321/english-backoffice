import { Button, Modal } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuTriangleAlert } from 'react-icons/lu';

type UnsavedGuardDialogProps = {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
};

const UnsavedGuardDialog = ({
  isOpen,
  onStay,
  onLeave,
}: UnsavedGuardDialogProps) => {
  const { t } = useTranslation();

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onStay();
        }}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[400px]">
            <Modal.Header>
              <Modal.Icon className="bg-warning/15 text-warning">
                <LuTriangleAlert className="size-5" />
              </Modal.Icon>
              <Modal.Heading>{t('tests.builder.guard.title')}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-default-600 text-sm">
                {t('tests.builder.guard.description')}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="tertiary" onPress={onStay}>
                {t('tests.builder.guard.stay')}
              </Button>
              <Button variant="danger" onPress={onLeave}>
                {t('tests.builder.guard.leave')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default UnsavedGuardDialog;
