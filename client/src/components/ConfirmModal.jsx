// Reusable confirmation modal using Bootstrap
const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || 'Confirm'}</h5>
            <button className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            <p>{message || 'Are you sure?'}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
