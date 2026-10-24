// Displays a dismissible alert for success or error messages
const Alert = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
      )}
    </div>
  );
};

export default Alert;
