import supabase from "@/utils/supabaseClient";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { List, X } from "react-feather";

export default function CategorySelect({
  category,
  callback,
}: {
  category: Record<string, any> | null;
  callback: (category: Record<string, any> | null) => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categories, setCategories] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data ? data : []);
    };

    getCategories();
  }, []);

  useEffect(() => console.log(category), [category]);

  return (
    <div className="flex w-full grow items-center justify-center py-4">
      {category ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button variant="faded" onPress={onOpen}>
              {category.category}
            </Button>
            <Button
              isIconOnly
              color="danger"
              variant="flat"
              onPress={() => callback(null)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="bordered"
          startContent={<List size={16} />}
          onPress={onOpen}
        >
          Select category
        </Button>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Select category</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      variant="faded"
                      key={category.id}
                      onPress={() => {
                        callback(category);
                        onClose();
                      }}
                    >
                      {category.category}
                    </Button>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
