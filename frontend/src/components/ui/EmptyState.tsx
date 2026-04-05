import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        action.href ? (
          <Link
            to={action.href}
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}