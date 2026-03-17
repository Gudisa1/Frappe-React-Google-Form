// components/GoToDashboardButton.jsx
import { useNavigate } from 'react-router-dom';
import { DashboardIcon } from '@radix-ui/react-icons';

const GoToDashboardButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/mr-dashboard')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg 
                 bg-indigo-600 text-white font-medium
                 hover:bg-indigo-700 transition-all duration-200
                 shadow-sm hover:shadow-md"
    >
      <DashboardIcon width="18" height="18" />
      Dashboard
    </button>
  );
};

export default GoToDashboardButton;