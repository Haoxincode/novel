import React from "react";
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
  ScrollText,
} from "lucide-react";
import { useEditor } from "novel";
import { getPrevText } from "novel/extensions";

const options = [
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
  {
    value: "refine",
    label: "Refine usecase",
    icon: RefreshCcwDot,
  },
  {
    value: "testcase", 
    label: "Generate testcase",
    icon: CheckCheck,
  },
  {
    value: "requirement",
    label: "Generate requirement",
    icon: StepForward,
  },
  {
    value: "sequence",
    label: "Generate sequence diagram",
    icon: ScrollText,
  },
  {
    value: "fmea",
    label: "FMEA analysis",
    icon: ScrollText,
  },
  {
    value: "translate",
    label: "Translate",
    icon: ScrollText,
  }
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Edit or review selection">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(
                slice.content,
              );
              onSelect(text, value);
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      {/*<CommandGroup heading="Use AI to do more">
        <CommandItem
          onSelect={() => {
            const text = getPrevText(editor, { chars: 5000 });
            onSelect(text, "translate");
          }}
          value="translate"
          className="gap-2 px-4"
        >
          <StepForward className="h-4 w-4 text-purple-500" />
          Translate
        </CommandItem>
      </CommandGroup>*/}
    </>
  );
};

export default AISelectorCommands;