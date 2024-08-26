import React from 'react';

const AvatarModal = ({ isOpen, onClose, avatars, onSelect }) => {
    if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Select Avatar</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {avatars.map((avatar) => (
            <img
              key={avatar.id}
              src={avatar.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full cursor-pointer"
              onClick={() => onSelect(avatar.id)}
            />
          ))}
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;