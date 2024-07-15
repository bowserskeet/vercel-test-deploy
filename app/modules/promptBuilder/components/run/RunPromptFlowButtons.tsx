import { PromptFlowWithDetails } from "../../db/promptFlows.db.server";
import { RowDto } from "~/modules/rows/repositories/RowDto";

interface Props {
  idx?: string | number;
  type: "list" | "edit";
  promptFlows: PromptFlowWithDetails[];
  row?: RowDto;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  openSideModal?: boolean;
}
export default function RunPromptFlowButtons({ idx, type, promptFlows, row, disabled, className, children, openSideModal }: Props) {
  return null;
}
