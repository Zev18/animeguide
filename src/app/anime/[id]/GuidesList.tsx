import { Button } from "@nextui-org/button";
import { CheckboxGroup } from "@nextui-org/checkbox";
import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { useState } from "react";
import { Plus } from "react-feather";
import { CustomCheckbox } from "./CustomCheckbox";
import { useRouter } from "next/navigation";

export default function GuidesList({
  guides,
  animeId,
  callback,
}: {
  guides: Record<string, any>[];
  animeId: number;
  callback: (guideIds: number[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  return (
    <>
      <ModalHeader>Add to guide</ModalHeader>
      <ModalBody>
        <p className="text-sm text-foreground-400">
          Only guides that don&apos;t already contain the anime will be
          displayed.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Plus size={16} />}
            color="primary"
            variant="bordered"
            onPress={() => router.push("/guides/new?startingAnime=" + animeId)}
          >
            New Guide
          </Button>
          <CheckboxGroup
            classNames={{ wrapper: "grid grid-cols-2", base: "w-full" }}
            value={selected}
            onValueChange={setSelected}
          >
            {guides.map((guide) => (
              <CustomCheckbox
                key={guide.id}
                value={guide.id}
                aria-label={guide.title}
                classNames={{
                  base: "hover:bg-background-300 cursor-pointer p-3",
                  label: "w-full",
                }}
              >
                <p>{guide.title}</p>
              </CustomCheckbox>
            ))}
          </CheckboxGroup>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          isLoading={submitting}
          onPress={() => {
            setSubmitting(true);
            callback(selected.map((str) => Number(str)));
          }}
        >
          Done
        </Button>
      </ModalFooter>
    </>
  );
}
