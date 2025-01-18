import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] md:max-w-[70%] lg:max-w-[50%] rounded-md">
        <DialogHeader>
          <DialogTitle>絶賛作成中です！</DialogTitle>
          <DialogDescription>
            いくつかご注意ください！ m(_ _)m
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc ml-6 text-sm">
          <li>用語はまだ全巻を網羅していません。今後にご期待ください。</li>
          <li>用語の詳細画面が開くまで少し遅い場合があります。</li>
          <li>
            詳細画面のリンクから他の用語に跳ぶとき、若干違う単語に跳ぶ場合があります。原因調査中です。
          </li>
        </ul>
        <Button onClick={onClose} className="mt-4">
          OK
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
