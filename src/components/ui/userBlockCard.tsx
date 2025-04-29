type UserManagementCardProps = {
    name: string;
    email: string;
    institution: string;
    lattes: string;
  };
  
  export default function UserBlockCard({
    name,
    email,
    institution,
    lattes,
  }: UserManagementCardProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-1">
          <div className="flex flex-col flex-1">
            <label className="block text-lg font-bold mb-2">{name}</label>
            <label className="block text-sm font-medium mb-2">{email}</label>
            <label className="block text-sm font-medium mb-2">{institution}</label>
            <label className="block text-sm font-medium">
              <a
                href={lattes}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {lattes}
              </a>
            </label>
          </div>
    
            <div className="flex flex-col items-end flex-1">
                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-30">
                    BLOQUEAR
                </button>
            </div>
        </div>
    );
  }
  