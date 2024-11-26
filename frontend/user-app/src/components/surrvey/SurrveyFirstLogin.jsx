import { Dialog, DialogContent } from "@/components/ui/dialog"
import SurveyPopup from "./SurveyPopup"

export function SurrveyFirstLogin({ isOpen, onClose }) {
  return (
    // <Dialog open={isOpen} onOpenChange={onClose}>
    //   <DialogContent className="max-w-full w-full h-full m-0 p-0 overflow-auto">
    //     <CreateProblemQuiz></CreateProblemQuiz>
    //   </DialogContent>
    // </Dialog>
    <div>
      <h1>Chào mừng đến với trang web lập trình của tôi</h1>
      <SurveyPopup />
    </div>
  )
}