import { FC } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

type PolicyModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
};

export const PolicyModal: FC<PolicyModalProps> = ({
  isOpen,
  onOpenChange,
  sections,
}) => (
  <Modal
    isOpen={isOpen}
    size="2xl"
    scrollBehavior="inside"
    onOpenChange={onOpenChange}
    style={{ height: 600 }}
  >
    <ModalContent>
      <ModalHeader className="text-lg font-semibold text-gray-900">
        Политика обработки персональных данных
      </ModalHeader>
      <ModalBody className="space-y-5 text-sm leading-6 text-gray-700">
        {sections.map((section) => (
          <section className="space-y-2" key={section.title}>
            <h4 className="font-semibold text-gray-900">{section.title}</h4>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button
          color="default"
          className="bg-gradient-to-r from-[#f99160] to-[#d43e14] text-white hover:brightness-95"
          onPress={() => onOpenChange(false)}
        >
          Закрыть
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
