import "./ConfirmDialog.css";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
                                          open,
                                          title = "Confirmation",
                                          message,
                                          confirmLabel = "Confirmer",
                                          cancelLabel = "Annuler",
                                          onConfirm,
                                          onCancel
                                      }: Props) {
    if (!open) return null;

    return (
        <div className="confirm-overlay" onMouseDown={onCancel}>
            <div className="confirm-dialog" onMouseDown={(e) => e.stopPropagation()}>
                <h2 className="confirm-title">{title}</h2>
                <p className="confirm-message">{message}</p>

                <div className="confirm-actions">
                    <button className="confirm-cancel" onClick={onCancel}>{cancelLabel}</button>
                    <button className="confirm-confirm" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}
